import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Coins, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export default function MintBasic() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [value, setValue] = useState("");

  const createTokenMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/tokens", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Basic token created successfully",
      });
      // Reset form
      setMessage("");
      setMintAmount("");
      setValue("");
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
      tokenType: "basic"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Coins className="h-10 w-10 text-electric-blue" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
              Create Basic Token
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple message tokens with value attachment - perfect for straightforward communication
          </p>
        </div>

        {/* Creation Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-electric-blue" />
              Basic Token Details
            </CardTitle>
            <CardDescription>
              Create a simple token with your message and value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="message">Token Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message..."
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
                className="w-full bg-electric-blue hover:bg-electric-blue/80"
                disabled={createTokenMutation.isPending}
              >
                {createTokenMutation.isPending ? "Creating Token..." : "Create Basic Token"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}