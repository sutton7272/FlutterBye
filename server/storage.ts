import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { 
  users, 
  jobs, 
  ratings, 
  messages, 
  cleanerProfiles,
  communicationLogs,
  userActivity,
  marketingCampaigns,
  type User,
  type InsertUser,
  type Job,
  type InsertJob,
  type Rating,
  type InsertRating,
  type Message,
  type InsertMessage,
  type CleanerProfile,
  type InsertCleanerProfile,
  type CommunicationLog,
  type InsertCommunicationLog,
  type UserActivity,
  type InsertUserActivity,
  type MarketingCampaign,
  type InsertMarketingCampaign
} from '../shared/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

const sqlite = new Database(':memory:');
const db = drizzle(sqlite);

// Initialize database with tables - Enhanced for marketing data collection
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_cleaner INTEGER DEFAULT 0,
    
    -- Contact Information (Marketing & Communication)
    phone TEXT,
    alternate_phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'USA',
    
    -- Personal & Demographic Information
    first_name TEXT,
    last_name TEXT,
    date_of_birth TEXT,
    gender TEXT,
    
    -- Pool Owner Information (for customers)
    pool_type TEXT, -- 'inground', 'above_ground', 'spa', 'hot_tub'
    pool_size TEXT, -- 'small', 'medium', 'large', 'extra_large'
    pool_age INTEGER,
    pool_equipment TEXT, -- JSON array of equipment
    special_requirements TEXT,
    property_type TEXT, -- 'residential', 'commercial', 'hoa'
    
    -- Professional Information (for cleaners)
    business_name TEXT,
    business_license TEXT,
    insurance_info TEXT,
    hourly_rate INTEGER, -- in cents
    service_areas TEXT, -- JSON array
    
    -- Marketing & Communication Preferences
    marketing_opt_in INTEGER DEFAULT 1,
    email_notifications INTEGER DEFAULT 1,
    sms_notifications INTEGER DEFAULT 0,
    promotional_emails INTEGER DEFAULT 1,
    preferred_contact_method TEXT DEFAULT 'email',
    communication_frequency TEXT DEFAULT 'weekly',
    
    -- Service Preferences & History
    preferred_service_day TEXT,
    preferred_service_time TEXT,
    service_frequency TEXT,
    budget_range TEXT,
    referral_source TEXT,
    
    -- Engagement & Analytics
    last_login_at TEXT,
    account_status TEXT DEFAULT 'active',
    lifetime_value INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    rating INTEGER DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    
    -- Additional Marketing Data
    interests TEXT, -- JSON array of interests
    customer_segment TEXT,
    notes TEXT,
    tags TEXT, -- JSON array
    
    -- Flutterbye Integration
    flutterboye_user_id TEXT,
    flutterboye_rewards INTEGER DEFAULT 0,
    
    -- System Fields
    is_active INTEGER DEFAULT 1,
    is_verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL REFERENCES users(id),
    cleaner_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    service_type TEXT NOT NULL,
    pool_size TEXT NOT NULL,
    scheduled_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    price INTEGER,
    is_recurring INTEGER DEFAULT 0,
    recurring_frequency TEXT,
    special_requests TEXT,
    chemical_needs TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL REFERENCES jobs(id),
    from_user_id INTEGER NOT NULL REFERENCES users(id),
    to_user_id INTEGER NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL REFERENCES jobs(id),
    from_user_id INTEGER NOT NULL REFERENCES users(id),
    to_user_id INTEGER NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cleaner_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    experience TEXT,
    specialties TEXT,
    service_areas TEXT,
    availability TEXT,
    hourly_rate INTEGER,
    bio TEXT,
    is_verified INTEGER DEFAULT 0,
    insurance TEXT,
    certifications TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS communication_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    type TEXT NOT NULL, -- 'email', 'sms', 'phone', 'app_notification'
    subject TEXT,
    content TEXT NOT NULL,
    campaign_id TEXT,
    sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
    opened INTEGER DEFAULT 0,
    clicked INTEGER DEFAULT 0,
    responded INTEGER DEFAULT 0,
    metadata TEXT -- JSON for additional tracking data
  );

  CREATE TABLE IF NOT EXISTS user_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    action TEXT NOT NULL, -- 'login', 'job_created', 'job_viewed', 'profile_updated'
    details TEXT, -- JSON object with action details
    ip_address TEXT,
    user_agent TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT,
    flutterboye_tracked INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'email', 'sms', 'push', 'in_app'
    target_segment TEXT, -- JSON array of segments
    content TEXT NOT NULL,
    subject TEXT,
    status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'sent', 'completed'
    scheduled_at TEXT,
    sent_at TEXT,
    total_sent INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed with sample data
