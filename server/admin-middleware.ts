import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        walletAddress: string;
        role: string;
        isAdmin: boolean;
        adminPermissions?: string[];
      };
    }
  }
}

// Middleware to authenticate wallet-based requests
export const authenticateWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;
    
    if (!walletAddress) {
      return res.status(401).json({ message: "Wallet address required" });
    }

    const user = await storage.getUserByWallet(walletAddress);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user.id,
      walletAddress: user.walletAddress,
      role: user.role || 'user',
      isAdmin: user.isAdmin || false,
      adminPermissions: user.adminPermissions as string[] || []
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};

// Middleware to check if user is admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ 
      message: "Admin access required. Contact a system administrator to request access.",
      code: "ADMIN_ACCESS_REQUIRED"
    });
  }
  next();
};

// Middleware to check specific admin permissions
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ 
        message: "Admin access required",
        code: "ADMIN_ACCESS_REQUIRED"
      });
    }

    const hasPermission = req.user.adminPermissions?.includes(permission) || 
                         req.user.role === 'super_admin';

    if (!hasPermission) {
      return res.status(403).json({ 
        message: `Permission '${permission}' required`,
        code: "INSUFFICIENT_PERMISSIONS"
      });
    }

    next();
  };
};

// Middleware to check if user is super admin
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'super_admin') {
    return res.status(403).json({ 
      message: "Super admin access required",
      code: "SUPER_ADMIN_REQUIRED"
    });
  }
  next();
};