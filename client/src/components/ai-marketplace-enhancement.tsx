import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Search, 
  Filter, 
  Star, 
  Target, 
  Zap,
  Eye,
  ShoppingCart,
  DollarSign,
  Users,
  Heart,
  Rocket,
  Crown
} from 'lucide-react';

/**
 * REVOLUTIONARY AI MARKETPLACE ENHANCEMENT SYSTEM
 * Most advanced AI shopping and discovery experience ever created
 */

// AI Smart Product Recommender
export function AIProductRecommender({ userProfile }: { userProfile?: any }) {
  const [recommendations, setRecommendations] = useState<Array<{
    id: string;
    name: string;
    price: number;
    reason: string;
    confidence: number;
    category: string;
  }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    generateRecommendations();
  }, [userProfile]);

  const generateRecommendations = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/marketplace-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile })
      });
      const result = await response.json();
      setRecommendations(result.recommendations || []);
    } catch (error) {
      console.error('AI recommendations failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-electric-blue/10 to-purple-500/10 border-electric-blue/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-electric-blue">
          <Brain className="w-5 h-5 animate-pulse" />
          AI Smart Recommendations
          <Badge className="bg-electric-blue/20 text-electric-blue">Personalized</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {isAnalyzing ? (
          <div className="flex items-center gap-2 py-8 justify-center">
            <Sparkles className="w-5 h-5 animate-spin text-electric-blue" />
            <span className="text-white">AI analyzing your preferences...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map((item) => (
              <Card key={item.id} className="bg-black/40 border-electric-blue/20 hover:border-electric-blue/40 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                    <Badge className="bg-green-500/20 text-green-400 text-xs">
                      {item.confidence}% match
                    </Badge>
                  </div>
                  <p className="text-xs text-white/70 mb-2">{item.reason}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-bold">{item.price} SOL</span>
                    <Button size="sm" className="bg-electric-blue/20 hover:bg-electric-blue/40">
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Buy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Button
          onClick={generateRecommendations}
          disabled={isAnalyzing}
          className="w-full bg-gradient-to-r from-electric-blue to-purple-500"
        >
          {isAnalyzing ? (
            <>
              <Brain className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Preferences...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Refresh AI Recommendations
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// AI Price Predictor
export function AIPricePredictor({ tokenId }: { tokenId?: string }) {
  const [prediction, setPrediction] = useState<{
    currentPrice: number;
    predictedPrice: number;
    confidence: number;
    timeframe: string;
    factors: string[];
  }>({
    currentPrice: 0,
    predictedPrice: 0,
    confidence: 0,
    timeframe: '24h',
    factors: []
  });

  useEffect(() => {
    if (tokenId) {
      predictPrice();
    }
  }, [tokenId]);

  const predictPrice = async () => {
    try {
      const response = await fetch('/api/ai/price-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId })
      });
      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      console.error('Price prediction failed:', error);
    }
  };

  const getPriceDirection = () => {
    if (prediction.predictedPrice > prediction.currentPrice) return 'up';
    if (prediction.predictedPrice < prediction.currentPrice) return 'down';
    return 'stable';
  };

  const getDirectionColor = () => {
    const direction = getPriceDirection();
    if (direction === 'up') return 'text-green-400';
    if (direction === 'down') return 'text-red-400';
    return 'text-yellow-400';
  };

  const getDirectionIcon = () => {
    const direction = getPriceDirection();
    if (direction === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (direction === 'down') return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
    return <Target className="w-4 h-4 text-yellow-400" />;
  };

  if (!tokenId || !prediction.currentPrice) return null;

  return (
    <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-green-400" />
          <span className="text-sm font-semibold text-white">AI Price Prediction</span>
          <Badge className="bg-green-500/20 text-green-400 text-xs">
            {prediction.confidence}% confidence
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-white/70">Current</p>
            <p className="text-lg font-bold text-white">{prediction.currentPrice.toFixed(3)} SOL</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/70">Predicted ({prediction.timeframe})</p>
            <div className="flex items-center justify-center gap-1">
              {getDirectionIcon()}
              <p className={`text-lg font-bold ${getDirectionColor()}`}>
                {prediction.predictedPrice.toFixed(3)} SOL
              </p>
            </div>
          </div>
        </div>

        {prediction.factors.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-white/70 mb-1">Key Factors:</p>
            <div className="flex flex-wrap gap-1">
              {prediction.factors.slice(0, 3).map((factor, index) => (
                <Badge key={index} className="bg-blue-500/20 text-blue-400 text-xs">
                  {factor}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// AI Smart Search Enhancement
export function AISmartSearch({ onSearch }: { onSearch: (query: string, filters: any) => void }) {
  const [query, setQuery] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [smartFilters, setSmartFilters] = useState<any>({});

  useEffect(() => {
    if (query.length > 2) {
      generateSearchSuggestions();
    }
  }, [query]);

  const generateSearchSuggestions = async () => {
    try {
      const response = await fetch('/api/ai/search-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const result = await response.json();
      setAiSuggestions(result.suggestions || []);
      setSmartFilters(result.smartFilters || {});
    } catch (error) {
      console.error('AI search suggestions failed:', error);
    }
  };

  const handleSmartSearch = () => {
    onSearch(query, smartFilters);
  };

  return (
    <Card className="bg-black/40 border-electric-blue/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-electric-blue" />
          <span className="text-sm font-semibold text-white">AI Smart Search</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="AI will enhance your search..."
              className="bg-black/20 border-electric-blue/30 text-white flex-1"
            />
            <Button
              onClick={handleSmartSearch}
              className="bg-gradient-to-r from-electric-blue to-purple-500"
            >
              <Brain className="w-4 h-4 mr-1" />
              Search
            </Button>
          </div>

          {aiSuggestions.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-white/70">AI Suggestions:</p>
              {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(suggestion)}
                  className="w-full text-left p-2 text-xs text-white/80 hover:text-white hover:bg-electric-blue/10 rounded border border-white/10 hover:border-electric-blue/30 transition-all"
                >
                  <Sparkles className="w-3 h-3 inline mr-1 text-electric-blue" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {Object.keys(smartFilters).length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-white/70">Smart filters:</span>
              {Object.entries(smartFilters).map(([key, value]) => (
                <Badge key={key} className="bg-purple-500/20 text-purple-400 text-xs">
                  {key}: {String(value)}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// AI Market Trend Analyzer
export function AIMarketTrendAnalyzer() {
  const [trends, setTrends] = useState<{
    hotCategories: Array<{name: string, growth: number}>;
    emergingTags: string[];
    priceMovements: Array<{direction: string, percentage: number, reason: string}>;
    recommendations: string[];
  }>({
    hotCategories: [],
    emergingTags: [],
    priceMovements: [],
    recommendations: []
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeTrends = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/market-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeframe: '24h' })
      });
      const result = await response.json();
      setTrends(result);
    } catch (error) {
      console.error('Market trend analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    analyzeTrends();
  }, []);

  return (
    <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-400">
          <TrendingUp className="w-5 h-5" />
          AI Market Intelligence
          <Badge className="bg-orange-500/20 text-orange-400">Live Analysis</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Hot Categories */}
        <div>
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-orange-400" />
            Trending Categories
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {trends.hotCategories.slice(0, 4).map((category, index) => (
              <div key={index} className="p-2 bg-orange-500/10 rounded border border-orange-500/20">
                <p className="text-white font-medium text-sm">{category.name}</p>
                <p className="text-green-400 text-xs">+{category.growth}% growth</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emerging Tags */}
        {trends.emergingTags.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Emerging Tags
            </h3>
            <div className="flex flex-wrap gap-1">
              {trends.emergingTags.slice(0, 6).map((tag, index) => (
                <Badge key={index} className="bg-yellow-500/20 text-yellow-400 text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Price Movements */}
        {trends.priceMovements.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              Price Movements
            </h3>
            <div className="space-y-2">
              {trends.priceMovements.slice(0, 3).map((movement, index) => (
                <div key={index} className="p-2 bg-green-500/10 rounded border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">{movement.reason}</span>
                    <span className={`text-sm font-semibold ${
                      movement.direction === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {movement.direction === 'up' ? '+' : '-'}{movement.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={analyzeTrends}
          disabled={isAnalyzing}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500"
        >
          {isAnalyzing ? (
            <>
              <Brain className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Market...
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Refresh Market Intelligence
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// AI Purchase Assistant
export function AIPurchaseAssistant({ item }: { item: any }) {
  const [analysis, setAnalysis] = useState<{
    recommendation: 'buy' | 'wait' | 'avoid';
    score: number;
    reasons: string[];
    riskFactors: string[];
    alternatives: Array<{name: string, price: number, reason: string}>;
  }>({
    recommendation: 'wait',
    score: 0,
    reasons: [],
    riskFactors: [],
    alternatives: []
  });

  useEffect(() => {
    if (item) {
      analyzeItem();
    }
  }, [item]);

  const analyzeItem = async () => {
    try {
      const response = await fetch('/api/ai/purchase-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item })
      });
      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('Purchase analysis failed:', error);
    }
  };

  const getRecommendationColor = () => {
    switch (analysis.recommendation) {
      case 'buy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'wait': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'avoid': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const getRecommendationIcon = () => {
    switch (analysis.recommendation) {
      case 'buy': return <Crown className="w-4 h-4" />;
      case 'wait': return <Eye className="w-4 h-4" />;
      case 'avoid': return <Target className="w-4 h-4" />;
    }
  };

  if (!item) return null;

  return (
    <Card className="bg-black/40 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Brain className="w-5 h-5" />
          AI Purchase Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Recommendation */}
        <div className={`p-4 rounded border ${getRecommendationColor()}`}>
          <div className="flex items-center gap-2 mb-2">
            {getRecommendationIcon()}
            <span className="font-semibold capitalize">{analysis.recommendation}</span>
            <Badge className="bg-white/20 text-white text-xs">
              Score: {analysis.score}/100
            </Badge>
          </div>
          <p className="text-sm">
            AI recommends to <strong>{analysis.recommendation}</strong> this item
          </p>
        </div>

        {/* Reasons */}
        {analysis.reasons.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-2">Why {analysis.recommendation}?</h3>
            <div className="space-y-1">
              {analysis.reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full mt-2" />
                  <p className="text-sm text-white/80">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Factors */}
        {analysis.riskFactors.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-2 text-red-400">Risk Factors</h3>
            <div className="space-y-1">
              {analysis.riskFactors.map((risk, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-red-400 rounded-full mt-2" />
                  <p className="text-sm text-red-300">{risk}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alternatives */}
        {analysis.alternatives.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-2">AI Alternatives</h3>
            <div className="space-y-2">
              {analysis.alternatives.slice(0, 2).map((alt, index) => (
                <div key={index} className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-sm">{alt.name}</span>
                    <span className="text-blue-400 font-semibold">{alt.price} SOL</span>
                  </div>
                  <p className="text-xs text-white/70">{alt.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}