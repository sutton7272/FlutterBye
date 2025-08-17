// Singleton Twitter Scheduler to prevent duplicate posting
import { TwitterContentScheduler } from './twitter-content-scheduler';

class TwitterSchedulerSingleton {
  private static instance: TwitterContentScheduler | null = null;
  private static isInitializing = false;

  static getInstance(): TwitterContentScheduler | null {
    if (this.isInitializing) {
      console.log('📅 Scheduler already initializing, skipping...');
      return this.instance;
    }

    if (!this.instance) {
      this.isInitializing = true;
      try {
        console.log('📅 Creating new Twitter scheduler instance...');
        this.instance = new TwitterContentScheduler();
        console.log('✅ Twitter scheduler singleton created');
      } catch (error) {
        console.error('❌ Failed to create Twitter scheduler:', error);
        this.instance = null;
      } finally {
        this.isInitializing = false;
      }
    }
    return this.instance;
  }

  static activateBot(configId?: string) {
    const scheduler = this.getInstance();
    if (scheduler) {
      scheduler.activateBot(configId);
    }
  }

  static deactivateBot() {
    const scheduler = this.getInstance();
    if (scheduler) {
      scheduler.deactivateBot();
    }
  }

  static getStatus() {
    const scheduler = this.getInstance();
    return scheduler ? scheduler.getBotStatus() : { isActive: false, isInitialized: false };
  }

  static reset() {
    console.log('🔄 Resetting Twitter scheduler singleton...');
    if (this.instance) {
      this.instance.stopBot();
    }
    this.instance = null;
    this.isInitializing = false;
  }
}

export default TwitterSchedulerSingleton;