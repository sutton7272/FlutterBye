import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Smartphone, Heart, Zap, Timer, Flame } from "lucide-react";

export function SmsIntegrationPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // SMS Analytics Query
  const { data: smsAnalytics } = useQuery({
    queryKey: ["/api/admin/sms/analytics"],
  });

  // Register phone mutation
  const registerMutation = useMutation({
    mutationFn: async (data: { phoneNumber: string; walletAddress: string }) => {
      const response = await fetch("/api/sms/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to register");
      return response.json();
    },
    onSuccess: () => {
      setShowVerification(true);
      toast({
        title: "Registration Started",
        description: "Check your phone for a verification code",
      });
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Verify phone mutation
  const verifyMutation = useMutation({
    mutationFn: async (data: { phoneNumber: string; verificationCode: string }) => {
      const response = await fetch("/api/sms/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to verify");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Phone Verified!",
        description: "You can now receive emotional tokens via SMS",
      });
      setShowVerification(false);
      setPhoneNumber("");
      setWalletAddress("");
      setVerificationCode("");
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Test SMS mutation
  const testSmsMutation = useMutation({
    mutationFn: async (data: { fromPhone: string; toPhone: string; message: string }) => {
      const response = await fetch("/api/sms/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to send test SMS");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Test SMS Sent",
        description: "Check the console for processing details",
      });
    },
  });

  const handleRegister = () => {
    if (!phoneNumber || !walletAddress) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone number and wallet address",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate({ phoneNumber, walletAddress });
  };

  const handleVerify = () => {
    if (!verificationCode) {
      toast({
        title: "Missing Code",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }
    verifyMutation.mutate({ phoneNumber, verificationCode });
  };

  const handleTestSms = () => {
    testSmsMutation.mutate({
      fromPhone: "+1234567890",
      toPhone: "+1987654321",
      message: "I'm sending you a hug 🫂 Hope you're doing well!"
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">SMS-to-Blockchain Integration</h1>
          <p className="text-xl text-purple-200">
            Text someone a message, and it arrives in their crypto wallet as a time-locked, emotional token
          </p>
          <div className="flex items-center justify-center space-x-2 text-green-300">
            <Smartphone className="h-5 w-5" />
            <span className="font-mono text-lg">+1 (844) BYE-TEXT</span>
          </div>
        </div>

        {/* How It Works */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="bg-blue-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Text Message</h3>
                <p className="text-sm text-gray-300">Send a message to +1 (844) BYE-TEXT</p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-purple-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Auto-Mint</h3>
                <p className="text-sm text-gray-300">Message becomes a tokenized note</p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-green-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Notification</h3>
                <p className="text-sm text-gray-300">Recipient gets blockchain link</p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-red-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Emotional Token</h3>
                <p className="text-sm text-gray-300">Time-locked, burn-to-read features</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emotional Features */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Emotional Token Features</CardTitle>
            <CardDescription className="text-purple-200">
              Your messages become interactive blockchain artifacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-orange-500/20 rounded-lg p-4 text-center">
                <Timer className="h-8 w-8 mx-auto mb-2 text-orange-300" />
                <h3 className="text-white font-semibold">Time-Locked</h3>
                <p className="text-orange-200 text-sm">Unlock after specific time</p>
              </div>
              <div className="bg-red-500/20 rounded-lg p-4 text-center">
                <Flame className="h-8 w-8 mx-auto mb-2 text-red-300" />
                <h3 className="text-white font-semibold">Burn-to-Read</h3>
                <p className="text-red-200 text-sm">Destroy token to reveal message</p>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-4 text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                <h3 className="text-white font-semibold">Reply-Gated</h3>
                <p className="text-blue-200 text-sm">Requires response to unlock</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phone Registration */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Register Your Phone</CardTitle>
            <CardDescription className="text-purple-200">
              Connect your phone number to your wallet to receive emotional tokens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showVerification ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wallet" className="text-white">Wallet Address</Label>
                  <Input
                    id="wallet"
                    placeholder="Your Solana wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button 
                    onClick={handleRegister}
                    disabled={registerMutation.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {registerMutation.isPending ? "Registering..." : "Register Phone Number"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-white">Verification Code</Label>
                  <Input
                    id="code"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleVerify}
                    disabled={verifyMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {verifyMutation.isPending ? "Verifying..." : "Verify"}
                  </Button>
                  <Button 
                    onClick={() => setShowVerification(false)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Development Testing */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Development Testing</CardTitle>
            <CardDescription className="text-purple-200">
              Test the SMS-to-blockchain functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleTestSms}
              disabled={testSmsMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {testSmsMutation.isPending ? "Sending..." : "Send Test SMS"}
            </Button>
            <p className="text-sm text-gray-300 mt-2">
              This will simulate an incoming SMS with emotional content
            </p>
          </CardContent>
        </Card>

        {/* SMS Analytics */}
        {smsAnalytics && typeof smsAnalytics === 'object' && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">SMS Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-300">{(smsAnalytics as any)?.totalMessages || 0}</div>
                  <div className="text-sm text-gray-300">Total Messages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-300">{(smsAnalytics as any)?.emotionBreakdown?.length || 0}</div>
                  <div className="text-sm text-gray-300">Emotion Types</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300">{(smsAnalytics as any)?.recentMessages?.length || 0}</div>
                  <div className="text-sm text-gray-300">Recent Activity</div>
                </div>
              </div>
              
              {(smsAnalytics as any)?.emotionBreakdown && (smsAnalytics as any).emotionBreakdown.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-3">Emotion Breakdown</h4>
                  <div className="flex flex-wrap gap-2">
                    {(smsAnalytics as any).emotionBreakdown.map((emotion: any, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-white/20 text-white">
                        {emotion.emotionType}: {emotion.count}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Vision Statement */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-white/20">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              The Future of Emotional Communication
            </h2>
            <p className="text-purple-200 text-lg leading-relaxed max-w-3xl mx-auto">
              You're not just texting someone — you're dropping an artifact into their emotional memory, 
              minted forever or destroyed on sight. Suddenly, texting becomes a crypto onboarding funnel, 
              a real-world delivery system for feelings, and a wallet-native communication layer.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}