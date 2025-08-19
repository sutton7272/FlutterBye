import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, text, varchar, timestamp, json } from 'drizzle-orm/pg-core';
import { sql, eq, desc } from 'drizzle-orm';
// @ts-ignore
import ws from "ws";

// Set up neon config
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

// VIP Waitlist table schema
export const vipWaitlist = pgTable("vip_waitlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entryId: varchar("entry_id").notNull().unique(),
  email: text("email").notNull(),
  walletAddress: text("wallet_address"),
  joinedAt: timestamp("joined_at").defaultNow(),
  benefits: json("benefits").$type<string[]>().default(sql`'["Early access before public launch", "Exclusive FLBY token airdrops", "Beta testing privileges", "VIP community access"]'`),
  status: text("status").default("active"),
  source: text("source").default("website"),
  metadata: json("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type VipWaitlist = typeof vipWaitlist.$inferSelect;
export type InsertVipWaitlist = typeof vipWaitlist.$inferInsert;

export class VipWaitlistDB {
  static async add(entry: InsertVipWaitlist): Promise<VipWaitlist> {
    const [newEntry] = await db
      .insert(vipWaitlist)
      .values(entry)
      .returning();
    return newEntry;
  }

  static async getAll(): Promise<VipWaitlist[]> {
    return await db
      .select()
      .from(vipWaitlist)
      .orderBy(desc(vipWaitlist.joinedAt));
  }

  static async getByEntryId(entryId: string): Promise<VipWaitlist | undefined> {
    const [entry] = await db
      .select()
      .from(vipWaitlist)
      .where(eq(vipWaitlist.entryId, entryId))
      .limit(1);
    return entry;
  }

  static async updateStatus(entryId: string, status: string): Promise<void> {
    await db
      .update(vipWaitlist)
      .set({ 
        status, 
        updatedAt: new Date() 
      })
      .where(eq(vipWaitlist.entryId, entryId));
  }

  static async getSummary(): Promise<{
    totalEmails: number;
    withWallets: number;
    withoutWallets: number;
    lastEntry: string | null;
  }> {
    const entries = await this.getAll();
    
    return {
      totalEmails: entries.length,
      withWallets: entries.filter(e => e.walletAddress && e.walletAddress.trim() !== '').length,
      withoutWallets: entries.filter(e => !e.walletAddress || e.walletAddress.trim() === '').length,
      lastEntry: entries.length > 0 ? entries[0].joinedAt.toISOString() : null
    };
  }
}