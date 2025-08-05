import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Heart, Music, Radio } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { VoiceMessageRecorder } from "@/components/voice-message-recorder";

export default function MintVoice() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [value, setValue] = useState("");
  const [voiceAttachment, setVoiceAttachment] = useState<Blob | null>(null);

  const createTokenMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/tokens", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Voice token created successfully",
      });
      // Reset form
      setMessage("");
      setMintAmount("");
      setValue("");
      setVoiceAttachment(null);
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
      tokenType: "voice",
      hasVoiceAttachment: !!voiceAttachment
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Mic className="h-10 w-10 text-electric-green" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-green to-electric-blue bg-clip-text text-transparent">
              Create Voice Token
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Audio-powered emotional tokens with voice recording and emotion analysis
          </p>
        </div>

        {/* Voice Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Mic className="h-8 w-8 text-electric-green mx-auto mb-2" />
              <h3 className="font-semibold">Voice Recording</h3>
              <p className="text-sm text-muted-foreground">Record your emotional message</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <h3 className="font-semibold">Emotion Analysis</h3>
              <p className="text-sm text-muted-foreground">AI analyzes emotional content</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Music className="h-8 w-8 text-purple mx-auto mb-2" />
              <h3 className="font-semibold">Audio NFT</h3>
              <p className="text-sm text-muted-foreground">Voice becomes unique NFT</p>
            </CardContent>
          </Card>
        </div>

        {/* Creation Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-electric-green" />
              Voice Token Details
            </CardTitle>
            <CardDescription>
              Create a token with voice message and emotional analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Voice Recording Section */}
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Radio className="h-5 w-5 text-electric-green" />
                    Voice Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VoiceMessageRecorder 
                    onVoiceAttached={(audioData: { url: string; duration: number; type: "voice" | "music"; audioData?: string }) => {
                      setVoiceAttachment(new Blob()); // placeholder for actual implementation
                      toast({
                        title: "Voice Recorded",
                        description: "Voice message attached successfully",
                      });
                    }} 
                  />
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="message">Token Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message (this will accompany your voice recording)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
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
                    placeholder="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    min="0"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-electric-green hover:bg-electric-green/80"
                disabled={createTokenMutation.isPending}
              >
                {createTokenMutation.isPending ? "Creating Voice Token..." : "Create Voice Token"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}