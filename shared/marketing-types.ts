// Marketing and communication types for enhanced user data collection

export interface MarketingData {
  // Contact preferences
  preferredContactMethod: 'email' | 'phone' | 'sms' | 'app_notification';
  communicationFrequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'on-demand';
  marketingOptIn: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  promotionalEmails: boolean;
  
  // Demographics for targeting
  ageRange?: '18-25' | '26-35' | '36-45' | '46-55' | '56-65' | '65+';
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  householdIncome?: 'under-50k' | '50k-75k' | '75k-100k' | '100k-150k' | '150k+';
  
  // Pool information for service targeting
  poolType: 'inground' | 'above_ground' | 'spa' | 'hot_tub' | 'multiple';
  poolSize: 'small' | 'medium' | 'large' | 'extra_large' | 'olympic';
  poolAge?: number;
  hasHeater?: boolean;
  hasSpa?: boolean;
  hasAutoCleaner?: boolean;
  
  // Service preferences
  serviceFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'seasonal' | 'as-needed';
  budgetRange: 'under-100' | '100-200' | '200-300' | '300-500' | '500+';
  preferredServiceDay?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  preferredServiceTime?: 'early-morning' | 'morning' | 'afternoon' | 'evening';
  
  // Customer journey
  referralSource?: 'google' | 'facebook' | 'instagram' | 'friend' | 'neighbor' | 'flyer' | 'website' | 'other';
  lifetimeValue: number; // Total spent in cents
  totalBookings: number;
  avgJobValue?: number; // Average job value in cents
  
  // Engagement tracking
  lastActiveDate?: Date;
  loginFrequency?: 'daily' | 'weekly' | 'monthly' | 'rarely';
  appUsage?: 'heavy' | 'moderate' | 'light';
  
  // Customer segments
  customerSegment: 'premium' | 'standard' | 'budget' | 'commercial' | 'new' | 'loyal' | 'at-risk';
  interests?: string[]; // Pool maintenance, landscaping, home improvement, etc.
  tags?: string[]; // Marketing tags for campaigns
}

export interface ServiceHistory {
  totalServices: number;
  lastServiceDate?: Date;
  averageRating: number;
  preferredCleaners: number[]; // User IDs of preferred cleaners
  commonServiceTypes: string[];
  seasonalPatterns?: {
    spring: number;
    summer: number;
    fall: number;
    winter: number;
  };
}

export interface CommunicationLog {
  id: number;
  userId: number;
  type: 'email' | 'sms' | 'phone' | 'app_notification' | 'in_app_message';
  subject?: string;
  content: string;
  sentAt: Date;
  opened?: boolean;
  clicked?: boolean;
  responded?: boolean;
  campaignId?: string;
}

// Form interfaces for collecting enhanced user data
export interface EnhancedRegistrationForm {
  // Basic info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Pool information
  poolType: 'inground' | 'above_ground' | 'spa' | 'hot_tub';
  poolSize: 'small' | 'medium' | 'large' | 'extra_large';
  poolAge?: number;
  specialRequirements?: string;
  
  // Service preferences
  serviceFrequency?: 'weekly' | 'bi-weekly' | 'monthly';
  budgetRange?: 'under-100' | '100-200' | '200-300' | '300-500' | '500+';
  preferredServiceDay?: string;
  
  // Marketing preferences
  marketingOptIn: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  referralSource?: string;
}

export interface CleanerProfileForm {
  // Business info
  businessName?: string;
  businessLicense?: string;
  insuranceInfo?: string;
  
  // Service info
  serviceAreas: string[];
  hourlyRate: number;
  specialties: string[];
  
  // Availability
  availability: {
    [day: string]: {
      available: boolean;
      startTime?: string;
      endTime?: string;
    };
  };
}