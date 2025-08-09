// Analytics tracking - will be integrated with the main analytics service later
const trackBusinessEvent = async (eventType: string, data: any) => {
  console.log(`📊 Business Event: ${eventType}`, data);
  // This will be connected to the main analytics system
};

export interface Campaign {
  id: string;
  name: string;
  message: string;
  emotionType: string;
  targetAudience: string;
  scheduledDate?: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  viralScore: number;
  estimatedReach: number;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  phoneNumber: string;
  name?: string;
  tags: string[];
  lastContact?: string;
  engagementScore: number;
  createdAt: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  message: string;
  emotion: string;
  category: string;
  viralScore: number;
  usageCount: number;
  rating: number;
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}

class SMSCampaignService {
  private campaigns: Campaign[] = [];
  private contacts: Contact[] = [];
  private templates: MessageTemplate[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with some sample campaigns
    this.campaigns = [
      {
        id: 'camp-001',
        name: 'Welcome New Users',
        message: 'Welcome to FlutterWave! Your emotional messaging journey begins now 🦋',
        emotionType: 'joy',
        targetAudience: 'new_contacts',
        status: 'active',
        totalRecipients: 156,
        sentCount: 89,
        deliveredCount: 87,
        viralScore: 78.5,
        estimatedReach: 2340,
        createdAt: '2025-08-07T10:00:00Z',
        updatedAt: '2025-08-09T07:00:00Z'
      },
      {
        id: 'camp-002',
        name: 'Valentine Day Special',
        message: 'Send love tokens to your special ones this Valentine\'s Day 💕',
        emotionType: 'love',
        targetAudience: 'high_engagement',
        status: 'scheduled',
        scheduledDate: '2025-02-14T09:00:00Z',
        totalRecipients: 892,
        sentCount: 0,
        deliveredCount: 0,
        viralScore: 94.2,
        estimatedReach: 15670,
        createdAt: '2025-08-05T14:30:00Z',
        updatedAt: '2025-08-05T14:30:00Z'
      }
    ];

    // Initialize with sample contacts
    this.contacts = [
      {
        id: 'contact-001',
        phoneNumber: '+1-555-0123',
        name: 'Alice Johnson',
        tags: ['friend', 'high-engagement'],
        lastContact: '2025-08-08T15:30:00Z',
        engagementScore: 85,
        createdAt: '2025-08-01T10:00:00Z'
      },
      {
        id: 'contact-002',
        phoneNumber: '+1-555-0456',
        name: 'Bob Smith',
        tags: ['family', 'birthday'],
        lastContact: '2025-08-07T09:15:00Z',
        engagementScore: 92,
        createdAt: '2025-08-02T11:20:00Z'
      }
    ];

    // Initialize with sample templates
    this.templates = [
      {
        id: 'template-001',
        title: 'Heartfelt Gratitude',
        message: 'Thank you for always believing in me! You mean the world to me 💕',
        emotion: 'gratitude',
        category: 'personal',
        viralScore: 94.2,
        usageCount: 1847,
        rating: 4.9,
        tags: ['thank you', 'appreciation', 'love'],
        isPublic: true,
        createdBy: 'FlutterWave Team',
        createdAt: '2025-08-01T00:00:00Z'
      },
      {
        id: 'template-002',
        title: 'Birthday Celebration',
        message: 'Happy Birthday! May your special day be filled with joy and love 🎂🎈',
        emotion: 'celebration',
        category: 'birthday',
        viralScore: 92.1,
        usageCount: 2103,
        rating: 4.9,
        tags: ['birthday', 'celebration', 'special day'],
        isPublic: true,
        createdBy: 'FlutterWave Team',
        createdAt: '2025-08-01T00:00:00Z'
      }
    ];
  }

