import { useState, useEffect } from 'react';

interface FlutterboyeNotification {
  id: string;
  message: string;
  type: 'job_posted' | 'job_accepted' | 'job_completed' | 'payment_received';
  timestamp: string;
  read: boolean;
}

interface FlutterboyeReward {
  id: string;
  amount: number;
  reason: string;
  timestamp: string;
}

interface FlutterboyeStats {
  totalEarnings: number;
  completedJobs: number;
  customerRating: number;
  rewardsEarned: number;
}

export function useFlutterboyeNotifications() {
  const [notifications, setNotifications] = useState<FlutterboyeNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/flutterbye/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/flutterbye/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return {
    notifications,
    loading,
    markAsRead,
    refetch: fetchNotifications
  };
}

export function useFlutterboyeRewards() {
  const [rewards, setRewards] = useState<FlutterboyeReward[]>([]);
  const [stats, setStats] = useState<FlutterboyeStats>({
    totalEarnings: 0,
    completedJobs: 0,
    customerRating: 0,
    rewardsEarned: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/flutterbye/rewards', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRewards(data.rewards || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Failed to fetch rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  return {
    rewards,
    stats,
    loading,
    refetch: fetchRewards
  };
}

export function useFlutterboyeStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/flutterbye/status');
        const data = await response.json();
        setIsConnected(data.connected || false);
      } catch (error) {
        console.error('Failed to check Flutterbye status:', error);
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  return { isConnected, loading };
}