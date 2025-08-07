import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    walletAddress: string;
    role: string;
    permissions: string[];
  };
}

export class AuthSecurity {
  private static jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
  private static refreshTokens = new Map<string, { userId: string; expiresAt: number }>();

  // JWT token generation with enhanced claims
  static generateAccessToken(user: {
    id: string;
    walletAddress: string;
    role?: string;
    permissions?: string[];
  }): string {
    const payload = {
      id: user.id,
      walletAddress: user.walletAddress,
      role: user.role || 'user',
      permissions: user.permissions || [],
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
    };

    return jwt.sign(payload, this.jwtSecret, { algorithm: 'HS256' });
  }

  // Refresh token generation
  static generateRefreshToken(userId: string): string {
    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
    
    this.refreshTokens.set(token, { userId, expiresAt });
    
    // Clean expired tokens
    this.cleanExpiredTokens();
    
    return token;
  }

  // Token validation middleware
  static authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      
      // Validate token type
      if (decoded.type !== 'access') {
        return res.status(401).json({ error: 'Invalid token type' });
      }

      // Check for token expiration (additional safety)
      if (decoded.exp * 1000 < Date.now()) {
        return res.status(401).json({ error: 'Token expired' });
      }

      req.user = {
        id: decoded.id,
        walletAddress: decoded.walletAddress,
        role: decoded.role,
        permissions: decoded.permissions || []
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: 'Token expired' });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        return res.status(500).json({ error: 'Token validation error' });
      }
    }
  }

  // Admin authentication middleware
  static authenticateAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    this.authenticateToken(req, res, (error) => {
      if (error) return next(error);

      const user = req.user!;
      
      // Check admin role
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      next();
    });
  }

  // Permission-based authentication
  static requirePermission(permission: string) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      this.authenticateToken(req, res, (error) => {
        if (error) return next(error);

        const user = req.user!;
        
        // Super admin has all permissions
        if (user.role === 'super_admin') {
          return next();
        }

        // Check specific permission
        if (!user.permissions.includes(permission)) {
          return res.status(403).json({ 
            error: `Permission '${permission}' required` 
          });
        }

        next();
      });
    };
  }

  // Refresh token validation
  static validateRefreshToken(token: string): string | null {
    const tokenData = this.refreshTokens.get(token);
    
    if (!tokenData) {
      return null;
    }

    if (Date.now() > tokenData.expiresAt) {
      this.refreshTokens.delete(token);
      return null;
    }

    return tokenData.userId;
  }

  // Token refresh endpoint
  static refreshAccessToken(refreshToken: string, userData: {
    id: string;
    walletAddress: string;
    role: string;
    permissions: string[];
  }): { accessToken: string; refreshToken: string } | null {
    
    const userId = this.validateRefreshToken(refreshToken);
    
    if (!userId || userId !== userData.id) {
      return null;
    }

    // Generate new tokens
    const newAccessToken = this.generateAccessToken(userData);
    const newRefreshToken = this.generateRefreshToken(userData.id);
    
    // Remove old refresh token
    this.refreshTokens.delete(refreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  // Wallet signature verification for authentication
  static async verifyWalletSignature(
    walletAddress: string,
    signature: string,
    message: string
  ): Promise<boolean> {
    try {
      // Import Solana web3 for signature verification
      const { PublicKey } = await import('@solana/web3.js');
      const nacl = await import('tweetnacl');
      
      const publicKey = new PublicKey(walletAddress);
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = Buffer.from(signature, 'base64');
      
      return nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKey.toBytes()
      );
    } catch (error) {
      console.error('Wallet signature verification error:', error);
      return false;
    }
  }

  // Session security enhancement
  static generateSecureNonce(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Rate limiting for authentication endpoints
  static createAuthRateLimit() {
    const attempts = new Map<string, { count: number; lastAttempt: number }>();
    
    return (req: Request, res: Response, next: NextFunction) => {
      const key = req.ip || 'unknown';
      const now = Date.now();
      const windowMs = 15 * 60 * 1000; // 15 minutes
      const maxAttempts = 5;

      const userAttempts = attempts.get(key) || { count: 0, lastAttempt: 0 };

      // Reset if window expired
      if (now - userAttempts.lastAttempt > windowMs) {
        userAttempts.count = 0;
      }

      // Check if limit exceeded
      if (userAttempts.count >= maxAttempts) {
        return res.status(429).json({
          error: 'Too many authentication attempts',
          retryAfter: Math.ceil((windowMs - (now - userAttempts.lastAttempt)) / 1000)
        });
      }

      // Track failed attempts
      res.on('finish', () => {
        if (res.statusCode === 401 || res.statusCode === 403) {
          userAttempts.count++;
          userAttempts.lastAttempt = now;
          attempts.set(key, userAttempts);
        } else if (res.statusCode === 200) {
          // Reset on successful auth
          attempts.delete(key);
        }
      });

      next();
    };
  }

  // Clean expired refresh tokens
  private static cleanExpiredTokens() {
    const now = Date.now();
    for (const [token, data] of Array.from(this.refreshTokens)) {
      if (now > data.expiresAt) {
        this.refreshTokens.delete(token);
      }
    }
  }

  // Security audit for auth system
  static auditAuthSecurity(): {
    jwtSecretSet: boolean;
    tokenCount: number;
    expiredTokens: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    
    const jwtSecretSet = !!process.env.JWT_SECRET;
    if (!jwtSecretSet) {
      recommendations.push('Set JWT_SECRET environment variable for production');
    }

    // Count tokens
    const now = Date.now();
    let expiredTokens = 0;
    
    for (const [, data] of Array.from(this.refreshTokens)) {
      if (now > data.expiresAt) {
        expiredTokens++;
      }
    }

    if (expiredTokens > 0) {
      recommendations.push(`Clean ${expiredTokens} expired refresh tokens`);
    }

    return {
      jwtSecretSet,
      tokenCount: this.refreshTokens.size,
      expiredTokens,
      recommendations
    };
  }
}