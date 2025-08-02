import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Share2, TrendingUp, Users, Award, Copy, ExternalLink, Heart, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ViralMessage {
  id: string;
  content: string;
  creator: string;
  shares: number;
  likes: number;
  comments: number;
  viralScore: number;
  rewardEarned: number;
  platforms: string[];
  timeAgo: string;
}

const mockViralMessages: ViralMessage[] = [
  {
    id: "1",
    content: "Just minted my first FLBY message! 🚀",
    creator: "CryptoEnthusiast",
    shares: 1240,
    likes: 3890,
    comments: 156,
    viralScore: 92,
    rewardEarned: 45.5,
    platforms: ["Twitter", "Discord", "Telegram"],
    timeAgo: "2h ago"
  },
  {
    id: "2",
    content: "Happy birthday blockchain! 🎂",
    creator: "BlockchainBirthday",
    shares: 890,
    likes: 2340,
    comments: 89,
    viralScore: 78,
    rewardEarned: 28.3,
    platforms: ["Twitter", "Reddit"],
    timeAgo: "5h ago"
  }
];

export default function ViralSharing() {
  const [selectedMessage, setSelectedMessage] = useState<string>("");
  const [customMessage, setCustomMessage] = useState("");
  const { toast } = useToast();

  const handleShare = (platform: string, messageId?: string) => {
    const message = messageId ? `Check out this FLBY message: ${window.location.origin}/message/${messageId}` : customMessage;
    
    // Simulate sharing to different platforms
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(window.location.origin)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent(message)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(message)}`,
      discord: `Share in Discord: ${message}`
    };

    if (platform === 'discord') {
      navigator.clipboard.writeText(`Share in Discord: ${message}`);
      toast({
        title: "Copied to Clipboard!",
        description: "Discord share link copied. Paste it in your Discord server!",
      });
    } else if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
      toast({
        title: "Sharing to " + platform.charAt(0).toUpperCase() + platform.slice(1),
        description: "You'll earn FLBY rewards for viral shares!",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Message link copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
            Viral Sharing Hub
          </h1>
          <p className="text-gray-300">Share your messages across platforms and earn FLBY rewards for viral content!</p>
        </div>

        {/* Sharing Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Shares</p>
                  <p className="text-2xl font-bold text-electric-blue">2,847</p>
                </div>
                <Share2 className="h-8 w-8 text-electric-blue" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Viral Score</p>
                  <p className="text-2xl font-bold text-electric-green">85/100</p>
                </div>
                <TrendingUp className="h-8 w-8 text-electric-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Reach</p>
                  <p className="text-2xl font-bold text-yellow-400">45.2K</p>
                </div>
                <Users className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">FLBY Earned</p>
                  <p className="text-2xl font-bold text-purple-400">127.8</p>
                </div>
                <Award className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Share New Message */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-electric-blue flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Create Custom Share Message</label>
                <Input
                  placeholder="Write your viral message here..."
                  className="bg-gray-700/50 border-gray-600 text-white"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-gray-400 mt-1">{customMessage.length}/100 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Share to Platforms</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => handleShare('twitter')}
                    className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Twitter/X
                  </Button>
                  <Button 
                    onClick={() => handleShare('facebook')}
                    className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button 
                    onClick={() => handleShare('linkedin')}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button 
                    onClick={() => handleShare('reddit')}
                    className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Reddit
                  </Button>
                  <Button 
                    onClick={() => handleShare('telegram')}
                    className="bg-blue-400 hover:bg-blue-500 flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Telegram
                  </Button>
                  <Button 
                    onClick={() => handleShare('discord')}
                    className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Discord
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-electric-blue/20 to-electric-green/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-electric-blue">Viral Rewards System</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 1 FLBY per 100 views from your shares</li>
                  <li>• 5 FLBY per 100 likes/reactions</li>
                  <li>• 10 FLBY per 100 comments/replies</li>
                  <li>• Bonus multipliers for trending messages!</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Viral Leaderboard */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-electric-green flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockViralMessages.map((message, index) => (
                <div key={message.id} className="bg-gray-700/50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-yellow-500 text-black">
                      #{index + 1} Trending
                    </Badge>
                    <span className="text-sm text-gray-400">{message.timeAgo}</span>
                  </div>
                  
                  <p className="font-semibold">{message.content}</p>
                  <p className="text-sm text-gray-400">by @{message.creator}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Viral Score</span>
                      <span className="text-electric-blue font-semibold">{message.viralScore}/100</span>
                    </div>
                    <Progress value={message.viralScore} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Share2 className="h-4 w-4 text-blue-400" />
                        {message.shares}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-400" />
                        {message.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4 text-green-400" />
                        {message.comments}
                      </span>
                    </div>
                    <span className="text-electric-green font-semibold">
                      +{message.rewardEarned} FLBY
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {message.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
                    onClick={() => copyToClipboard(`${window.location.origin}/message/${message.id}`)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share This Message
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Viral Challenges */}
        <Card className="mt-8 bg-gradient-to-r from-purple-800/50 to-blue-800/50 border-purple-700">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Weekly Viral Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                <h4 className="font-semibold mb-2 text-electric-blue">Share Master</h4>
                <p className="text-sm text-gray-300 mb-3">Get 1000+ total shares this week</p>
                <div className="space-y-2">
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-gray-400">650 / 1000 shares</p>
                </div>
                <Badge className="mt-2 bg-electric-blue text-white">500 FLBY Reward</Badge>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                <h4 className="font-semibold mb-2 text-electric-green">Viral Sensation</h4>
                <p className="text-sm text-gray-300 mb-3">Create a message with 90+ viral score</p>
                <div className="space-y-2">
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-gray-400">85 / 90 viral score</p>
                </div>
                <Badge className="mt-2 bg-electric-green text-white">750 FLBY Reward</Badge>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                <h4 className="font-semibold mb-2 text-yellow-400">Platform King</h4>
                <p className="text-sm text-gray-300 mb-3">Share on all 6 platforms</p>
                <div className="space-y-2">
                  <Progress value={50} className="h-2" />
                  <p className="text-xs text-gray-400">3 / 6 platforms</p>
                </div>
                <Badge className="mt-2 bg-yellow-400 text-black">1000 FLBY Reward</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}