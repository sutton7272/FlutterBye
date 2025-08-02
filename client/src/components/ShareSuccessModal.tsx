import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Twitter, Facebook, Link, Sparkles, Ticket, Gift } from "lucide-react";

interface ShareSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  mintData: {
    message: string;
    amount: string;
    type: string;
    wasFreeMint?: boolean;
    redemptionCode?: string;
    transactionUrl?: string;
  };
}

export function ShareSuccessModal({
  isOpen,
  onClose,
  mintData
}: ShareSuccessModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Generate share messages
  const shareMessages = {
    twitter: `🎉 Just minted "${mintData.message}" on @Flutterbye ${mintData.wasFreeMint ? 'for FREE using a redemption code! 🎫' : '🚀'}\n\nJoin the tokenized messaging revolution on Solana! 💎\n\n#Flutterbye #Solana #Web3 #Blockchain`,
    
    facebook: `I just created a tokenized message "${mintData.message}" on Flutterbye! ${mintData.wasFreeMint ? 'Used a free minting code and paid zero fees! 🎫' : ''} This is the future of communication on blockchain. Check it out!`,
    
    generic: `🎉 Just minted "${mintData.message}" on Flutterbye! ${mintData.wasFreeMint ? 'Free minting with redemption code! 🎫' : ''}\n\nExperience tokenized messaging on Solana blockchain.\n\nTry it: ${window.location.origin}`
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessages.twitter)}&url=${encodeURIComponent(window.location.origin)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareMessages.facebook)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent('Flutterbye - Tokenized Messaging')}&summary=${encodeURIComponent(shareMessages.generic)}`
  };

  const handleCopyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareMessages.generic);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "Share text copied. Paste it anywhere to spread the word!",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please select and copy the text manually.",
        variant: "destructive",
      });
    }
  };

  const handleSocialShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      toast({
        title: "Link copied!",
        description: "Flutterbye link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md glassmorphism border-electric-blue/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold gradient-text">
            <Share2 className="w-6 h-6 text-electric-blue" />
            Share Your Success!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Success Summary */}
          <div className="p-4 bg-gradient-to-r from-electric-blue/10 to-electric-green/10 rounded-lg border border-electric-blue/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-electric-green" />
              <span className="font-semibold text-electric-blue">Mint Successful!</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">"{mintData.message}"</p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                {mintData.amount}
              </Badge>
              {mintData.wasFreeMint && (
                <Badge variant="secondary" className="bg-electric-green/20 text-electric-green border-electric-green/30">
                  <Ticket className="w-3 h-3 mr-1" />
                  FREE MINT
                </Badge>
              )}
            </div>
          </div>

          {/* Share Text */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Share Message:</label>
            <div className="relative">
              <textarea
                value={shareMessages.generic}
                readOnly
                className="w-full p-3 bg-slate-800/50 border border-electric-blue/30 rounded-lg text-sm text-gray-300 resize-none h-24"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyShareText}
                className="absolute top-2 right-2 h-6 w-6 p-0"
              >
                {copied ? (
                  <div className="w-4 h-4 text-electric-green">✓</div>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Share on Social Media:</label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialShare('twitter')}
                className="flex flex-col items-center gap-2 h-16 border-electric-blue/30 hover:bg-electric-blue/10"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare('facebook')}
                className="flex flex-col items-center gap-2 h-16 border-electric-blue/30 hover:bg-electric-blue/10"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare('linkedin')}
                className="flex flex-col items-center gap-2 h-16 border-electric-blue/30 hover:bg-electric-blue/10"
              >
                <div className="w-5 h-5 bg-blue-700 rounded text-white flex items-center justify-center text-xs font-bold">in</div>
                <span className="text-xs">LinkedIn</span>
              </Button>
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Or copy link:</label>
            <div className="flex gap-2">
              <Input
                value={window.location.origin}
                readOnly
                className="flex-1 bg-slate-800/50 border-electric-blue/30"
              />
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="border-electric-blue/30 hover:bg-electric-blue/10"
              >
                <Link className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Referral Incentive */}
          {mintData.wasFreeMint && (
            <div className="p-3 bg-gradient-to-r from-electric-green/10 to-yellow-500/10 rounded-lg border border-electric-green/20">
              <div className="flex items-center gap-2 mb-1">
                <Gift className="w-4 h-4 text-electric-green" />
                <span className="text-sm font-semibold text-electric-green">Bonus Tip!</span>
              </div>
              <p className="text-xs text-gray-300">
                Share your free mint experience to help others discover redemption codes and free minting opportunities!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-electric-blue/30 hover:bg-electric-blue/10"
            >
              Close
            </Button>
            <Button
              onClick={() => handleSocialShare('twitter')}
              className="flex-1 bg-gradient-to-r from-electric-blue to-electric-green hover:from-electric-blue/80 hover:to-electric-green/80"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Share Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}