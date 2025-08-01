import { db } from "./db";
import { 
  users, 
  tokens, 
  adminSettings, 
  adminLogs, 
  platformStats, 
  userAnalytics,
  redeemableCodes,
  codeRedemptions,
  transactions,
  redemptions
} from "@shared/schema";
import { eq, desc, count, sum, gte, sql } from "drizzle-orm";

interface AdminSettingsData {
  baseMintingFee: number;
  imageUploadFee: number;
  maxMessageLength: number;
  maxImageSize: number;
  platformEnabled: boolean;
  maintenanceMode: boolean;
  allowedCurrencies: string[];
  minValueAttachment: number;
  maxValueAttachment: number;
  redemptionTimeoutHours: number;
}

export class AdminService {
  // Get platform statistics
  async getPlatformStats() {
    try {
      const totalUsers = await db.select({ count: count() }).from(users);
      const totalTokens = await db.select({ count: count() }).from(tokens);
      
      const valueStats = await db
        .select({
          totalValue: sum(tokens.attachedValue),
          totalRedemptions: count(redemptions.id)
        })
        .from(tokens)
        .leftJoin(redemptions, eq(tokens.id, redemptions.tokenId));

      // Get active users in last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const activeUsers = await db
        .select({ count: count() })
        .from(userAnalytics)
        .where(gte(userAnalytics.timestamp, oneDayAgo));

      // Calculate today's revenue (platform fees)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTokens = await db
        .select({ count: count() })
        .from(tokens)
        .where(gte(tokens.createdAt, today));

      const settings = await this.getSettings();
      const revenueToday = todayTokens[0].count * settings.baseMintingFee;

      // Get top performing tokens
      const topTokens = await db
        .select({
          id: tokens.id,
          message: tokens.message,
          attachedValue: tokens.attachedValue,
          redemptions: count(redemptions.id)
        })
        .from(tokens)
        .leftJoin(redemptions, eq(tokens.id, redemptions.tokenId))
        .where(eq(tokens.hasAttachedValue, true))
        .groupBy(tokens.id, tokens.message, tokens.attachedValue)
        .orderBy(desc(tokens.attachedValue))
        .limit(5);

      return {
        totalUsers: totalUsers[0].count,
        totalTokens: totalTokens[0].count,
        totalValueEscrowed: parseFloat(valueStats[0]?.totalValue || "0"),
        totalRedemptions: valueStats[0]?.totalRedemptions || 0,
        activeUsers24h: activeUsers[0].count,
        revenueToday,
        topTokens: topTokens.map(token => ({
          id: token.id,
          message: token.message,
          attachedValue: parseFloat(token.attachedValue || "0"),
          redemptions: token.redemptions
        }))
      };
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      throw error;
    }
  }

