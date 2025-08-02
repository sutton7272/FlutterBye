import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, X, ExternalLink, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";

interface HelpTooltipProps {
  title: string;
  content: string;
  type?: 'info' | 'warning' | 'success' | 'tip';
  learnMoreUrl?: string;
  children: React.ReactNode;
}

export function HelpTooltip({ title, content, type = 'info', learnMoreUrl, children }: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'tip': return <Lightbulb className="h-4 w-4 text-electric-blue" />;
      default: return <HelpCircle className="h-4 w-4 text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'warning': return 'border-yellow-400/30';
      case 'success': return 'border-green-400/30';
      case 'tip': return 'border-electric-blue/30';
      default: return 'border-blue-400/30';
    }
  };

  return (
    <div className="relative inline-block">
      <div 
        className="cursor-help inline-flex items-center gap-1"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {children}
        {getIcon()}
      </div>
      
      {isOpen && (
        <Card className={`absolute z-50 w-72 mt-2 bg-gray-900 ${getBorderColor()} shadow-lg`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                {getIcon()}
                {title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-300 mb-3">{content}</p>
            {learnMoreUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(learnMoreUrl, '_blank')}
                className="text-xs border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Learn More
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Predefined help content for common concepts
export const helpContent = {
  blockchain: {
    title: "What is Blockchain?",
    content: "A secure, decentralized ledger that records all transactions permanently. Your tokens are stored safely on the Solana blockchain.",
    type: 'info' as const
  },
  splToken: {
    title: "SPL Tokens",
    content: "Standard tokens on Solana blockchain. Each message becomes a unique SPL token that you own and can trade.",
    type: 'info' as const
  },
  wallet: {
    title: "Crypto Wallet",
    content: "A digital wallet that stores your cryptocurrencies and tokens. Connect Phantom or Solflare to get started.",
    type: 'info' as const
  },
  minting: {
    title: "Token Minting",
    content: "Creating a new token on the blockchain. Your message becomes a permanent, tradeable digital asset.",
    type: 'tip' as const
  },
  gasFeess: {
    title: "Network Fees",
    content: "Small fees paid to process transactions on the blockchain. Usually costs less than $0.01 on Solana.",
    type: 'warning' as const
  },
  marketCap: {
    title: "Market Value",
    content: "The total value of all tokens for a message. Calculated as token price × total supply.",
    type: 'info' as const
  },
  viral: {
    title: "Viral Mechanics",
    content: "Features that help your messages spread across social media, earning you FLBY rewards for engagement.",
    type: 'tip' as const
  },
  flbyToken: {
    title: "FLBY Token",
    content: "Flutterbye's native token. Earn through viral shares, get discounts on fees, and access exclusive features.",
    type: 'success' as const
  }
};

// Quick help component for forms
interface QuickHelpProps {
  concept: keyof typeof helpContent;
  className?: string;
}

export function QuickHelp({ concept, className = "" }: QuickHelpProps) {
  const help = helpContent[concept];
  
  return (
    <div className={`inline-block ${className}`}>
      <HelpTooltip
        title={help.title}
        content={help.content}
        type={help.type}
      >
        <span></span>
      </HelpTooltip>
    </div>
  );
}

// Contextual help panel for complex features
interface HelpPanelProps {
  topic: string;
  isOpen: boolean;
  onClose: () => void;
}

export function HelpPanel({ topic, isOpen, onClose }: HelpPanelProps) {
  if (!isOpen) return null;

  const getHelpContent = (topic: string) => {
    switch (topic) {
      case 'minting':
        return {
          title: "How to Create Your First Token",
          steps: [
            "Write a 27-character message that expresses your idea",
            "Choose how many tokens to create (more = lower individual price)",
            "Optionally upload a custom image for your token",
            "Set any additional value or expiration date",
            "Review and confirm your creation"
          ],
          tips: [
            "Shorter, catchier messages tend to be more valuable",
            "Custom images make tokens more memorable",
            "Consider your audience when setting quantities"
          ]
        };
      case 'marketplace':
        return {
          title: "How to Navigate the Marketplace",
          steps: [
            "Browse categories or search for specific messages",
            "Use filters to find tokens in your price range",
            "Check viral potential and social engagement",
            "Review token details and creator information",
            "Purchase with SOL, USDC, or FLBY tokens"
          ],
          tips: [
            "Trending tokens often have higher viral potential",
            "Check the creator's other successful tokens",
            "Use FLBY tokens to get 10% discount on purchases"
          ]
        };
      default:
        return null;
    }
  };

  const content = getHelpContent(topic);
  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-gray-900 border-electric-blue/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-electric-blue flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              {content.title}
            </CardTitle>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-white mb-3">Step-by-Step Guide:</h4>
            <ol className="space-y-2">
              {content.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <Badge variant="outline" className="text-xs border-electric-blue/30 text-electric-blue">
                    {index + 1}
                  </Badge>
                  <span className="text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-3">Pro Tips:</h4>
            <ul className="space-y-2">
              {content.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <Lightbulb className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
            >
              Got It!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}