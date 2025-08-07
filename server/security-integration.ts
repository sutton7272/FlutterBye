import type { Express } from 'express';
import { ProductionSecurity } from './production-security';
import { AuthSecurity } from './auth-security';
import { keyManagement } from './key-management';
import { storage } from './storage';

export class SecurityIntegration {
  
  // Initialize all security middleware
  static initializeSecurityMiddleware(app: Express) {
    console.log('🔒 Initializing enhanced security middleware...');

    try {
      // Validate production environment
      ProductionSecurity.validateProductionEnvironment();
      console.log('✅ Environment validation passed');
    } catch (error) {
      console.warn('⚠️ Environment validation warnings:', (error as Error).message);
    }

    // Apply security headers first
    app.use(ProductionSecurity.securityHeaders());
    
    // Apply input sanitization
    app.use(ProductionSecurity.sanitizeAndValidate());
    
    // Apply advanced rate limiting
    app.use(ProductionSecurity.createAdvancedRateLimit());
    
    // Apply security logging
    app.use(ProductionSecurity.securityLogger());
    
    // Apply auth rate limiting to auth endpoints
    app.use('/api/auth/*', AuthSecurity.createAuthRateLimit());
    
    // Apply blockchain rate limiting to token endpoints
    app.use(['/api/tokens/create', '/api/tokens/burn', '/api/tokens/transfer'], 
      ProductionSecurity.createBlockchainRateLimit()
    );

    console.log('✅ Enhanced security middleware initialized');
  }

  // Register security endpoints
  static registerSecurityEndpoints(app: Express) {
    console.log('🔒 Registering security endpoints...');

    // Authentication endpoints
    app.post('/api/auth/login', async (req, res) => {
      try {
        const { walletAddress, signature, message } = req.body;

        if (!walletAddress || !signature || !message) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate wallet address format
        if (!ProductionSecurity.validateWalletAddress(walletAddress)) {
          return res.status(400).json({ error: 'Invalid wallet address format' });
        }

        // Verify wallet signature
        const isValidSignature = await AuthSecurity.verifyWalletSignature(
          walletAddress, signature, message
        );

        if (!isValidSignature) {
          return res.status(401).json({ error: 'Invalid signature' });
        }

        // Get or create user
        let user = await storage.getUserByWallet(walletAddress);
        if (!user) {
          user = await storage.createUser({
            walletAddress,
            email: null,
            airdropPreferences: []
          });
        }

        // Generate tokens
        const accessToken = AuthSecurity.generateAccessToken({
          id: user.id,
          walletAddress: user.walletAddress,
          role: user.role || 'user',
          permissions: user.adminPermissions || []
        });

        const refreshToken = AuthSecurity.generateRefreshToken(user.id);

        res.json({
          success: true,
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            walletAddress: user.walletAddress,
            role: user.role,
            permissions: user.adminPermissions
          }
        });

      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Authentication failed' });
      }
    });

