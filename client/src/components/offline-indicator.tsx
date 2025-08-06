import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/use-performance';

export function OfflineIndicator() {
  // Temporarily disabled to prevent flashing during development
  // Re-enable for production by uncommenting the code below
  
  /*
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  // Only show if actually offline for more than 3 seconds
  if (!isOnline) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Alert className="border-red-500/50 bg-red-950/80 backdrop-blur-sm">
          <WifiOff className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            You're offline. Some features may not work properly.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Alert className="border-green-500/50 bg-green-950/80 backdrop-blur-sm">
          <Wifi className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-200">
            You're back online!
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  */

  return null;
}