sqlite.exec(`
  INSERT INTO users (name, email, password, is_cleaner, phone, address) VALUES
  ('John Customer', 'john@example.com', 'password123', 0, '555-0101', '123 Main St, City, State'),
  ('Jane Cleaner', 'jane@poolcleaner.com', 'password123', 1, '555-0102', '456 Oak Ave, City, State'),
  ('Mike Pool Pro', 'mike@poolpro.com', 'password123', 1, '555-0103', '789 Pine St, City, State'),
  ('Sarah Customer', 'sarah@example.com', 'password123', 0, '555-0104', '321 Elm St, City, State');

  INSERT INTO cleaner_profiles (user_id, experience, specialties, service_areas, hourly_rate, bio, is_verified) VALUES
  (2, '5 years', '["pool maintenance", "chemical balancing", "equipment repair"]', '["downtown", "north side", "suburbs"]', 5000, 'Professional pool cleaner with 5 years experience. Certified in pool maintenance and chemical handling.', 1),
  (3, '8 years', '["deep cleaning", "algae removal", "pool repairs", "equipment installation"]', '["south side", "west end", "suburbs"]', 6000, 'Expert pool technician specializing in problem pools and equipment repair. Licensed and insured.', 1);

  INSERT INTO jobs (customer_id, title, description, address, service_type, pool_size, scheduled_date, price) VALUES
  (1, 'Weekly Pool Cleaning', 'Need regular weekly pool maintenance including skimming, vacuuming, and chemical balancing', '123 Main St, City, State', 'basic', 'medium', '2024-02-10', 8000),
  (4, 'Deep Pool Cleaning', 'Pool has been neglected for months, needs deep cleaning and algae treatment', '321 Elm St, City, State', 'deep', 'large', '2024-02-12', 15000);
`);

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(id: number, updates: Partial<User>): Promise<User | null>;
  getAllCleaners(): Promise<User[]>;

  // Job operations
  createJob(job: InsertJob): Promise<Job>;
  getJobById(id: number): Promise<Job | null>;
  getJobsByCustomer(customerId: number): Promise<Job[]>;
  getJobsByCleaner(cleanerId: number): Promise<Job[]>;
  getOpenJobs(): Promise<Job[]>;
  updateJob(id: number, updates: Partial<Job>): Promise<Job | null>;
  deleteJob(id: number): Promise<boolean>;

  // Rating operations
  createRating(rating: InsertRating): Promise<Rating>;
  getRatingsByUser(userId: number): Promise<Rating[]>;
  getRatingsByJob(jobId: number): Promise<Rating[]>;

  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByJob(jobId: number): Promise<Message[]>;

  // Cleaner profile operations
  createCleanerProfile(profile: InsertCleanerProfile): Promise<CleanerProfile>;
  getCleanerProfile(userId: number): Promise<CleanerProfile | null>;
  updateCleanerProfile(userId: number, updates: Partial<CleanerProfile>): Promise<CleanerProfile | null>;
  
  // Marketing & Communication operations
  logUserActivity(activity: InsertUserActivity): Promise<UserActivity>;
  logCommunication(communication: InsertCommunicationLog): Promise<CommunicationLog>;
  createMarketingCampaign(campaign: InsertMarketingCampaign): Promise<MarketingCampaign>;
  getUserActivities(userId: number): Promise<UserActivity[]>;
  getCommunicationLogs(userId: number): Promise<CommunicationLog[]>;
  getMarketingInsights(): Promise<any>;
  updateUserEngagement(userId: number, action: string, details?: any): Promise<void>;
  trackFlutterboyeIntegration(userId: number, data: any): Promise<void>;
}

export class SQLiteStorage implements IStorage {
  async createUser(user: InsertUser): Promise<User> {
    const result = db.insert(users).values(user).returning().get();
    return result as User;
  }

  async getUserById(id: number): Promise<User | null> {
    const result = db.select().from(users).where(eq(users.id, id)).get();
    return result as User || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = db.select().from(users).where(eq(users.email, email)).get();
    return result as User || null;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const result = db.update(users).set(updates).where(eq(users.id, id)).returning().get();
    return result as User || null;
  }

  async getAllCleaners(): Promise<User[]> {
    const result = db.select().from(users).where(eq(users.isCleaner, true)).all();
    return result as User[];
  }

  async createJob(job: InsertJob): Promise<Job> {
    const result = db.insert(jobs).values(job).returning().get();
    return result as Job;
  }

  async getJobById(id: number): Promise<Job | null> {
    const result = db.select().from(jobs).where(eq(jobs.id, id)).get();
    return result as Job || null;
  }

  async getJobsByCustomer(customerId: number): Promise<Job[]> {
    const result = db.select().from(jobs)
      .where(eq(jobs.customerId, customerId))
      .orderBy(desc(jobs.createdAt))
      .all();
    return result as Job[];
  }

  async getJobsByCleaner(cleanerId: number): Promise<Job[]> {
    const result = db.select().from(jobs)
      .where(eq(jobs.cleanerId, cleanerId))
      .orderBy(desc(jobs.createdAt))
      .all();
    return result as Job[];
  }

  async getOpenJobs(): Promise<Job[]> {
    const result = db.select().from(jobs)
      .where(eq(jobs.status, 'open'))
      .orderBy(desc(jobs.createdAt))
      .all();
    return result as Job[];
  }

  async updateJob(id: number, updates: Partial<Job>): Promise<Job | null> {
    const updateData = { ...updates, updatedAt: new Date().toISOString() };
    const result = db.update(jobs).set(updateData).where(eq(jobs.id, id)).returning().get();
    return result as Job || null;
  }

