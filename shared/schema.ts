import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for both customers and cleaners
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  address: text("address"),
  isCleaner: integer("is_cleaner", { mode: "boolean" }).default(false),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  rating: integer("rating").default(0), // 0-5 star rating
  totalRatings: integer("total_ratings").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
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

// Enums for validation
export const ServiceTypes = ["basic", "deep", "repair", "maintenance"] as const;
export const PoolSizes = ["small", "medium", "large"] as const;
export const JobStatuses = ["open", "accepted", "in_progress", "completed", "cancelled"] as const;
export const RecurringFrequencies = ["weekly", "biweekly", "monthly"] as const;