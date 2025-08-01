import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Coins, 
  MessageSquare, 
  Zap,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
  Eye,
  Share2
} from "lucide-react";

interface StatData {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
  description: string;
  interactive?: boolean;
}

export function InteractiveStatsDashboard() {
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const stats: StatData[] = [
    {
      id: "tokens-minted",
      title: "TOKENS MINTED",
      value: "10,847",
      change: "+127",
      trend: 'up',
      icon: <Coins className="h-6 w-6" />,
      color: "from-purple-500 to-pink-500",
      description: "SPL tokens created in the last 24h",
      interactive: true
    },
    {
      id: "sms-sent", 
      title: "SMS SENT",
      value: "2,341",
      change: "+43",
      trend: 'up',
      icon: <MessageSquare className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-500",
      description: "Text messages converted to tokens",
      interactive: true
    },
    {
      id: "value-distributed",
      title: "VALUE DISTRIBUTED", 
      value: "$47.2K",
      change: "+$2.1K",
      trend: 'up',
      icon: <DollarSign className="h-6 w-6" />,
      color: "from-green-500 to-emerald-500",
      description: "Total SOL value attached to tokens",
      interactive: true
    },
    {
      id: "active-users",
      title: "ACTIVE USERS",
      value: "892",
      change: "+12",
      trend: 'up', 
      icon: <Users className="h-6 w-6" />,
      color: "from-orange-500 to-red-500",
      description: "Unique wallets in the last 24h",
      interactive: true
    },
    {
      id: "redemptions",
      title: "REDEMPTIONS",
      value: "156",
      change: "+8",
      trend: 'up',
      icon: <Zap className="h-6 w-6" />,
      color: "from-yellow-500 to-orange-500",
      description: "Tokens burned for value redemption"
    },
    {
      id: "avg-value",
      title: "AVG TOKEN VALUE",
      value: "0.043 SOL",
      change: "+0.002",
      trend: 'up',
      icon: <TrendingUp className="h-6 w-6" />,
      color: "from-indigo-500 to-purple-500",
      description: "Average value per token created"
    }
  ];

  const handleStatClick = (statId: string) => {
    if (selectedStat === statId) {
      setSelectedStat(null);
    } else {
      setSelectedStat(statId);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-3 w-3 text-green-500" />;
      case 'down': return <ArrowDown className="h-3 w-3 text-red-500" />;
      default: return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Live Platform Stats
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live Updates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card 
            key={stat.id}
            className={`
              cursor-pointer transition-all duration-500 hover:scale-105
              ${selectedStat === stat.id ? 'ring-2 ring-purple-500 shadow-xl' : ''}
              ${isAnimating ? 'animate-pulse' : ''}
              bg-gradient-to-br ${stat.color}/10 border-transparent
              hover:shadow-xl hover:shadow-purple-500/20
            `}
            onClick={() => stat.interactive && handleStatClick(stat.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(stat.trend)}
                  <span className="text-xs font-medium text-green-600">
                    {stat.change}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </div>
                
                {selectedStat === stat.id && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-3">
                      {stat.description}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {stat.interactive && (
                <div className="mt-4 text-xs text-muted-foreground">
                  Click for details
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Activity Feed */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Real-time Activity</h3>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
          
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {[
              { action: "SMS → Token", user: "2hXj...M2u5", message: "gm frens", time: "2s ago" },
              { action: "Token Mint", user: "5LuH...2F6W", message: "hodl till we make it", time: "8s ago" },
              { action: "Value Redemption", user: "GrQY...xTwa", message: "love you mom", time: "15s ago" },
              { action: "Bulk Mint", user: "58mt...CteS", message: "probably nothing", time: "23s ago" },
              { action: "SMS → Token", user: "DEtj...rLTp", message: "wen lambo", time: "31s ago" }
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <span className="text-sm font-medium">{activity.user}</span>
                    <span className="text-xs text-gray-400 ml-2">{activity.action}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}