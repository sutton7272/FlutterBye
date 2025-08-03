import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Rocket, 
  Zap, 
  Target, 
  Sparkles,
  Users,
  Globe,
  Heart,
  Share,
  Eye,
  Clock,
  Star,
  Crown,
  Flame,
  Lightning
} from 'lucide-react';

/**
 * REVOLUTIONARY AI VIRAL ENHANCEMENT SYSTEM
 * Most advanced viral prediction and acceleration ever created
 */

// AI Viral Score Calculator
export function AIViralScoreCalculator({ content }: { content: string }) {
  const [viralMetrics, setViralMetrics] = useState<{
    overallScore: number;
    emotionalImpact: number;
    trendinessScore: number;
    shareability: number;
    timingScore: number;
    audienceReach: number;
    factors: Array<{factor: string, score: number, impact: string}>;
    predictions: Array<{metric: string, value: number, timeframe: string}>;
  }>({
    overallScore: 0,
    emotionalImpact: 0,
    trendinessScore: 0,
    shareability: 0,
    timingScore: 0,
    audienceReach: 0,
    factors: [],
    predictions: []
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (content.length > 5) {
      analyzeViralPotential();
    }
  }, [content]);

  const analyzeViralPotential = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/viral-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const result = await response.json();
      setViralMetrics(result);
    } catch (error) {
      console.error('Viral analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 40) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  if (!content) return null;

  return (
    <Card className="bg-gradient-to-br from-electric-blue/10 to-purple-500/10 border-electric-blue/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-electric-blue">
          <Rocket className="w-5 h-5 animate-bounce" />
          AI Viral Intelligence
          {isAnalyzing && (
            <Badge className="bg-electric-blue/20 text-electric-blue animate-pulse">
              Analyzing...
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Overall Viral Score */}
        <div className={`p-6 rounded-lg border text-center ${getScoreBackground(viralMetrics.overallScore)}`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className={`w-8 h-8 ${getScoreColor(viralMetrics.overallScore)}`} />
            <span className={`text-4xl font-bold ${getScoreColor(viralMetrics.overallScore)}`}>
              {viralMetrics.overallScore}
            </span>
          </div>
          <p className="text-white font-semibold">Viral Potential Score</p>
          <Progress 
            value={viralMetrics.overallScore} 
            className="mt-2 h-2"
          />
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="bg-black/40 border-pink-500/30">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
              <p className={`text-lg font-bold ${getScoreColor(viralMetrics.emotionalImpact)}`}>
                {viralMetrics.emotionalImpact}
              </p>
              <p className="text-xs text-white/70">Emotional Impact</p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className={`text-lg font-bold ${getScoreColor(viralMetrics.trendinessScore)}`}>
                {viralMetrics.trendinessScore}
              </p>
              <p className="text-xs text-white/70">Trendiness</p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <Share className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className={`text-lg font-bold ${getScoreColor(viralMetrics.shareability)}`}>
                {viralMetrics.shareability}
              </p>
              <p className="text-xs text-white/70">Shareability</p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-green-500/30">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className={`text-lg font-bold ${getScoreColor(viralMetrics.timingScore)}`}>
                {viralMetrics.timingScore}
              </p>
              <p className="text-xs text-white/70">Timing</p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className={`text-lg font-bold ${getScoreColor(viralMetrics.audienceReach)}`}>
                {viralMetrics.audienceReach}
              </p>
              <p className="text-xs text-white/70">Audience Reach</p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-red-500/30">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className={`text-lg font-bold ${getScoreColor(viralMetrics.overallScore)}`}>
                {Math.floor(viralMetrics.overallScore / 10)}x
              </p>
              <p className="text-xs text-white/70">Viral Multiplier</p>
            </CardContent>
          </Card>
        </div>

        {/* Viral Factors */}
        {viralMetrics.factors.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Lightning className="w-4 h-4 text-electric-blue" />
              Viral Factors Analysis
            </h3>
            <div className="space-y-2">
              {viralMetrics.factors.slice(0, 5).map((factor, index) => (
                <div key={index} className="p-3 bg-electric-blue/5 rounded border border-electric-blue/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-sm">{factor.factor}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${getScoreColor(factor.score)}`}>
                        {factor.score}/100
                      </span>
                      <Badge className={`text-xs ${
                        factor.impact === 'high' ? 'bg-green-500/20 text-green-400' :
                        factor.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {factor.impact}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={factor.score} className="h-1" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Viral Predictions */}
        {viralMetrics.predictions.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" />
              AI Viral Predictions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {viralMetrics.predictions.map((prediction, index) => (
                <div key={index} className="p-3 bg-purple-500/10 rounded border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">{prediction.metric}</span>
                    <span className="text-purple-400 font-bold">{prediction.value.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-white/60 mt-1">in {prediction.timeframe}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={analyzeViralPotential}
          disabled={isAnalyzing}
          className="w-full bg-gradient-to-r from-electric-blue to-purple-500"
        >
          {isAnalyzing ? (
            <>
              <Brain className="w-4 h-4 mr-2 animate-spin" />
              AI Analyzing Viral Potential...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4 mr-2" />
              Refresh Viral Analysis
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// AI Viral Acceleration Engine
export function AIViralAccelerationEngine({ content, onAccelerate }: { content: string; onAccelerate: (acceleratedContent: string) => void }) {
  const [accelerationStrategies, setAccelerationStrategies] = useState<Array<{
    strategy: string;
    description: string;
    potentialGain: number;
    difficulty: 'easy' | 'medium' | 'hard';
    preview: string;
  }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (content.length > 10) {
      generateAccelerationStrategies();
    }
  }, [content]);

  const generateAccelerationStrategies = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/viral-acceleration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const result = await response.json();
      setAccelerationStrategies(result.strategies || []);
    } catch (error) {
      console.error('Viral acceleration failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (!content) return null;

  return (
    <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-400">
          <Zap className="w-5 h-5 animate-pulse" />
          AI Viral Acceleration Engine
          <Badge className="bg-orange-500/20 text-orange-400">Boost Mode</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {isGenerating ? (
          <div className="flex items-center gap-2 py-8 justify-center">
            <Sparkles className="w-5 h-5 animate-spin text-orange-400" />
            <span className="text-white">Generating viral acceleration strategies...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {accelerationStrategies.slice(0, 4).map((strategy, index) => (
              <Card key={index} className="bg-black/40 border-orange-500/20 hover:border-orange-500/40 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm">{strategy.strategy}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(strategy.difficulty)}>
                        {strategy.difficulty}
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-400">
                        +{strategy.potentialGain}% viral
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-xs text-white/70 mb-3">{strategy.description}</p>
                  
                  <div className="p-2 bg-orange-500/10 rounded border border-orange-500/20 mb-3">
                    <p className="text-xs text-orange-200">Preview: "{strategy.preview}"</p>
                  </div>
                  
                  <Button
                    onClick={() => onAccelerate(strategy.preview)}
                    size="sm"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    <Rocket className="w-3 h-3 mr-1" />
                    Apply This Strategy
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Button
          onClick={generateAccelerationStrategies}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500"
        >
          {isGenerating ? (
            <>
              <Brain className="w-4 h-4 mr-2 animate-spin" />
              Generating Strategies...
            </>
          ) : (
            <>
              <Lightning className="w-4 h-4 mr-2" />
              Generate New Strategies
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// AI Trend Predictor
export function AITrendPredictor() {
  const [trendPredictions, setTrendPredictions] = useState<Array<{
    trend: string;
    confidence: number;
    timeframe: string;
    category: string;
    impact: 'low' | 'medium' | 'high';
    keywords: string[];
  }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const predictTrends = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/trend-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisDepth: 'deep' })
      });
      const result = await response.json();
      setTrendPredictions(result.predictions || []);
    } catch (error) {
      console.error('Trend prediction failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    predictTrends();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Globe className="w-5 h-5" />
          AI Trend Predictor
          <Badge className="bg-purple-500/20 text-purple-400">Future Vision</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {isAnalyzing ? (
          <div className="flex items-center gap-2 py-8 justify-center">
            <Brain className="w-5 h-5 animate-spin text-purple-400" />
            <span className="text-white">AI analyzing future trends...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {trendPredictions.slice(0, 5).map((prediction, index) => (
              <Card key={index} className={`border ${getImpactColor(prediction.impact)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm">{prediction.trend}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                        {prediction.confidence}% confidence
                      </Badge>
                      <Badge className={`text-xs ${getImpactColor(prediction.impact)}`}>
                        {prediction.impact} impact
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-3 h-3 text-white/60" />
                    <span className="text-xs text-white/70">{prediction.timeframe}</span>
                    <Star className="w-3 h-3 text-white/60" />
                    <span className="text-xs text-white/70">{prediction.category}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {prediction.keywords.slice(0, 4).map((keyword, kIndex) => (
                      <Badge key={kIndex} className="bg-blue-500/20 text-blue-400 text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Button
          onClick={predictTrends}
          disabled={isAnalyzing}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
        >
          {isAnalyzing ? (
            <>
              <Brain className="w-4 h-4 mr-2 animate-spin" />
              Predicting Future Trends...
            </>
          ) : (
            <>
              <Crown className="w-4 h-4 mr-2" />
              Refresh Trend Predictions
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}