import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Coins, 
  Zap, 
  Wallet, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Target,
  Gift,
  Share2,
  TrendingUp,
  Heart,
  Rocket
} from "lucide-react";
import { Link } from "wouter";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
  action?: string;
}

interface MobileOnboardingWizardProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export function MobileOnboardingWizard({ onComplete, onSkip }: MobileOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    name: '',
    interests: [] as string[],
    firstMessage: ''
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Flutterbye!',
      description: 'Transform your messages into valuable tokens in just a few taps',
      icon: Sparkles,
      completed: false
    },
    {
      id: 'connect',
      title: 'Connect Your Wallet',
      description: 'Quick and secure wallet connection to start tokenizing',
      icon: Wallet,
      completed: false,
      action: 'Connect Wallet'
    },
    {
      id: 'profile',
      title: 'Tell Us About You',
      description: 'Personalize your experience for better recommendations',
      icon: Target,
      completed: false
    },
    {
      id: 'firstToken',
      title: 'Create Your First Token',
      description: 'Turn your first message into a valuable token',
      icon: Coins,
      completed: false,
      action: 'Create Token'
    },
    {
      id: 'discover',
      title: 'Discover Viral Tokens',
      description: 'Explore trending tokens and join conversations',
      icon: TrendingUp,
      completed: false,
      action: 'Explore Trending'
    }
  ];

  const [onboardingSteps, setOnboardingSteps] = useState(steps);
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleStepComplete = () => {
    const updatedSteps = [...onboardingSteps];
    updatedSteps[currentStep].completed = true;
    setOnboardingSteps(updatedSteps);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSkip?.();
    }
  };

  const currentStepData = onboardingSteps[currentStep];
  const IconComponent = currentStepData.icon;

  const interestOptions = [
    'DeFi', 'NFTs', 'Gaming', 'Art', 'Music', 'Sports', 
    'Tech', 'Memes', 'Investment', 'Trading', 'Social', 'News'
  ];

  const toggleInterest = (interest: string) => {
    setUserProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glassmorphism electric-frame">
        <CardHeader className="text-center">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-text-secondary mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Icon */}
          <div className="w-16 h-16 electric-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <IconComponent className="h-8 w-8 text-white" />
          </div>

          <CardTitle className="text-xl text-white">
            {currentStepData.title}
          </CardTitle>
          <CardDescription className="text-text-secondary">
            {currentStepData.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step-specific content */}
          {currentStep === 0 && (
            <div className="text-center space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 text-electric-blue mx-auto mb-2" />
                  <div className="text-sm text-text-secondary">Send Messages</div>
                </div>
                <div className="text-center">
                  <Coins className="h-8 w-8 text-electric-green mx-auto mb-2" />
                  <div className="text-sm text-text-secondary">Create Tokens</div>
                </div>
                <div className="text-center">
                  <Zap className="h-8 w-8 text-warning-orange mx-auto mb-2" />
                  <div className="text-sm text-text-secondary">Earn Value</div>
                </div>
              </div>
              <p className="text-sm text-text-secondary">
                Join thousands of users turning everyday messages into valuable digital assets
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-electric-blue/10 border border-electric-blue/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Wallet className="h-5 w-5 text-electric-blue" />
                  <span className="font-medium text-white">Secure & Easy</span>
                </div>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-electric-green" />
                    Your wallet stays in your control
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-electric-green" />
                    No personal data required
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-electric-green" />
                    Start earning immediately
                  </li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Display Name (Optional)</Label>
                <Input
                  id="name"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="How should we call you?"
                  className="mt-1 bg-surface-dark border-electric-blue/20"
                />
              </div>
              
              <div>
                <Label className="text-white">Your Interests</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {interestOptions.map((interest) => (
                    <Button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      variant={userProfile.interests.includes(interest) ? "default" : "outline"}
                      size="sm"
                      className={`text-xs ${
                        userProfile.interests.includes(interest)
                          ? 'electric-gradient text-white'
                          : 'border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10'
                      }`}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstMessage" className="text-white">Your First Token Message</Label>
                <Textarea
                  id="firstMessage"
                  value={userProfile.firstMessage}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, firstMessage: e.target.value }))}
                  placeholder="What's on your mind? (e.g., 'gm everyone! ready to moon!')"
                  className="mt-1 bg-surface-dark border-electric-blue/20"
                  rows={3}
                />
              </div>
              
              <div className="bg-electric-green/10 border border-electric-green/20 rounded-lg p-3">
                <div className="flex items-center gap-2 text-electric-green text-sm">
                  <Gift className="h-4 w-4" />
                  <span>Your first token is free!</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-electric-blue/10 border-electric-blue/20">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-electric-blue mx-auto mb-2" />
                    <div className="text-sm font-medium text-white">Trending</div>
                    <div className="text-xs text-text-secondary">Hot tokens</div>
                  </CardContent>
                </Card>
                <Card className="bg-electric-green/10 border-electric-green/20">
                  <CardContent className="p-4 text-center">
                    <Heart className="h-6 w-6 text-electric-green mx-auto mb-2" />
                    <div className="text-sm font-medium text-white">For You</div>
                    <div className="text-xs text-text-secondary">Personalized</div>
                  </CardContent>
                </Card>
              </div>
              
              <p className="text-sm text-text-secondary text-center">
                Discover viral tokens, join conversations, and earn rewards by engaging with the community
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSkip}
              variant="outline"
              className="flex-1 border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
            >
              {currentStep === steps.length - 1 ? 'Maybe Later' : 'Skip'}
            </Button>
            <Button
              onClick={handleStepComplete}
              className="flex-1 electric-gradient text-white"
            >
              {currentStepData.action || (currentStep === steps.length - 1 ? 'Get Started' : 'Continue')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Skip All Option */}
          {currentStep > 0 && (
            <Button
              onClick={onSkip}
              variant="ghost"
              size="sm"
              className="w-full text-xs text-text-secondary hover:text-white"
            >
              Skip onboarding
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}