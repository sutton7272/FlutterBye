import React from 'react';
import { useFlutterboyeNotifications, useFlutterboyeRewards, useFlutterboyeStatus } from '../hooks/useFlutterbye';
import { Bell, Gift, TrendingUp, Star } from 'lucide-react';

interface NotificationCardProps {
  notification: {
    id: string;
    message: string;
    type: string;
    timestamp: string;
    read: boolean;
  };
  onMarkRead: (id: string) => void;
}

function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        notification.read 
          ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
      }`}
      onClick={() => !notification.read && onMarkRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(notification.timestamp).toLocaleDateString()}
          </p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        )}
      </div>
    </div>
  );
}

function RewardsCard({ rewards, stats }: { rewards: any[], stats: any }) {
  return (
    <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-6 h-6" />
        <h3 className="text-lg font-semibold">Flutterbye Rewards</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-green-100 text-sm">Total Earnings</p>
          <p className="text-2xl font-bold">${stats.totalEarnings}</p>
        </div>
        <div>
          <p className="text-green-100 text-sm">Rewards Earned</p>
          <p className="text-2xl font-bold">${stats.rewardsEarned}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          <span>{stats.completedJobs} jobs</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          <span>{stats.customerRating}/5.0</span>
        </div>
      </div>
    </div>
  );
}

export function FlutterboyeStatus() {
  const { isConnected, loading } = useFlutterboyeStatus();
  
  if (loading) return null;
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
      isConnected 
        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    }`}>
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
      <span>{isConnected ? 'Flutterbye Connected' : 'Flutterbye Setup Needed'}</span>
    </div>
  );
}

export function FlutterboyeNotifications() {
  const { notifications, loading, markAsRead } = useFlutterboyeNotifications();
  
  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Bell className="w-5 h-5" />
        Flutterbye Notifications
      </h3>
      
      {notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No notifications yet
        </p>
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={markAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FlutterboyeRewards() {
  const { rewards, stats, loading } = useFlutterboyeRewards();
  
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <RewardsCard rewards={rewards} stats={stats} />
      
      {rewards.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Recent Rewards
          </h4>
          <div className="space-y-2">
            {rewards.map(reward => (
              <div key={reward.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {reward.reason}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(reward.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  +${reward.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}