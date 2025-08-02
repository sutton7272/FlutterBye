import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, TrendingUp, Zap, Sparkles, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmotionAnalysis {
  primaryEmotion: string;
  intensity: number;
  confidence: number;
  marketImpact: 'low' | 'medium' | 'high' | 'viral';
  suggestedPrice: number;
  viralPotential: number;
  emotionBreakdown: {
    joy: number;
    surprise: number;
    trust: number;
    fear: number;
    sadness: number;
    disgust: number;
    anger: number;
    anticipation: number;
  };
  recommendations: string[];
}

export default function AIEmotionAnalyzer() {
  const [message, setMessage] = useState('');
  const [analysis, setAnalysis] = useState<EmotionAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeEmotion = async () => {
    if (!message.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis (in production, this would call OpenAI API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock sophisticated emotion analysis
    const mockAnalysis: EmotionAnalysis = {
      primaryEmotion: 'Anticipation',
      intensity: 87,
      confidence: 94,
      marketImpact: 'viral',
      suggestedPrice: 0.15,
      viralPotential: 92,
      emotionBreakdown: {
        joy: 23,
        surprise: 15,
        trust: 31,
        fear: 8,
        sadness: 5,
        disgust: 2,
        anger: 3,
        anticipation: 87
      },
      recommendations: [
        'Add countdown timer for urgency',
        'Include social proof elements',
        'Optimize for peak trading hours (2-4 PM EST)',
        'Target crypto enthusiast demographics',
        'Use blue-green color scheme for trust'
      ]
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      joy: 'bg-yellow-500',
      surprise: 'bg-orange-500',
      trust: 'bg-blue-500',
      fear: 'bg-red-500',
      sadness: 'bg-indigo-500',
      disgust: 'bg-green-500',
      anger: 'bg-red-600',
      anticipation: 'bg-purple-500'
    };
    return colors[emotion.toLowerCase()] || 'bg-gray-500';
  };

  const getMarketImpactBadge = (impact: string) => {
    const variants = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-green-100 text-green-800',
      viral: 'bg-purple-100 text-purple-800 animate-pulse'
    };
    return variants[impact as keyof typeof variants];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-electric-blue" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
              AI Emotion Analyzer
            </h1>
            <Sparkles className="w-8 h-8 text-electric-green" />
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Harness advanced AI to analyze emotional resonance and predict viral potential of your tokenized messages
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-electric-blue">
                <Target className="w-5 h-5" />
                Message Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter your message (max 27 characters)
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 27))}
                  placeholder="BuyTheDipNowOrCry"
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px] resize-none"
                  maxLength={27}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{message.length}/27 characters</span>
                  <span>{27 - message.length} remaining</span>
                </div>
              </div>

              <Button
                onClick={analyzeEmotion}
                disabled={!message.trim() || isAnalyzing}
                className="w-full bg-gradient-to-r from-electric-blue to-electric-green hover:from-electric-blue/80 hover:to-electric-green/80"
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing Emotions...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Analyze Emotion
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <AnimatePresence>
            {analysis && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-electric-green">
                      <Heart className="w-5 h-5" />
                      Emotion Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Primary Emotion */}
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-bold text-white">{analysis.primaryEmotion}</h3>
                      <Badge className={getMarketImpactBadge(analysis.marketImpact)}>
                        {analysis.marketImpact.toUpperCase()} IMPACT
                      </Badge>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Intensity</span>
                          <span className="text-white font-medium">{analysis.intensity}%</span>
                        </div>
                        <Progress value={analysis.intensity} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Confidence</span>
                          <span className="text-white font-medium">{analysis.confidence}%</span>
                        </div>
                        <Progress value={analysis.confidence} className="h-2" />
                      </div>
                    </div>

                    {/* Viral Potential */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          Viral Potential
                        </span>
                        <span className="text-electric-green font-bold">{analysis.viralPotential}%</span>
                      </div>
                      <Progress value={analysis.viralPotential} className="h-3" />
                    </div>

                    {/* Suggested Price */}
                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-300">Suggested Price</div>
                      <div className="text-2xl font-bold text-electric-blue">
                        {analysis.suggestedPrice} SOL
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Detailed Analysis */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Emotion Breakdown */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-electric-blue">Emotion Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analysis.emotionBreakdown).map(([emotion, value]) => (
                      <div key={emotion} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize text-gray-300">{emotion}</span>
                          <span className="text-white font-medium">{value}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ duration: 1, delay: 0.1 }}
                            className={`h-2 rounded-full ${getEmotionColor(emotion)}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Recommendations */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-electric-green">
                    <Zap className="w-5 h-5" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.recommendations.map((recommendation, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg"
                      >
                        <div className="w-6 h-6 bg-electric-blue/20 rounded-full flex items-center justify-center text-electric-blue text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-300 text-sm">{recommendation}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}