import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Coins, Upload, Calculator, DollarSign, Lock, Globe, Gift, AlertCircle, Wand2, Star, Sparkles, Users, Target, ImageIcon, FileImage, QrCode, Plus, X, Ticket, Loader2, Zap, CheckCircle, Eye, FileText } from "lucide-react";

export default function Mint() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [valuePerToken, setValuePerToken] = useState("");
  const [targetType, setTargetType] = useState("manual");
  const [manualWallets, setManualWallets] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [tokenImage, setTokenImage] = useState<string>("");
  
  // Phase 2: Value attachment features
  const [attachValue, setAttachValue] = useState(false);
  const [attachedValue, setAttachedValue] = useState("");
  const [currency, setCurrency] = useState("SOL");
  const [isPublic, setIsPublic] = useState(false);
  const [memo, setMemo] = useState("");
  const [messageMedia, setMessageMedia] = useState<Array<{
    id: string;
    type: 'image' | 'gif' | 'qr';
    url: string;
    name: string;
  }>>([]);
  const [expirationDate, setExpirationDate] = useState("");
  const [redemptionCode, setRedemptionCode] = useState("");
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [validatedCode, setValidatedCode] = useState<any>(null);
  const [isFreeMode, setIsFreeMode] = useState(false);

  const remainingChars = 27 - message.length;

  // Handler functions
  const handleTokenImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setTokenImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRedemptionCodeValidation = () => {
    if (!redemptionCode.trim()) return;
    setIsValidatingCode(true);
    toast({
      title: "Code Validation",
      description: "Checking redemption code...",
    });
    // Simulate validation
    setTimeout(() => {
      setValidatedCode({ code: redemptionCode, savingsAmount: "0.01" });
      setIsFreeMode(true);
      setIsValidatingCode(false);
      toast({
        title: "Code Validated",
        description: "Your redemption code is valid! You'll save 0.01 SOL on this transaction.",
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.length > 27) {
      toast({
        title: "Message too long",
        description: "Message must be 27 characters or less",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Token Created!",
      description: `Successfully created ${mintAmount} "${message}" tokens${attachValue ? ` with ${attachedValue} ${currency} value` : ''}`,
    });
    
    // Reset form
    setMessage("");
    setMintAmount("");
    setAttachValue(false);
    setAttachedValue("");
    setRedemptionCode("");
    setValidatedCode(null);
    setIsFreeMode(false);
  };

  const getEstimatedCost = () => {
    if (isFreeMode) return 0;
    const baseFee = 0.01;
    const imageFee = tokenImage ? 0.005 : 0;
    const totalValue = attachValue ? parseFloat(attachedValue) || 0 : 0;
    return baseFee + imageFee + totalValue;
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Token Creation Center</h1>
          <p className="text-xl text-muted-foreground">Create individual tokens or limited edition collections</p>
        </div>

        <Tabs defaultValue="individual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Individual Token
            </TabsTrigger>
            <TabsTrigger value="limited" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Limited Edition
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-6">
            <Tabs defaultValue="create" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Create Token
                </TabsTrigger>
                <TabsTrigger value="holders" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Token Holders
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-6">
                {/* Advanced Form */}
                <form onSubmit={handleSubmit} id="mint-form" className="space-y-8">
                  {/* Two-Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Left Column - Essential Features */}
                    <div className="space-y-6">
                      {/* Token Details */}
                      <Card className="premium-card electric-frame">
                        <CardHeader>
                          <CardTitle className="text-primary flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Token Details
                          </CardTitle>
                          <CardDescription>
                            Create your unique blockchain message token
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Message Input with Character Counter */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <Label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Message (Max 27 characters)
                              </Label>
                              <Badge variant={remainingChars < 0 ? "destructive" : "secondary"}>
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
                              className={remainingChars < 0 ? "border-destructive" : ""}
                            />
                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Your message becomes the token name with FLBY-MSG symbol
                            </p>
                          </div>

                          {/* Token Image Upload */}
                          <div>
                            <Label htmlFor="tokenImage" className="text-sm font-medium">Custom Token Image</Label>
                            <div className="mt-2 space-y-3">
                              <div className="flex items-center gap-4">
                                <input
                                  id="tokenImage"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleTokenImageUpload}
                                  className="hidden"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => document.getElementById('tokenImage')?.click()}
                                  className="flex items-center gap-2"
                                >
                                  <Upload className="w-4 h-4" />
                                  Upload Image
                                </Button>
                                {tokenImage && (
                                  <Badge variant="secondary" className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Image uploaded
                                  </Badge>
                                )}
                              </div>
                              {tokenImage && (
                                <div className="w-20 h-20 rounded-lg border overflow-hidden">
                                  <img src={tokenImage} alt="Token preview" className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Amount and Cost */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="mintAmount" className="text-sm">Amount</Label>
                              <Input
                                id="mintAmount"
                                type="number"
                                min="1"
                                step="1"
                                value={mintAmount}
                                onChange={(e) => setMintAmount(e.target.value)}
                                required
                                placeholder="100"
                              />
                            </div>
                            <div>
                              <Label className="text-sm">Estimated Cost</Label>
                              <div className="h-10 flex items-center px-3 border rounded-md bg-muted">
                                <span className="text-sm">{getEstimatedCost().toFixed(3)} SOL</span>
                              </div>
                            </div>
                          </div>

                          {/* Free Code Section */}
                          <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-green-500/20">
                            <div className="flex items-center gap-2">
                              <Ticket className="w-4 h-4 text-green-500" />
                              <Label className="text-sm font-medium text-green-600 dark:text-green-400">
                                Free Mint Code (Optional)
                              </Label>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                value={redemptionCode}
                                onChange={(e) => setRedemptionCode(e.target.value)}
                                placeholder="Enter code (e.g., FLBY-FREE-2024)"
                                className="border-green-500/50 focus:border-green-400"
                              />
                              <Button
                                type="button"
                                onClick={handleRedemptionCodeValidation}
                                disabled={isValidatingCode}
                                variant="outline"
                                size="sm"
                                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                              >
                                {isValidatingCode ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Validate"
                                )}
                              </Button>
                            </div>
                            {validatedCode && (
                              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                <span>Valid code! Save {validatedCode.savingsAmount} SOL</span>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Use a redemption code to mint tokens for free or at a discount
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Column - Preview & Advanced Options */}
                    <div className="space-y-6">
                      {/* Token Preview */}
                      <Card className="premium-card electric-frame">
                        <CardHeader>
                          <CardTitle className="text-primary flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            Token Preview
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center p-6 border rounded-lg bg-muted/20">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
                              {tokenImage ? (
                                <img src={tokenImage} alt="Token" className="w-full h-full object-cover" />
                              ) : (
                                <Sparkles className="w-10 h-10 text-white" />
                              )}
                            </div>
                            <h3 className="text-lg font-semibold mb-1">
                              {message || "Your Message Here"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">FLBY-MSG</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Supply:</span>
                                <span>{mintAmount || "0"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Value:</span>
                                <span>{attachValue && attachedValue ? `${attachedValue} ${currency}` : "Free"}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Value & Distribution */}
                      <Card className="premium-card electric-frame">
                        <CardContent className="p-5">
                          <h4 className="font-bold mb-3 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Value & Distribution
                          </h4>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Switch
                                id="attachValue"
                                checked={attachValue}
                                onCheckedChange={setAttachValue}
                              />
                              <Label htmlFor="attachValue" className="text-sm">Attach Value to Tokens</Label>
                            </div>
                            
                            {attachValue && (
                              <div className="space-y-3 pl-6 border-l-2 border-primary/20">
                                <div>
                                  <Label htmlFor="attachedValue" className="text-sm">Value per Token</Label>
                                  <Input
                                    id="attachedValue"
                                    type="number"
                                    min="0"
                                    step="0.001"
                                    value={attachedValue}
                                    onChange={(e) => setAttachedValue(e.target.value)}
                                    placeholder="0.001"
                                    className="mt-1"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="currency" className="text-sm">Payment Currency</Label>
                                  <Select value={currency} onValueChange={setCurrency}>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="SOL">SOL</SelectItem>
                                      <SelectItem value="USDC">USDC</SelectItem>
                                      <SelectItem value="FLBY">FLBY (10% discount)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="expirationDate" className="text-sm">Expiration Date</Label>
                                  <Input
                                    id="expirationDate"
                                    type="date"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Submit Button */}
                      <Button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-3 text-lg"
                        disabled={!message || !mintAmount}
                      >
                        <Coins className="w-5 h-5 mr-2" />
                        {isFreeMode ? "Mint Free Token" : `Create Token (${getEstimatedCost().toFixed(3)} SOL)`}
                      </Button>
                    </div>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="holders" className="space-y-6">
                <Card className="premium-card electric-frame">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Token Holder Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Token holder analytics will appear here once you create your first token.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="limited" className="space-y-6">
            <Card className="premium-card electric-frame">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Limited Edition Collections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
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