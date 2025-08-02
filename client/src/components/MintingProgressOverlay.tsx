import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, AlertCircle, Zap, Coins, Upload, Share2, Clock } from "lucide-react";

interface MintingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  icon: React.ElementType;
  estimatedTime?: number;
}

interface MintingProgressOverlayProps {
  isVisible: boolean;
  currentStep?: string;
  onComplete?: () => void;
  onError?: (error: string) => void;
  mintingData?: {
    message: string;
    quantity: number;
    hasValue: boolean;
    hasImage: boolean;
  };
}

export function MintingProgressOverlay({ 
  isVisible, 
  currentStep, 
  onComplete, 
  onError,
  mintingData 
}: MintingProgressOverlayProps) {
  const [steps, setSteps] = useState<MintingStep[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0);

  // Initialize steps based on minting configuration
  useEffect(() => {
    if (!isVisible || !mintingData) return;

    const initialSteps: MintingStep[] = [
      {
        id: 'validation',
        title: 'Validating Token Data',
        description: 'Checking message format and parameters',
        status: 'pending',
        icon: CheckCircle,
        estimatedTime: 2
      },
      {
        id: 'wallet',
        title: 'Connecting to Wallet',
        description: 'Establishing secure connection to your wallet',
        status: 'pending',
        icon: Zap,
        estimatedTime: 3
      }
    ];

    if (mintingData.hasImage) {
      initialSteps.push({
        id: 'image',
        title: 'Processing Token Image',
        description: 'Uploading and optimizing your custom image',
        status: 'pending',
        icon: Upload,
        estimatedTime: 5
      });
    }

    initialSteps.push(
      {
        id: 'token',
        title: 'Creating SPL Token',
        description: 'Minting your message token on Solana blockchain',
        status: 'pending',
        icon: Coins,
        estimatedTime: 8
      }
    );

    if (mintingData.hasValue) {
      initialSteps.push({
        id: 'value',
        title: 'Attaching Value',
        description: 'Distributing value pool to token holders',
        status: 'pending',
        icon: Share2,
        estimatedTime: 6
      });
    }

    initialSteps.push({
      id: 'finalization',
      title: 'Finalizing Transaction',
      description: 'Confirming on blockchain and updating records',
      status: 'pending',
      icon: CheckCircle,
      estimatedTime: 4
    });

    setSteps(initialSteps);
    setEstimatedTimeRemaining(initialSteps.reduce((sum, step) => sum + (step.estimatedTime || 0), 0));
  }, [isVisible, mintingData]);

  // Timer for elapsed time
  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Update step status based on current step
  useEffect(() => {
    if (!currentStep) return;

    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      let foundCurrent = false;
      let completedTime = 0;

      for (let i = 0; i < newSteps.length; i++) {
        if (newSteps[i].id === currentStep) {
          newSteps[i].status = 'processing';
          foundCurrent = true;
        } else if (!foundCurrent) {
          newSteps[i].status = 'completed';
          completedTime += newSteps[i].estimatedTime || 0;
        } else {
          newSteps[i].status = 'pending';
        }
      }

      // Update overall progress
      const totalSteps = newSteps.length;
      const completedSteps = newSteps.filter(step => step.status === 'completed').length;
      const currentStepProgress = newSteps.find(step => step.status === 'processing') ? 0.5 : 0;
      setOverallProgress(((completedSteps + currentStepProgress) / totalSteps) * 100);

      // Update estimated time remaining
      const remainingSteps = newSteps.filter(step => step.status === 'pending' || step.status === 'processing');
      const remainingTime = remainingSteps.reduce((sum, step) => sum + (step.estimatedTime || 0), 0);
      setEstimatedTimeRemaining(remainingTime);

      return newSteps;
    });
  }, [currentStep]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusIcon = (status: MintingStep['status'], DefaultIcon: React.ElementType) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <DefaultIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: MintingStep['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-400/50 bg-green-900/20';
      case 'processing':
        return 'border-blue-400/50 bg-blue-900/20 animate-pulse';
      case 'error':
        return 'border-red-400/50 bg-red-900/20';
      default:
        return 'border-gray-600/50 bg-gray-900/20';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/95 border border-blue-500/30">
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Coins className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Minting Your Token</h3>
            <p className="text-sm text-gray-400">
              Creating "{mintingData?.message}" • {mintingData?.quantity} tokens
            </p>
          </div>

          {/* Overall Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white">Overall Progress</span>
              <span className="text-sm text-blue-400">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3 bg-gray-700" />
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{formatTime(elapsedTime)}</div>
              <div className="text-xs text-gray-400">Elapsed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{formatTime(estimatedTimeRemaining)}</div>
              <div className="text-xs text-gray-400">Remaining</div>
            </div>
          </div>

          {/* Step List */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-3 rounded-lg border transition-all duration-300 ${getStatusColor(step.status)}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(step.status, step.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">{step.title}</h4>
                      <Badge variant={
                        step.status === 'completed' ? 'default' :
                        step.status === 'processing' ? 'secondary' :
                        step.status === 'error' ? 'destructive' : 'outline'
                      } className="text-xs">
                        {step.status === 'processing' ? 'Active' :
                         step.status === 'completed' ? 'Done' :
                         step.status === 'error' ? 'Error' : 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                    {step.status === 'processing' && step.estimatedTime && (
                      <div className="flex items-center mt-2 text-xs text-blue-400">
                        <Clock className="w-3 h-3 mr-1" />
                        ~{step.estimatedTime} seconds
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Message */}
          <div className="mt-6 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-center">
            <p className="text-xs text-blue-300">
              🔐 Your transaction is being processed securely on the Solana blockchain
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}