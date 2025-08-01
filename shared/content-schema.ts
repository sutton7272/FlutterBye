import { pgTable, text, varchar, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Content sections that can be edited
export const contentSections = pgTable("content_sections", {
  id: varchar("id").primaryKey(),
  section: varchar("section").notNull(), // e.g., "hero", "features", "stats"
  page: varchar("page").notNull(), // e.g., "home", "mint", "about" 
  title: text("title"),
  subtitle: text("subtitle"),
  description: text("description"),
  buttonText: text("button_text"),
  buttonLink: text("button_link"),
  imageUrl: text("image_url"),
  imageAlt: text("image_alt"),
  isActive: boolean("is_active").default(true),
  displayOrder: varchar("display_order").default("0"),
  customData: jsonb("custom_data"), // For flexible additional fields
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Layout configurations 
export const layoutConfigs = pgTable("layout_configs", {
  id: varchar("id").primaryKey(),
  page: varchar("page").notNull(),
  section: varchar("section").notNull(),
  layoutType: varchar("layout_type").notNull(), // grid, flex, columns
  gridCols: varchar("grid_cols").default("1"), // 1, 2, 3, 4
  spacing: varchar("spacing").default("medium"), // small, medium, large
  alignment: varchar("alignment").default("left"), // left, center, right
  backgroundColor: varchar("background_color").default("transparent"),
  textColor: varchar("text_color").default("default"),
  customClasses: text("custom_classes"),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dynamic text content
export const textContent = pgTable("text_content", {
  id: varchar("id").primaryKey(),
  key: varchar("key").notNull().unique(), // e.g., "home.hero.title"
  value: text("value").notNull(),
  description: text("description"), // Admin helper text
  category: varchar("category"), // grouping for admin UI
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Image assets management
export const imageAssets = pgTable("image_assets", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  originalName: varchar("original_name"),
  url: text("url").notNull(),
  altText: text("alt_text"),
  category: varchar("category"), // logos, heroes, icons, backgrounds
  width: varchar("width"),
  height: varchar("height"),
  fileSize: varchar("file_size"),
  usageCount: varchar("usage_count").default("0"),
  isActive: boolean("is_active").default(true),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Theme and styling
export const themeSettings = pgTable("theme_settings", {
  id: varchar("id").primaryKey().default("default"),
  primaryColor: varchar("primary_color").default("#8B5CF6"),
  secondaryColor: varchar("secondary_color").default("#EC4899"),
  accentColor: varchar("accent_color").default("#06B6D4"),
  backgroundColor: varchar("background_color").default("#000000"),
  textColor: varchar("text_color").default("#FFFFFF"),
  fontFamily: varchar("font_family").default("Inter"),
  borderRadius: varchar("border_radius").default("0.5rem"),
  customCss: text("custom_css"),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export types
export type ContentSection = typeof contentSections.$inferSelect;
export type InsertContentSection = typeof contentSections.$inferInsert;
export type LayoutConfig = typeof layoutConfigs.$inferSelect;
export type InsertLayoutConfig = typeof layoutConfigs.$inferInsert;
export type TextContent = typeof textContent.$inferSelect;
export type InsertTextContent = typeof textContent.$inferInsert;
export type ImageAsset = typeof imageAssets.$inferSelect;
export type InsertImageAsset = typeof imageAssets.$inferInsert;
export type ThemeSettings = typeof themeSettings.$inferSelect;
export type InsertThemeSettings = typeof themeSettings.$inferInsert;

// Zod schemas
export const insertContentSectionSchema = createInsertSchema(contentSections);
export const insertLayoutConfigSchema = createInsertSchema(layoutConfigs);
export const insertTextContentSchema = createInsertSchema(textContent);
export const insertImageAssetSchema = createInsertSchema(imageAssets);
export const insertThemeSettingsSchema = createInsertSchema(themeSettings);

export type InsertContentSectionInput = z.infer<typeof insertContentSectionSchema>;
export type InsertLayoutConfigInput = z.infer<typeof insertLayoutConfigSchema>;
export type InsertTextContentInput = z.infer<typeof insertTextContentSchema>;
export type InsertImageAssetInput = z.infer<typeof insertImageAssetSchema>;
export type InsertThemeSettingsInput = z.infer<typeof insertThemeSettingsSchema>;