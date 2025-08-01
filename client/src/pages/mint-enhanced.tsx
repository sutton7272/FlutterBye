import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ImageUpload from "@/components/image-upload";
import { LoadingSpinner } from "@/components/loading-spinner";
import { validateTokenQuantity, validateWholeNumber } from "@/lib/validators";
import { 
  Coins, 
  Upload, 
  Calculator, 
  DollarSign, 
  Lock, 
  Globe, 
  Gift, 
  AlertCircle, 
  Wand2,
  MessageSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  Zap,
  Sparkles
} from "lucide-react";
import AITextOptimizer from "@/components/ai-text-optimizer";
import { EnhancedMetadataForm } from "@/components/enhanced-metadata-form";
import { FlexiblePricingCalculator } from "@/components/flexible-pricing-calculator";
import { type InsertToken } from "@shared/schema";
import TokenHolderAnalysis from "@/components/token-holder-analysis";

interface MetadataFormData {
  additionalMessages: string[];
  links: Array<{ url: string; title: string }>;
  gifs: string[];
}

interface PricingCalculation {
  quantity: number;
  pricePerToken: string;
  totalCost: string;
  discount: string;
  gasFeeIncluded: boolean;
  appliedTier: string;
}

export default function MintEnhanced() {
  const { toast } = useToast();
  
  // Basic token information
  const [message, setMessage] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [mintAmountError, setMintAmountError] = useState("");
  const [tokenImage, setTokenImage] = useState<string>("");
  
  // Enhanced metadata
  const [metadata, setMetadata] = useState<MetadataFormData>({
    additionalMessages: [],
    links: [],
    gifs: []
  });
  
  // Pricing information
  const [pricingCalculation, setPricingCalculation] = useState<PricingCalculation>({
    quantity: 1,
    pricePerToken: '0.01',
    totalCost: '0.01',
    discount: '0',
    gasFeeIncluded: true,
    appliedTier: 'base'
  });
  
  // Value attachment features
  const [attachValue, setAttachValue] = useState(false);
  const [attachedValue, setAttachedValue] = useState("");
  const [currency, setCurrency] = useState("SOL");
  const [isPublic, setIsPublic] = useState(false);
  const [memo, setMemo] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [isFreeFlutterbye, setIsFreeFlutterbye] = useState(false);
  
  // Distribution settings
  const [targetType, setTargetType] = useState("manual");
  const [manualWallets, setManualWallets] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const mintToken = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/tokens/enhanced", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Enhanced Token Minted Successfully!",
        description: "Your FlBY-MSG token with enhanced metadata has been created",
      });
      
      // Reset form
      setMessage("");
      setMintAmount("");
      setTokenImage("");
      setMetadata({ additionalMessages: [], links: [], gifs: [] });
      setAttachedValue("");
      setManualWallets("");
      setCsvFile(null);
    },
    onError: (error: any) => {
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint token. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleMintAmountChange = (value: string) => {
    setMintAmount(value);
    const validation = validateTokenQuantity(value);
    setMintAmountError(validation.error || "");
    
    // Update pricing calculation
    if (validation.isValid) {
      const quantity = parseInt(value);
      setPricingCalculation(prev => ({ ...prev, quantity }));
    }
  };

  const handleOptimizedTextApply = (optimizedText: string) => {
    setMessage(optimizedText);
  };

  const handleMetadataChange = (newMetadata: MetadataFormData) => {
    setMetadata(newMetadata);
  };

  const handlePricingChange = (calculation: PricingCalculation) => {
    setPricingCalculation(calculation);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message for your token",
        variant: "destructive",
      });
      return;
    }

    if (!mintAmount || !validateTokenQuantity(mintAmount).isValid) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid token quantity",
        variant: "destructive",
      });
      return;
    }

    if (attachValue && (!attachedValue || parseFloat(attachedValue) <= 0)) {
      toast({
        title: "Invalid Value",
        description: "Please enter a valid attached value",
        variant: "destructive",
      });
      return;
    }

    const tokenData = {
      message: message.trim(),
      totalSupply: parseInt(mintAmount),
      imageUrl: tokenImage,
      
      // Enhanced metadata for Solscan
      additionalMessages: metadata.additionalMessages,
      links: metadata.links,
      gifs: metadata.gifs,
      solscanMetadata: {
        enhanced: true,
        version: "2.0",
        timestamp: new Date().toISOString()
      },
      
      // Pricing information
      mintingCostPerToken: pricingCalculation.pricePerToken,
      gasFeeIncluded: pricingCalculation.gasFeeIncluded,
      bulkDiscountApplied: pricingCalculation.discount,
      totalMintingCost: pricingCalculation.totalCost,
      
      // Value attachment
      hasAttachedValue: attachValue,
      attachedValue: attachValue ? attachedValue : "0",
      valuePerToken: attachValue && attachedValue ? 
        (parseFloat(attachedValue) / parseInt(mintAmount)).toString() : "0",
      currency,
      isPublic,
      expiresAt: expirationDate ? new Date(expirationDate).toISOString() : null,
      metadata: {
        memo,
        isFreeFlutterbye,
        pricingTier: pricingCalculation.appliedTier
      },
      
      // Distribution
      targetType,
      targetWallets: targetType === "manual" ? 
        manualWallets.split(/[,\n]/).map(w => w.trim()).filter(w => w) : 
        [],
      csvFile: csvFile ? await csvFile.text() : null
    };

    mintToken.mutate(tokenData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Enhanced Token Minting
          </h1>
          <p className="text-muted-foreground">
            Create powerful FlBY-MSG tokens with enhanced metadata, flexible pricing, and Solscan visibility
          </p>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="metadata" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Metadata
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="value" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Value
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Distribution
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Message Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-purple-600" />
                    Token Message
                  </CardTitle>
                  <CardDescription>
                    Enter your 27-character message with AI optimization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Enter your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={27}
                      className="resize-none"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{message.length}/27 characters</span>
                      <Badge variant={message.length <= 27 ? "default" : "destructive"}>
                        {message.length <= 27 ? "Valid" : "Too long"}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* AI Text Optimizer */}
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <CardContent className="pt-4">
                      <AITextOptimizer
                        onOptimizedTextApply={handleOptimizedTextApply}
                        currentText={message}
                      />
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Token Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-green-600" />
                    Token Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mintAmount">Token Quantity</Label>
                    <Input
                      id="mintAmount"
                      type="number"
                      placeholder="Enter quantity"
                      value={mintAmount}
                      onChange={(e) => handleMintAmountChange(e.target.value)}
                      min="1"
                      max="1000000"
                    />
                    {mintAmountError && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {mintAmountError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Token Image</Label>
                    <ImageUpload
                      onImageChange={setTokenImage}
                      currentImage={tokenImage}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Metadata Tab */}
          <TabsContent value="metadata" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Enhanced Metadata for Solscan
                </CardTitle>
                <CardDescription>
                  Add additional messages, links, and GIFs that will be visible on the Solana blockchain explorer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedMetadataForm
                  onMetadataChange={handleMetadataChange}
                  initialData={metadata}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flexible Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Smart Pricing Calculator
                </CardTitle>
                <CardDescription>
                  Automatic bulk discounts and gas fee inclusion for seamless user experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FlexiblePricingCalculator
                  onPricingChange={handlePricingChange}
                  quantity={parseInt(mintAmount) || 1}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Value Attachment Tab */}
          <TabsContent value="value" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Value Attachment
                </CardTitle>
                <CardDescription>
                  Attach redeemable value to your tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="attachValue">Attach Value to Tokens</Label>
                  <Switch
                    id="attachValue"
                    checked={attachValue}
                    onCheckedChange={setAttachValue}
                  />
                </div>

                {attachValue && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="attachedValue">Total Value Pool</Label>
                        <Input
                          id="attachedValue"
                          type="number"
                          step="0.001"
                          placeholder="0.1"
                          value={attachedValue}
                          onChange={(e) => setAttachedValue(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <RadioGroup
                          value={currency}
                          onValueChange={setCurrency}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="SOL" id="sol" />
                            <Label htmlFor="sol">SOL</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="USDC" id="usdc" />
                            <Label htmlFor="usdc">USDC</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {attachedValue && mintAmount && (
                      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                        <CardContent className="pt-4">
                          <p className="text-sm text-green-800 dark:text-green-200">
                            <strong>Value per token:</strong> {' '}
                            {(parseFloat(attachedValue) / parseInt(mintAmount)).toFixed(6)} {currency}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
                      <Input
                        id="expirationDate"
                        type="datetime-local"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="isPublic">Public Token (Discoverable)</Label>
                      <Switch
                        id="isPublic"
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-purple-600" />
                  Token Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={targetType} onValueChange={setTargetType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual">Manual Wallet Addresses</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="csv" id="csv" />
                    <Label htmlFor="csv">Upload CSV File</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="analysis" id="analysis" />
                    <Label htmlFor="analysis">Token Holder Analysis</Label>
                  </div>
                </RadioGroup>

                {targetType === "manual" && (
                  <div className="space-y-2">
                    <Label htmlFor="manualWallets">Wallet Addresses</Label>
                    <Textarea
                      id="manualWallets"
                      placeholder="Enter wallet addresses (one per line or comma-separated)"
                      value={manualWallets}
                      onChange={(e) => setManualWallets(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                )}

                {targetType === "analysis" && (
                  <TokenHolderAnalysis />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Mint Button */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold">Ready to Mint</h3>
                <p className="text-sm text-muted-foreground">
                  Total Cost: <strong>{pricingCalculation.totalCost} SOL</strong>
                  {parseFloat(pricingCalculation.discount) > 0 && (
                    <span className="text-green-600"> ({pricingCalculation.discount}% discount applied)</span>
                  )}
                </p>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={mintToken.isPending || !message || !mintAmount}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {mintToken.isPending ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Minting Token...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Mint Enhanced Token
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}