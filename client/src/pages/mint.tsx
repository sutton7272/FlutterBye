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

  // Listen for share modal trigger
  useEffect(() => {
    const handleOpenShareModal = () => {
      setShowShareModal(true);
    };

    window.addEventListener('openShareModal', handleOpenShareModal);
    return () => window.removeEventListener('openShareModal', handleOpenShareModal);
  }, []);

  // Calculate price when mint amount changes
  useEffect(() => {
    const calculatePrice = async () => {
      const quantity = parseInt(mintAmount);
      if (quantity && quantity > 0) {
        try {
          const response = await apiRequest("POST", "/api/calculate-token-price", { quantity });
          const data = await response.json();
          setPriceCalculation(data);
        } catch (error) {
          console.error("Failed to calculate price:", error);
          setPriceCalculation(null);
        }
      } else {
        setPriceCalculation(null);
      }
    };

    const timeoutId = setTimeout(calculatePrice, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [mintAmount]);
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
  
  // Additional state variables
  const [walletAddresses, setWalletAddresses] = useState("");
  
  // Confetti celebration state
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [successData, setSuccessData] = useState<{
    message: string;
    amount: string;
    type: string;
    wasFreeMint?: boolean;
    redemptionCode?: string;
    transactionUrl?: string;
  } | null>(null);

  const mintToken = useMutation({
    mutationFn: async (data: InsertToken) => {
      const response = await apiRequest("POST", "/api/tokens", data);
      return await response.json();
    },
    onSuccess: (data) => {
      // Show confetti celebration
      setSuccessData({
        message: message,
        amount: `${mintAmount} tokens${attachValue ? ` • ${attachedValue} ${currency} value` : ''}`,
        type: 'Token Mint',
        wasFreeMint: isFreeMode,
        redemptionCode: validatedCode?.code,
        transactionUrl: data.blockchainUrl
      });
      setShowSuccessOverlay(true);
      
      // Reset form
      setMessage("");
      setMintAmount("");
      setValuePerToken("");
      setManualWallets("");
      setCsvFile(null);
      setTokenImage("");
      setAttachValue(false);
      setAttachedValue("");
      setCurrency("SOL");
      setIsPublic(false);
      setMemo("");
      setExpirationDate("");
      setRedemptionCode("");
      setValidatedCode(null);
      setIsFreeMode(false);
      setMessageMedia([]);
    },
    onError: (error) => {
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint token. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Validate redemption code with comprehensive data collection
  const validateRedemptionCode = useMutation({
    mutationFn: async (code: string) => {
      // Collect comprehensive user data for analytics
      const userData = {
        code,
        walletAddress: "user-wallet-placeholder", // This would come from wallet connection
        ipAddress: undefined, // Server-side collection
        userAgent: navigator.userAgent,
        referralSource: new URLSearchParams(window.location.search).get('ref') || 'direct',
        timestamp: new Date().toISOString(),
        geolocation: undefined, // Server-side IP geolocation
        metadata: {
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          platform: navigator.platform
        }
      };
      
      const response = await apiRequest("POST", "/api/validate-redemption-code", userData);
      return await response.json();
    },
    onSuccess: (data: any) => {
      setValidatedCode(data);
      setIsFreeMode(true);
      toast({
        title: "Code Validated",
        description: `Your redemption code is valid! You'll save ${data.savingsAmount || '0.01'} SOL on this transaction.`,
      });
    },
    onError: (error) => {
      setValidatedCode(null);
      setIsFreeMode(false);
      toast({
        title: "Invalid Code",
        description: error.message || "This redemption code is invalid or expired.",
        variant: "destructive",
      });
    },
  });

  const handleRedemptionCodeValidation = () => {
    if (!redemptionCode.trim()) return;
    setIsValidatingCode(true);
    validateRedemptionCode.mutate(redemptionCode.trim());
    setIsValidatingCode(false);
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

    // Validate wallets if manual entry
    if (targetType === "manual" && manualWallets) {
      const wallets = manualWallets.split('\n').filter(w => w.trim());
      // Basic wallet validation would go here
    }

    const tokenData: InsertToken & { imageFile?: string; redemptionCode?: string; isFreeMode?: boolean } = {
      message,
      symbol: "FlBY-MSG", // Always FlBY-MSG
      creatorId: "user-1", // Mock user ID
      totalSupply: parseInt(mintAmount) || 0,
      availableSupply: parseInt(mintAmount) || 0,

      // Phase 2: Value attachment
      hasAttachedValue: attachValue,
      attachedValue: attachValue ? attachedValue : "0",
      currency: currency,
      isPublic: isPublic,
      expiresAt: attachValue && expirationDate ? new Date(expirationDate) : undefined,
      metadata: {
        ...(memo && { memo: [memo] }),
        ...(redemptionCode && validatedCode && { redemptionCode: [redemptionCode] }),
        ...(messageMedia.length > 0 && { messageMedia: [JSON.stringify(messageMedia)] })
      },
      valuePerToken: attachValue && attachedValue && mintAmount ? 
        (parseFloat(attachedValue) / parseInt(mintAmount)).toString() : "0",
      imageFile: tokenImage || undefined,
      redemptionCode: validatedCode ? redemptionCode : undefined,
      isFreeMode: isFreeMode,
    };

    mintToken.mutate(tokenData);
  };

  const handleMessageMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'gif' | 'qr') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = {
      image: ['image/jpeg', 'image/png', 'image/webp'],
      gif: ['image/gif'],
      qr: ['image/jpeg', 'image/png', 'image/webp']
    };

    if (!validTypes[type].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please upload a valid ${type} file`,
        variant: "destructive",
      });
      return;
    }

    // Convert to base64 and add to messageMedia
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      const newMedia = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        url,
        name: file.name
      };
      setMessageMedia(prev => [...prev, newMedia]);
      toast({
        title: "Media added",
        description: `${type} has been added to your message`,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeMessageMedia = (id: string) => {
    setMessageMedia(prev => prev.filter(media => media.id !== id));
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      toast({
        title: "CSV Uploaded",
        description: `${file.name} ready for processing`,
      });
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a valid CSV file",
        variant: "destructive",
      });
    }
  };

  const calculateTotalCost = () => {
    if (isFreeMode) return 0;
    const baseFee = 0.01;
    const imageFee = tokenImage ? 0.005 : 0;
    const totalValue = attachValue ? parseFloat(attachedValue) || 0 : 0;
    return baseFee + imageFee + totalValue;
  };

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

  // Validation states for redemption code
  const validateCode = validatedCode;
  const codeValidation = validatedCode;

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
                {/* Price Comparison Widget */}
                <div className="mb-6">
                  <TokenPriceComparison 
                    onQuantitySelect={(quantity) => {
                      setMintAmount(quantity.toString());
                      document.getElementById('mint-form')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* LEFT COLUMN - Core Token Creation */}
                  <div className="space-y-4">
                    <Card id="mint-form" className="premium-card electric-frame">
                      <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                          {/* Message Input */}
                          <div className="electric-frame p-4 bg-slate-800/30">
                            <div className="flex justify-between items-center mb-2">
                              <Label htmlFor="message" className="text-electric-blue font-semibold flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Message (Max 27 characters)
                              </Label>
                              <Badge variant={remainingChars < 0 ? "destructive" : "secondary"} className="border-electric-blue/50">
                                {remainingChars}/27
                              </Badge>
                            </div>
                            <div className="relative">
                              <Input
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                maxLength={27}
                                required
                                placeholder="StakeNowForYield"
                                className={`${remainingChars < 0 ? "border-destructive" : "border-electric-blue/50"} bg-black/40 text-white placeholder:text-gray-400 focus:border-electric-green focus:ring-electric-green/20`}
                              />
                            </div>
                            <p className="text-xs text-electric-blue/80 mt-2 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Your message becomes the token name with FLBY-MSG symbol
                            </p>
                          </div>
                          
                          {/* AI Text Optimizer */}
                          <div className="bg-slate-700/20 rounded-lg p-1">
                            <AITextOptimizer 
                              onOptimizedTextSelect={(optimizedText) => setMessage(optimizedText)}
                              className="border-0 bg-transparent"
                            />
                          </div>
                          
                          {/* Amount and Image */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="mintAmount">Amount</Label>
                              <Input
                                id="mintAmount"
                                type="number"
                                min="1"
                                step="1"
                                value={mintAmount}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setMintAmount(value);
                                  
                                  if (value) {
                                    const validation = validateTokenQuantity(value);
                                    setMintAmountError(validation.isValid ? "" : validation.error || "");
                                  } else {
                                    setMintAmountError("");
                                  }
                                }}
                                required
                                placeholder="100"
                              />
                            </div>
                            <div>
                              <Label htmlFor="tokenImage">Image</Label>
                              <Input
                                id="tokenImage"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleTokenImageUpload}
                              />
                            </div>
                          </div>

                          {tokenImage && (
                            <div className="p-2 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-950/20">
                              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">Image uploaded successfully</span>
                              </div>
                            </div>
                          )}

                          {/* Free Code */}
                          <div className="border-t pt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Gift className="w-4 h-4 text-green-500" />
                              <Label className="text-green-400 font-semibold text-sm">Free Code</Label>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                value={redemptionCode}
                                onChange={(e) => setRedemptionCode(e.target.value.toUpperCase())}
                                placeholder="Enter free minting code"
                                className="border-green-500/50 focus:border-green-400"
                              />
                              <Button
                                type="button"
                                onClick={handleRedemptionCodeValidation}
                                disabled={validateCode.isPending}
                                variant="outline"
                                size="sm"
                                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                              >
                                {validateCode.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
                              </Button>
                            </div>
                            {codeValidation && (
                              <div className={`mt-2 p-2 rounded-lg border text-xs ${
                                codeValidation.valid 
                                  ? 'border-green-500/50 bg-green-500/10 text-green-400' 
                                  : 'border-red-500/50 bg-red-500/10 text-red-400'
                              }`}>
                                <div className="flex items-center gap-2">
                                  {codeValidation.valid ? (
                                    <CheckCircle className="w-3 h-3" />
                                  ) : (
                                    <AlertCircle className="w-3 h-3" />
                                  )}
                                  <span className="font-medium">
                                    {codeValidation.valid ? 'Valid!' : 'Invalid'}
                                  </span>
                                </div>
                                {codeValidation.message && (
                                  <p className="mt-1 opacity-80">{codeValidation.message}</p>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            type="submit" 
                            disabled={mintToken.isPending || remainingChars < 0}
                            className="w-full bg-electric-blue hover:bg-blue-600 py-3 text-lg cyber-glow"
                          >
                            {mintToken.isPending ? "Minting..." : "Mint Tokens"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>

                  {/* RIGHT COLUMN - Advanced Features & Preview */}
                  <div className="space-y-4">
                    {/* Token Preview */}
                    <Card className="glassmorphism">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <Eye className="w-5 h-5" />
                          Token Preview
                        </h3>
                        
                        <div className="bg-slate-700/50 p-4 rounded-xl border-2 border-dashed border-slate-600">
                          <div className="text-center">
                            {tokenImage ? (
                              <div className="w-12 h-12 mx-auto mb-3 rounded-full overflow-hidden">
                                <img 
                                  src={`data:image/png;base64,${tokenImage}`}
                                  alt="Token preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center">
                                <Coins className="text-lg text-white" />
                              </div>
                            )}
                            <h4 className="font-bold mb-2">
                              {message || "Your Message Token"}
                            </h4>
                            <Badge variant="secondary" className="mb-3 text-xs">
                              FLBY-MSG
                            </Badge>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Supply:</span>
                                <span>{mintAmount || "0"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Value:</span>
                                <span>{valuePerToken ? `${valuePerToken} SOL` : "Free"}</span>
                              </div>
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
                                <Label htmlFor="attachedValue" className="text-sm">Value per Token (SOL)</Label>
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
                                    <SelectItem value="SOL">SOL (Solana)</SelectItem>
                                    <SelectItem value="USDC">USDC (Stablecoin)</SelectItem>
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

                          <div>
                            <Label htmlFor="walletAddresses" className="text-sm">Recipient Addresses</Label>
                            <Textarea
                              id="walletAddresses"
                              value={walletAddresses}
                              onChange={(e) => setWalletAddresses(e.target.value)}
                              placeholder="Enter wallet addresses (one per line)"
                              rows={3}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Extended Message & Media */}
                    <Card className="premium-card electric-frame">
                      <CardContent className="p-5">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Extended Message
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <Textarea
                              id="memo"
                              value={memo}
                              onChange={(e) => setMemo(e.target.value)}
                              placeholder="Add detailed description or context for your token..."
                              rows={3}
                              maxLength={500}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {memo.length}/500 characters
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm">Add Media</Label>
                            <div className="flex gap-2 mt-2">
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  onChange={(e) => handleMessageMediaUpload(e, 'image')}
                                  className="hidden"
                                  id="message-image-upload"
                                />
                                <Label htmlFor="message-image-upload" className="cursor-pointer">
                                  <Button type="button" variant="outline" size="sm">
                                    <ImageIcon className="w-4 h-4 mr-1" />
                                    Image
                                  </Button>
                                </Label>
                              </div>
                              
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/gif"
                                  onChange={(e) => handleMessageMediaUpload(e, 'gif')}
                                  className="hidden"
                                  id="message-gif-upload"
                                />
                                <Label htmlFor="message-gif-upload" className="cursor-pointer">
                                  <Button type="button" variant="outline" size="sm">
                                    <FileImage className="w-4 h-4 mr-1" />
                                    GIF
                                  </Button>
                                </Label>
                              </div>
                              
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  onChange={(e) => handleMessageMediaUpload(e, 'qr')}
                                  className="hidden"
                                  id="message-qr-upload"
                                />
                                <Label htmlFor="message-qr-upload" className="cursor-pointer">
                                  <Button type="button" variant="outline" size="sm">
                                    <QrCode className="w-4 h-4 mr-1" />
                                    QR
                                  </Button>
                                </Label>
                              </div>
                            </div>

                            {messageMedia.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <Label className="text-sm">Attached Media ({messageMedia.length})</Label>
                                <div className="space-y-2">
                                  {messageMedia.map((media) => (
                                    <div key={media.id} className="flex items-center gap-2 p-2 border border-slate-700 rounded">
                                      <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
                                        {media.type === 'image' && <ImageIcon className="w-4 h-4 text-blue-500" />}
                                        {media.type === 'gif' && <FileImage className="w-4 h-4 text-green-500" />}
                                        {media.type === 'qr' && <QrCode className="w-4 h-4 text-purple-500" />}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{media.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{media.type}</p>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeMessageMedia(media.id)}
                                        className="w-6 h-6 p-0 text-red-500 hover:text-red-700"
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Fee Structure */}
                    <Card className="bg-slate-700/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Calculator className="w-4 h-4" />
                          <h4 className="font-semibold">Fee Structure</h4>
                        </div>
                        <div className="text-sm space-y-1">
                          {isFreeMode ? (
                            <>
                              <div className="flex justify-between text-green-400">
                                <span>Free Code Applied:</span>
                                <span>FREE</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground line-through">
                                <span>Base Fee:</span>
                                <span>0.01 SOL</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Base Fee:</span>
                                <span>0.01 SOL</span>
                              </div>
                              {tokenImage && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Image Fee:</span>
                                  <span>0.005 SOL</span>
                                </div>
                              )}
                            </>
                          )}
                          {attachValue && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Value Pool:</span>
                              <span>{(parseFloat(attachedValue) || 0).toFixed(3)} {currency}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-semibold border-t border-slate-600 pt-2">
                            <span>Total Cost:</span>
                            <span className={`${isFreeMode ? 'text-green-400' : 'text-primary'}`}>
                              {isFreeMode ? 'FREE' : `${calculateTotalCost().toFixed(3)} SOL`}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="holders" className="space-y-6">
                <Card className="premium-card electric-frame">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Token Holder Analysis
                    </CardTitle>
                    <CardDescription>
                      Analyze token holders for targeted distribution campaigns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Token Holder Map</h3>
                      <p className="text-muted-foreground mb-6">
                        Analyze wallet addresses, token holdings, and distribution patterns to optimize your marketing campaigns.
                        Perfect for targeting specific token communities.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
                        <div className="border border-blue-500/20 bg-blue-500/5 rounded-lg p-4">
                          <h4 className="font-medium text-blue-400 mb-2">Wallet Analysis</h4>
                          <p className="text-sm text-muted-foreground">Identify high-value holders</p>
                        </div>
                        <div className="border border-green-500/20 bg-green-500/5 rounded-lg p-4">
                          <h4 className="font-medium text-green-400 mb-2">Distribution Patterns</h4>
                          <p className="text-sm text-muted-foreground">Understand holder behavior</p>
                        </div>
                        <div className="border border-purple-500/20 bg-purple-500/5 rounded-lg p-4">
                          <h4 className="font-medium text-purple-400 mb-2">Targeted Campaigns</h4>
                          <p className="text-sm text-muted-foreground">Optimize your outreach</p>
                        </div>
                      </div>
                      <Button className="mr-4">
                        <Users className="w-4 h-4 mr-2" />
                        View Token Map
                      </Button>
                      <Button variant="outline">
                        <Target className="w-4 h-4 mr-2" />
                        Analyze Holders
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="limited" className="space-y-6">
            <Card className="premium-card electric-frame">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Limited Edition Collections
                </CardTitle>
                <CardDescription>
                  Create exclusive, limited-supply token collections with unique attributes
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Star className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Limited Edition Coming Soon</h3>
                  <p className="text-muted-foreground mb-6">
                    Create exclusive token sets with limited supply, special artwork, and rarity tiers. 
                    Perfect for collectibles, event badges, and premium offerings.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="border border-purple-500/20 bg-purple-500/5 rounded-lg p-4">
                      <h4 className="font-medium text-purple-400 mb-2">Rarity Tiers</h4>
                      <p className="text-sm text-muted-foreground">Common, Rare, Epic, Legendary</p>
                    </div>
                    <div className="border border-blue-500/20 bg-blue-500/5 rounded-lg p-4">
                      <h4 className="font-medium text-blue-400 mb-2">Limited Supply</h4>
                      <p className="text-sm text-muted-foreground">Set maximum editions</p>
                    </div>
                    <div className="border border-green-500/20 bg-green-500/5 rounded-lg p-4">
                      <h4 className="font-medium text-green-400 mb-2">Custom Artwork</h4>
                      <p className="text-sm text-muted-foreground">Unique visuals per tier</p>
                    </div>
                  </div>
                  <Button className="mt-6" variant="outline" disabled>
                    <Star className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Success Overlay with Confetti */}
      <TransactionSuccessOverlay
        isVisible={showSuccessOverlay}
        onClose={() => {
          setShowSuccessOverlay(false);
          setSuccessData(null);
        }}
        transactionType={successData?.type || 'Transaction'}
        amount={successData?.amount}
        message={successData?.message}
      />

      {/* Share Success Modal */}
      {successData && (
        <ShareSuccessModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          mintData={successData}
        />
      )}
    </div>
  );
}
