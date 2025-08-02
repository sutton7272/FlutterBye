import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Coins, Sparkles, Zap } from "lucide-react";

export default function MintMinimal() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  
  const remainingChars = 27 - message.length;

  const handleMint = () => {
    toast({
      title: "Mint Feature",
      description: "Token minting functionality ready for integration",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <Sparkles className="inline w-8 h-8 mr-2 text-electric-blue" />
            Create Your Token
          </h1>
          <p className="text-gray-300">Transform your message into a blockchain asset</p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column - Essential Features */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-electric-blue/30">
              <CardHeader>
                <CardTitle className="text-electric-blue flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Token Creation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="message" className="text-electric-blue font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Message (Max 27 characters)
                    </Label>
                    <Badge variant={remainingChars < 0 ? "destructive" : "secondary"} className="border-electric-blue/50">
                      {remainingChars}/27
                    </Badge>
                  </div>
                  <Input
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={27}
                    required
                    placeholder="StakeNowForYield"
                    className={`${remainingChars < 0 ? "border-destructive" : "border-electric-blue/50"} bg-black/40 text-white placeholder:text-gray-400 focus:border-electric-green focus:ring-electric-green/20`}
                  />
                  <p className="text-xs text-electric-blue/80 mt-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Your message becomes the token name with FLBY-MSG symbol
                  </p>
                </div>

                <div>
                  <Label htmlFor="mintAmount">Amount</Label>
                  <Input
                    id="mintAmount"
                    type="number"
                    min="1"
                    step="1"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    required
                    placeholder="100"
                    className="bg-black/40 text-white border-electric-blue/50 focus:border-electric-green"
                  />
                </div>

                <Button 
                  onClick={handleMint}
                  className="w-full bg-gradient-to-r from-electric-blue to-electric-green hover:from-electric-blue/80 hover:to-electric-green/80 text-white font-semibold py-3"
                  disabled={!message || !mintAmount}
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Create Token
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Advanced Features */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-electric-green/30">
              <CardHeader>
                <CardTitle className="text-electric-green">Token Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 border border-electric-green/30 rounded-lg bg-black/20">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-electric-blue to-electric-green rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {message || "Your Message Here"}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">FLBY-MSG Token</p>
                  <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/50">
                    {mintAmount || "0"} Tokens
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}