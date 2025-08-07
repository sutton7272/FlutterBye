import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  Coins, 
  Send, 
  Gift,
  Target,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Zap,
  Brain
} from "lucide-react";

export default function FlutterbeyeMessages() {
  const [message, setMessage] = useState("");
  const [attachedValue, setAttachedValue] = useState("");
  const [expirationDays, setExpirationDays] = useState("7");

  const handleCreateMessage = () => {
    console.log("Creating message:", { message, attachedValue, expirationDays });
    // Integration with token creation API
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-gradient">Flutterbye Messages</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Revolutionary 27-character blockchain messaging with attached value
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="outline" className="px-4 py-2">
              <Coins className="w-4 h-4 mr-2" />
              Blockchain Messages
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              Targeted Distribution
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <DollarSign className="w-4 h-4 mr-2" />
              Value Attachment
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Message Creation Form */}
          <Card className="electric-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Create Message Token
              </CardTitle>
              <CardDescription>
                Create a 27-character message with redeemable value
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="message">Message (Max 27 characters)</Label>
                <Input
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 27))}
                  placeholder="Enter your message..."
                  className="electric-border"
                />
                <div className="text-sm text-muted-foreground mt-1">
                  {message.length}/27 characters
                </div>
              </div>

              <div>
                <Label htmlFor="value">Attached Value (SOL)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.001"
                  value={attachedValue}
                  onChange={(e) => setAttachedValue(e.target.value)}
                  placeholder="0.1"
                  className="electric-border"
                />
              </div>

              <div>
                <Label htmlFor="expiration">Expiration (Days)</Label>
                <Input
                  id="expiration"
                  type="number"
                  value={expirationDays}
                  onChange={(e) => setExpirationDays(e.target.value)}
                  className="electric-border"
                />
              </div>

              <Button 
                onClick={handleCreateMessage}
                className="w-full electric-glow"
                disabled={!message || message.length === 0}
              >
                <Zap className="w-4 h-4 mr-2" />
                Create Message Token
              </Button>
            </CardContent>
          </Card>

          {/* Live Statistics */}
          <Card className="electric-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Platform Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-electric-blue">1,247</div>
                  <div className="text-sm text-muted-foreground">Messages Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-electric-green">89.3 SOL</div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-electric-blue">743</div>
                  <div className="text-sm text-muted-foreground">Redeemed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-electric-green">2,891</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Showcase */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="electric-border hover-lift">
            <CardHeader>
              <Target className="w-8 h-8 text-electric-blue mb-2" />
              <CardTitle>Targeted Messaging</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Send messages to specific wallet holders with precision targeting
              </p>
              <Link href="/enterprise-campaigns">
                <Button variant="outline" className="w-full">
                  Enterprise Campaigns
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="electric-border hover-lift">
            <CardHeader>
              <Gift className="w-8 h-8 text-electric-green mb-2" />
              <CardTitle>Value Redemption</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Discover and redeem message tokens with attached value
              </p>
              <Link href="/redeem">
                <Button variant="outline" className="w-full">
                  Redeem Messages
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="electric-border hover-lift">
            <CardHeader>
              <Brain className="w-8 h-8 text-electric-purple mb-2" />
              <CardTitle>AI Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                AI-powered wallet analysis and targeting recommendations
              </p>
              <Link href="/flutterai">
                <Button variant="outline" className="w-full">
                  FlutterAI Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="electric-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common Flutterbye Messages operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/create">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Send className="w-6 h-6" />
                  <span>Create Basic</span>
                </Button>
              </Link>
              
              <Link href="/campaign-builder">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Target className="w-6 h-6" />
                  <span>Campaign Builder</span>
                </Button>
              </Link>
              
              <Link href="/redeem">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Gift className="w-6 h-6" />
                  <span>Redeem Tokens</span>
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Users className="w-6 h-6" />
                  <span>My Portfolio</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}