import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for both customers and cleaners - Enhanced for marketing & communication
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Core Identity
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isCleaner: integer("is_cleaner", { mode: "boolean" }).default(false),
  
  // Contact Information (Marketing & Communication)
  phone: text("phone"),
  alternatePhone: text("alternate_phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country").default("USA"),
  
  // Personal & Demographic Information
  firstName: text("first_name"),
  lastName: text("last_name"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  
  // Pool Owner Information (for customers)
  poolType: text("pool_type"), // 'inground', 'above_ground', 'spa', 'hot_tub'
  poolSize: text("pool_size"), // 'small', 'medium', 'large', 'extra_large'
  poolAge: integer("pool_age"),
  poolEquipment: text("pool_equipment"), // JSON array of equipment
  specialRequirements: text("special_requirements"),
  propertyType: text("property_type"), // 'residential', 'commercial', 'hoa'
  
  // Professional Information (for cleaners)
  businessName: text("business_name"),
  businessLicense: text("business_license"),
  insuranceInfo: text("insurance_info"),
  hourlyRate: integer("hourly_rate"), // in cents
  serviceAreas: text("service_areas"), // JSON array
  
  // Marketing & Communication Preferences
  marketingOptIn: integer("marketing_opt_in", { mode: "boolean" }).default(true),
  emailNotifications: integer("email_notifications", { mode: "boolean" }).default(true),
  smsNotifications: integer("sms_notifications", { mode: "boolean" }).default(false),
  promotionalEmails: integer("promotional_emails", { mode: "boolean" }).default(true),
  preferredContactMethod: text("preferred_contact_method").default("email"), // 'email', 'phone', 'sms'
  communicationFrequency: text("communication_frequency").default("weekly"), // 'daily', 'weekly', 'monthly'
  
  // Service Preferences & History
  preferredServiceDay: text("preferred_service_day"), // 'monday', 'tuesday', etc.
  preferredServiceTime: text("preferred_service_time"), // 'morning', 'afternoon', 'evening'
  serviceFrequency: text("service_frequency"), // 'weekly', 'bi-weekly', 'monthly'
  budgetRange: text("budget_range"), // '$50-100', '$100-200', etc.
  referralSource: text("referral_source"), // How they found us
  
  // Engagement & Analytics
  lastLoginAt: text("last_login_at"),
  accountStatus: text("account_status").default("active"), // 'active', 'inactive', 'suspended'
  lifetimeValue: integer("lifetime_value").default(0), // Total spent in cents
  totalBookings: integer("total_bookings").default(0),
  rating: integer("rating").default(0), // 0-5 star rating
  totalRatings: integer("total_ratings").default(0),
  
  // Additional Marketing Data
  interests: text("interests"), // JSON array of interests
  customerSegment: text("customer_segment"), // 'premium', 'budget', 'commercial', etc.
  notes: text("notes"), // Internal notes for customer service
  tags: text("tags"), // Marketing tags/segments JSON array
  
  // Flutterbye Integration
  flutterboyeUserId: text("flutterboye_user_id"), // Link to Flutterbye user
  flutterboyeRewards: integer("flutterboye_rewards").default(0), // Reward points earned
  
  // System Fields
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Jobs table for pool cleaning requests
export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerId: integer("customer_id").notNull().references(() => users.id),
  cleanerId: integer("cleaner_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  serviceType: text("service_type").notNull(), // 'basic', 'deep', 'repair', 'maintenance'
  poolSize: text("pool_size").notNull(), // 'small', 'medium', 'large'
  scheduledDate: text("scheduled_date").notNull(),
  status: text("status").notNull().default("open"), // 'open', 'accepted', 'in_progress', 'completed', 'cancelled'
  price: integer("price"), // in cents
  isRecurring: integer("is_recurring", { mode: "boolean" }).default(false),
  recurringFrequency: text("recurring_frequency"), // 'weekly', 'biweekly', 'monthly'
  specialRequests: text("special_requests"),
  chemicalNeeds: text("chemical_needs"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Ratings table for job reviews
export const ratings = sqliteTable("ratings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  fromUserId: integer("from_user_id").notNull().references(() => users.id),
  toUserId: integer("to_user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Messages table for communication between customers and cleaners
export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  fromUserId: integer("from_user_id").notNull().references(() => users.id),
  toUserId: integer("to_user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Cleaner profiles with additional information
export const cleanerProfiles = sqliteTable("cleaner_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  experience: text("experience"),
  specialties: text("specialties"), // JSON array of specialties
  serviceAreas: text("service_areas"), // JSON array of service areas
  availability: text("availability"), // JSON object with availability schedule
  hourlyRate: integer("hourly_rate"), // in cents
  bio: text("bio"),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  insurance: text("insurance"),
  certifications: text("certifications"), // JSON array
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  rating: true,
  totalRatings: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  cleanerId: true,
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertCleanerProfileSchema = createInsertSchema(cleanerProfiles).omit({
  id: true,
  createdAt: true,
  isVerified: true,
});

// Tokens table for SPL token tracking
export const tokens = sqliteTable("tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  address: text("address").notNull().unique(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  message: text("message").notNull(),
  signature: text("signature").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  metadata: text("metadata"), // JSON string for additional data
  userId: text("user_id") // Foreign key to users
});

export const insertTokenSchema = createInsertSchema(tokens).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type CleanerProfile = typeof cleanerProfiles.$inferSelect;
export type InsertCleanerProfile = z.infer<typeof insertCleanerProfileSchema>;
export type Token = typeof tokens.$inferSelect;
export type InsertToken = z.infer<typeof insertTokenSchema>;

// Marketing communication log table
export const communicationLogs = sqliteTable("communication_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'email', 'sms', 'phone', 'app_notification'
  subject: text("subject"),
  content: text("content").notNull(),
  campaignId: text("campaign_id"),
  sentAt: text("sent_at").default(sql`CURRENT_TIMESTAMP`),
  opened: integer("opened", { mode: "boolean" }).default(false),
  clicked: integer("clicked", { mode: "boolean" }).default(false),
  responded: integer("responded", { mode: "boolean" }).default(false),
  metadata: text("metadata"), // JSON for additional tracking data
});

// User activity tracking for marketing insights
export const userActivity = sqliteTable("user_activity", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  action: text("action").notNull(), // 'login', 'job_created', 'job_viewed', 'profile_updated'
  details: text("details"), // JSON object with action details
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
  sessionId: text("session_id"),
  flutterboyeTracked: integer("flutterboye_tracked", { mode: "boolean" }).default(false),
});

// Marketing campaigns table
export const marketingCampaigns = sqliteTable("marketing_campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'email', 'sms', 'push', 'in_app'
  targetSegment: text("target_segment"), // JSON array of segments
  content: text("content").notNull(),
  subject: text("subject"),
  status: text("status").default("draft"), // 'draft', 'scheduled', 'sent', 'completed'
  scheduledAt: text("scheduled_at"),
  sentAt: text("sent_at"),
  totalSent: integer("total_sent").default(0),
  totalOpened: integer("total_opened").default(0),
  totalClicked: integer("total_clicked").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertCommunicationLogSchema = createInsertSchema(communicationLogs).omit({
  id: true,
  sentAt: true,
});

export const insertUserActivitySchema = createInsertSchema(userActivity).omit({
  id: true,
  timestamp: true,
});

export const insertMarketingCampaignSchema = createInsertSchema(marketingCampaigns).omit({
  id: true,
  createdAt: true,
  totalSent: true,
  totalOpened: true,
  totalClicked: true,
});

// Additional types for marketing tables
export type CommunicationLog = typeof communicationLogs.$inferSelect;
export type InsertCommunicationLog = z.infer<typeof insertCommunicationLogSchema>;
export type UserActivity = typeof userActivity.$inferSelect;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;
export type MarketingCampaign = typeof marketingCampaigns.$inferSelect;
export type InsertMarketingCampaign = z.infer<typeof insertMarketingCampaignSchema>;

// Enums for validation
export const ServiceTypes = ["basic", "deep", "repair", "maintenance"] as const;
export const PoolSizes = ["small", "medium", "large"] as const;
export const JobStatuses = ["open", "accepted", "in_progress", "completed", "cancelled"] as const;
export const RecurringFrequencies = ["weekly", "biweekly", "monthly"] as const;

// Marketing enums
export const CommunicationTypes = ["email", "sms", "phone", "app_notification"] as const;
export const ContactMethods = ["email", "phone", "sms"] as const;
export const CommunicationFrequencies = ["daily", "weekly", "monthly"] as const;
export const PoolTypes = ["inground", "above_ground", "spa", "hot_tub"] as const;
export const ExtendedPoolSizes = ["small", "medium", "large", "extra_large"] as const;
export const CustomerSegments = ["premium", "standard", "budget", "commercial", "new", "loyal", "at-risk"] as const;