  // Campaign Management
  async createCampaign(campaignData: Partial<Campaign>): Promise<Campaign> {
    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: campaignData.name || '',
      message: campaignData.message || '',
      emotionType: campaignData.emotionType || 'message',
      targetAudience: campaignData.targetAudience || 'all',
      scheduledDate: campaignData.scheduledDate,
      status: campaignData.scheduledDate ? 'scheduled' : 'draft',
      totalRecipients: this.calculateTargetAudience(campaignData.targetAudience || 'all'),
      sentCount: 0,
      deliveredCount: 0,
      viralScore: Math.random() * 30 + 70, // Random score between 70-100
      estimatedReach: Math.floor(Math.random() * 10000) + 1000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.campaigns.push(newCampaign);
    
    await trackBusinessEvent('sms_campaign_created', {
      campaignId: newCampaign.id,
      emotionType: newCampaign.emotionType,
      targetAudience: newCampaign.targetAudience,
      estimatedReach: newCampaign.estimatedReach
    });

    return newCampaign;
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return this.campaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getCampaign(id: string): Promise<Campaign | null> {
    return this.campaigns.find(c => c.id === id) || null;
  }

  async launchCampaign(id: string): Promise<Campaign | null> {
    const campaign = this.campaigns.find(c => c.id === id);
    if (!campaign) return null;

    campaign.status = 'active';
    campaign.updatedAt = new Date().toISOString();

    // Simulate sending process
    this.simulateCampaignProgress(campaign);

    await trackBusinessEvent('sms_campaign_launched', {
      campaignId: campaign.id,
      totalRecipients: campaign.totalRecipients
    });

    return campaign;
  }

  private simulateCampaignProgress(campaign: Campaign) {
    const interval = setInterval(() => {
      if (campaign.sentCount >= campaign.totalRecipients) {
        campaign.status = 'completed';
        clearInterval(interval);
        return;
      }

      const increment = Math.min(
        Math.floor(Math.random() * 10) + 1,
        campaign.totalRecipients - campaign.sentCount
      );
      
      campaign.sentCount += increment;
      campaign.deliveredCount += Math.floor(increment * 0.98); // 98% delivery rate
      campaign.updatedAt = new Date().toISOString();
    }, 2000);
  }

  private calculateTargetAudience(targetAudience: string): number {
    switch (targetAudience) {
      case 'all': return this.contacts.length;
      case 'high_engagement': return Math.floor(this.contacts.length * 0.6);
      case 'recent_activity': return Math.floor(this.contacts.length * 0.4);
      case 'new_contacts': return Math.floor(this.contacts.length * 0.3);
      default: return this.contacts.length;
    }
  }

  // Contact Management
  async addContact(contactData: Partial<Contact>): Promise<Contact> {
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      phoneNumber: contactData.phoneNumber || '',
      name: contactData.name,
      tags: contactData.tags || [],
      engagementScore: Math.floor(Math.random() * 40) + 60, // Random score 60-100
      createdAt: new Date().toISOString()
    };

    this.contacts.push(newContact);

    await trackBusinessEvent('sms_contact_added', {
      contactId: newContact.id,
      tags: newContact.tags
    });

    return newContact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return this.contacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Template Management
  async createTemplate(templateData: Partial<MessageTemplate>): Promise<MessageTemplate> {
    const newTemplate: MessageTemplate = {
      id: `template-${Date.now()}`,
      title: templateData.title || '',
      message: templateData.message || '',
      emotion: templateData.emotion || 'message',
      category: templateData.category || 'personal',
      viralScore: Math.random() * 30 + 70, // Random score between 70-100
      usageCount: 0,
      rating: 4.5 + Math.random() * 0.5, // Random rating 4.5-5.0
      tags: templateData.tags || [],
      isPublic: templateData.isPublic || false,
      createdBy: 'User',
      createdAt: new Date().toISOString()
    };

    this.templates.push(newTemplate);

    await trackBusinessEvent('sms_template_created', {
      templateId: newTemplate.id,
      emotion: newTemplate.emotion,
      category: newTemplate.category
    });

    return newTemplate;
  }

  async getAllTemplates(): Promise<MessageTemplate[]> {
    return this.templates.sort((a, b) => b.usageCount - a.usageCount);
  }

  async getTemplate(id: string): Promise<MessageTemplate | null> {
    return this.templates.find(t => t.id === id) || null;
  }

  async incrementTemplateUsage(id: string): Promise<void> {
    const template = this.templates.find(t => t.id === id);
    if (template) {
      template.usageCount++;
    }
  }

  // Analytics
  async getCampaignAnalytics() {
    const totalCampaigns = this.campaigns.length;
    const activeCampaigns = this.campaigns.filter(c => c.status === 'active').length;
    const completedCampaigns = this.campaigns.filter(c => c.status === 'completed').length;
    
    const totalMessages = this.campaigns.reduce((sum, c) => sum + c.sentCount, 0);
    const totalRecipients = this.campaigns.reduce((sum, c) => sum + c.totalRecipients, 0);
    const averageViralScore = this.campaigns.reduce((sum, c) => sum + c.viralScore, 0) / totalCampaigns || 0;
    
    const emotionBreakdown = this.campaigns.reduce((acc: any, campaign) => {
      const emotion = campaign.emotionType;
      if (!acc[emotion]) {
        acc[emotion] = { count: 0, totalViralScore: 0, totalRevenue: 0 };
      }
      acc[emotion].count++;
      acc[emotion].totalViralScore += campaign.viralScore;
      acc[emotion].totalRevenue += campaign.sentCount * 0.25; // $0.25 per message
      return acc;
    }, {});

    return {
      overview: {
        totalCampaigns,
        totalMessages,
        totalRecipients,
        averageViralScore,
        totalRevenue: totalMessages * 0.25,
        deliveryRate: 98.7,
        engagementRate: 67.4,
        conversionRate: 23.8
      },
      emotionBreakdown: Object.entries(emotionBreakdown).map(([emotion, data]: [string, any]) => ({
        emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        count: data.count,
        avgViralScore: data.totalViralScore / data.count,
        revenue: data.totalRevenue,
        color: this.getEmotionColor(emotion)
      })),
      activeCampaigns,
      completedCampaigns
    };
  }

  private getEmotionColor(emotion: string): string {
    const colors: { [key: string]: string } = {
      love: 'text-pink-400',
      joy: 'text-yellow-400',
      gratitude: 'text-green-400',
      support: 'text-blue-400',
      motivation: 'text-red-400',
      celebration: 'text-purple-400'
    };
    return colors[emotion] || 'text-gray-400';
  }
}

export const smsCampaignService = new SMSCampaignService();