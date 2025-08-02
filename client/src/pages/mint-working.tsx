import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Coins, Sparkles, Zap, Star, Users } from "lucide-react";

export default function Mint() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [mintAmount, setMintAmount] = useState("");

  const remainingChars = 27 - message.length;

  const handleMint = () => {
    toast({
      title: "Token Creation",
      description: "Your tokenized message is ready for blockchain deployment!",
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">
            <Sparkles className="inline w-8 h-8 mr-3 text-electric-blue" />
            Token Creation Center
          </h1>
          <p className="text-xl text-gray-300">Transform your message into a blockchain asset</p>
        </div>

        <Tabs defaultValue="individual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-electric-blue/30">
            <TabsTrigger value="individual" className="flex items-center gap-2 text-white data-[state=active]:bg-electric-blue data-[state=active]:text-white">
              <Coins className="w-4 h-4" />
              Individual Token
            </TabsTrigger>
            <TabsTrigger value="limited" className="flex items-center gap-2 text-white data-[state=active]:bg-electric-green data-[state=active]:text-white">
              <Star className="w-4 h-4" />
              Limited Edition
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-6">
            <Tabs defaultValue="create" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/50 border border-electric-green/30">
                <TabsTrigger value="create" className="flex items-center gap-2 text-white data-[state=active]:bg-electric-blue">
                  <Coins className="w-4 h-4" />
                  Create Token
                </TabsTrigger>
                <TabsTrigger value="holders" className="flex items-center gap-2 text-white data-[state=active]:bg-electric-green">
                  <Users className="w-4 h-4" />
                  Token Holders
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-6">
                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Left Column - Essential Token Creation */}
                  <div className="space-y-6">
                    <Card className="bg-slate-800/50 border-electric-blue/30 backdrop-blur">
                      <CardHeader>
                        <CardTitle className="text-electric-blue flex items-center gap-2">
                          <Coins className="w-5 h-5" />
                          Essential Token Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Message Input */}
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

                        {/* Amount */}
                        <div>
                          <Label htmlFor="mintAmount" className="text-white">Amount</Label>
                          <Input
                            id="mintAmount"
                            type="number"
                            min="1"
                            step="1"
                            value={mintAmount}
                            onChange={(e) => setMintAmount(e.target.value)}
                            required
                            placeholder="100"
                            className="bg-black/40 text-white border-electric-blue/50 focus:border-electric-green placeholder:text-gray-400"
                          />
                        </div>

                        {/* Mint Button */}
                        <Button 
                          onClick={handleMint}
                          className="w-full bg-gradient-to-r from-electric-blue to-electric-green hover:from-electric-blue/80 hover:to-electric-green/80 text-white font-semibold py-3 text-lg"
                          disabled={!message || !mintAmount}
                        >
                          <Coins className="w-5 h-5 mr-2" />
                          Create Token
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Token Preview & Advanced Features */}
                  <div className="space-y-6">
                    {/* Token Preview */}
                    <Card className="bg-slate-800/50 border-electric-green/30 backdrop-blur">
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

                    {/* Coming Soon Features */}
                    <Card className="bg-slate-800/50 border-electric-blue/30 backdrop-blur">
                      <CardHeader>
                        <CardTitle className="text-electric-blue">Advanced Features</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-center text-gray-400">
                          <p className="text-sm mb-2">✨ Coming in Phase 2:</p>
                          <ul className="text-xs space-y-1">
                            <li>• Value attachment to tokens</li>
                            <li>• Custom token images</li>
                            <li>• Free redemption codes</li>
                            <li>• AI text optimization</li>
                            <li>• Extended message support</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="holders" className="space-y-6">
                <Card className="bg-slate-800/50 border-electric-green/30 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-electric-green flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Token Holder Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Token holder analytics will appear here once you create your first token.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="limited" className="space-y-6">
            <Card className="bg-slate-800/50 border-electric-blue/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-electric-blue flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Limited Edition Collections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Limited Edition token collections coming in Phase 2!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}