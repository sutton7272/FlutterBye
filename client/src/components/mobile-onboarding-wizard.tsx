import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  ArrowRight, 
  ArrowLeft,
  Coins, 
  Users, 
  Brain, 
  MessageSquare,
  Sparkles,
  CheckCircle,
  Smartphone
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  action?: string;
  href?: string;
}

interface MobileOnboardingWizardProps {
  onComplete: () => void;
}

export function MobileOnboardingWizard({ onComplete }: MobileOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to Flutterbye",
      description: "Transform your messages into valuable blockchain tokens with AI-powered intelligence",
      icon: Sparkles
    },
    {
      id: "create",
      title: "Create Tokens",
      description: "Turn any message into a token that can gain value and be shared",
      icon: Coins,
      action: "Try it",
      href: "/create"
    },
    {
      id: "trade",
      title: "Trade & Discover",
      description: "Buy, sell, and discover valuable tokens from the community",
      icon: Users,
      action: "Explore",
      href: "/trade"
    },
    {
      id: "intelligence",
      title: "AI Intelligence",
      description: "Get smart insights about market trends and viral potential",
      icon: Brain,
      action: "See AI",
      href: "/intelligence"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep ? "bg-electric-blue" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Main Card */}
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-electric-blue/10 flex items-center justify-center mb-4">
                <currentStepData.icon className="h-8 w-8 text-electric-blue" />
              </div>
              <CardTitle className="text-xl">
                {currentStepData.title}
              </CardTitle>
              <CardDescription className="text-base">
                {currentStepData.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentStepData.action && currentStepData.href && (
                <Link href={currentStepData.href}>
                  <Button 
                    className="w-full" 
                    onClick={onComplete}
                  >
                    {currentStepData.action} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              
              {!currentStepData.action && (
                <Button className="w-full" onClick={nextStep}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="opacity-70"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="flex space-x-2">
              <Button variant="ghost" onClick={onComplete} className="text-muted-foreground">
                Skip
              </Button>
              
              {currentStep < steps.length - 1 && !currentStepData.action && (
                <Button onClick={nextStep}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Tips */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Smartphone className="h-5 w-5 text-electric-blue mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Mobile Optimized</p>
                  <p className="text-xs text-muted-foreground">
                    Flutterbye works great on your phone. Tap and swipe to navigate easily.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Badge */}
      <div className="p-4 text-center">
        <Badge variant="outline" className="text-xs">
          <CheckCircle className="mr-1 h-3 w-3" />
          Secure blockchain platform
        </Badge>
      </div>
    </div>
  );
}