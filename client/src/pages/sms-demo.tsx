import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Smartphone, Heart, Clock, Flame, Shield, ArrowRight, Sparkles } from "lucide-react";

export function SMSDemoPage() {
  const [testMessage, setTestMessage] = useState("I'm sending you a hug 🫂 Hope you're doing well!");
  const [fromPhone, setFromPhone] = useState("+1234567890");
  const [toPhone, setToPhone] = useState("+1987654321");
  const [lastResult, setLastResult] = useState<any>(null);
  const { toast } = useToast();

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
    onSuccess: (data) => {
      setLastResult(data.tokenData);
      toast({
        title: "SMS Processed Successfully!",
        description: "Your message has been converted to an emotional token",
      });
    },
    onError: (error) => {
      toast({
        title: "Processing Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTestSms = () => {
    if (!testMessage.trim()) {
      toast({
        title: "Missing Message",
        description: "Please enter a message to test",
        variant: "destructive",
      });
      return;
    }
    testSmsMutation.mutate({ fromPhone, toPhone, message: testMessage });
  };

  const emotionExamples = [
    { text: "I love you so much! ❤️", emotion: "love", features: ["Emotion: Love", "Value: 0.02 SOL"] },
    { text: "Sorry for what happened earlier 😢", emotion: "sorry", features: ["Emotion: Sorry", "Value: 0.025 SOL"] },
    { text: "Congratulations on your promotion! 🎉", emotion: "celebration", features: ["Emotion: Celebration", "Value: 0.025 SOL"] },
    { text: "I'll tell you later about the surprise", emotion: "message", features: ["Time-locked", "Contains 'later'"] },
    { text: "This is private just between us", emotion: "message", features: ["Burn-to-read", "Contains 'private'"] },
    { text: "Please reply when you get this", emotion: "message", features: ["Reply-required", "Contains 'reply'"] },
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">SMS-to-Message Demo</h1>
          <p className="text-xl text-purple-200">
            Experience how text messages transform into emotional blockchain tokens
          </p>
          <div className="flex items-center justify-center space-x-2 text-green-300">
            <Smartphone className="h-5 w-5" />
            <span className="font-mono text-lg">Text → Blockchain → Emotion</span>
          </div>
        </div>

        {/* Interactive Demo */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              Live SMS Demo
            </CardTitle>
            <CardDescription className="text-purple-200">
              Test the SMS-to-blockchain conversion in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from" className="text-white">From Phone</Label>
                <Input
                  id="from"
                  value={fromPhone}
                  onChange={(e) => setFromPhone(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to" className="text-white">To Phone</Label>
                <Input
                  id="to"
                  value={toPhone}
                  onChange={(e) => setToPhone(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">Message</Label>
              <Textarea
                id="message"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                placeholder="Type your emotional message here..."
              />
            </div>

            <Button 
              onClick={handleTestSms}
              disabled={testSmsMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
              size="lg"
            >
              {testSmsMutation.isPending ? (
                <>Processing Message...</>
              ) : (
                <>
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Convert to Emotional Token
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result Display */}
        {lastResult && (
          <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-sm border-green-400/30">
            <CardHeader>
              <CardTitle className="text-green-300 flex items-center gap-2">
                <Heart className="h-6 w-6" />
                Token Created Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-300">Message:</span>
                    <p className="text-white font-semibold text-lg">{lastResult.message}</p>
                  </div>
                  <div>
                    <span className="text-gray-300">Emotion Type:</span>
                    <Badge variant="secondary" className="ml-2 bg-purple-600/20 text-purple-200">
                      {lastResult.emotionType}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-300">Value:</span>
                    <span className="text-green-300 font-bold ml-2">{lastResult.valuePerToken} SOL</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {lastResult.isTimeLocked && (
                      <Badge className="bg-orange-600/20 text-orange-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Time-Locked
                      </Badge>
                    )}
                    {lastResult.isBurnToRead && (
                      <Badge className="bg-red-600/20 text-red-200">
                        <Flame className="h-3 w-3 mr-1" />
                        Burn-to-Read
                      </Badge>
                    )}
                    {lastResult.requiresReply && (
                      <Badge className="bg-blue-600/20 text-blue-200">
                        <Shield className="h-3 w-3 mr-1" />
                        Reply-Required
                      </Badge>
                    )}
                  </div>
                  
                  {lastResult.metadata && (
                    <div>
                      <span className="text-gray-300">Emoji:</span>
                      <span className="text-2xl ml-2">{lastResult.metadata.emotionData?.emoji}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Example Messages */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Try These Examples</CardTitle>
            <CardDescription className="text-purple-200">
              Click any example to test different emotional token types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {emotionExamples.map((example, index) => (
                <div
                  key={index}
                  onClick={() => setTestMessage(example.text)}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-white group-hover:text-purple-200 transition-colors">
                      "{example.text}"
                    </p>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-300 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {example.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="outline" className="text-xs border-white/20 text-gray-300">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">How SMS-to-Blockchain Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <MessageSquare className="h-8 w-8 text-blue-300" />
                </div>
                <h3 className="text-white font-semibold">1. Send SMS</h3>
                <p className="text-gray-300 text-sm">Text your message to the Flutterbye number</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-purple-300" />
                </div>
                <h3 className="text-white font-semibold">2. Emotion Analysis</h3>
                <p className="text-gray-300 text-sm">AI analyzes emotional content and context</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-green-300" />
                </div>
                <h3 className="text-white font-semibold">3. Token Creation</h3>
                <p className="text-gray-300 text-sm">Message becomes a blockchain token with value</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="bg-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Smartphone className="h-8 w-8 text-yellow-300" />
                </div>
                <h3 className="text-white font-semibold">4. Delivery</h3>
                <p className="text-gray-300 text-sm">Recipient gets notification with blockchain link</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-400/30">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-orange-300" />
              <h3 className="text-white font-semibold text-xl mb-2">Time-Locked Messages</h3>
              <p className="text-orange-200">Messages unlock after a specific time, adding anticipation and surprise</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-900/20 to-pink-900/20 border-red-400/30">
            <CardContent className="p-6 text-center">
              <Flame className="h-12 w-12 mx-auto mb-4 text-red-300" />
              <h3 className="text-white font-semibold text-xl mb-2">Burn-to-Read</h3>
              <p className="text-red-200">Destroy the token to reveal the message, creating unique intimacy</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-400/30">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-blue-300" />
              <h3 className="text-white font-semibold text-xl mb-2">Reply-Gated</h3>
              <p className="text-blue-200">Message unlocks only when recipient replies, ensuring engagement</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}