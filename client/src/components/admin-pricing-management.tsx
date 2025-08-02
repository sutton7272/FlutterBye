import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings,
  DollarSign,
  TrendingUp,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Edit,
  Plus,
  Trash2
} from "lucide-react";

interface PricingTier {
  id: string;
  name: string;
  minQuantity: number;
  maxQuantity: number;
  basePrice: number;
  discount: number;
  isActive: boolean;
}

interface RedemptionFeeConfig {
  percentage: number;
  minimumFee: number;
  maximumFee: number;
  isActive: boolean;
}

interface ValueCreationFeeConfig {
  percentage: number;
  minimumFee: number;
  maximumFee: number;
  isActive: boolean;
}

interface PlatformFeeConfig {
  mintingFeePercentage: number;
  valueAttachmentFeePercentage: number;
  redemptionFeePercentage: number;
  minimumPlatformFee: number;
  maximumPlatformFee: number;
  feeWalletAddress: string;
}

export function AdminPricingManagement() {
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    { id: "1", name: "Starter", minQuantity: 1, maxQuantity: 99, basePrice: 0.01, discount: 0, isActive: true },
    { id: "2", name: "Growth", minQuantity: 100, maxQuantity: 499, basePrice: 0.009, discount: 10, isActive: true },
    { id: "3", name: "Scale", minQuantity: 500, maxQuantity: 1999, basePrice: 0.008, discount: 20, isActive: true },
    { id: "4", name: "Enterprise", minQuantity: 2000, maxQuantity: 10000, basePrice: 0.007, discount: 30, isActive: true },
  ]);

  const [redemptionFees, setRedemptionFees] = useState<RedemptionFeeConfig>({
    percentage: 5,
    minimumFee: 0.001,
    maximumFee: 0.1,
    isActive: true
  });

  const [valueCreationFees, setValueCreationFees] = useState<ValueCreationFeeConfig>({
    percentage: 2.5,
    minimumFee: 0.0005,
    maximumFee: 0.05,
    isActive: true
  });

  const [platformFees, setPlatformFees] = useState<PlatformFeeConfig>({
    mintingFeePercentage: 1,
    valueAttachmentFeePercentage: 2.5,
    redemptionFeePercentage: 5,
    minimumPlatformFee: 0.0001,
    maximumPlatformFee: 0.2,
    feeWalletAddress: "11111111111111111111111111111111"
  });

  const [globalSettings, setGlobalSettings] = useState({
    gasFeeIncluded: true,
    dynamicPricingEnabled: true,
    bulkDiscountsEnabled: true,
    minimumMintAmount: 1,
    maximumMintAmount: 10000
  });

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleTierUpdate = (tierId: string, updates: Partial<PricingTier>) => {
    setPricingTiers(tiers => 
      tiers.map(tier => 
        tier.id === tierId ? { ...tier, ...updates } : tier
      )
    );
  };

  const addNewTier = () => {
    const newTier: PricingTier = {
      id: Date.now().toString(),
      name: "Custom",
      minQuantity: 10001,
      maxQuantity: 50000,
      basePrice: 0.006,
      discount: 40,
      isActive: true
    };
    setPricingTiers([...pricingTiers, newTier]);
  };

  const removeTier = (tierId: string) => {
    setPricingTiers(tiers => tiers.filter(tier => tier.id !== tierId));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real app, would save to backend with all pricing configuration
    
    setIsSaving(false);
    setIsEditing(null);
  };

  const getTierBadgeColor = (discount: number) => {
    if (discount >= 30) return "bg-green-100 text-green-800 border-green-200";
    if (discount >= 20) return "bg-purple-100 text-purple-800 border-purple-200";
    if (discount >= 10) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="space-y-6">
      
      <Tabs defaultValue="tiers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tiers">Pricing Tiers</TabsTrigger>
          <TabsTrigger value="creation-fees">Creation Fees</TabsTrigger>
          <TabsTrigger value="redemption-fees">Redemption Fees</TabsTrigger>
          <TabsTrigger value="global">Global Settings</TabsTrigger>
        </TabsList>

        {/* Pricing Tiers Tab */}
        <TabsContent value="tiers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Bulk Pricing Tiers Management
              </CardTitle>
              <CardDescription>
                Configure automatic bulk discounts and pricing tiers for token minting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Active Pricing Tiers</h4>
                  <p className="text-sm text-muted-foreground">
                    {pricingTiers.filter(t => t.isActive).length} active tiers
                  </p>
                </div>
                <Button onClick={addNewTier} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tier
                </Button>
              </div>

              <div className="space-y-3">
                {pricingTiers.map((tier) => (
                  <Card key={tier.id} className={`transition-all ${
                    isEditing === tier.id ? 'ring-2 ring-purple-500' : ''
                  }`}>
                    <CardContent className="pt-4">
                      {isEditing === tier.id ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <Label>Tier Name</Label>
                            <Input
                              value={tier.name}
                              onChange={(e) => handleTierUpdate(tier.id, { name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Min Quantity</Label>
                            <Input
                              type="number"
                              value={tier.minQuantity}
                              onChange={(e) => handleTierUpdate(tier.id, { minQuantity: parseInt(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label>Max Quantity</Label>
                            <Input
                              type="number"
                              value={tier.maxQuantity}
                              onChange={(e) => handleTierUpdate(tier.id, { maxQuantity: parseInt(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label>Base Price (SOL)</Label>
                            <Input
                              type="number"
                              step="0.001"
                              value={tier.basePrice}
                              onChange={(e) => handleTierUpdate(tier.id, { basePrice: parseFloat(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label>Discount (%)</Label>
                            <Input
                              type="number"
                              value={tier.discount}
                              onChange={(e) => handleTierUpdate(tier.id, { discount: parseInt(e.target.value) })}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={tier.isActive}
                              onCheckedChange={(checked) => handleTierUpdate(tier.id, { isActive: checked })}
                            />
                            <Label>Active</Label>
                          </div>
                          <Button
                            onClick={() => setIsEditing(null)}
                            size="sm"
                            className="mt-6"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Done
                          </Button>
                          <Button
                            onClick={() => removeTier(tier.id)}
                            variant="destructive"
                            size="sm"
                            className="mt-6"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge className={getTierBadgeColor(tier.discount)}>
                              {tier.name}
                            </Badge>
                            <div className="text-sm">
                              <span className="font-medium">
                                {tier.minQuantity.toLocaleString()} - {tier.maxQuantity.toLocaleString()} tokens
                              </span>
                              <br />
                              <span className="text-muted-foreground">
                                {tier.basePrice} SOL/token
                                {tier.discount > 0 && ` (${tier.discount}% discount)`}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {tier.isActive ? (
                              <Badge variant="default">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                            <Button
                              onClick={() => setIsEditing(tier.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Value Creation Fees Tab */}
        <TabsContent value="creation-fees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Value Attachment Creation Fees
              </CardTitle>
              <CardDescription>
                Configure platform fees when users attach value to newly created tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Creation Fee Percentage</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={valueCreationFees.percentage}
                      onChange={(e) => setValueCreationFees({
                        ...valueCreationFees,
                        percentage: parseFloat(e.target.value)
                      })}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Fee charged when attaching value to tokens during creation
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Creation Fee (SOL)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={valueCreationFees.minimumFee}
                    onChange={(e) => setValueCreationFees({
                      ...valueCreationFees,
                      minimumFee: parseFloat(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Creation Fee (SOL)</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={valueCreationFees.maximumFee}
                    onChange={(e) => setValueCreationFees({
                      ...valueCreationFees,
                      maximumFee: parseFloat(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Value Creation Fees</Label>
                  <p className="text-sm text-muted-foreground">
                    Charge fees when users attach value to tokens during minting
                  </p>
                </div>
                <Switch
                  checked={valueCreationFees.isActive}
                  onCheckedChange={(checked) => setValueCreationFees({
                    ...valueCreationFees,
                    isActive: checked
                  })}
                />
              </div>

              <Separator />

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  Creation Fee Calculation Preview
                </h4>
                <div className="text-sm space-y-1">
                  <p>• Attaching 0.1 SOL: Fee = {Math.min(Math.max((0.1 * valueCreationFees.percentage / 100), valueCreationFees.minimumFee), valueCreationFees.maximumFee).toFixed(4)} SOL</p>
                  <p>• Attaching 0.5 SOL: Fee = {Math.min(Math.max((0.5 * valueCreationFees.percentage / 100), valueCreationFees.minimumFee), valueCreationFees.maximumFee).toFixed(4)} SOL</p>
                  <p>• Attaching 2 SOL: Fee = {Math.min(Math.max((2 * valueCreationFees.percentage / 100), valueCreationFees.minimumFee), valueCreationFees.maximumFee).toFixed(4)} SOL</p>
                </div>
                <Separator className="my-3" />
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Creation fees are deducted from the attached value before it's distributed to the escrow wallet.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Platform Fee Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Platform Fee Collection Settings
              </CardTitle>
              <CardDescription>
                Configure comprehensive platform fee structure and collection wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Token Minting Fee (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={platformFees.mintingFeePercentage}
                    onChange={(e) => setPlatformFees({
                      ...platformFees,
                      mintingFeePercentage: parseFloat(e.target.value)
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Fee on base token minting cost
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Value Attachment Fee (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={platformFees.valueAttachmentFeePercentage}
                    onChange={(e) => setPlatformFees({
                      ...platformFees,
                      valueAttachmentFeePercentage: parseFloat(e.target.value)
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Fee when attaching value during creation
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Value Redemption Fee (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={platformFees.redemptionFeePercentage}
                    onChange={(e) => setPlatformFees({
                      ...platformFees,
                      redemptionFeePercentage: parseFloat(e.target.value)
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Fee when burning tokens to redeem value
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Platform Fee (SOL)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={platformFees.minimumPlatformFee}
                    onChange={(e) => setPlatformFees({
                      ...platformFees,
                      minimumPlatformFee: parseFloat(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Platform Fee (SOL)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={platformFees.maximumPlatformFee}
                    onChange={(e) => setPlatformFees({
                      ...platformFees,
                      maximumPlatformFee: parseFloat(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Platform Fee Collection Wallet Address</Label>
                <Input
                  value={platformFees.feeWalletAddress}
                  onChange={(e) => setPlatformFees({
                    ...platformFees,
                    feeWalletAddress: e.target.value
                  })}
                  placeholder="Solana wallet address for fee collection"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  All platform fees will be automatically transferred to this wallet address
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-yellow-600" />
                  Revenue Calculation Example
                </h4>
                <div className="text-sm space-y-1">
                  <p><strong>Scenario:</strong> User mints 1000 tokens at 0.01 SOL each with 1 SOL attached value</p>
                  <p>• Minting cost: 10 SOL → Platform fee: {(10 * platformFees.mintingFeePercentage / 100).toFixed(4)} SOL</p>
                  <p>• Value attachment: 1 SOL → Platform fee: {(1 * platformFees.valueAttachmentFeePercentage / 100).toFixed(4)} SOL</p>
                  <p>• Later redemption: 1 SOL → Platform fee: {(1 * platformFees.redemptionFeePercentage / 100).toFixed(4)} SOL</p>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    <strong>Total potential revenue: {((10 * platformFees.mintingFeePercentage / 100) + (1 * platformFees.valueAttachmentFeePercentage / 100) + (1 * platformFees.redemptionFeePercentage / 100)).toFixed(4)} SOL</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Redemption Fees Tab */}
        <TabsContent value="redemption-fees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Value Redemption Fee Structure
              </CardTitle>
              <CardDescription>
                Configure platform fees when users burn tokens to redeem attached value
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Fee Percentage</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={redemptionFees.percentage}
                      onChange={(e) => setRedemptionFees({
                        ...redemptionFees,
                        percentage: parseFloat(e.target.value)
                      })}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Fee (SOL)</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={redemptionFees.minimumFee}
                    onChange={(e) => setRedemptionFees({
                      ...redemptionFees,
                      minimumFee: parseFloat(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Fee (SOL)</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={redemptionFees.maximumFee}
                    onChange={(e) => setRedemptionFees({
                      ...redemptionFees,
                      maximumFee: parseFloat(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Enable Redemption Fees</Label>
                <Switch
                  checked={redemptionFees.isActive}
                  onCheckedChange={(checked) => setRedemptionFees({
                    ...redemptionFees,
                    isActive: checked
                  })}
                />
              </div>

              <Separator />

              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Redemption Fee Calculation Preview
                </h4>
                <div className="text-sm space-y-1">
                  <p>• Redeeming 0.01 SOL: Fee = {((0.01 * redemptionFees.percentage / 100)).toFixed(4)} SOL</p>
                  <p>• Redeeming 0.1 SOL: Fee = {Math.min(Math.max((0.1 * redemptionFees.percentage / 100), redemptionFees.minimumFee), redemptionFees.maximumFee).toFixed(4)} SOL</p>
                  <p>• Redeeming 1 SOL: Fee = {Math.min(Math.max((1 * redemptionFees.percentage / 100), redemptionFees.minimumFee), redemptionFees.maximumFee).toFixed(4)} SOL</p>
                </div>
                <Separator className="my-3" />
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  Redemption fees are deducted from the value being redeemed before transfer to the user.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Global Settings Tab */}
        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Global Pricing Settings
              </CardTitle>
              <CardDescription>
                Platform-wide pricing configuration and limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Include Gas Fees in Pricing</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically include all blockchain gas fees in displayed prices
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.gasFeeIncluded}
                    onCheckedChange={(checked) => setGlobalSettings({
                      ...globalSettings,
                      gasFeeIncluded: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dynamic Pricing</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable real-time pricing adjustments based on network conditions
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.dynamicPricingEnabled}
                    onCheckedChange={(checked) => setGlobalSettings({
                      ...globalSettings,
                      dynamicPricingEnabled: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Bulk Discounts</Label>
                    <p className="text-sm text-muted-foreground">
                      Apply automatic bulk discounts based on quantity tiers
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.bulkDiscountsEnabled}
                    onCheckedChange={(checked) => setGlobalSettings({
                      ...globalSettings,
                      bulkDiscountsEnabled: checked
                    })}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Mint Amount</Label>
                  <Input
                    type="number"
                    value={globalSettings.minimumMintAmount}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      minimumMintAmount: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Mint Amount</Label>
                  <Input
                    type="number"
                    value={globalSettings.maximumMintAmount}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      maximumMintAmount: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">Pricing Configuration</h4>
              <p className="text-sm text-muted-foreground">
                Changes will be applied immediately to all new token minting operations
              </p>
            </div>
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}