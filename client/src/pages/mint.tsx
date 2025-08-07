import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ImageUpload from "@/components/image-upload";
import { LoadingSpinner } from "@/components/loading-spinner";
import { validateTokenQuantity, validateWholeNumber } from "@/lib/validators";
import { Coins, Upload, Calculator, DollarSign, Lock, Globe, Gift, AlertCircle, Wand2, Star, Sparkles, Users, Target, ImageIcon, FileImage, QrCode, Plus, X, Ticket, Loader2, Zap, CheckCircle, Mic, TrendingUp, Heart, Copy, Check } from "lucide-react";
import AITextOptimizer from "@/components/ai-text-optimizer";
import { EmotionAnalyzer } from "@/components/EmotionAnalyzer";
import { ViralMechanics } from "@/components/ViralMechanics";
import { NetworkEffects } from "@/components/NetworkEffects";
import { type InsertToken } from "@shared/schema";
import TokenHolderAnalysis from "@/components/token-holder-analysis";
import { TransactionSuccessOverlay } from "@/components/confetti-celebration";
import { ShareSuccessModal } from "@/components/ShareSuccessModal";
import { TokenPriceComparison } from "@/components/token-price-comparison";
import { MintingProgressOverlay } from "@/components/MintingProgressOverlay";
import { VoiceMessageRecorder } from "@/components/voice-message-recorder";
import RealTimeAIAssistant from "@/components/RealTimeAIAssistant";

interface MintProps {
  tokenType?: "basic" | "ai-enhanced" | "voice" | "multimedia";
}

