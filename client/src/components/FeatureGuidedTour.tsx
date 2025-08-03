import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Star,
  Sparkles,
  Crown,
  Target,
  Zap,
  Eye,
  Mic,
  Brain,
  TrendingUp,
  Waves,
  Play
} from 'lucide-react';

interface FeatureGuidedTourProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void;
}

export function FeatureGuidedTour({ currentStep, onStepChange, onComplete }: FeatureGuidedTourProps) {
  const tourSteps = [
    {
      id: 'welcome',
      title: 'Welcome to the Revolutionary Platform',
      description: 'You\'re about to experience the world\'s first multimedia blockchain messaging platform. This technology has never existed before and represents a complete breakthrough in digital communication.',
      icon: <Crown className="w-8 h-8 text-yellow-400" />,
      highlight: 'WORLD FIRST TECHNOLOGY',
      action: 'Begin Revolutionary Journey',
      tips: [
        'This platform combines 4 impossible-to-find technologies',
        'Voice + AI + Viral Prediction + Blockchain = Unprecedented value',
        'Every feature you\'ll see is genuinely revolutionary'
      ]
    },
    {
      id: 'voice-upload',
      title: 'VoiceAttachmentUploader™',
      description: 'Record your voice directly or upload songs/music to attach to blockchain messages. This is the world\'s first system for permanent audio storage on blockchain tokens.',
      icon: <Mic className="w-8 h-8 text-blue-400" />,
      highlight: 'VOICE TO BLOCKCHAIN',
      action: 'Try Voice Recording',
      tips: [
        'Click the microphone to record voice messages',
        'Upload MP3, WAV, OGG, M4A files up to 10MB',
        'Instant emotion analysis during recording',
        'Audio permanently stored on Solana blockchain'
      ]
    },
    {
      id: 'ai-enhancement',
      title: 'AIVoiceEnhancer™',
      description: 'Advanced neural network analysis of your voice patterns, creating unique fingerprints and predicting market value. This AI enhancement technology is impossible to find elsewhere.',
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      highlight: 'NEURAL VOICE ANALYSIS',
      action: 'Enhance with AI',
      tips: [
        'Neural pattern analysis creates voice fingerprints',
        'Personality detection (Charismatic, Inspirational, etc.)',
        'Market value prediction with confidence scoring',
        'Voice rarity assessment for uniqueness'
      ]
    },
    {
      id: 'visualization',
      title: 'BlockchainAudioVisualizer™',
      description: 'Real-time audio waveform visualization with blockchain pulse effects. Watch your voice patterns come alive with energy-reactive visuals synchronized to blockchain data.',
      icon: <Waves className="w-8 h-8 text-emerald-400" />,
      highlight: 'LIVE BLOCKCHAIN SYNC',
      action: 'View Audio Visualization',
      tips: [
        'Real-time waveform display on canvas',
        'Blockchain pulse effects synchronized with audio',
        'Emotion-reactive colors change with voice tone',
        'Live network status indicators'
      ]
    },
    {
      id: 'viral-prediction',
      title: 'SocialViralPredictor™',
      description: 'Multi-platform viral analysis predicting success across Twitter, TikTok, Instagram, and YouTube. Get monetization forecasts and optimal posting strategies.',
      icon: <TrendingUp className="w-8 h-8 text-green-400" />,
      highlight: 'VIRAL INTELLIGENCE',
      action: 'Predict Viral Success',
      tips: [
        'Platform-specific engagement predictions',
        'Viral coefficient calculation for spread rate',
        'Monetization potential with revenue estimates',
        'Optimal timing and hashtag recommendations'
      ]
    },
    {
      id: 'ultimate-token',
      title: 'Ultimate Multimedia Token Creation',
      description: 'Combine all analysis data into the world\'s most advanced blockchain token. Audio + AI insights + viral predictions = unprecedented digital value.',
      icon: <Crown className="w-8 h-8 text-yellow-400" />,
      highlight: 'ULTIMATE VALUE CREATION',
      action: 'Create Ultimate Token',
      tips: [
        'All enhancement data included in token metadata',
        'Permanent blockchain storage with full analysis',
        'Token value enhanced by AI and viral predictions',
        'Creates entirely new category of digital assets'
      ]
    }
  ];

  const currentStepData = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-900/95 border-2 border-blue-500/40 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-2">
            <Eye className="w-6 h-6 text-blue-400" />
            Guided Revolutionary Tour
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            Step {currentStep + 1} of {tourSteps.length}
          </Badge>
        </div>
        
        <Progress value={progress} className="h-2 mb-4" />
        
        <div className="text-center">
          <Badge variant="secondary" className="bg-red-500/20 text-red-300 animate-pulse mb-3">
            <Sparkles className="w-3 h-3 mr-1" />
            {currentStepData.highlight}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Step Display */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-full border-2 border-blue-500/30">
              {currentStepData.icon}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-white">{currentStepData.title}</h3>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">{currentStepData.description}</p>
        </div>

        {/* Tips & Features */}
        <div className="space-y-3">
          <h4 className="text-lg font-medium text-blue-300 text-center">Key Features:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentStepData.tips.map((tip, index) => (
              <div 
                key={index}
                className="flex items-start gap-2 p-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/20"
              >
                <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6"
          >
            <Play className="w-4 h-4 mr-2" />
            {currentStepData.action}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700/50">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="border-gray-600 hover:border-gray-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {/* Step Indicators */}
          <div className="flex gap-2">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => onStepChange(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-blue-500 scale-125' 
                    : index < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {currentStep === tourSteps.length - 1 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Tour
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Completion Celebration */}
        {currentStep === tourSteps.length - 1 && (
          <div className="text-center p-6 bg-gradient-to-r from-yellow-900/30 via-orange-900/30 to-red-900/30 rounded-lg border border-yellow-500/30">
            <h4 className="text-xl font-bold text-yellow-300 mb-2">🎉 Revolutionary Journey Complete!</h4>
            <p className="text-gray-300">
              You've now seen technology that literally doesn't exist anywhere else. 
              Ready to create multimedia blockchain tokens that will change digital communication forever?
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}