    // Token refresh endpoint
    app.post('/api/auth/refresh', async (req, res) => {
      try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
          return res.status(400).json({ error: 'Refresh token required' });
        }

        const userId = AuthSecurity.validateRefreshToken(refreshToken);
        if (!userId) {
          return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(401).json({ error: 'User not found' });
        }

        const tokens = AuthSecurity.refreshAccessToken(refreshToken, {
          id: user.id,
          walletAddress: user.walletAddress,
          role: user.role || 'user',
          permissions: user.adminPermissions || []
        });

        if (!tokens) {
          return res.status(401).json({ error: 'Token refresh failed' });
        }

        res.json({
          success: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        });

      } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ error: 'Token refresh failed' });
      }
    });

    // Get authentication nonce for wallet signing
    app.post('/api/auth/nonce', (req, res) => {
      const { walletAddress } = req.body;

      if (!walletAddress || !ProductionSecurity.validateWalletAddress(walletAddress)) {
        return res.status(400).json({ error: 'Valid wallet address required' });
      }

      const nonce = AuthSecurity.generateSecureNonce();
      const message = `Sign this message to authenticate with Flutterbye:\n\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;

      res.json({
        success: true,
        nonce,
        message
      });
    });

    // Security audit endpoint (admin only)
    app.get('/api/security/audit', AuthSecurity.authenticateAdmin, (req, res) => {
      try {
        const keyAudit = keyManagement.auditKeyUsage();
        const authAudit = AuthSecurity.auditAuthSecurity();
        
        const audit = {
          timestamp: new Date().toISOString(),
          keyManagement: keyAudit,
          authentication: authAudit,
          environment: {
            nodeEnv: process.env.NODE_ENV,
            httpsEnforced: req.secure || req.headers['x-forwarded-proto'] === 'https',
            databaseSslEnabled: ProductionSecurity.validateDatabaseSecurity()
          },
          recommendations: [
            ...keyAudit.recommendations,
            ...authAudit.recommendations
          ]
        };

        res.json({
          success: true,
          audit
        });

      } catch (error) {
        console.error('Security audit error:', error);
        res.status(500).json({ error: 'Security audit failed' });
      }
    });

    // Key rotation endpoint (super admin only)
    app.post('/api/security/rotate-keys', 
      AuthSecurity.requirePermission('key_management'),
      (req, res) => {
        try {
          const newEncryptionKey = keyManagement.rotateEncryptionKey();
          
          res.json({
            success: true,
            message: 'Encryption key rotated successfully',
            newKeyHex: newEncryptionKey.toString('hex'),
            warning: 'Update ENCRYPTION_KEY environment variable immediately'
          });

        } catch (error) {
          console.error('Key rotation error:', error);
          res.status(500).json({ error: 'Key rotation failed' });
        }
      }
    );

    // Generate production keypair (super admin only)
    app.post('/api/security/generate-keypair',
      AuthSecurity.requirePermission('key_management'),
      (req, res) => {
        try {
          const keypairData = keyManagement.generateProductionKeypair();
          
          res.json({
            success: true,
            publicKey: keypairData.publicKey,
            privateKeyBase58: keypairData.privateKeyBase58,
            privateKeyArray: keypairData.privateKeyArray,
            warning: 'Store private key securely and update SOLANA_ESCROW_PRIVATE_KEY'
          });

        } catch (error) {
          console.error('Keypair generation error:', error);
          res.status(500).json({ error: 'Keypair generation failed' });
        }
      }
    );

    console.log('✅ Security endpoints registered');
  }

  // Validate API keys and external services
  static validateExternalServices() {
    console.log('🔒 Validating external services...');

    ProductionSecurity.validateApiKeys();
    
    const services = {
      openai: !!process.env.OPENAI_API_KEY,
      stripe: !!process.env.STRIPE_SECRET_KEY,
      twilio: !!process.env.TWILIO_AUTH_TOKEN,
      twitter: !!(process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET)
    };

    console.log('📊 External services status:', services);

    const missingServices = Object.entries(services)
      .filter(([, isConfigured]) => !isConfigured)
      .map(([service]) => service);

    if (missingServices.length > 0) {
      console.warn('⚠️ Missing API keys for:', missingServices.join(', '));
    } else {
      console.log('✅ All external services configured');
    }

    return services;
  }

  // Complete security initialization
  static async initialize(app: Express) {
    console.log('🚀 Initializing comprehensive security system...');

    // Initialize security middleware
    this.initializeSecurityMiddleware(app);

    // Register security endpoints
    this.registerSecurityEndpoints(app);

    // Validate external services
    const services = this.validateExternalServices();

    // Key management audit
    const keyAudit = keyManagement.auditKeyUsage();
    if (keyAudit.recommendations.length > 0) {
      console.warn('🔑 Key management recommendations:', keyAudit.recommendations);
    }

    console.log('✅ Comprehensive security system initialized');
    console.log('🔒 Security features active:');
    console.log('  - Enhanced rate limiting with IP tracking');
    console.log('  - JWT-based authentication with refresh tokens');
    console.log('  - Wallet signature verification');
    console.log('  - Input sanitization and validation'); 
    console.log('  - Security headers (CSP, HSTS, etc.)');
    console.log('  - Request logging and monitoring');
    console.log('  - Key management and encryption');
    console.log('  - Admin role-based access control');

    return {
      status: 'initialized',
      middleware: 'active',
      endpoints: 'registered',
      services,
      keyManagement: keyAudit
    };
  }
}