export default function Mint({ tokenType }: MintProps = {}) {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [message, setMessage] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [mintAmountError, setMintAmountError] = useState("");

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
          const response = await apiRequest("/api/calculate-token-price", "POST", { quantity });
          setPriceCalculation(response as any);
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
  
  // Price calculation state
  const [priceCalculation, setPriceCalculation] = useState<{
    pricePerToken: number;
    totalPrice: number;
    tier: any;
    currency: string;
  } | null>(null);
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
  const [attachedVoice, setAttachedVoice] = useState<{ url: string; duration: number; type: 'voice' | 'music' } | null>(null);
  
  // QR Code generation states
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [qrCodeText, setQRCodeText] = useState("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [generatedQRCode, setGeneratedQRCode] = useState<string>("");
  const [copiedQRText, setCopiedQRText] = useState(false);
  const [copiedQRImage, setCopiedQRImage] = useState(false);
  
  // Progress tracking for step-by-step guidance
  const [currentStep, setCurrentStep] = useState(1);
  
  // Minting progress states
  const [showMintingProgress, setShowMintingProgress] = useState(false);
  const [mintingStep, setMintingStep] = useState<string>("");
  const [mintingError, setMintingError] = useState<string>("");
  
  // Determine current step based on form completion
  const determineCurrentStep = () => {
    if (!message || message.length === 0) return 1; // Message step
    if (!mintAmount || parseInt(mintAmount) <= 0) return 2; // Quantity step
    if (attachValue && (!attachedValue || parseFloat(attachedValue) <= 0)) return 3; // Value step
    return 4; // Ready to mint (Image is optional)
  };
  
  // Update current step when form changes
  useEffect(() => {
    setCurrentStep(determineCurrentStep());
  }, [message, mintAmount, attachValue, attachedValue]);
  
  // Confetti celebration state
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
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
      // Show progress overlay
      setShowMintingProgress(true);
      setMintingError("");
      
      try {
        // Step 1: Validation
        setMintingStep("validation");
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Step 2: Wallet connection
        setMintingStep("wallet");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Step 3: Image processing (if applicable)
        if (data.imageFile) {
          setMintingStep("image");
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        // Step 4: Token creation
        setMintingStep("token");
        const response = await apiRequest("POST", "/api/tokens", data);
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Step 5: Value attachment (if applicable)
        if (data.attachedValue && parseFloat(data.attachedValue) > 0) {
          setMintingStep("value");
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        // Step 6: Finalization
        setMintingStep("finalization");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return response.json();
      } catch (error) {
        setMintingError(error instanceof Error ? error.message : "Unknown error occurred");
        throw error;
      }
    },
    onSuccess: (data) => {
      setShowMintingProgress(false);
      setMintingStep("");
      
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
      setAttachedVoice(null);
    },
    onError: (error) => {
      setShowMintingProgress(false);
      setMintingStep("");
      
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
      
      return await apiRequest("POST", "/api/validate-redemption-code", userData);
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

    const tokenData: InsertToken = {
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
    };

    mintToken.mutate(tokenData);
  };

  const handleMessageMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'gif') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = {
      image: ['image/jpeg', 'image/png', 'image/webp'],
      gif: ['image/gif']
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

  const handleGenerateQRCode = async () => {
    if (!qrCodeText.trim()) {
      toast({
        title: "QR Code Error",
        description: "Please enter some text or URL to generate a QR code",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingQR(true);
    try {
      const response = await apiRequest("/api/qr/generate", "POST", {
        data: qrCodeText,
        size: 256
      });

      const qrData = await response.json();
      setGeneratedQRCode(qrData.qrCode);
      
      const newMedia = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'qr' as const,
        url: qrData.qrCode,
        name: `QR Code: ${qrCodeText.substring(0, 20)}...`
      };
      
      setMessageMedia(prev => [...prev, newMedia]);
      
      toast({
        title: "QR Code Generated",
        description: "QR code has been added to your message",
      });
    } catch (error) {
      toast({
        title: "QR Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate QR code",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const copyQRText = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeText);
      setCopiedQRText(true);
      setTimeout(() => setCopiedQRText(false), 2000);
      toast({
        title: "Copied!",
        description: "QR code text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  const copyQRImage = async () => {
    if (!generatedQRCode) return;
    
    try {
      // Convert base64 to blob and copy to clipboard
      const response = await fetch(generatedQRCode);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopiedQRImage(true);
      setTimeout(() => setCopiedQRImage(false), 2000);
      toast({
        title: "Copied!",
        description: "QR code image copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy image to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = () => {
    if (!generatedQRCode) return;
    
    const link = document.createElement('a');
    link.href = generatedQRCode;
    link.download = `qr-code-${qrCodeText.substring(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded!",
      description: "QR code saved to your device",
    });
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

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Token Creation Center</h1>
          <p className="text-xl text-muted-foreground">Create individual tokens or limited edition collections</p>
        </div>

        <Tabs defaultValue="individual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Individual Token
            </TabsTrigger>
            <TabsTrigger value="limited" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Limited Edition
            </TabsTrigger>
            <TabsTrigger value="collaborative" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              🚀 Collaborative Mode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-6">
                {/* Floating Progress Indicator - Always Visible */}
                <div className="fixed top-20 right-4 z-50 bg-slate-900/95 backdrop-blur-sm border border-electric-blue/30 rounded-xl p-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    {[
                      { step: 1, label: "Message", icon: Sparkles, completed: message.length > 0 },
                      { step: 2, label: "Quantity", icon: Calculator, completed: mintAmount && parseInt(mintAmount) > 0 },
                      { step: 3, label: "Value", icon: DollarSign, completed: !attachValue || (attachedValue && parseFloat(attachedValue) > 0) },
                      { step: 4, label: "Mint", icon: Zap, completed: false }
                    ].map(({ step, label, icon: Icon, completed }) => (
                      <div key={step} className="flex flex-col items-center gap-1">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                          ${currentStep === step 
                            ? 'bg-gradient-to-r from-electric-blue to-circuit-teal animate-pulse shadow-lg shadow-electric-blue/50' 
                            : completed 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-700 text-gray-400'
                          }
                        `}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-medium ${
                          currentStep === step ? 'text-electric-blue' : completed ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                  {currentStep < 4 && (
                    <div className="mt-2 text-center">
                      <span className="text-xs text-electric-blue animate-pulse">
                        Complete Step {currentStep}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Minting Form */}
          <Card id="mint-form" className="premium-card electric-frame lg:col-span-2">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-gradient">Create Your Message Token</h3>
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Message Structure</h4>
                <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <p><strong>Token Name:</strong> 27 characters max - becomes the official token identifier</p>
                  <p><strong>Token Image:</strong> Main visual for the token (separate from message media)</p>
                  <p><strong>Extended Message:</strong> Up to 500 characters - for longer descriptions and context</p>
                  <p><strong>Message Media:</strong> Add images, GIFs, or QR codes within your extended message</p>
                </div>
              </div>
              
              {/* Progress Steps Header */}
              <div className="mb-6 p-4 bg-gradient-to-r from-slate-900/80 to-black/60 rounded-xl border border-electric-blue/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {[
                      { step: 1, label: "Message", icon: Sparkles, completed: message.length > 0 },
                      { step: 2, label: "Quantity", icon: Calculator, completed: mintAmount && parseInt(mintAmount) > 0 },
                      { step: 3, label: "Value", icon: DollarSign, completed: !attachValue || (attachedValue && parseFloat(attachedValue) > 0) },
                      { step: 4, label: "Mint", icon: Zap, completed: false }
                    ].map(({ step, label, icon: Icon, completed }) => (
                      <div key={step} className="flex items-center gap-2">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                          ${currentStep === step 
                            ? 'bg-gradient-to-r from-electric-blue to-circuit-teal animate-pulse shadow-lg shadow-electric-blue/50' 
                            : completed 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-700 text-gray-400'
                          }
                        `}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-sm font-medium ${
                          currentStep === step ? 'text-electric-blue' : completed ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {label}
                        </span>
                        {step < 4 && <div className="w-8 h-px bg-gray-600"></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`electric-frame p-4 transition-all duration-500 ${
                  currentStep === 1 
                    ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20 ring-2 ring-electric-blue/50 shadow-lg shadow-electric-blue/25' 
                    : 'bg-gradient-to-r from-electric-blue/5 to-electric-green/5'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="message" className={`font-semibold flex items-center gap-2 ${
                      currentStep === 1 ? 'text-electric-blue animate-pulse' : 'text-electric-blue'
                    }`}>
                      <Sparkles className={`w-4 h-4 ${currentStep === 1 ? 'animate-spin' : ''}`} />
                      Message (Max 27 characters)
                      {currentStep === 1 && <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue animate-pulse ml-2">Step 1</Badge>}
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
                    <div className="absolute inset-0 rounded-md border border-electric-blue/30 pointer-events-none"></div>
                  </div>
                  <p className="text-xs text-electric-blue/80 mt-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Your message will become the token name with FLBY-MSG symbol
                  </p>
                </div>
                
                {/* AI Text Optimizer */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-primary/5 to-cyan/5 rounded-lg p-1">
                    <AITextOptimizer 
                      onOptimizedTextSelect={(optimizedText) => setMessage(optimizedText)}
                      className="border-0 bg-transparent"
                    />
                  </div>
                  
                  {/* Real-Time AI Assistant Integration */}
                  <RealTimeAIAssistant
                    context="token-creation"
                    userInput={message + (memo ? ` ${memo}` : '')}
                    onSuggestionApply={(suggestion) => {
                      // Apply AI suggestion to appropriate field
                      if (message.length === 0 || message.length < 10) {
                        setMessage(suggestion.substring(0, 27));
                      } else {
                        setMemo(suggestion);
                      }
                    }}
                    onOptimizationApply={(optimization) => {
                      // Apply comprehensive AI optimization
                      if (optimization.type === 'token-optimization') {
                        // Use AI insights to guide user
                        toast({
                          title: "AI Optimization Applied",
                          description: "Token enhanced with AI recommendations",
                        });
                      }
                    }}
                  />
                </div>

                {/* Extended Message Section - Moved Higher */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="memo" className="text-electric-blue font-semibold flex items-center gap-2">
                      <FileImage className="w-4 h-4" />
                      Extended Message (Optional)
                    </Label>
                    <Textarea
                      id="memo"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="Add a longer message, detailed description, or special instructions for this token. This text will be stored with your token and can be much longer than the 27-character token name..."
                      rows={4}
                      maxLength={500}
                      className="bg-black/40 text-white placeholder:text-gray-400 border-electric-blue/30 focus:border-electric-green focus:ring-electric-green/20"
                    />
                    <p className="text-xs text-electric-blue/80 mt-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Use this for longer messages, detailed descriptions, or context that doesn't fit in the 27-character token name. {memo.length}/500 characters
                    </p>
                  </div>

                  {/* Message Media Upload Section */}
                  <div className="space-y-3">
                    <Label className="text-electric-blue font-semibold flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Add Media to Message
                    </Label>
                    <p className="text-sm text-gray-400">
                      Attach images, GIFs, QR codes, or voice messages to enhance your extended message
                    </p>
                    
                    <div className="flex gap-2 flex-wrap">
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
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Add Image
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
                            <FileImage className="w-4 h-4 mr-2" />
                            Add GIF
                          </Button>
                        </Label>
                      </div>
                      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="sm">
                            <QrCode className="w-4 h-4 mr-2" />
                            Add QR Code
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-electric-blue/30 max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-electric-blue">Generate QR Code</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="qr-text" className="text-white">
                                  Text or URL to encode
                                </Label>
                                {qrCodeText && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={copyQRText}
                                    className="text-electric-blue hover:text-electric-green"
                                  >
                                    {copiedQRText ? (
                                      <Check className="w-4 h-4" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </Button>
                                )}
                              </div>
                              <Textarea
                                id="qr-text"
                                value={qrCodeText}
                                onChange={(e) => {
                                  setQRCodeText(e.target.value);
                                  setGeneratedQRCode("");
                                }}
                                placeholder="Enter website URL, wallet address, contact info, or any text..."
                                rows={3}
                                className="bg-black/40 text-white border-electric-blue/30 focus:border-electric-green"
                              />
                              <p className="text-xs text-gray-400 mt-1">
                                Examples: https://flutterbye.com, wallet address, contact details
                              </p>
                            </div>

                            {/* QR Code Preview */}
                            {generatedQRCode && (
                              <div className="space-y-3">
                                <Label className="text-white">Generated QR Code</Label>
                                <div className="flex flex-col items-center space-y-3 p-4 bg-white rounded-lg">
                                  <img 
                                    src={generatedQRCode} 
                                    alt="Generated QR Code" 
                                    className="w-48 h-48 object-contain"
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={copyQRImage}
                                      className="text-xs"
                                    >
                                      {copiedQRImage ? (
                                        <>
                                          <Check className="w-3 h-3 mr-1" />
                                          Copied
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3 mr-1" />
                                          Copy Image
                                        </>
                                      )}
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={downloadQRCode}
                                      className="text-xs"
                                    >
                                      <Upload className="w-3 h-3 mr-1" />
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <Label className="text-white text-sm">Quick Templates</Label>
                              <div className="flex gap-2 flex-wrap mt-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setQRCodeText("https://flutterbye.com")}
                                  className="text-xs"
                                >
                                  Flutterbye
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setQRCodeText(`Token: ${message}`)}
                                  className="text-xs"
                                  disabled={!message}
                                >
                                  Token Link
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setQRCodeText("mailto:contact@example.com")}
                                  className="text-xs"
                                >
                                  Email
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setQRCodeText("tel:+1234567890")}
                                  className="text-xs"
                                >
                                  Phone
                                </Button>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!generatedQRCode ? (
                                <Button
                                  onClick={handleGenerateQRCode}
                                  disabled={isGeneratingQR || !qrCodeText.trim()}
                                  className="bg-electric-blue hover:bg-electric-blue/80"
                                >
                                  {isGeneratingQR ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <QrCode className="w-4 h-4 mr-2" />
                                      Generate QR Code
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setShowQRDialog(false);
                                    setQRCodeText("");
                                    setGeneratedQRCode("");
                                  }}
                                  className="bg-electric-green hover:bg-electric-green/80"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Done
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setShowQRDialog(false);
                                  setQRCodeText("");
                                  setGeneratedQRCode("");
                                  setCopiedQRText(false);
                                  setCopiedQRImage(false);
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Scroll to voice section
                          document.querySelector('[data-voice-section]')?.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'center'
                          });
                          toast({
                            title: "Voice Recorder",
                            description: "Scroll down to the Voice & Music section to record your message"
                          });
                        }}
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Add Voice
                      </Button>
                    </div>

                    {/* Display uploaded media */}
                    {messageMedia.length > 0 && (
                      <div className="space-y-2">
                        <Label>Attached Media ({messageMedia.length})</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {messageMedia.map((media) => (
                            <div key={media.id} className="relative border border-electric-blue/30 rounded-lg p-3 bg-slate-800/50">
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center overflow-hidden border border-electric-blue/20">
                                  {media.type === 'image' && (
                                    <img src={media.url} alt="Preview" className="w-full h-full object-cover rounded" />
                                  )}
                                  {media.type === 'gif' && (
                                    <img src={media.url} alt="GIF Preview" className="w-full h-full object-cover rounded" />
                                  )}
                                  {media.type === 'qr' && (
                                    <img src={media.url} alt="QR Code" className="w-full h-full object-contain rounded bg-white p-1" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate text-electric-blue">{media.name}</p>
                                  <p className="text-xs text-gray-400 capitalize">{media.type}</p>
                                  {media.type === 'qr' && (
                                    <Badge variant="outline" className="mt-1 text-xs border-purple-400 text-purple-400">
                                      QR Generated
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeMessageMedia(media.id)}
                                  className="w-6 h-6 p-0 text-red-400 hover:text-red-600 hover:bg-red-400/10"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={`space-y-4 transition-all duration-500 ${
                  currentStep === 2 
                    ? 'ring-2 ring-electric-blue/50 shadow-lg shadow-electric-blue/25 bg-gradient-to-r from-blue-900/20 to-green-900/20 p-4 rounded-xl' 
                    : ''
                }`}>
                  <div>
                    <Label htmlFor="mintAmount" className={`flex items-center gap-2 ${
                      currentStep === 2 ? 'text-electric-blue animate-pulse' : ''
                    }`}>
                      <Calculator className={`w-4 h-4 ${currentStep === 2 ? 'animate-spin' : ''}`} />
                      Mint Amount
                      {currentStep === 2 && <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue animate-pulse ml-2">Step 2</Badge>}
                    </Label>
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
                      placeholder="1000"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Only whole numbers allowed - no fractional tokens
                    </p>

                    {/* Dynamic Pricing Display */}
                    {priceCalculation && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-electric-blue/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-electric-blue font-medium text-sm">Price per Token</p>
                            <p className="text-xl font-bold text-white">
                              ${priceCalculation.pricePerToken.toFixed(2)}
                            </p>
                            {priceCalculation.tier?.discountPercentage !== "0" && (
                              <Badge className="bg-green-600/20 text-green-400 border-green-400 text-xs">
                                {priceCalculation.tier.discountPercentage}% OFF
                              </Badge>
                            )}
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-circuit-teal font-medium text-sm">Total Cost</p>
                            <p className="text-xl font-bold text-electric-green">
                              ${priceCalculation.totalPrice.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {parseInt(mintAmount)} × ${priceCalculation.pricePerToken.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        {priceCalculation.tier && (
                          <div className="mt-2 pt-2 border-t border-electric-blue/20">
                            <p className="text-xs text-gray-400">
                              <Sparkles className="w-3 h-3 inline mr-1" />
                              Using <span className="text-electric-blue font-medium">{priceCalculation.tier.tierName}</span> pricing tier
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>Target Distribution</Label>
                  <RadioGroup value={targetType} onValueChange={setTargetType} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual">Manual Entry</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="csv" id="csv" />
                      <Label htmlFor="csv">CSV Upload</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="holders" id="holders" />
                      <Label htmlFor="holders">Top Token Holders</Label>
                    </div>
                  </RadioGroup>
                  
                  {targetType === "manual" && (
                    <div className="mt-4">
                      <Textarea
                        value={manualWallets}
                        onChange={(e) => setManualWallets(e.target.value)}
                        placeholder="Enter wallet addresses, one per line"
                        rows={4}
                      />
                    </div>
                  )}
                  
                  {targetType === "csv" && (
                    <div className="mt-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload CSV file with wallet addresses
                        </p>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleCsvUpload}
                          className="hidden"
                          id="csv-upload"
                        />
                        <Label htmlFor="csv-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm">
                            Choose File
                          </Button>
                        </Label>
                        {csvFile && (
                          <p className="text-xs text-primary mt-2">
                            Selected: {csvFile.name}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        CSV should contain wallet addresses in first column
                      </p>
                    </div>
                  )}
                  
                  {targetType === "holders" && (
                    <TokenHolderAnalysis 
                      onHoldersSelected={(holders) => {
                        setManualWallets(holders.map(h => h.address).join('\n'));
                      }}
                    />
                  )}
                </div>
                
                {/* Token Image Upload Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-green-500" />
                    Token Image (Optional)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Add a custom image to make your token more engaging and memorable
                  </p>
                  <ImageUpload
                    onImageSelect={setTokenImage}
                    onImageRemove={() => setTokenImage("")}
                    selectedImage={tokenImage}
                    disabled={mintToken.isPending}
                  />
                  {tokenImage && (
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Image attached! Your token will stand out with this custom visual.
                      </p>
                    </div>
                  )}
                </div>

                {/* Voice Message Attachment Section */}
                <div className="space-y-4" data-voice-section>
                  <h4 className="text-lg font-semibold flex items-center">
                    <Mic className="w-5 h-5 mr-2 text-orange-500" />
                    Voice & Music Attachment (NEW!)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Add a personal voice message or background music to make your token truly special
                  </p>
                  
                  <VoiceMessageRecorder
                    onVoiceAttached={(voiceData) => {
                      setAttachedVoice(voiceData);
                      toast({
                        title: "Voice Attached!",
                        description: `${voiceData.type === 'voice' ? 'Voice message' : 'Music'} attached to your token`
                      });
                    }}
                    maxDuration={90}
                    showMusicUpload={true}
                  />
                  
                  {attachedVoice && (
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <p className="text-sm text-orange-700 dark:text-orange-300 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {attachedVoice.type === 'voice' ? 'Voice message' : 'Background music'} attached! 
                        ({Math.round(attachedVoice.duration)}s duration)
                      </p>
                    </div>
                  )}
                </div>

                {/* Phase 2: Value Attachment Section */}
                <Separator />

                <Separator />
                
                <div className={`space-y-6 transition-all duration-500 ${
                  currentStep === 3 
                    ? 'ring-2 ring-electric-blue/50 shadow-lg shadow-electric-blue/25 bg-gradient-to-r from-blue-900/20 to-green-900/20 p-6 rounded-xl' 
                    : 'p-6 bg-gradient-to-r from-purple-900/10 to-blue-900/10 border-2 border-purple-500/30 rounded-xl'
                }`}>
                  <div className="text-center mb-4">
                    <h4 className={`text-2xl font-bold flex items-center justify-center ${
                      currentStep === 3 ? 'text-electric-blue animate-pulse' : 'text-purple-400'
                    }`}>
                      <DollarSign className={`w-6 h-6 mr-3 ${currentStep === 3 ? 'text-electric-blue animate-spin' : 'text-purple-400'}`} />
                      Value & Distribution Engine
                      {currentStep === 3 && <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue animate-pulse ml-3">Step 3</Badge>}
                    </h4>
                    <p className="text-sm text-purple-300 mt-2 max-w-md mx-auto">
                      🚀 Transform your message into a valuable asset by attaching real SOL tokens that recipients can claim
                    </p>
                  </div>
                  
                  {/* Value Proposition Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/40 rounded-lg p-3 text-center">
                      <Gift className="w-6 h-6 mx-auto text-green-400 mb-2" />
                      <h5 className="text-sm font-semibold text-green-300">Instant Rewards</h5>
                      <p className="text-xs text-green-400/80">Recipients get immediate value</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/40 rounded-lg p-3 text-center">
                      <Target className="w-6 h-6 mx-auto text-blue-400 mb-2" />
                      <h5 className="text-sm font-semibold text-blue-300">Viral Incentive</h5>
                      <p className="text-xs text-blue-400/80">Value drives engagement</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/40 rounded-lg p-3 text-center">
                      <Star className="w-6 h-6 mx-auto text-purple-400 mb-2" />
                      <h5 className="text-sm font-semibold text-purple-300">Premium Appeal</h5>
                      <p className="text-xs text-purple-400/80">Value = perceived importance</p>
                    </div>
                  </div>
                  
                  {/* Main Value Toggle */}
                  <div className="p-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-2 border-purple-400/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Switch
                            id="attach-value"
                            checked={attachValue}
                            onCheckedChange={setAttachValue}
                            className="data-[state=checked]:bg-purple-500"
                          />
                          <Label htmlFor="attach-value" className="text-lg font-semibold text-purple-300 cursor-pointer">
                            💰 Attach Real Value to Your Token
                          </Label>
                        </div>
                        <p className="text-sm text-purple-400/90 ml-11">
                          Turn your message into a valuable asset that recipients can actually claim and use. This is what makes Flutterbye revolutionary!
                        </p>
                      </div>
                      {!attachValue && (
                        <div className="text-right">
                          <Badge variant="outline" className="border-purple-400/50 text-purple-300">
                            Optional but Powerful
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {!attachValue && (
                      <div className="mt-3 p-3 bg-purple-500/10 border border-purple-400/30 rounded-lg">
                        <p className="text-xs text-purple-300 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          <strong>Why attach value?</strong> Recipients are 10x more likely to engage with tokens that have real worth. Transform your message from notification to valuable gift!
                        </p>
                      </div>
                    )}
                  </div>

                  {attachValue && (
                    <div className="space-y-6 p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 border-2 border-green-400/40 rounded-xl">
                      <div className="text-center mb-4">
                        <h5 className="text-lg font-semibold text-green-300 mb-2">🎯 Value Configuration</h5>
                        <p className="text-sm text-green-400/80">Set up how much value each recipient will receive</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="attached-value" className="text-base font-semibold text-green-300">Total Value Pool</Label>
                          <Input
                            id="attached-value"
                            type="number"
                            step="0.001"
                            min="0"
                            value={attachedValue}
                            onChange={(e) => setAttachedValue(e.target.value)}
                            placeholder="10.0"
                            className="text-lg py-3 bg-black/40 border-green-400/50 focus:border-green-300 text-center"
                          />
                          <p className="text-xs text-green-400/80">
                            💎 This amount gets distributed among all tokens
                          </p>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="currency" className="text-base font-semibold text-blue-300">Currency</Label>
                          <select
                            id="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full px-4 py-3 text-lg border rounded-md bg-black/40 border-blue-400/50 focus:border-blue-300 text-center text-white"
                          >
                            <option value="SOL">SOL (Solana)</option>
                            <option value="USDC">USDC (USD Coin)</option>
                          </select>
                          <p className="text-xs text-blue-400/80">
                            🌟 Choose your distribution currency
                          </p>
                        </div>
                      </div>

                      {/* Value Per Token Calculation - Make this super prominent */}
                      <div className="p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-2 border-yellow-400/50 rounded-lg text-center">
                        <h6 className="text-lg font-bold text-yellow-300 mb-2">💰 Value Per Token</h6>
                        <div className="text-3xl font-bold text-yellow-200 mb-2">
                          {attachedValue && mintAmount ? (parseFloat(attachedValue) / parseInt(mintAmount)).toFixed(6) : '0'} {currency}
                        </div>
                        <p className="text-sm text-yellow-400/90">
                          Each recipient gets this amount when they claim their token
                        </p>
                        <p className="text-xs text-yellow-500/70 mt-1">
                          Automatically calculated: {attachedValue || '0'} {currency} ÷ {mintAmount || '0'} tokens
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expiration-date">Expiration Date (Optional)</Label>
                        <Input
                          id="expiration-date"
                          type="datetime-local"
                          value={expirationDate}
                          onChange={(e) => setExpirationDate(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                        <p className="text-xs text-muted-foreground">
                          If set, attached value can only be claimed before this date
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is-public"
                          checked={isPublic}
                          onCheckedChange={setIsPublic}
                        />
                        <Label htmlFor="is-public">Make token publicly visible</Label>
                      </div>
                    </div>
                  )}
                </div>


                
                <Card className="bg-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-4 h-4" />
                      <h4 className="font-semibold">Fee Structure</h4>
                    </div>
                    <div className="text-sm space-y-1">
                      {isFreeMode ? (
                        <>
                          <div className="flex justify-between text-green-400">
                            <span>Redemption Code Applied:</span>
                            <span>FREE MINTING</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground line-through">Base Minting Fee:</span>
                            <span className="line-through text-muted-foreground">0.01 SOL</span>
                          </div>
                          {tokenImage && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground line-through">Image Upload Fee:</span>
                              <span className="line-through text-muted-foreground">0.005 SOL</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Base Minting Fee:</span>
                            <span>0.01 SOL</span>
                          </div>
                          {tokenImage && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Image Upload Fee:</span>
                              <span>0.005 SOL</span>
                            </div>
                          )}
                        </>
                      )}
                      {attachValue && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Value Pool:</span>
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
                
                {/* Price Comparison Widget - Moved to bottom for better UX */}
                <div className="mb-6">
                  <TokenPriceComparison 
                    onQuantitySelect={(quantity) => {
                      setMintAmount(quantity.toString());
                      // Scroll to mint button
                      document.querySelector('button[type="submit"]')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                      });
                    }}
                  />
                </div>
                
                {/* Free Minting Code Section - Positioned before payment */}
                <div className="mb-6 p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl">
                  <h4 className="text-lg font-semibold flex items-center text-green-400 mb-3">
                    <Ticket className="w-5 h-5 mr-2" />
                    Free Minting Code (Optional)
                  </h4>
                  <p className="text-sm text-gray-300 mb-4">
                    Have a redemption code? Enter it before minting to get your tokens for free!
                  </p>
                  
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Enter redemption code (e.g., FLBY-EARLY-001)"
                      value={redemptionCode}
                      onChange={(e) => setRedemptionCode(e.target.value.toUpperCase())}
                      disabled={isValidatingCode || isFreeMode}
                      className="bg-black/40 border-green-500/30 focus:border-green-400 text-white placeholder:text-gray-400"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRedemptionCodeValidation}
                      disabled={!redemptionCode.trim() || isValidatingCode || isFreeMode}
                      className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                    >
                      {isValidatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : "Validate"}
                    </Button>
                  </div>
                  
                  {validatedCode && isFreeMode && (
                    <div className="p-4 bg-green-500/10 border border-green-400/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                          <div>
                            <p className="font-semibold text-green-300">
                              Code "{validatedCode.code}" Validated!
                            </p>
                            <p className="text-sm text-green-400">
                              Type: {validatedCode.type} • {validatedCode.remainingUses !== null ? `${validatedCode.remainingUses} uses left` : 'Unlimited uses'}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRedemptionCode("");
                            setValidatedCode(null);
                            setIsFreeMode(false);
                          }}
                          className="text-green-400 hover:text-green-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  disabled={mintToken.isPending || remainingChars < 0}
                  className={`w-full py-4 text-lg cyber-glow transition-all duration-500 ${
                    currentStep === 4 
                      ? 'bg-gradient-to-r from-electric-blue to-circuit-teal hover:from-electric-blue/80 hover:to-circuit-teal/80 animate-pulse ring-2 ring-electric-blue/50 shadow-lg shadow-electric-blue/50' 
                      : 'bg-gradient-to-r from-primary to-blue-500 hover:from-blue-500 hover:to-primary'
                  }`}
                >
                  {mintToken.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <Zap className={`w-4 h-4 mr-2 ${currentStep === 4 ? 'animate-spin' : ''}`} />
                      {currentStep === 4 ? "Ready to Mint Tokens!" : "Mint Tokens"}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Right Column - Token Preview & Holder Analysis */}
          <div className="space-y-6">
            {/* Token Preview */}
            <Card className="glassmorphism">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Token Preview</h3>
                
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
                    <h4 className="text-sm font-bold mb-1">
                      {message || "Your Message Token"}
                    </h4>
                    <Badge variant="secondary" className="mb-3 text-xs">
                      FLBY-MSG
                    </Badge>
                    <div className="space-y-1 text-xs">
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

            {/* Token Holder Analysis - Permanently Displayed */}
            <Card className="premium-card electric-frame">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5" />
                  Token Holder Analysis
                </CardTitle>
                <CardDescription className="text-sm">
                  Analyze token holders for targeted campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-center">
                  <Users className="w-10 h-10 mx-auto text-blue-400 mb-3" />
                  <h3 className="text-sm font-semibold mb-2">Token Holder Map</h3>
                  <p className="text-muted-foreground mb-3 text-xs">
                    Analyze wallets and distribution patterns for marketing optimization.
                  </p>
                  <div className="grid grid-cols-1 gap-2 mb-3">
                    <div className="border border-blue-500/20 bg-blue-500/5 rounded-lg p-2">
                      <h4 className="font-medium text-blue-400 mb-1 text-xs">Wallet Analysis</h4>
                      <p className="text-[10px] text-muted-foreground">Identify high-value holders</p>
                    </div>
                    <div className="border border-green-500/20 bg-green-500/5 rounded-lg p-2">
                      <h4 className="font-medium text-green-400 mb-1 text-xs">Geographic Mapping</h4>
                      <p className="text-[10px] text-muted-foreground">See global token distribution</p>
                    </div>
                    <div className="border border-purple-500/20 bg-purple-500/5 rounded-lg p-2">
                      <h4 className="font-medium text-purple-400 mb-1 text-xs">Engagement Tracking</h4>
                      <p className="text-[10px] text-muted-foreground">Monitor holder activity</p>
                    </div>
                    <div className="border border-orange-500/20 bg-orange-500/5 rounded-lg p-2">
                      <h4 className="font-medium text-orange-400 mb-1 text-xs">Influence Scoring</h4>
                      <p className="text-[10px] text-muted-foreground">Rate holder influence</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => navigate('/token-map')}
                    >
                      <Users className="w-3 h-3 mr-1" />
                      View Token Map
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="sm"
                      onClick={async () => {
                        if (!message.trim()) {
                          toast({
                            title: "Enter a message first",
                            description: "Please enter a token message to analyze holders for.",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        try {
                          const response = await fetch('/api/tokens/analyze-holders', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              tokenName: message,
                              holderCount: parseInt(mintAmount) || 25,
                            }),
                          });
                          
                          if (!response.ok) {
                            throw new Error('Failed to analyze holders');
                          }
                          
                          const holders = await response.json();
                          
                          toast({
                            title: "Analysis Complete",
                            description: `Found ${holders.length} token holders for analysis.`,
                          });
                          
                          console.log("Token holders:", holders);
                          
                        } catch (error) {
                          console.error('Error analyzing holders:', error);
                          toast({
                            title: "Analysis Failed",
                            description: "Failed to analyze token holders. Please try again.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Target className="w-3 h-3 mr-1" />
                      Analyze Holders
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="sm"
                      onClick={async () => {
                        if (!message.trim()) {
                          toast({
                            title: "Enter a message first",
                            description: "Please enter a token message for export.",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        try {
                          const response = await fetch('/api/tokens/export-holders', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              tokenName: message,
                              format: 'csv'
                            }),
                          });
                          
                          if (!response.ok) {
                            throw new Error('Failed to export data');
                          }
                          
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${message}-holders.csv`;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                          
                          toast({
                            title: "Export Complete",
                            description: "Holder data exported successfully.",
                          });
                          
                        } catch (error) {
                          console.error('Error exporting holders:', error);
                          toast({
                            title: "Export Failed",
                            description: "Failed to export holder data. Please try again.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <FileImage className="w-3 h-3 mr-1" />
                      Export Data
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-xs" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Campaign Builder",
                          description: "Advanced campaign tools coming soon with AI-powered targeting.",
                        });
                      }}
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      Campaign Builder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
                </div>

          {/* Game-Changing AI Features */}
          {message.trim() && (
            <div className="space-y-4">
              {/* AI Emotion Analysis (placeholder for when API key is available) */}
              <EmotionAnalyzer 
                message={message}
                recipientCount={parseInt(mintAmount) || 1}
                onValueSuggestion={(value) => setValuePerToken(value.toString())}
                onOptimizedMessage={(optimized) => setMessage(optimized)}
              />
              
              {/* Viral Mechanics Engine */}
              <ViralMechanics 
                message={message}
                recipientCount={parseInt(mintAmount) || 1}
                valuePerToken={parseFloat(valuePerToken) || 0}
                onBoostSuggestion={(boost) => {
                  // Apply viral boost suggestions
                  console.log("Viral boost suggestion:", boost);
                }}
              />
              
              {/* Network Effects Engine */}
              <NetworkEffects 
                senderWallet="connected-wallet" // Would be actual connected wallet
                recipientCount={parseInt(mintAmount) || 1}
                valuePerToken={parseFloat(valuePerToken) || 0}
                messageCategory="other" // Would be determined by AI
              />
            </div>
          )}
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

          <TabsContent value="collaborative" className="space-y-6">
            <CollaborativeCreationTab />
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

      {/* Minting Progress Overlay */}
      <MintingProgressOverlay
        isVisible={showMintingProgress}
        currentStep={mintingStep}
        onComplete={() => {
          setShowMintingProgress(false);
          setMintingStep("");
        }}
        onError={(error) => {
          setMintingError(error);
          setShowMintingProgress(false);
          setMintingStep("");
        }}
        mintingData={{
          message: message,
          quantity: parseInt(mintAmount) || 0,
          hasValue: attachValue && parseFloat(attachedValue) > 0,
          hasImage: !!tokenImage
        }}
      />
    </div>
  );
}

// Collaborative Creation Tab Component
function CollaborativeCreationTab() {
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const { data: sessions, refetch: refetchSessions } = useQuery<any[]>({
    queryKey: ['/api/collaborative/sessions'],
    refetchInterval: 5000
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await fetch('/api/collaborative/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          creatorId: 'current-user'
        })
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedSessionId(data.sessionId);
      setIsCreatingSession(false);
      setSessionName('');
      refetchSessions();
    }
  });

  const joinSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch('/api/collaborative/join-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId: 'current-user'
        })
      });
      return response.json();
    },
    onSuccess: () => {
      refetchSessions();
    }
  });

  const handleCreateSession = () => {
    if (!sessionName.trim()) return;
    createSessionMutation.mutate({
      name: sessionName,
      description: 'Collaborative token creation session'
    });
  };

  return (
    <Card className="electric-frame">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gradient">
          <Users className="w-5 h-5" />
          Collaborative Token Creation
        </CardTitle>
        <CardDescription>
          Create tokens together in real-time with multiple contributors
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Session Creation */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-white">Create New Session</h3>
          <div className="flex gap-3">
            <Input
              placeholder="Session name..."
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateSession()}
              className="flex-1"
            />
            <Button 
              onClick={handleCreateSession}
              disabled={!sessionName.trim() || createSessionMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {createSessionMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Active Sessions</h3>
          
          {sessions?.map((session: any) => (
            <Card 
              key={session.sessionId}
              className={`transition-all duration-200 cursor-pointer ${
                selectedSessionId === session.sessionId 
                  ? 'ring-2 ring-purple-500 bg-purple-900/10' 
                  : 'hover:ring-1 hover:ring-purple-400/50'
              }`}
              onClick={() => setSelectedSessionId(session.sessionId)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-white">{session.name || 'Untitled Session'}</h4>
                    <p className="text-sm text-slate-400">
                      Created by {session.creatorId} • {session.collaborators?.length || 0} contributors
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={session.status === 'active' ? 'default' : 'secondary'}
                      className={session.status === 'active' ? 'bg-green-600' : ''}
                    >
                      {session.status === 'active' ? 'Live' : 'Paused'}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        joinSessionMutation.mutate(session.sessionId);
                      }}
                      disabled={joinSessionMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Join
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Token Progress:</span>
                    <div className="text-white font-medium">
                      {session.tokenProgress?.message ? '✓ Message' : '○ Message'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Contributions:</span>
                    <div className="text-white font-medium">
                      {session.contributions?.length || 0}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Viral Score:</span>
                    <div className="text-green-400 font-medium">
                      {session.viralPotential?.score || 0}/100
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Last Activity:</span>
                    <div className="text-white font-medium">
                      {session.lastActivity ? 'Just now' : 'N/A'}
                    </div>
                  </div>
                </div>

                {session.currentToken && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="text-sm">
                      <span className="text-slate-400">Current Token: </span>
                      <span className="text-white font-mono">{session.currentToken.message || 'Working...'}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {(!sessions || sessions.length === 0) && (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Active Sessions</h3>
                <p className="text-slate-400 mb-4">Create a new collaborative session to get started</p>
                <Button 
                  onClick={() => setIsCreatingSession(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Create First Session
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Session Details */}
        {selectedSessionId && (
          <Card className="mt-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-sm text-purple-400">Session Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-slate-300">Active Contributors</p>
                        <p className="text-xl font-bold text-white">3</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-sm text-slate-300">Viral Potential</p>
                        <p className="text-xl font-bold text-white">87/100</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-sm text-slate-300">Contributions</p>
                        <p className="text-xl font-bold text-white">12</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4 p-4 bg-slate-800/30 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">Current Token Preview</h4>
                <div className="text-lg font-mono text-gradient">
                  "Building the future together..."
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Last edited by user_123 • 2 minutes ago
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalize Token
                </Button>
                <Button size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Leave Session
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
