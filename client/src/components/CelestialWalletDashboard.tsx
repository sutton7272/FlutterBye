import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Stars, 
  Sparkles, 
  Moon, 
  Sun, 
  Zap, 
  Award, 
  Settings, 
  Palette,
  TrendingUp,
  Shield,
  Target,
  Lightbulb
} from 'lucide-react';

interface PersonalizationProfile {
  userId: string;
  celestialTheme: string;
  constellation: string;
  cosmicName: string;
  personality: {
    traits: string[];
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    tradingStyle: 'hodler' | 'trader' | 'defi_farmer' | 'nft_collector';
    preferences: string[];
  };
  achievements: Array<{
    title: string;
    description: string;
    unlockedAt: string;
    rarity: 'common' | 'rare' | 'legendary' | 'mythic';
  }>;
  stats: {
    totalValue: number;
    portfolioGrowth: number;
    transactionCount: number;
    daysSinceFirstTransaction: number;
    favoriteToken: string;
    riskScore: number;
  };
  customization: {
    background: string;
    particleEffects: boolean;
    soundEffects: boolean;
    animations: boolean;
  };
  insights: string[];
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
}

interface CelestialWalletDashboardProps {
  userId: string;
  walletAddress?: string;
}

const THEME_COLORS = {
  nebula: ['#4C1D95', '#7C3AED', '#A855F7', '#C084FC'],
  starforge: ['#DC2626', '#F59E0B', '#FBBF24', '#FCD34D'],
  voidwalker: ['#111827', '#374151', '#6B7280', '#D1D5DB'],
  aurora: ['#065F46', '#047857', '#10B981', '#6EE7B7'],
  supernova: ['#B91C1C', '#DC2626', '#F97316', '#FBBF24'],
  quantum: ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD']
};

const RARITY_COLORS = {
  common: 'text-gray-400',
  rare: 'text-blue-400',
  legendary: 'text-purple-400',
  mythic: 'text-yellow-400'
};

