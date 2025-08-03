import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Plus, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface AIUsageStats {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  apiCallsUsed: number;
  apiCallsLimit: number;
  subscriptionType: 'none' | 'starter' | 'pro' | 'enterprise' | 'unlimited';
  subscriptionExpiry?: string;
}

interface AICreditDisplayProps {
  userId: string;
  compact?: boolean;
}

export function AICreditDisplay({ userId, compact = false }: AICreditDisplayProps) {
  const [usage, setUsage] = useState<AIUsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, [userId]);

  const fetchUsage = async () => {
    try {
      const response = await apiRequest("GET", `/api/ai/usage/${userId}`);
      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error("Error fetching AI usage:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardContent className="p-4">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!usage) {
    return (
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardContent className="p-4">
          <div className="text-center">
            <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-slate-300 text-sm">No AI usage data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'unlimited': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'enterprise': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'pro': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'starter': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-slate-600';
    }
  };

  const isUnlimited = usage.subscriptionType === 'unlimited';
  const creditsRemaining = usage.remainingCredits;
  const apiCallsRemaining = usage.apiCallsLimit - usage.apiCallsUsed;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-white font-medium">
            {isUnlimited ? '∞' : creditsRemaining}
          </span>
          {!isUnlimited && (
            <span className="text-slate-400 text-sm">credits</span>
          )}
        </div>
        {usage.subscriptionType !== 'none' && (
          <Badge className={getSubscriptionColor(usage.subscriptionType)}>
            {usage.subscriptionType.toUpperCase()}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-400/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Credits</h3>
              <p className="text-slate-400 text-sm">
                {usage.subscriptionType === 'none' ? 'Pay-per-use' : `${usage.subscriptionType} plan`}
              </p>
            </div>
          </div>
          
          {usage.subscriptionType !== 'none' && (
            <Badge className={getSubscriptionColor(usage.subscriptionType)}>
              {usage.subscriptionType.toUpperCase()}
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          {/* Credits */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-300 text-sm">Credits</span>
              <span className="text-white font-medium">
                {isUnlimited ? 'Unlimited' : `${creditsRemaining}/${usage.totalCredits}`}
              </span>
            </div>
            {!isUnlimited && (
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${usage.totalCredits > 0 ? (creditsRemaining / usage.totalCredits) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            )}
          </div>

          {/* API Calls */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-300 text-sm">API Calls</span>
              <span className="text-white font-medium">
                {isUnlimited ? 'Unlimited' : `${apiCallsRemaining}/${usage.apiCallsLimit}`}
              </span>
            </div>
            {!isUnlimited && (
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${usage.apiCallsLimit > 0 ? (apiCallsRemaining / usage.apiCallsLimit) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Link href="/ai-payments" className="flex-1">
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Buy Credits
            </Button>
          </Link>
          
          {usage.subscriptionType === 'none' && (
            <Link href="/ai-payments" className="flex-1">
              <Button 
                size="sm" 
                variant="outline"
                className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Upgrade
              </Button>
            </Link>
          )}
        </div>

        {/* Low credits warning */}
        {!isUnlimited && creditsRemaining <= 10 && creditsRemaining > 0 && (
          <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm">Low on credits</span>
            </div>
          </div>
        )}

        {/* No credits warning */}
        {!isUnlimited && creditsRemaining <= 0 && (
          <div className="mt-3 p-2 bg-red-900/30 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm">Out of credits</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}