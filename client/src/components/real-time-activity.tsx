import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Coins, Gift, Zap, TrendingUp } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'sms' | 'mint' | 'redeem' | 'transfer';
  message: string;
  walletAddress: string;
  timestamp: Date;
  value?: string;
  emotionType?: string;
}

export function RealTimeActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'sms',
      message: 'thinking of you always',
      walletAddress: '7xKs...9mPq',
      timestamp: new Date(Date.now() - 2000),
      emotionType: 'heart'
    },
    {
      id: '2',
      type: 'mint',
      message: 'StakeNowForYield',
      walletAddress: '4Bt8...3xRp',
      timestamp: new Date(Date.now() - 5000),
      value: '0.05 SOL'
    },
    {
      id: '3',
      type: 'redeem',
      message: 'congratulations champ',
      walletAddress: '9Kj2...7vNm',
      timestamp: new Date(Date.now() - 8000),
      value: '0.02 SOL',
      emotionType: 'celebration'
    }
  ]);

  const [stats, setStats] = useState({
    tokensMinted: 10847,
    smsSent: 2341,
    valueDistributed: 47.2,
    activeUsers: 892
  });

  useEffect(() => {
    // Simulate real-time activity updates
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? 'sms' : 'mint',
        message: generateRandomMessage(),
        walletAddress: generateRandomWallet(),
        timestamp: new Date(),
        value: Math.random() > 0.7 ? `${(Math.random() * 0.1).toFixed(3)} SOL` : undefined,
        emotionType: Math.random() > 0.6 ? getRandomEmotion() : undefined
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 19)]); // Keep latest 20
      
      // Update stats occasionally
      if (Math.random() > 0.8) {
        setStats(prev => ({
          tokensMinted: prev.tokensMinted + 1,
          smsSent: prev.smsSent + (Math.random() > 0.5 ? 1 : 0),
          valueDistributed: prev.valueDistributed + (Math.random() * 0.1),
          activeUsers: prev.activeUsers + (Math.random() > 0.9 ? 1 : 0)
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const generateRandomMessage = () => {
    const messages = [
      'good morning sunshine',
      'thinking of you',
      'you got this champ',
      'sorry about yesterday',
      'happy birthday friend',
      'StakeForRewards',
      'HodlTillMoon',
      'BullMarketVibes'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const generateRandomWallet = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
    const start = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const end = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${start}...${end}`;
  };

  const getRandomEmotion = () => {
    const emotions = ['heart', 'hug', 'celebration', 'encouragement', 'apology'];
    return emotions[Math.floor(Math.random() * emotions.length)];
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'mint': return <Coins className="w-4 h-4" />;
      case 'redeem': return <Gift className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sms': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'mint': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'redeem': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.tokensMinted.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Tokens Minted</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.smsSent.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">SMS Sent</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              ${stats.valueDistributed.toFixed(1)}K
            </div>
            <div className="text-xs text-muted-foreground">Value Distributed</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.activeUsers.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Active Users</div>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Live Activity Feed
            <Badge variant="secondary" className="animate-pulse">
              LIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        "{activity.message}"
                      </div>
                      <div className="text-xs text-muted-foreground">
                        by {activity.walletAddress}
                        {activity.emotionType && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {activity.emotionType}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.value && (
                      <div className="text-sm font-medium text-green-600">
                        {activity.value}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {activity.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}