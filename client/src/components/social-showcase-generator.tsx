import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Share2, 
  Twitter, 
  Download, 
  Copy, 
  Sparkles, 
  TrendingUp,
  Heart,
  MessageSquare,
  Zap,
  Star
} from "lucide-react";

interface TokenShowcaseData {
  message: string;
  quantity: number;
  valueAttached?: string;
  tokenImage?: string;
  solscanUrl?: string;
}

interface SocialShowcaseGeneratorProps {
  tokenData?: TokenShowcaseData;
  isOpen: boolean;
  onClose: () => void;
}

export function SocialShowcaseGenerator({ tokenData, isOpen, onClose }: SocialShowcaseGeneratorProps) {
  const { toast } = useToast();
  const [customMessage, setCustomMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("viral");
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = {
    viral: {
      name: "Viral Hype",
      emoji: "🚀",
      pattern: "Just minted {quantity} '{message}' tokens on @Flutterbye! {value}SMS to blockchain is the future. {url} #FlutterbySZN #SolanaGems"
    },
    casual: {
      name: "Casual Share",
      emoji: "💫",
      pattern: "Turned my message '{message}' into {quantity} tokens using @Flutterbye{value} Pretty cool tech! {url}"
    },
    technical: {
      name: "Technical Deep",
      emoji: "🔧",
      pattern: "Created {quantity} SPL tokens from 27-char message '{message}' on Solana via @Flutterbye{value} SMS-to-blockchain bridge is revolutionary. {url}"
    },
    meme: {
      name: "Meme Mode",
      emoji: "🐸",
      pattern: "wen moon? wen lambo? wen '{message}' tokens? NOW! {quantity} minted on @Flutterbye{value} {url} probably nothing 👀"
    },
    achievement: {
      name: "Achievement",
      emoji: "🏆",
      pattern: "ACHIEVEMENT UNLOCKED: Minted {quantity} '{message}' tokens on @Flutterbye!{value} From text to treasure in seconds ⚡ {url}"
    }
  };

  const generateShowcase = async () => {
    if (!tokenData) return;
    
    setIsGenerating(true);
    
    try {
      const template = templates[selectedTemplate as keyof typeof templates];
      const valueText = tokenData.valueAttached ? ` with ${tokenData.valueAttached} SOL attached value! ` : " ";
      const urlText = tokenData.solscanUrl || "flutterbye.com";
      
      const generatedText = template.pattern
        .replace("{quantity}", tokenData.quantity.toLocaleString())
        .replace("{message}", tokenData.message)
        .replace("{value}", valueText)
        .replace("{url}", urlText);
      
      setCustomMessage(generatedText);
      
      toast({
        title: "Showcase generated!",
        description: "Your viral social media post is ready to share",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Post copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please select and copy manually",
        variant: "destructive",
      });
    }
  };

  const shareToTwitter = (text: string) => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
  };

  const downloadAsImage = async () => {
    // Create canvas for social media image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !tokenData) return;

    canvas.width = 1200;
    canvas.height = 630;

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(1, '#EC4899');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('FLUTTERBYE TOKEN', canvas.width / 2, 150);
    
    ctx.font = 'bold 36px Arial';
    ctx.fillText(`"${tokenData.message}"`, canvas.width / 2, 250);
    
    ctx.font = '28px Arial';
    ctx.fillText(`${tokenData.quantity.toLocaleString()} Tokens Minted`, canvas.width / 2, 350);
    
    if (tokenData.valueAttached) {
      ctx.fillText(`${tokenData.valueAttached} SOL Value Attached`, canvas.width / 2, 400);
    }
    
    ctx.font = '24px Arial';
    ctx.fillText('SMS-to-Blockchain Revolution', canvas.width / 2, 500);

    // Download
    const link = document.createElement('a');
    link.download = `flutterbye-${tokenData.message.replace(/\s+/g, '-')}-showcase.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast({
      title: "Image downloaded!",
      description: "Your showcase image is ready to share",
    });
  };

  if (!isOpen || !tokenData) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Social Media Showcase Generator
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Token Preview */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Your Token</h3>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                {tokenData.quantity.toLocaleString()} Tokens
              </Badge>
            </div>
            <p className="text-2xl font-bold mb-2">"{tokenData.message}"</p>
            {tokenData.valueAttached && (
              <p className="text-sm text-muted-foreground">
                💰 {tokenData.valueAttached} SOL value attached
              </p>
            )}
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <Label>Choose Your Vibe</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(templates).map(([key, template]) => (
                <Button
                  key={key}
                  variant={selectedTemplate === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTemplate(key)}
                  className="flex items-center gap-2"
                >
                  <span>{template.emoji}</span>
                  <span className="text-xs">{template.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generateShowcase} 
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Viral Post"}
          </Button>

          {/* Generated Content */}
          {customMessage && (
            <div className="space-y-4">
              <Separator />
              <div className="space-y-3">
                <Label>Your Viral Post</Label>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
                  <p className="text-sm whitespace-pre-wrap">{customMessage}</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(customMessage)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Text
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => shareToTwitter(customMessage)}
                    className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Tweet
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={downloadAsImage}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Image
                  </Button>
                </div>
              </div>

              {/* Engagement Tips */}
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Engagement Tips
                </h4>
                <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                  <li>• Tag friends who would love Flutterbye</li>
                  <li>• Post during peak hours (9-11 AM, 1-3 PM)</li>
                  <li>• Use trending hashtags: #SolanaGems #Web3 #TokenizeEverything</li>
                  <li>• Share your Solscan link for credibility</li>
                  <li>• Engage with comments quickly for algorithm boost</li>
                </ul>
              </div>
            </div>
          )}

          {/* Custom Message Editor */}
          <div className="space-y-3">
            <Label>Customize Your Message</Label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Write your own custom message or use the generator above..."
              className="w-full p-3 border rounded-lg min-h-[100px] resize-y"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{customMessage.length} characters</span>
              <span>Optimal: 120-280 characters</span>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}