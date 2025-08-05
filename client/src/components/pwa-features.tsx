import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Smartphone, Bell, X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-performance';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useLocalStorage('pwa-install-dismissed', false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    checkInstalled();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
  };

  if (isInstalled || !showPrompt || dismissed) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 z-50 border-electric-blue/20 bg-slate-900/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-electric-blue" />
            <CardTitle className="text-sm">Install Flutterbye</CardTitle>
            <Badge variant="secondary" className="text-xs">PWA</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          Get the full app experience with offline access and push notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="flex-1 bg-gradient-to-r from-electric-blue to-electric-green"
          >
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="border-electric-blue/20"
          >
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PWANotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [dismissed, setDismissed] = useLocalStorage('notification-prompt-dismissed', false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Show prompt after a delay if not already granted or denied
      if (Notification.permission === 'default' && !dismissed) {
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 10000); // Show after 10 seconds
        
        return () => clearTimeout(timer);
      }
    }
  }, [dismissed]);

  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      setShowPrompt(false);
      
      if (permission === 'granted') {
        new Notification('Flutterbye Notifications Enabled!', {
          body: 'You\'ll now receive updates about your tokens and chats.',
          icon: '/icon-192x192.png',
        });
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
  };

  if (permission !== 'default' || !showPrompt || dismissed) {
    return null;
  }

  return (
    <Card className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 border-electric-blue/20 bg-slate-900/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-electric-green" />
            <CardTitle className="text-sm">Enable Notifications</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          Stay updated with real-time token alerts and chat messages
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button
            onClick={handleEnableNotifications}
            size="sm"
            className="flex-1 bg-gradient-to-r from-electric-green to-electric-blue"
          >
            <Bell className="w-4 h-4 mr-2" />
            Enable
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="border-electric-blue/20"
          >
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}