import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production';
const JWT_EXPIRY = '24h';

export interface AuthenticatedUser {
  id: string;
  walletAddress: string;
  role: string;
  isAdmin: boolean;
  adminPermissions?: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

// Generate JWT token for authenticated user
export function generateToken(user: AuthenticatedUser): string {
  return jwt.sign(
    {
      id: user.id,
      walletAddress: user.walletAddress,
      role: user.role,
      isAdmin: user.isAdmin,
      adminPermissions: user.adminPermissions
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

// Verify JWT token
export function verifyToken(token: string): AuthenticatedUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      walletAddress: decoded.walletAddress,
      role: decoded.role,
      isAdmin: decoded.isAdmin,
      adminPermissions: decoded.adminPermissions
    };
  } catch (error) {
    return null;
  }
}

// Authentication middleware
export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'MISSING_TOKEN'
    });
  }

  const token = authHeader.substring(7);
  const user = verifyToken(token);

  if (!user) {
    return res.status(401).json({ 
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN'
    });
  }

  // Verify user still exists and is active
  try {
    const dbUser = await storage.getUser(user.id);
    if (!dbUser) {
      return res.status(401).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = verifyToken(token);
    
    if (user) {
      try {
        const dbUser = await storage.getUser(user.id);
        if (dbUser) {
          req.user = user;
        }
      } catch (error) {
        console.error('Optional auth error:', error);
      }
    }
  }
  
  next();
};

// Wallet-based authentication for initial login
export const authenticateWallet = async (walletAddress: string, signature: string, message: string): Promise<AuthenticatedUser | null> => {
  try {
    // In production, verify the signature against the message and wallet
    // For now, basic validation
    if (!walletAddress || !signature || !message) {
      return null;
    }

    // Get or create user
    let user = await storage.getUserByWallet(walletAddress);
    if (!user) {
      user = await storage.createUser({
        walletAddress,
        role: 'user',
        isAdmin: false,
        credits: '0'
      });
    }

    return {
      id: user.id,
      walletAddress: user.walletAddress,
      role: user.role || 'user',
      isAdmin: user.isAdmin || false,
      adminPermissions: user.adminPermissions || []
    };
  } catch (error) {
    console.error('Wallet authentication error:', error);
    return null;
  }
};