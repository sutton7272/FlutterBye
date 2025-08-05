import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Zap, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import AITextOptimizer from "@/components/ai-text-optimizer";

export default function MintAIEnhanced() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [value, setValue] = useState("");
  const [aiOptimized, setAiOptimized] = useState(false);

  const createTokenMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/tokens", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "AI-Enhanced token created successfully",
      });
      // Reset form
      setMessage("");
      setMintAmount("");
      setValue("");
      setAiOptimized(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create token",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !mintAmount || !value) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createTokenMutation.mutate({
      message: message.trim(),
      initialSupply: parseInt(mintAmount),
      value: parseFloat(value),
      tokenType: "ai-enhanced",
      aiOptimized
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Brain className="h-10 w-10 text-purple" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple to-electric-blue bg-clip-text text-transparent">
              Create AI-Enhanced Token
            </h1>
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold">
              RECOMMENDED
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Smart tokens with AI optimization for maximum viral potential and engagement
          </p>
        </div>

        {/* AI Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Sparkles className="h-8 w-8 text-purple mx-auto mb-2" />
              <h3 className="font-semibold">AI Message Optimization</h3>
              <p className="text-sm text-muted-foreground">Enhance your message for maximum impact</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-electric-green mx-auto mb-2" />
              <h3 className="font-semibold">Viral Prediction</h3>
              <p className="text-sm text-muted-foreground">AI predicts viral potential</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="font-semibold">Smart Pricing</h3>
              <p className="text-sm text-muted-foreground">AI-recommended optimal pricing</p>
            </CardContent>
          </Card>
        </div>

        {/* Creation Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple" />
              AI-Enhanced Token Details
            </CardTitle>
            <CardDescription>
              Create an intelligent token with AI-powered features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="message">Token Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message... (AI will optimize it)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
                {message && (
                  <AITextOptimizer 
                    onOptimizedTextSelect={(optimizedText: string) => {
                      setMessage(optimizedText);
                      setAiOptimized(true);
                    }} 
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mintAmount">Token Quantity *</Label>
                  <Input
                    id="mintAmount"
                    type="number"
                    placeholder="1000"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Token Value (SOL) *</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.001"
                    placeholder="0.01 (AI will suggest optimal price)"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    min="0"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-purple hover:bg-purple/80"
                disabled={createTokenMutation.isPending}
              >
                {createTokenMutation.isPending ? "Creating AI-Enhanced Token..." : "Create AI-Enhanced Token"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}