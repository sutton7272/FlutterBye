/**
 * PWA (Progressive Web App) management utilities
 */

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
        
        // Listen for updates
        this.serviceWorkerRegistration.addEventListener('updatefound', () => {
          this.handleServiceWorkerUpdate();
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.notifyInstallAvailable();
    });

    // Check if already installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.notifyInstallComplete();
    });

    // Check if running as PWA
    this.checkInstallStatus();
  }

  private checkInstallStatus() {
    // Check if running in standalone mode
    this.isInstalled = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
  }

  private handleServiceWorkerUpdate() {
    const registration = this.serviceWorkerRegistration;
    if (!registration) return;

    const installingWorker = registration.installing;
    if (!installingWorker) return;

    installingWorker.addEventListener('statechange', () => {
      if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New content is available
        this.notifyUpdateAvailable();
      }
    });
  }

  // Public methods
  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  canInstall(): boolean {
    return this.deferredPrompt !== null && !this.isInstalled;
  }

  isAppInstalled(): boolean {
    return this.isInstalled;
  }

  async updateServiceWorker(): Promise<void> {
    if (this.serviceWorkerRegistration) {
      await this.serviceWorkerRegistration.update();
    }
  }

  async skipWaiting(): Promise<void> {
    if (this.serviceWorkerRegistration?.waiting) {
      this.serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  // Notification methods (to be implemented by consuming code)
  private notifyInstallAvailable() {
    // Dispatch custom event for install prompt availability
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  }

  private notifyInstallComplete() {
    // Dispatch custom event for install completion
    window.dispatchEvent(new CustomEvent('pwa-install-complete'));
  }

  private notifyUpdateAvailable() {
    // Dispatch custom event for update availability
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  }

  // Offline detection
  isOnline(): boolean {
    return navigator.onLine;
  }

  onOffline(callback: () => void): () => void {
    window.addEventListener('offline', callback);
    return () => window.removeEventListener('offline', callback);
  }

  onOnline(callback: () => void): () => void {
    window.addEventListener('online', callback);
    return () => window.removeEventListener('online', callback);
  }

  // Background sync
  async requestBackgroundSync(tag: string): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
    }
  }

  // Push notifications
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }

  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.serviceWorkerRegistration) return null;

    try {
      const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.VITE_VAPID_PUBLIC_KEY || ''
        )
      });
      
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }
}

// Global PWA manager instance
export const pwaManager = new PWAManager();

// React hook for PWA functionality
export function usePWA() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Update install status
    setCanInstall(pwaManager.canInstall());
    setIsInstalled(pwaManager.isAppInstalled());

    // Listen for PWA events
    const handleInstallAvailable = () => setCanInstall(true);
    const handleInstallComplete = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };
    const handleUpdateAvailable = () => setUpdateAvailable(true);

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-complete', handleInstallComplete);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-complete', handleInstallComplete);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    canInstall,
    isInstalled,
    isOnline,
    updateAvailable,
    showInstallPrompt: () => pwaManager.showInstallPrompt(),
    updateApp: () => pwaManager.skipWaiting(),
    requestNotifications: () => pwaManager.requestNotificationPermission()
  };
}

// Import required React hooks
import { useState, useEffect } from 'react';