  async deleteJob(id: number): Promise<boolean> {
    const result = db.delete(jobs).where(eq(jobs.id, id)).run();
    return result.changes > 0;
  }

  async createRating(rating: InsertRating): Promise<Rating> {
    const result = db.insert(ratings).values(rating).returning().get();
    return result as Rating;
  }

  async getRatingsByUser(userId: number): Promise<Rating[]> {
    const result = db.select().from(ratings)
      .where(eq(ratings.toUserId, userId))
      .orderBy(desc(ratings.createdAt))
      .all();
    return result as Rating[];
  }

  async getRatingsByJob(jobId: number): Promise<Rating[]> {
    const result = db.select().from(ratings)
      .where(eq(ratings.jobId, jobId))
      .orderBy(desc(ratings.createdAt))
      .all();
    return result as Rating[];
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = db.insert(messages).values(message).returning().get();
    return result as Message;
  }

  async getMessagesByJob(jobId: number): Promise<Message[]> {
    const result = db.select().from(messages)
      .where(eq(messages.jobId, jobId))
      .orderBy(asc(messages.createdAt))
      .all();
    return result as Message[];
  }

  async createCleanerProfile(profile: InsertCleanerProfile): Promise<CleanerProfile> {
    const result = db.insert(cleanerProfiles).values(profile).returning().get();
    return result as CleanerProfile;
  }

  async getCleanerProfile(userId: number): Promise<CleanerProfile | null> {
    const result = db.select().from(cleanerProfiles).where(eq(cleanerProfiles.userId, userId)).get();
    return result as CleanerProfile || null;
  }

  async updateCleanerProfile(userId: number, updates: Partial<CleanerProfile>): Promise<CleanerProfile | null> {
    const result = db.update(cleanerProfiles).set(updates).where(eq(cleanerProfiles.userId, userId)).returning().get();
    return result as CleanerProfile || null;
  }

  // Marketing & Communication operations
  async logUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    const result = db.insert(userActivity).values(activity).returning().get();
    return result as UserActivity;
  }

  async logCommunication(communication: InsertCommunicationLog): Promise<CommunicationLog> {
    const result = db.insert(communicationLogs).values(communication).returning().get();
    return result as CommunicationLog;
  }

  async createMarketingCampaign(campaign: InsertMarketingCampaign): Promise<MarketingCampaign> {
    const result = db.insert(marketingCampaigns).values(campaign).returning().get();
    return result as MarketingCampaign;
  }

  async getUserActivities(userId: number): Promise<UserActivity[]> {
    const result = db.select().from(userActivity)
      .where(eq(userActivity.userId, userId))
      .orderBy(desc(userActivity.timestamp))
      .all();
    return result as UserActivity[];
  }

  async getCommunicationLogs(userId: number): Promise<CommunicationLog[]> {
    const result = db.select().from(communicationLogs)
      .where(eq(communicationLogs.userId, userId))
      .orderBy(desc(communicationLogs.sentAt))
      .all();
    return result as CommunicationLog[];
  }

  async getMarketingInsights(): Promise<any> {
    // Get comprehensive marketing insights
    const totalUsers = db.select().from(users).all().length;
    const activeUsers = db.select().from(users).where(eq(users.isActive, true)).all().length;
    const poolCustomers = db.select().from(users).where(eq(users.isCleaner, false)).all();
    
    const customerSegments = poolCustomers.reduce((acc: any, user: any) => {
      const segment = user.customerSegment || 'new';
      acc[segment] = (acc[segment] || 0) + 1;
      return acc;
    }, {});

    const communicationPreferences = poolCustomers.reduce((acc: any, user: any) => {
      const method = user.preferredContactMethod || 'email';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

    return {
      totalUsers,
      activeUsers,
      poolCustomers: poolCustomers.length,
      customerSegments,
      communicationPreferences,
      timestamp: new Date().toISOString()
    };
  }

  async updateUserEngagement(userId: number, action: string, details?: any): Promise<void> {
    // Log the activity
    await this.logUserActivity({
      userId,
      action,
      details: JSON.stringify(details || {}),
      sessionId: `session_${Date.now()}`,
      flutterboyeTracked: false
    });

    // Update user's last activity and engagement metrics
    const updates: Partial<User> = {
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (action === 'job_created') {
      const user = await this.getUserById(userId);
      if (user) {
        updates.totalBookings = (user.totalBookings || 0) + 1;
      }
    }

    await this.updateUser(userId, updates);
  }

  async trackFlutterboyeIntegration(userId: number, data: any): Promise<void> {
    // Update user's Flutterbye integration data
    const updates: Partial<User> = {
      flutterboyeUserId: data.flutterboyeUserId,
      flutterboyeRewards: data.rewards || 0,
      updatedAt: new Date().toISOString()
    };

    await this.updateUser(userId, updates);

    // Log the integration activity
    await this.logUserActivity({
      userId,
      action: 'flutterboye_integration',
      details: JSON.stringify(data),
      sessionId: `flutterboye_${Date.now()}`,
      flutterboyeTracked: true
    });
  }
}

export const storage = new SQLiteStorage();