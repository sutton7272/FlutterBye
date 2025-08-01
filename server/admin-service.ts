import { storage } from "./storage";

export class AdminService {
  // Create a new admin user
  static async createAdmin(
    walletAddress: string, 
    permissions: string[], 
    addedByUserId: string,
    role: 'admin' | 'super_admin' = 'admin'
  ) {
    try {
      // Check if user exists
      let user = await storage.getUserByWallet(walletAddress);
      
      if (!user) {
        // Create new user first
        user = await storage.createUser({
          walletAddress,
          role,
          isAdmin: true,
          adminPermissions: permissions as any,
          adminAddedBy: addedByUserId,
          adminAddedAt: new Date()
        });
      } else {
        // Update existing user to admin
        user = await storage.updateUserAdminStatus(user.id, {
          role,
          isAdmin: true,
          adminPermissions: permissions as any,
          adminAddedBy: addedByUserId,
          adminAddedAt: new Date()
        });
      }

      // Log admin creation
      await storage.createAdminLog({
        adminId: addedByUserId,
        action: 'create_admin',
        targetUserId: user.id,
        details: { permissions, role } as any,
        ipAddress: 'server'
      });

      return user;
    } catch (error) {
      console.error("Error creating admin:", error);
      throw new Error("Failed to create admin user");
    }
  }

  // Remove admin access from user
  static async removeAdmin(userId: string, removedByUserId: string) {
    try {
      const user = await storage.updateUserAdminStatus(userId, {
        role: 'user',
        isAdmin: false,
        adminPermissions: [] as any,
        adminAddedBy: null,
        adminAddedAt: null
      });

      // Log admin removal
      await storage.createAdminLog({
        adminId: removedByUserId,
        action: 'remove_admin',
        targetUserId: userId,
        details: { reason: 'Admin access revoked' } as any,
        ipAddress: 'server'
      });

      return user;
    } catch (error) {
      console.error("Error removing admin:", error);
      throw new Error("Failed to remove admin access");
    }
  }

  // Update admin permissions
  static async updateAdminPermissions(
    userId: string, 
    permissions: string[], 
    updatedByUserId: string
  ) {
    try {
      const user = await storage.updateUserAdminStatus(userId, {
        adminPermissions: permissions as any
      });

      // Log permission update
      await storage.createAdminLog({
        adminId: updatedByUserId,
        action: 'update_permissions',
        targetUserId: userId,
        details: { newPermissions: permissions } as any,
        ipAddress: 'server'
      });

      return user;
    } catch (error) {
      console.error("Error updating admin permissions:", error);
      throw new Error("Failed to update admin permissions");
    }
  }

  // Get all admin users
  static async getAllAdmins() {
    try {
      return await storage.getAdminUsers();
    } catch (error) {
      console.error("Error fetching admin users:", error);
      throw new Error("Failed to fetch admin users");
    }
  }

  // Check if wallet address is admin
  static async isWalletAdmin(walletAddress: string): Promise<boolean> {
    try {
      const user = await storage.getUserByWallet(walletAddress);
      return user?.isAdmin || false;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }

  // Available admin permissions
  static getAvailablePermissions() {
    return [
      'dashboard', // View admin dashboard
      'users', // Manage users
      'wallet_management', // Manage escrow wallets
      'settings', // Platform settings
      'analytics', // View analytics
      'content_moderation', // Moderate content
      'financial_management', // Handle financial operations
      'system_administration' // Full system access
    ];
  }

  // Initialize first super admin (run once)
  static async initializeSuperAdmin(walletAddress: string) {
    try {
      // Check if any super admin exists
      const existingSuperAdmins = await storage.getSuperAdmins();
      
      if (existingSuperAdmins.length > 0) {
        throw new Error("Super admin already exists");
      }

      const user = await this.createAdmin(
        walletAddress,
        this.getAvailablePermissions(),
        'system', // system initialization
        'super_admin'
      );

      console.log(`Super admin initialized for wallet: ${walletAddress}`);
      return user;
    } catch (error) {
      console.error("Error initializing super admin:", error);
      throw error;
    }
  }
}