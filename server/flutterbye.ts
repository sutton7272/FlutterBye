import axios from 'axios';

interface FlutterboyeConfig {
  apiKey: string;
  apiUrl: string;
}

class FlutterboyeService {
  private config: FlutterboyeConfig;

  constructor() {
    this.config = {
      apiKey: process.env.FLUTTERBYE_API_KEY || '',
      apiUrl: process.env.FLUTTERBYE_API_URL || 'https://api.flutterbye.com'
    };
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async createNotification(data: {
    recipientId: string;
    message: string;
    type: 'job_posted' | 'job_accepted' | 'job_completed' | 'payment_received';
    metadata?: any;
  }) {
    if (!this.config.apiKey) {
      console.log('Flutterbye API key not configured, skipping notification');
      return null;
    }

    try {
      const response = await axios.post(
        `${this.config.apiUrl}/notifications`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Flutterbye notification error:', error);
      return null;
    }
  }

  async trackUserActivity(data: {
    userId: string;
    action: string;
    details: any;
  }) {
    if (!this.config.apiKey) {
      console.log('Flutterbye API key not configured, skipping activity tracking');
      return null;
    }

    try {
      const response = await axios.post(
        `${this.config.apiUrl}/analytics/track`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Flutterbye tracking error:', error);
      return null;
    }
  }

  async sendRewards(data: {
    userId: string;
    amount: number;
    reason: string;
    jobId?: number;
  }) {
    if (!this.config.apiKey) {
      console.log('Flutterbye API key not configured, skipping rewards');
      return null;
    }

    try {
      const response = await axios.post(
        `${this.config.apiUrl}/rewards/send`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Flutterbye rewards error:', error);
      return null;
    }
  }

  isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.apiUrl);
  }
}

export const flutterboyeService = new FlutterboyeService();