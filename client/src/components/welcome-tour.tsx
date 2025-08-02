import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight, ArrowLeft, Sparkles, Coins, TrendingUp, MessageSquare, Gift } from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Flutterbye! 🦋',
    description: 'Transform your messages into valuable blockchain tokens. Each message becomes a unique SPL token that can be traded, shared, and monetized.',
    position: 'center'
  },
  {
    id: 'mint',
    title: 'Create Your First Token',
    description: 'Turn any 27-character message into a tradeable token. Add custom images, set value, and watch your words become wealth.',
    position: 'center',
    action: {
      label: 'Start Minting',
      href: '/mint'
    }
  },
  {
    id: 'marketplace',
    title: 'Discover & Trade Messages',
    description: 'Browse thousands of tokenized messages, find viral content, connect with celebrities, and trade with the community.',
    position: 'center',
    action: {
      label: 'Explore Marketplace',
      href: '/marketplace'
    }
  },
  {
    id: 'viral',
    title: 'Go Viral & Earn FLBY',
    description: 'Share your messages across social platforms and earn FLBY rewards for every view, like, and comment you generate.',
    position: 'center'
  },
  {
    id: 'ready',
    title: 'You\'re Ready to Flutter! 🚀',
    description: 'Start with a simple message, connect your wallet, and join the revolution of tokenized communication.',
    position: 'center',
    action: {
      label: 'Get Started Now',
      href: '/mint'
    }
  }
];

interface WelcomeTourProps {
  onComplete: () => void;
}

export function WelcomeTour({ onComplete }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has already seen the tour
    const hasSeenTour = localStorage.getItem('flutterbye-tour-completed');
    if (hasSeenTour) {
      setIsVisible(false);
      return;
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('flutterbye-tour-completed', 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('flutterbye-tour-completed', 'true');
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-gray-900 border-electric-blue/30 electric-frame">
        <CardContent className="p-8 text-center space-y-6">
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-electric-blue'
                    : index < currentStep
                    ? 'bg-electric-green'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Step Icon */}
          <div className="flex justify-center mb-4">
            {currentStep === 0 && <Sparkles className="h-12 w-12 text-electric-blue" />}
            {currentStep === 1 && <Coins className="h-12 w-12 text-electric-green" />}
            {currentStep === 2 && <TrendingUp className="h-12 w-12 text-purple-400" />}
            {currentStep === 3 && <MessageSquare className="h-12 w-12 text-pink-400" />}
            {currentStep === 4 && <Gift className="h-12 w-12 text-yellow-400" />}
          </div>

          {/* Step Content */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              {currentTourStep.title}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {currentTourStep.description}
            </p>
          </div>

          {/* Step Counter */}
          <Badge variant="outline" className="text-electric-blue border-electric-blue/30">
            Step {currentStep + 1} of {tourSteps.length}
          </Badge>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-gray-400 hover:text-white"
              >
                Skip Tour
              </Button>
              
              {currentTourStep.action ? (
                <Button
                  onClick={() => {
                    if (currentTourStep.action?.href) {
                      window.location.href = currentTourStep.action.href;
                    } else if (currentTourStep.action?.onClick) {
                      currentTourStep.action.onClick();
                    }
                    handleComplete();
                  }}
                  className="bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
                >
                  {currentTourStep.action.label}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
                >
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook to restart tour
export function useWelcomeTour() {
  const restartTour = () => {
    localStorage.removeItem('flutterbye-tour-completed');
    window.location.reload();
  };

  return { restartTour };
}