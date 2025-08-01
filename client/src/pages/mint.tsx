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
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ImageUpload from "@/components/image-upload";
import { LoadingSpinner } from "@/components/loading-spinner";
import { validateTokenQuantity, validateWholeNumber } from "@/lib/validators";
import { Coins, Upload, Calculator, DollarSign, Lock, Globe, Gift, AlertCircle, Wand2 } from "lucide-react";
import AITextOptimizer from "@/components/ai-text-optimizer";
import { type InsertToken } from "@shared/schema";
import TokenHolderAnalysis from "@/components/token-holder-analysis";

export default function Mint() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [mintAmountError, setMintAmountError] = useState("");
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
  const [expirationDate, setExpirationDate] = useState("");
  const [isFreeFlutterbye, setIsFreeFlutterbye] = useState(false);

  const mintToken = useMutation({
    mutationFn: async (data: InsertToken) => {
      const response = await apiRequest("POST", "/api/tokens", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Token Minted Successfully!",
        description: "Your FlBY-MSG token has been created and distributed",
      });
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
      setIsFreeFlutterbye(false);
    },
    onError: (error) => {
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint token. Please try again.",
        variant: "destructive",
      });
    },
  });

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

    const tokenData: InsertToken & { imageFile?: string } = {
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
      metadata: memo ? { memo: [memo], isFreeFlutterbye: [isFreeFlutterbye] } : { isFreeFlutterbye: [isFreeFlutterbye] },
      valuePerToken: attachValue && attachedValue && mintAmount ? 
        (parseFloat(attachedValue) / parseInt(mintAmount)).toString() : "0",
      imageFile: tokenImage || undefined,
    };

    mintToken.mutate(tokenData);
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
          <h1 className="text-4xl font-bold mb-4">Mint FLBY-MSG Tokens</h1>
          <p className="text-xl text-muted-foreground">Create tokenized messages and distribute them to your target audience</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Minting Form */}
          <Card className="glassmorphism">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Create Your Message Token</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="message">Message (Max 27 characters)</Label>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Your message will become the token name with FLBY-MSG symbol
                  </p>
                </div>
                
                {/* AI Text Optimizer */}
                <div className="bg-gradient-to-r from-primary/5 to-cyan/5 rounded-lg p-1">
                  <AITextOptimizer 
                    onOptimizedTextSelect={(optimizedText) => setMessage(optimizedText)}
                    className="border-0 bg-transparent"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mintAmount">Mint Amount</Label>
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
                
                <ImageUpload
                  onImageSelect={setTokenImage}
                  onImageRemove={() => setTokenImage("")}
                  selectedImage={tokenImage}
                  disabled={mintToken.isPending}
                />

                {/* Phase 2: Value Attachment Section */}
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
                    Value & Distribution Settings
                  </h4>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="attach-value"
                      checked={attachValue}
                      onCheckedChange={setAttachValue}
                    />
                    <Label htmlFor="attach-value">Attach value to this token</Label>
                  </div>

                  {attachValue && (
                    <div className="space-y-4 ml-6 border-l-2 border-blue-200 pl-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="attached-value">Total Value Pool</Label>
                          <Input
                            id="attached-value"
                            type="number"
                            step="0.001"
                            min="0"
                            value={attachedValue}
                            onChange={(e) => setAttachedValue(e.target.value)}
                            placeholder="10.0"
                          />
                          <p className="text-xs text-muted-foreground">
                            Total value to distribute among all tokens
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currency">Currency</Label>
                          <select
                            id="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-600"
                          >
                            <option value="SOL">SOL</option>
                            <option value="USDC">USDC</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Value Per Token: {attachedValue && mintAmount ? (parseFloat(attachedValue) / parseInt(mintAmount)).toFixed(6) : '0'} {currency}</Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically calculated based on total pool and mint amount
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

                {/* Free Flutterbye Section */}
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-purple-500" />
                    Special Mint Options
                  </h4>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="free-flutterbye"
                      checked={isFreeFlutterbye}
                      onCheckedChange={setIsFreeFlutterbye}
                    />
                    <Label htmlFor="free-flutterbye">Create as Free Flutterbye mint</Label>
                  </div>
                  
                  {isFreeFlutterbye && (
                    <div className="ml-6 p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        This token will be created as a special Free Flutterbye mint, eligible for redemption codes and special distribution.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="memo">Memo (Optional)</Label>
                    <Textarea
                      id="memo"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="Add any notes or special instructions for this token..."
                      rows={3}
                    />
                  </div>
                </div>
                
                <Card className="bg-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-4 h-4" />
                      <h4 className="font-semibold">Fee Structure</h4>
                    </div>
                    <div className="text-sm space-y-1">
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
                      {attachValue && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Value Pool:</span>
                          <span>{(parseFloat(attachedValue) || 0).toFixed(3)} {currency}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold border-t border-slate-600 pt-2">
                        <span>Total Cost:</span>
                        <span className="text-primary">{calculateTotalCost().toFixed(3)} SOL</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Button 
                  type="submit" 
                  disabled={mintToken.isPending || remainingChars < 0}
                  className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-blue-500 hover:to-primary py-4 text-lg cyber-glow"
                >
                  {mintToken.isPending ? "Minting..." : "Mint Tokens"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Preview */}
          <Card className="glassmorphism">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Token Preview</h3>
              
              <div className="bg-slate-700/50 p-6 rounded-xl border-2 border-dashed border-slate-600">
                <div className="text-center">
                  {tokenImage ? (
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden">
                      <img 
                        src={`data:image/png;base64,${tokenImage}`}
                        alt="Token preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center">
                      <Coins className="text-2xl text-white" />
                    </div>
                  )}
                  <h4 className="text-lg font-bold mb-2">
                    {message || "Your Message Token"}
                  </h4>
                  <Badge variant="secondary" className="mb-4">
                    FLBY-MSG
                  </Badge>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Supply:</span>
                      <span>{mintAmount || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Value per Token:</span>
                      <span>{valuePerToken ? `${valuePerToken} SOL` : "Free"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Creator:</span>
                      <span className="text-primary">Connected Wallet</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Recent Mints</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                    <div>
                      <p className="font-semibold">HodlForDiamondHands</p>
                      <p className="text-xs text-muted-foreground">FlBY-MSG • 500 tokens</p>
                    </div>
                    <span className="text-primary font-semibold">0.1 SOL</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                    <div>
                      <p className="font-semibold">JoinTheHiveNow</p>
                      <p className="text-xs text-muted-foreground">FlBY-MSG • 1000 tokens</p>
                    </div>
                    <span className="text-primary font-semibold">0.05 SOL</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