  // Get all users with analytics
  async getUsers() {
    try {
      const usersData = await db
        .select({
          id: users.id,
          walletAddress: users.walletAddress,
          createdAt: users.createdAt,
          credits: users.credits
        })
        .from(users)
        .orderBy(desc(users.createdAt));

      // Get additional stats for each user
      const enrichedUsers = await Promise.all(
        usersData.map(async (user) => {
          const tokenStats = await db
            .select({
              totalMinted: count(tokens.id),
              totalValue: sum(tokens.attachedValue)
            })
            .from(tokens)
            .where(eq(tokens.creatorId, user.id));

          const redemptionStats = await db
            .select({ count: count() })
            .from(redemptions)
            .where(eq(redemptions.userId, user.id));

          const lastActivity = await db
            .select({ timestamp: userAnalytics.timestamp })
            .from(userAnalytics)
            .where(eq(userAnalytics.userId, user.id))
            .orderBy(desc(userAnalytics.timestamp))
            .limit(1);

          // Calculate risk score based on activity patterns
          const riskScore = Math.floor(Math.random() * 100); // Placeholder algorithm

          return {
            id: user.id,
            walletAddress: user.walletAddress,
            totalTokensMinted: tokenStats[0]?.totalMinted || 0,
            totalValueAttached: parseFloat(tokenStats[0]?.totalValue || "0"),
            totalRedemptions: redemptionStats[0]?.count || 0,
            joinedAt: user.createdAt?.toISOString() || "",
            lastActive: lastActivity[0]?.timestamp?.toISOString() || "",
            isBlocked: false, // TODO: Add blocked status to schema
            riskScore
          };
        })
      );

      return enrichedUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  // Get admin logs
  async getAdminLogs() {
    try {
      const logs = await db
        .select()
        .from(adminLogs)
        .orderBy(desc(adminLogs.createdAt))
        .limit(50);

      return logs.map(log => ({
        id: log.id,
        adminId: log.adminId,
        action: log.action,
        targetType: log.targetType,
        targetId: log.targetId,
        details: log.details,
        timestamp: log.createdAt?.toISOString() || ""
      }));
    } catch (error) {
      console.error("Error fetching admin logs:", error);
      throw error;
    }
  }

  // Get platform settings
  async getSettings(): Promise<AdminSettingsData> {
    try {
      const settings = await db.select().from(adminSettings);
      
      // Default settings if none exist
      const defaultSettings: AdminSettingsData = {
        baseMintingFee: 0.01,
        imageUploadFee: 0.005,
        maxMessageLength: 27,
        maxImageSize: 5,
        platformEnabled: true,
        maintenanceMode: false,
        allowedCurrencies: ["SOL", "USDC"],
        minValueAttachment: 0.001,
        maxValueAttachment: 100,
        redemptionTimeoutHours: 24
      };

      // Convert database settings to typed object
      const settingsObj = { ...defaultSettings };
      settings.forEach(setting => {
        switch (setting.type) {
          case 'number':
            (settingsObj as any)[setting.key] = parseFloat(setting.value);
            break;
          case 'boolean':
            (settingsObj as any)[setting.key] = setting.value === 'true';
            break;
          case 'array':
            (settingsObj as any)[setting.key] = JSON.parse(setting.value);
            break;
          default:
            (settingsObj as any)[setting.key] = setting.value;
        }
      });

      return settingsObj;
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Return defaults on error
      return {
        baseMintingFee: 0.01,
        imageUploadFee: 0.005,
        maxMessageLength: 27,
        maxImageSize: 5,
        platformEnabled: true,
        maintenanceMode: false,
        allowedCurrencies: ["SOL", "USDC"],
        minValueAttachment: 0.001,
        maxValueAttachment: 100,
        redemptionTimeoutHours: 24
      };
    }
  }

  // Update platform settings
  async updateSettings(newSettings: AdminSettingsData, adminId: string) {
    try {
      // Convert settings object to database format
      const settingsToUpdate = Object.entries(newSettings).map(([key, value]) => {
        let type: string;
        let stringValue: string;

        if (typeof value === 'number') {
          type = 'number';
          stringValue = value.toString();
        } else if (typeof value === 'boolean') {
          type = 'boolean';
          stringValue = value.toString();
        } else if (Array.isArray(value)) {
          type = 'array';
          stringValue = JSON.stringify(value);
        } else {
          type = 'string';
          stringValue = value.toString();
        }

        return {
          key,
          value: stringValue,
          type,
          updatedBy: adminId
        };
      });

      // Upsert each setting
      for (const setting of settingsToUpdate) {
        await db
          .insert(adminSettings)
          .values(setting)
          .onConflictDoUpdate({
            target: adminSettings.key,
            set: {
              value: setting.value,
              type: setting.type,
              updatedBy: setting.updatedBy,
              updatedAt: new Date()
            }
          });
      }

      // Log the action
      await this.logAdminAction(adminId, "settings_updated", "settings", "platform", newSettings);

      return { success: true, settings: newSettings };
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  }

  // Block/unblock user
  async toggleUserBlock(userId: string, blocked: boolean, adminId: string) {
    try {
      // TODO: Add blocked status to users table
      // For now, log the action
      await this.logAdminAction(adminId, blocked ? "user_blocked" : "user_unblocked", "user", userId, { blocked });
      
      return { success: true, userId, blocked };
    } catch (error) {
      console.error("Error toggling user block:", error);
      throw error;
    }
  }

  // Generate redemption codes
  async generateCodes(type: string, count: number, adminId: string) {
    try {
      const codes = [];
      
      for (let i = 0; i < count; i++) {
        const code = `${type.toUpperCase().replace('_', '-')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        const [newCode] = await db
          .insert(redeemableCodes)
          .values({
            code,
            type,
            value: "0", // Free codes have no monetary value
            maxUses: 1,
            currentUses: 0,
            isActive: true,
            createdBy: adminId
          })
          .returning();

        codes.push(newCode);
      }

      // Log the action
      await this.logAdminAction(adminId, "codes_generated", "codes", "bulk", { type, count });

      return { success: true, count: codes.length, codes };
    } catch (error) {
      console.error("Error generating codes:", error);
      throw error;
    }
  }

  // Export data
  async exportData(dataType: string, adminId: string) {
    try {
      let data: any[] = [];

      switch (dataType) {
        case 'users':
          data = await this.getUsers();
          break;
        case 'tokens':
          data = await db.select().from(tokens);
          break;
        case 'transactions':
          data = await db.select().from(transactions);
          break;
        case 'analytics':
          data = await db.select().from(userAnalytics);
          break;
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }

      // Log the export
      await this.logAdminAction(adminId, "data_exported", "data", dataType, { recordCount: data.length });

      return {
        exportType: dataType,
        timestamp: new Date().toISOString(),
        recordCount: data.length,
        data
      };
    } catch (error) {
      console.error("Error exporting data:", error);
      throw error;
    }
  }

  // Log admin action
  async logAdminAction(adminId: string, action: string, targetType: string, targetId: string, details?: any) {
    try {
      await db.insert(adminLogs).values({
        adminId,
        action,
        targetType,
        targetId,
        details: details || {}
      });
    } catch (error) {
      console.error("Error logging admin action:", error);
    }
  }

  // Track user analytics
  async trackUserEvent(userId: string, event: string, data?: any) {
    try {
      await db.insert(userAnalytics).values({
        userId,
        event,
        data: data || {}
      });
    } catch (error) {
      console.error("Error tracking user event:", error);
    }
  }
}

export const adminService = new AdminService();