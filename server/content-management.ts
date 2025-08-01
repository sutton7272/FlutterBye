import { db } from "./db";
import { 
  contentSections, 
  layoutConfigs, 
  textContent, 
  imageAssets, 
  themeSettings,
  type InsertContentSection,
  type InsertLayoutConfig,
  type InsertTextContent,
  type InsertImageAsset,
  type InsertThemeSettings
} from "@shared/content-schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export class ContentManagementService {
  
  // Content Sections Management
  async getAllContentSections() {
    return await db.select().from(contentSections).orderBy(contentSections.page, contentSections.displayOrder);
  }

  async getContentSectionsByPage(page: string) {
    return await db.select().from(contentSections)
      .where(eq(contentSections.page, page))
      .orderBy(contentSections.displayOrder);
  }

  async createContentSection(data: Omit<InsertContentSection, 'id'>) {
    const [section] = await db.insert(contentSections).values({
      id: randomUUID(),
      ...data,
      updatedAt: new Date()
    }).returning();
    return section;
  }

  async updateContentSection(id: string, data: Partial<InsertContentSection>) {
    const [section] = await db.update(contentSections)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(contentSections.id, id))
      .returning();
    return section;
  }

  async deleteContentSection(id: string) {
    await db.delete(contentSections).where(eq(contentSections.id, id));
  }

  // Layout Configuration Management
  async getAllLayoutConfigs() {
    return await db.select().from(layoutConfigs).orderBy(layoutConfigs.page, layoutConfigs.section);
  }

  async getLayoutConfigsByPage(page: string) {
    return await db.select().from(layoutConfigs)
      .where(eq(layoutConfigs.page, page));
  }

  async upsertLayoutConfig(data: Omit<InsertLayoutConfig, 'id'>) {
    const existingConfig = await db.select().from(layoutConfigs)
      .where(eq(layoutConfigs.page, data.page))
      .limit(1);

    if (existingConfig.length > 0) {
      const [config] = await db.update(layoutConfigs)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(layoutConfigs.id, existingConfig[0].id))
        .returning();
      return config;
    } else {
      const [config] = await db.insert(layoutConfigs).values({
        id: randomUUID(),
        ...data,
        updatedAt: new Date()
      }).returning();
      return config;
    }
  }

  // Text Content Management
  async getAllTextContent() {
    return await db.select().from(textContent).orderBy(textContent.category, textContent.key);
  }

  async getTextContentByCategory(category: string) {
    return await db.select().from(textContent)
      .where(eq(textContent.category, category));
  }

  async upsertTextContent(data: Omit<InsertTextContent, 'id'>) {
    const existing = await db.select().from(textContent)
      .where(eq(textContent.key, data.key))
      .limit(1);

    if (existing.length > 0) {
      const [content] = await db.update(textContent)
        .set({ value: data.value, updatedAt: new Date() })
        .where(eq(textContent.key, data.key))
        .returning();
      return content;
    } else {
      const [content] = await db.insert(textContent).values({
        id: randomUUID(),
        ...data,
        updatedAt: new Date()
      }).returning();
      return content;
    }
  }

  async deleteTextContent(key: string) {
    await db.delete(textContent).where(eq(textContent.key, key));
  }

  // Image Assets Management
  async getAllImageAssets() {
    return await db.select().from(imageAssets).orderBy(desc(imageAssets.uploadedAt));
  }

  async getImageAssetsByCategory(category: string) {
    return await db.select().from(imageAssets)
      .where(eq(imageAssets.category, category))
      .orderBy(desc(imageAssets.uploadedAt));
  }

  async createImageAsset(data: Omit<InsertImageAsset, 'id'>) {
    const [asset] = await db.insert(imageAssets).values({
      id: randomUUID(),
      ...data,
      uploadedAt: new Date()
    }).returning();
    return asset;
  }

  async updateImageAsset(id: string, data: Partial<InsertImageAsset>) {
    const [asset] = await db.update(imageAssets)
      .set(data)
      .where(eq(imageAssets.id, id))
      .returning();
    return asset;
  }

  async deleteImageAsset(id: string) {
    await db.delete(imageAssets).where(eq(imageAssets.id, id));
  }

  async incrementImageUsage(id: string) {
    const [asset] = await db.select().from(imageAssets)
      .where(eq(imageAssets.id, id))
      .limit(1);
    
    if (asset) {
      await db.update(imageAssets)
        .set({ usageCount: String(parseInt(asset.usageCount || "0") + 1) })
        .where(eq(imageAssets.id, id));
    }
  }

  // Theme Settings Management
  async getThemeSettings() {
    const [settings] = await db.select().from(themeSettings)
      .where(eq(themeSettings.id, "default"))
      .limit(1);
    return settings;
  }

  async updateThemeSettings(data: Partial<InsertThemeSettings>) {
    const existing = await this.getThemeSettings();
    
    if (existing) {
      const [settings] = await db.update(themeSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(themeSettings.id, "default"))
        .returning();
      return settings;
    } else {
      const [settings] = await db.insert(themeSettings).values({
        id: "default",
        ...data,
        updatedAt: new Date()
      }).returning();
      return settings;
    }
  }

  // Bulk operations
  async bulkUpdateTextContent(updates: Array<{ key: string; value: string }>) {
    const results = [];
    for (const update of updates) {
      const result = await this.upsertTextContent({
        key: update.key,
        value: update.value,
        category: update.key.split('.')[0] // Extract category from key
      });
      results.push(result);
    }
    return results;
  }

  async exportAllContent() {
    const [sections, layouts, texts, images, theme] = await Promise.all([
      this.getAllContentSections(),
      this.getAllLayoutConfigs(),
      this.getAllTextContent(),
      this.getAllImageAssets(),
      this.getThemeSettings()
    ]);

    return {
      contentSections: sections,
      layoutConfigs: layouts,
      textContent: texts,
      imageAssets: images,
      themeSettings: theme,
      exportedAt: new Date().toISOString()
    };
  }
}

export const contentService = new ContentManagementService();