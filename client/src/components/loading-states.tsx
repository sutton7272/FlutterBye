import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, CheckCircle, AlertCircle, Zap } from "lucide-react";

interface LoadingStateProps {
  type: 'minting' | 'transaction' | 'wallet' | 'marketplace' | 'generic';
  message?: string;
  progress?: number;
  estimatedTime?: string;
  stage?: string;
}

export function LoadingState({ type, message, progress, estimatedTime, stage }: LoadingStateProps) {
  const getLoadingContent = () => {
    switch (type) {
      case 'minting':
        return {
          icon: <Zap className="h-8 w-8 text-electric-blue animate-pulse" />,
          title: "Creating Your Token",
          defaultMessage: "Transforming your message into a blockchain token...",
          stages: [
            "Validating message content",
            "Generating token metadata", 
            "Creating SPL token",
            "Uploading to blockchain",
            "Finalizing token creation"
          ]
        };
      case 'transaction':
        return {
          icon: <Loader2 className="h-8 w-8 text-electric-green animate-spin" />,
          title: "Processing Transaction",
          defaultMessage: "Confirming your transaction on the blockchain...",
          stages: [
            "Preparing transaction",
            "Sending to network",
            "Awaiting confirmation",
            "Validating on blockchain",
            "Transaction complete"
          ]
        };
      case 'wallet':
        return {
          icon: <Clock className="h-8 w-8 text-purple-400 animate-pulse" />,
          title: "Connecting Wallet",
          defaultMessage: "Please approve the connection in your wallet...",
          stages: [
            "Detecting wallet",
            "Requesting permission", 
            "Establishing connection",
            "Verifying account",
            "Connection established"
          ]
        };
      case 'marketplace':
        return {
          icon: <Loader2 className="h-8 w-8 text-yellow-400 animate-spin" />,
          title: "Loading Marketplace",
          defaultMessage: "Fetching the latest tokenized messages...",
          stages: [
            "Loading token data",
            "Fetching prices",
            "Calculating metrics",
            "Preparing display",
            "Ready to browse"
          ]
        };
      default:
        return {
          icon: <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />,
          title: "Loading",
          defaultMessage: "Please wait...",
          stages: []
        };
    }
  };

  const content = getLoadingContent();
  const currentStage = stage ? content.stages.indexOf(stage) : -1;

  return (
    <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
      <CardContent className="p-8 text-center space-y-6">
        {/* Loading Icon */}
        <div className="flex justify-center">
          {content.icon}
        </div>

        {/* Title and Message */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{content.title}</h3>
          <p className="text-gray-300">{message || content.defaultMessage}</p>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-electric-blue to-electric-green h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">{progress}% complete</p>
          </div>
        )}

        {/* Stage Indicator */}
        {content.stages.length > 0 && currentStage >= 0 && (
          <div className="space-y-3">
            <Badge variant="outline" className="text-electric-blue border-electric-blue/30">
              Step {currentStage + 1} of {content.stages.length}
            </Badge>
            <div className="space-y-2">
              {content.stages.map((stageText, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  {index < currentStage ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : index === currentStage ? (
                    <Loader2 className="h-4 w-4 text-electric-blue animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-600" />
                  )}
                  <span className={index <= currentStage ? 'text-white' : 'text-gray-500'}>
                    {stageText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estimated Time */}
        {estimatedTime && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Estimated time: {estimatedTime}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Skeleton loading for content
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <Card className={`bg-gray-800/50 border-gray-700 ${className}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-700 rounded-lg animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded animate-pulse" />
          <div className="h-3 bg-gray-700 rounded animate-pulse w-5/6" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-700 rounded animate-pulse w-16" />
          <div className="h-8 bg-gray-700 rounded animate-pulse w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

// Loading overlay for existing content
interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, message = "Loading...", children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 text-electric-blue animate-spin mx-auto" />
            <p className="text-white font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Smart loading state that adapts to context
interface SmartLoadingProps {
  isLoading: boolean;
  type?: 'minting' | 'transaction' | 'wallet' | 'marketplace' | 'generic';
  message?: string;
  progress?: number;
  estimatedTime?: string;
  stage?: string;
  overlay?: boolean;
  children?: React.ReactNode;
}

export function SmartLoading({ 
  isLoading, 
  type = 'generic', 
  message, 
  progress, 
  estimatedTime, 
  stage, 
  overlay = false,
  children 
}: SmartLoadingProps) {
  if (!isLoading) return <>{children}</>;

  const loadingComponent = (
    <LoadingState
      type={type}
      message={message}
      progress={progress}
      estimatedTime={estimatedTime}
      stage={stage}
    />
  );

  if (overlay && children) {
    return (
      <LoadingOverlay isLoading={isLoading} message={message}>
        {children}
      </LoadingOverlay>
    );
  }

  return loadingComponent;
}