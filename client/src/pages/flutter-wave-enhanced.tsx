import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Link } from "wouter";
import { 
  Waves, 
  MessageSquare, 
  Heart,
  Brain,
  Smartphone,
  Globe,
  Zap,
  Users,
  TrendingUp,
  Bot,
  Target,
  Send,
  PhoneCall,
  Mail,
  BarChart3
} from "lucide-react";

export default function FlutterWaveEnhanced() {
  const [smsMessage, setSmsMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emotionalIntensity, setEmotionalIntensity] = useState(50);
  const [autoTokenCreate, setAutoTokenCreate] = useState(true);
  const [viralBoost, setViralBoost] = useState(false);

  const handleSendSMS = () => {
    console.log("Sending SMS:", { smsMessage, phoneNumber, emotionalIntensity, autoTokenCreate, viralBoost });
    // Integration with SMS to blockchain API
  };

  const emotionalCategories = [
    { name: "Love & Romance", icon: "❤️", count: 1247, color: "text-red-400" },
    { name: "Friendship", icon: "🤝", count: 892, color: "text-blue-400" },
    { name: "Celebration", icon: "🎉", count: 634, color: "text-yellow-400" },
    { name: "Support", icon: "🤗", count: 456, color: "text-green-400" },
    { name: "Motivation", icon: "💪", count: 723, color: "text-purple-400" },
    { name: "Gratitude", icon: "🙏", count: 567, color: "text-pink-400" }
  ];

  const recentTokens = [
    {
      id: 1,
      message: "miss u so much babe ❤️",
      sentiment: "Love",
      value: "0.05 SOL",
      timestamp: "2 mins ago",
      viral_score: 85
    },
    {
      id: 2,
      message: "thanks for everything mom",
      sentiment: "Gratitude",
      value: "0.12 SOL",
      timestamp: "5 mins ago",
      viral_score: 92
    },
    {
      id: 3,
      message: "you got this! 💪",
      sentiment: "Motivation",
      value: "0.03 SOL",
      timestamp: "8 mins ago",
      viral_score: 78
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-gradient">FlutterWave</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform SMS messages into valuable blockchain tokens with AI-powered emotional intelligence
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="outline" className="px-4 py-2">
              <Smartphone className="w-4 h-4 mr-2" />
              SMS Integration
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              Emotional AI
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Viral Prediction
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Waves className="w-4 h-4 mr-2" />
              Real-time Processing
            </Badge>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="electric-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-electric-blue">47,891</div>
              <div className="text-sm text-muted-foreground">SMS Processed</div>
            </CardContent>
          </Card>
          <Card className="electric-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-electric-green">234.7 SOL</div>
              <div className="text-sm text-muted-foreground">Tokens Created</div>
            </CardContent>
          </Card>
          <Card className="electric-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-electric-purple">89.3%</div>
              <div className="text-sm text-muted-foreground">Emotion Accuracy</div>
            </CardContent>
          </Card>
          <Card className="electric-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-electric-blue">12,456</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* SMS to Token Converter */}
          <Card className="electric-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                SMS to Token Converter
              </CardTitle>
              <CardDescription>
                Transform emotional SMS messages into valuable blockchain tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="electric-border"
                />
              </div>

              <div>
                <Label htmlFor="sms">SMS Message</Label>
                <Textarea
                  id="sms"
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Type your heartfelt message..."
                  className="electric-border min-h-[100px]"
                />
                <div className="text-sm text-muted-foreground mt-1">
                  {smsMessage.length}/160 characters
                </div>
              </div>

              <div>
                <Label>Emotional Intensity: {emotionalIntensity}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={emotionalIntensity}
                  onChange={(e) => setEmotionalIntensity(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-token">Auto-create Token</Label>
                <Switch
                  id="auto-token"
                  checked={autoTokenCreate}
                  onCheckedChange={setAutoTokenCreate}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="viral-boost">Viral Boost</Label>
                <Switch
                  id="viral-boost"
                  checked={viralBoost}
                  onCheckedChange={setViralBoost}
                />
              </div>

              <Button 
                onClick={handleSendSMS}
                className="w-full electric-glow"
                disabled={!smsMessage || !phoneNumber}
              >
                <Zap className="w-4 h-4 mr-2" />
                Send & Tokenize
              </Button>
            </CardContent>
          </Card>

          {/* AI Emotional Analysis */}
          <Card className="electric-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Emotional Analysis
              </CardTitle>
              <CardDescription>
                Real-time emotional intelligence and sentiment processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-2">Detected Emotions:</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Love (45%)</Badge>
                    <Badge variant="secondary">Joy (30%)</Badge>
                    <Badge variant="secondary">Nostalgia (25%)</Badge>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-2">Viral Potential:</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div className="bg-electric-blue h-2 rounded-full" style={{width: `${emotionalIntensity}%`}}></div>
                    </div>
                    <span className="text-sm">{emotionalIntensity}%</span>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-2">Token Value Estimate:</div>
                  <div className="text-lg font-bold text-electric-green">
                    {(emotionalIntensity * 0.001).toFixed(3)} SOL
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-2">Recommended Actions:</div>
                  <ul className="text-sm space-y-1">
                    <li>• Add emoji for higher engagement</li>
                    <li>• Consider timing for viral boost</li>
                    <li>• Target specific demographics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emotional Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Emotional Categories</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {emotionalCategories.map((category, index) => (
              <Card key={index} className="electric-border hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <div className={`text-2xl font-bold ${category.color}`}>
                    {category.count.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">tokens created</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Token Creations */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Recent Token Creations</h2>
          <div className="space-y-4">
            {recentTokens.map((token) => (
              <Card key={token.id} className="electric-border hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium mb-1">"{token.message}"</div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{token.sentiment}</span>
                        <span>{token.timestamp}</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>Viral Score: {token.viral_score}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-electric-green">{token.value}</div>
                      <div className="text-sm text-muted-foreground">Token Value</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="electric-border hover-lift">
            <CardHeader>
              <Bot className="w-8 h-8 text-electric-blue mb-2" />
              <CardTitle>Marketing Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                AI-powered marketing campaigns through SMS integration
              </p>
              <Link href="/ai-marketing-bot">
                <Button variant="outline" className="w-full">
                  Marketing Bot
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="electric-border hover-lift">
            <CardHeader>
              <Target className="w-8 h-8 text-electric-green mb-2" />
              <CardTitle>SMS Nexus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Advanced SMS features with blockchain integration
              </p>
              <Link href="/sms-nexus">
                <Button variant="outline" className="w-full">
                  Explore Nexus
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="electric-border hover-lift">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-electric-purple mb-2" />
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Track SMS performance, engagement, and token metrics
              </p>
              <Button variant="outline" className="w-full">
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="electric-border">
          <CardHeader>
            <CardTitle>FlutterWave Features</CardTitle>
            <CardDescription>
              Complete SMS to blockchain integration ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/sms-demo">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <PhoneCall className="w-6 h-6" />
                  <span>SMS Demo</span>
                  <span className="text-xs text-muted-foreground">Try SMS features</span>
                </Button>
              </Link>
              
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Brain className="w-6 h-6" />
                <span>Emotion AI</span>
                <span className="text-xs text-muted-foreground">Sentiment analysis</span>
              </Button>
              
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <TrendingUp className="w-6 h-6" />
                <span>Viral Boost</span>
                <span className="text-xs text-muted-foreground">Amplify reach</span>
              </Button>
              
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>Community</span>
                <span className="text-xs text-muted-foreground">Connect users</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}