const CelestialWalletDashboard: React.FC<CelestialWalletDashboardProps> = ({ 
  userId, 
  walletAddress 
}) => {
  const queryClient = useQueryClient();
  const [selectedTheme, setSelectedTheme] = useState<string>('');

  // Fetch personalization profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['celestial-profile', userId],
    queryFn: () => apiRequest('GET', `/api/celestial/profile/${userId}`)
  });

  // Fetch available themes
  const { data: themes } = useQuery({
    queryKey: ['celestial-themes'],
    queryFn: () => apiRequest('GET', '/api/celestial/themes')
  });

  // Generate profile mutation
  const generateProfileMutation = useMutation({
    mutationFn: (walletData: any) => 
      apiRequest('POST', '/api/celestial/generate-profile', { userId, walletData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['celestial-profile', userId] });
    }
  });

  // Update theme mutation
  const updateThemeMutation = useMutation({
    mutationFn: (theme: string) =>
      apiRequest('PUT', `/api/celestial/profile/${userId}/theme`, { celestialTheme: theme }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['celestial-profile', userId] });
    }
  });

  // Generate profile for new users
  const handleGenerateProfile = async () => {
    const mockWalletData = {
      totalValue: Math.floor(Math.random() * 10000) + 1000,
      portfolioGrowth: Math.floor(Math.random() * 100) - 20,
      transactionCount: Math.floor(Math.random() * 500) + 10,
      daysSinceFirstTransaction: Math.floor(Math.random() * 365) + 1,
      riskScore: Math.floor(Math.random() * 100),
      tradingFrequency: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
      favoriteTokens: ['SOL', 'ETH', 'BTC', 'USDC'],
      favoriteToken: 'SOL'
    };
    
    generateProfileMutation.mutate(mockWalletData);
  };

  const getThemeGradient = (theme: string) => {
    const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.quantum;
    return `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
  };

  const getRiskIcon = (riskTolerance: string) => {
    switch (riskTolerance) {
      case 'conservative': return <Shield className="w-4 h-4" />;
      case 'aggressive': return <Zap className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getTradingStyleIcon = (style: string) => {
    switch (style) {
      case 'hodler': return <Moon className="w-4 h-4" />;
      case 'trader': return <TrendingUp className="w-4 h-4" />;
      case 'defi_farmer': return <Sparkles className="w-4 h-4" />;
      case 'nft_collector': return <Award className="w-4 h-4" />;
      default: return <Stars className="w-4 h-4" />;
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin">
            <Stars className="w-12 h-12 text-purple-400" />
          </div>
          <p className="text-gray-300">Mapping your cosmic journey...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-purple-500/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Stars className="w-16 h-16 text-purple-400" />
            </div>
            <CardTitle className="text-2xl text-white">Welcome to the Cosmos</CardTitle>
            <p className="text-gray-400">
              Let's create your personalized celestial identity
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGenerateProfile}
              disabled={generateProfileMutation.isPending}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {generateProfileMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span>Generating Cosmic Identity...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Stars className="w-4 h-4" />
                  <span>Generate Cosmic Identity</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-6"
      style={{
        background: getThemeGradient(profile.celestialTheme),
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cosmic Header */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center">
                    <Stars className="w-8 h-8 text-white" />
                  </div>
                  {profile.customization.particleEffects && (
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {profile.cosmicName}
                  </h1>
                  <p className="text-gray-300">
                    {profile.constellation} Explorer • {profile.celestialTheme} Traveler
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-white border-white/30">
                  Level {Math.floor(profile.stats.daysSinceFirstTransaction / 30) + 1}
                </Badge>
                <Button variant="outline" size="sm" className="text-white border-white/30">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-black/20 backdrop-blur-sm border-white/10">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="achievements" className="text-white">Achievements</TabsTrigger>
            <TabsTrigger value="insights" className="text-white">Cosmic Insights</TabsTrigger>
            <TabsTrigger value="customization" className="text-white">Customization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    ${profile.stats.totalValue.toLocaleString()}
                  </div>
                  <p className="text-gray-300 text-sm">Total Value</p>
                </CardContent>
              </Card>
              
              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {profile.stats.portfolioGrowth > 0 ? '+' : ''}
                    {profile.stats.portfolioGrowth}%
                  </div>
                  <p className="text-gray-300 text-sm">Growth</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {profile.stats.transactionCount}
                  </div>
                  <p className="text-gray-300 text-sm">Transactions</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {profile.stats.daysSinceFirstTransaction}
                  </div>
                  <p className="text-gray-300 text-sm">Days Active</p>
                </CardContent>
              </Card>
            </div>

            {/* Personality Profile */}
            <Card className="bg-black/20 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Sun className="w-5 h-5" />
                  <span>Cosmic Personality</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Risk Tolerance</span>
                      <div className="flex items-center space-x-2">
                        {getRiskIcon(profile.personality.riskTolerance)}
                        <Badge variant="outline" className="text-white border-white/30">
                          {profile.personality.riskTolerance}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Trading Style</span>
                      <div className="flex items-center space-x-2">
                        {getTradingStyleIcon(profile.personality.tradingStyle)}
                        <Badge variant="outline" className="text-white border-white/30">
                          {profile.personality.tradingStyle}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-300 mb-2">Personality Traits</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.personality.traits.map((trait, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/10 text-white">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-gray-300 mb-2">Risk Score</p>
                  <Progress value={profile.stats.riskScore} className="w-full" />
                  <p className="text-sm text-gray-400 mt-1">
                    {profile.stats.riskScore}/100
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.achievements.map((achievement, index) => (
                <Card key={index} className="bg-black/20 backdrop-blur-sm border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`${RARITY_COLORS[achievement.rarity]} mt-1`}>
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{achievement.title}</h3>
                        <p className="text-sm text-gray-300 mb-2">{achievement.description}</p>
                        <Badge 
                          variant="outline" 
                          className={`${RARITY_COLORS[achievement.rarity]} border-current`}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cosmic Insights */}
              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5" />
                    <span>Cosmic Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.insights.map((insight, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg">
                      <p className="text-gray-300">{insight}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Personalized Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg">
                      <p className="text-gray-300">{recommendation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customization" className="space-y-6">
            <Card className="bg-black/20 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Celestial Themes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {themes && Object.entries(themes).map(([key, theme]: [string, any]) => (
                    <div
                      key={key}
                      className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                        profile.celestialTheme === key 
                          ? 'border-white/50' 
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      style={{ background: getThemeGradient(key) }}
                      onClick={() => updateThemeMutation.mutate(key)}
                    >
                      <h3 className="font-semibold text-white mb-1">{theme.name}</h3>
                      <p className="text-sm text-gray-200">{theme.description}</p>
                      <p className="text-xs text-gray-300 mt-2">{theme.personality}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CelestialWalletDashboard;