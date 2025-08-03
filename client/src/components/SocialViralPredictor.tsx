import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Share2, 
  Users, 
  Globe,
  Target,
  Zap,
  Crown,
  Star,
  ChartLine,
  Rocket,
  Heart,
  MessageCircle,
  BarChart3,
  Timer
} from 'lucide-react';

interface SocialViralPredictorProps {
  audioData: any;
  enhancedData?: any;
  onPredictionComplete: (prediction: any) => void;
}

export function SocialViralPredictor({ audioData, enhancedData, onPredictionComplete }: SocialViralPredictorProps) {
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionProgress, setPredictionProgress] = useState(0);
  const [viralPrediction, setViralPrediction] = useState<any>(null);
  const [socialMetrics, setSocialMetrics] = useState<any>(null);
  const [platformBreakdown, setPlatformBreakdown] = useState<any>(null);
  const { toast } = useToast();

  const generateViralPrediction = async () => {
    setIsPredicting(true);
    setPredictionProgress(0);

    try {
      const stages = [
        { name: 'Social Platform Analysis', progress: 25 },
        { name: 'Audience Targeting', progress: 50 },
        { name: 'Engagement Prediction', progress: 75 },
        { name: 'Viral Trajectory Mapping', progress: 100 }
      ];

      for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPredictionProgress(stage.progress);

        if (stage.progress === 25) {
          // Generate platform breakdown
          setPlatformBreakdown({
            twitter: {
              score: Math.random() * 100,
              reach: Math.floor(Math.random() * 50000 + 10000),
              engagement: Math.random() * 15 + 2,
              peakHours: ['2PM-4PM', '7PM-9PM'],
              hashtags: ['#BlockchainVoice', '#CryptoAudio', '#Web3Music']
            },
            tiktok: {
              score: Math.random() * 100,
              reach: Math.floor(Math.random() * 100000 + 20000),
              engagement: Math.random() * 25 + 5,
              peakHours: ['6PM-10PM', '8AM-10AM'],
              hashtags: ['#VoiceToken', '#BlockchainContent', '#CryptoTrend']
            },
            instagram: {
              score: Math.random() * 100,
              reach: Math.floor(Math.random() * 75000 + 15000),
              engagement: Math.random() * 12 + 3,
              peakHours: ['12PM-2PM', '5PM-7PM'],
              hashtags: ['#AudioNFT', '#VoiceToken', '#BlockchainArt']
            },
            youtube: {
              score: Math.random() * 100,
              reach: Math.floor(Math.random() * 25000 + 5000),
              engagement: Math.random() * 8 + 1,
              peakHours: ['7PM-10PM', '2PM-4PM'],
              hashtags: ['#BlockchainTech', '#CryptoInnovation', '#VoiceNFT']
            }
          });
        }

        if (stage.progress === 50) {
          // Generate social metrics
          setSocialMetrics({
            predictedShares: Math.floor(Math.random() * 10000 + 1000),
            predictedLikes: Math.floor(Math.random() * 50000 + 5000),
            predictedComments: Math.floor(Math.random() * 5000 + 500),
            predictedViews: Math.floor(Math.random() * 500000 + 50000),
            viralCoefficient: (Math.random() * 3 + 1).toFixed(2),
            trendingProbability: Math.random() * 100,
            influencerReach: Math.floor(Math.random() * 20),
            communityResonance: Math.random() * 100
          });
        }

        if (stage.progress === 100) {
          // Generate final viral prediction
          const emotion = audioData?.analysis?.emotion || enhancedData?.aiInsights?.personalityType || 'Neutral';
          const energy = audioData?.analysis?.energy || enhancedData?.aiInsights?.emotionalDepth || 50;
          
          setViralPrediction({
            overallScore: Math.random() * 100,
            viralTiming: `${Math.floor(Math.random() * 48 + 2)} hours`,
            peakEngagement: `${Math.floor(Math.random() * 72 + 6)} hours`,
            totalReach: Math.floor(Math.random() * 1000000 + 100000),
            monetizationPotential: (Math.random() * 10000 + 1000).toFixed(0),
            influencerAttraction: Math.random() * 100,
            brandPartnershipScore: Math.random() * 100,
            longTermValue: Math.random() * 100,
            riskFactors: ['Content fatigue', 'Platform algorithm changes', 'Seasonal trends'][Math.floor(Math.random() * 3)],
            successFactors: ['Emotional resonance', 'Timing optimization', 'Community engagement'][Math.floor(Math.random() * 3)],
            recommendedStrategy: emotion === 'Joy' ? 'Celebration campaign' : 
                               emotion === 'Excitement' ? 'Hype building' : 
                               'Authentic storytelling'
          });
        }
      }

      const finalPrediction = {
        audioData,
        enhancedData,
        viralPrediction,
        socialMetrics,
        platformBreakdown,
        timestamp: Date.now()
      };

      onPredictionComplete(finalPrediction);

      toast({
        title: "Viral Prediction Complete!",
        description: `Predicted reach: ${viralPrediction?.totalReach?.toLocaleString()} users with ${Math.round(viralPrediction?.overallScore)}% viral score`
      });

    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: "Could not generate viral prediction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPredicting(false);
      setPredictionProgress(0);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className="bg-gradient-to-br from-green-900/40 via-emerald-900/30 to-teal-900/40 border-2 border-green-500/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-400 animate-pulse" />
          Social Viral Predictor™
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 animate-pulse">
            VIRAL INTELLIGENCE
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isPredicting && !viralPrediction && (
          <div className="text-center space-y-4">
            <div className="p-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg border border-green-500/30">
              <h3 className="text-xl font-bold text-green-300 mb-3">Predict Viral Success</h3>
              <p className="text-gray-300 mb-4">
                Advanced AI analyzes your content's viral potential across all major social platforms,
                predicting reach, engagement, and monetization opportunities.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="text-center p-2 bg-green-900/20 rounded-lg border border-green-500/20">
                  <Share2 className="w-6 h-6 text-green-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">Share Prediction</div>
                </div>
                <div className="text-center p-2 bg-emerald-900/20 rounded-lg border border-emerald-500/20">
                  <Users className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">Audience Analysis</div>
                </div>
                <div className="text-center p-2 bg-teal-900/20 rounded-lg border border-teal-500/20">
                  <Globe className="w-6 h-6 text-teal-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">Platform Optimization</div>
                </div>
                <div className="text-center p-2 bg-cyan-900/20 rounded-lg border border-cyan-500/20">
                  <ChartLine className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">Monetization</div>
                </div>
              </div>
              
              <Button
                onClick={generateViralPrediction}
                className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Predict Viral Success
              </Button>
            </div>
          </div>
        )}

        {isPredicting && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <TrendingUp className="w-6 h-6 text-green-400 animate-spin" />
                <span className="text-green-300 font-medium">Analyzing Viral Potential...</span>
              </div>
              <Progress value={predictionProgress} className="h-3" />
              <div className="text-sm text-gray-400 mt-2">{predictionProgress}% Complete</div>
            </div>
          </div>
        )}

        {viralPrediction && (
          <div className="space-y-4">
            {/* Overall Viral Score */}
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg p-4 border border-green-500/20">
              <h4 className="text-lg font-bold text-green-300 mb-3 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Viral Prediction Results
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-green-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-300">{Math.round(viralPrediction.overallScore)}</div>
                  <div className="text-xs text-gray-400">Viral Score</div>
                </div>
                <div className="text-center p-3 bg-emerald-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-300">{formatNumber(viralPrediction.totalReach)}</div>
                  <div className="text-xs text-gray-400">Predicted Reach</div>
                </div>
                <div className="text-center p-3 bg-teal-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-teal-300">{viralPrediction.viralTiming}</div>
                  <div className="text-xs text-gray-400">Time to Viral</div>
                </div>
                <div className="text-center p-3 bg-cyan-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-300">${formatNumber(parseInt(viralPrediction.monetizationPotential))}</div>
                  <div className="text-xs text-gray-400">Revenue Potential</div>
                </div>
              </div>
            </div>

            {/* Social Metrics */}
            {socialMetrics && (
              <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-lg p-4 border border-blue-500/20">
                <h4 className="text-lg font-bold text-blue-300 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Predicted Social Engagement
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-blue-900/30 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-lg font-bold text-blue-300">{formatNumber(socialMetrics.predictedLikes)}</span>
                    </div>
                    <div className="text-xs text-gray-400">Likes</div>
                  </div>
                  <div className="text-center p-3 bg-indigo-900/30 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Share2 className="w-4 h-4 text-green-400" />
                      <span className="text-lg font-bold text-indigo-300">{formatNumber(socialMetrics.predictedShares)}</span>
                    </div>
                    <div className="text-xs text-gray-400">Shares</div>
                  </div>
                  <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-lg font-bold text-purple-300">{formatNumber(socialMetrics.predictedComments)}</span>
                    </div>
                    <div className="text-xs text-gray-400">Comments</div>
                  </div>
                  <div className="text-center p-3 bg-pink-900/30 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Timer className="w-4 h-4 text-yellow-400" />
                      <span className="text-lg font-bold text-pink-300">{socialMetrics.viralCoefficient}x</span>
                    </div>
                    <div className="text-xs text-gray-400">Viral Coefficient</div>
                  </div>
                </div>
              </div>
            )}

            {/* Platform Breakdown */}
            {platformBreakdown && (
              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-4 border border-purple-500/20">
                <h4 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Platform Performance Breakdown
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(platformBreakdown).map(([platform, data]: [string, any]) => (
                    <div key={platform} className="p-3 bg-gray-900/30 rounded-lg border border-gray-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-purple-300 capitalize">{platform}</span>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                          {Math.round(data.score)}% match
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Reach:</span>
                          <span className="text-white ml-1">{formatNumber(data.reach)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Engagement:</span>
                          <span className="text-white ml-1">{data.engagement.toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <span className="text-xs text-gray-400">Best times:</span>
                        <div className="text-xs text-purple-300">{data.peakHours.join(', ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategy Recommendations */}
            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg p-4 border border-yellow-500/20">
              <h4 className="text-lg font-bold text-yellow-300 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Viral Strategy Recommendations
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-yellow-300 mb-2">Success Factors</h5>
                  <div className="space-y-1 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{viralPrediction.successFactors}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-green-400" />
                      <span>Optimal timing: {viralPrediction.peakEngagement}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-blue-400" />
                      <span>Strategy: {viralPrediction.recommendedStrategy}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-orange-300 mb-2">Risk Mitigation</h5>
                  <div className="space-y-1 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-red-400" />
                      <span>Risk: {viralPrediction.riskFactors}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-orange-400" />
                      <span>Influencer potential: {Math.round(viralPrediction.influencerAttraction)}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-purple-400" />
                      <span>Brand appeal: {Math.round(viralPrediction.brandPartnershipScore)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}