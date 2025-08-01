import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Calculator, 
  Zap, 
  TrendingDown, 
  Shield, 
  Info,
  CheckCircle
} from "lucide-react";

interface PricingTier {
  name: string;
  minQuantity: number;
  maxQuantity: number;
  basePrice: string;
  discount: string;
  color: string;
}

interface PricingCalculation {
  quantity: number;
  pricePerToken: string;
  totalCost: string;
  discount: string;
  gasFeeIncluded: boolean;
  appliedTier: string;
  platformFee?: string;
  valueAttachmentFee?: string;
  totalWithFees?: string;
}

interface FlexiblePricingCalculatorProps {
  onPricingChange: (calculation: PricingCalculation) => void;
  quantity: number;
  hasAttachedValue?: boolean;
  attachedValue?: string;
}

// Mock pricing tiers - in real app, fetch from admin settings
const PRICING_TIERS: PricingTier[] = [
  { name: "Starter", minQuantity: 1, maxQuantity: 99, basePrice: "0.01", discount: "0", color: "gray" },
  { name: "Growth", minQuantity: 100, maxQuantity: 499, basePrice: "0.009", discount: "10", color: "blue" },
  { name: "Scale", minQuantity: 500, maxQuantity: 1999, basePrice: "0.008", discount: "20", color: "purple" },
  { name: "Enterprise", minQuantity: 2000, maxQuantity: 10000, basePrice: "0.007", discount: "30", color: "green" }
];

export function FlexiblePricingCalculator({ 
  onPricingChange, 
  quantity, 
  hasAttachedValue, 
  attachedValue = "0" 
}: FlexiblePricingCalculatorProps) {
  const [calculation, setCalculation] = useState<PricingCalculation>({
    quantity: 1,
    pricePerToken: "0.01",
    totalCost: "0.01",
    discount: "0",
    gasFeeIncluded: true,
    appliedTier: "Starter"
  });

  useEffect(() => {
    calculatePricing(quantity);
  }, [quantity, hasAttachedValue, attachedValue]);

  const calculatePricing = (qty: number) => {
    if (qty <= 0) qty = 1;
    
    // Find applicable tier
    const tier = PRICING_TIERS.find(t => qty >= t.minQuantity && qty <= t.maxQuantity) || PRICING_TIERS[0];
    
    const pricePerToken = parseFloat(tier.basePrice);
    const baseCost = pricePerToken * qty;
    
    // Calculate fees if value is attached
    let platformFee = 0;
    let valueAttachmentFee = 0;
    
    if (hasAttachedValue && parseFloat(attachedValue) > 0) {
      // Platform fee on minting cost (1%)
      platformFee = baseCost * 0.01;
      
      // Value attachment fee (2.5%)
      const attachedValueNum = parseFloat(attachedValue);
      valueAttachmentFee = Math.min(Math.max(attachedValueNum * 0.025, 0.0005), 0.05);
    }
    
    const totalCost = baseCost.toFixed(6);
    const totalWithFees = (baseCost + platformFee + valueAttachmentFee).toFixed(6);
    
    const newCalculation: PricingCalculation = {
      quantity: qty,
      pricePerToken: tier.basePrice,
      totalCost,
      discount: tier.discount,
      gasFeeIncluded: true,
      appliedTier: tier.name,
      platformFee: platformFee > 0 ? platformFee.toFixed(6) : undefined,
      valueAttachmentFee: valueAttachmentFee > 0 ? valueAttachmentFee.toFixed(6) : undefined,
      totalWithFees: hasAttachedValue ? totalWithFees : totalCost
    };
    
    setCalculation(newCalculation);
    onPricingChange(newCalculation);
  };

  const getProgressValue = () => {
    const maxTier = PRICING_TIERS[PRICING_TIERS.length - 1];
    return Math.min((quantity / maxTier.maxQuantity) * 100, 100);
  };

  const getTierColor = (tierName: string) => {
    const tier = PRICING_TIERS.find(t => t.name === tierName);
    switch (tier?.color) {
      case "blue": return "text-blue-600 bg-blue-100 dark:bg-blue-950/30";
      case "purple": return "text-purple-600 bg-purple-100 dark:bg-purple-950/30";
      case "green": return "text-green-600 bg-green-100 dark:bg-green-950/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-950/30";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Current Pricing Display */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-yellow-600" />
            Smart Pricing Calculation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Quantity</p>
              <p className="text-2xl font-bold">{quantity.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Per Token</p>
              <p className="text-2xl font-bold">{calculation.pricePerToken} SOL</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Base Cost</p>
              <p className="text-2xl font-bold">{calculation.totalCost} SOL</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tier</p>
              <Badge className={getTierColor(calculation.appliedTier)}>
                {calculation.appliedTier}
              </Badge>
            </div>
          </div>
          
          {hasAttachedValue && (calculation.platformFee || calculation.valueAttachmentFee) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Fee Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {calculation.platformFee && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee (1%):</span>
                      <span className="font-medium">{calculation.platformFee} SOL</span>
                    </div>
                  )}
                  {calculation.valueAttachmentFee && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Value Attachment Fee:</span>
                      <span className="font-medium">{calculation.valueAttachmentFee} SOL</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span>Total with Fees:</span>
                    <span className="text-green-600">{calculation.totalWithFees} SOL</span>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {parseFloat(calculation.discount) > 0 && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                {calculation.discount}% bulk discount applied! You save{" "}
                {(parseFloat(PRICING_TIERS[0].basePrice) * quantity - parseFloat(calculation.totalCost)).toFixed(4)} SOL
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Tiers Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Pricing Tiers & Discounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {PRICING_TIERS.map((tier, index) => (
              <div key={tier.name} className={`p-3 rounded-lg border-2 transition-all ${
                calculation.appliedTier === tier.name 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getTierColor(tier.name)}>
                      {tier.name}
                    </Badge>
                    <div className="text-sm">
                      <span className="font-medium">
                        {tier.minQuantity.toLocaleString()} - {tier.maxQuantity.toLocaleString()} tokens
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{tier.basePrice} SOL/token</p>
                    {tier.discount !== "0" && (
                      <p className="text-xs text-green-600 font-medium">
                        {tier.discount}% discount
                      </p>
                    )}
                  </div>
                </div>
                {calculation.appliedTier === tier.name && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-purple-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Currently applied to your order</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Discount Progress</span>
              <span>{Math.round(getProgressValue())}%</span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Increase quantity to unlock better pricing tiers
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features Included */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            What's Included
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Gas fees included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Instant blockchain confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Enhanced Solscan metadata</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Automatic token distribution</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Value attachment capability</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">24/7 platform support</span>
            </div>
          </div>

          <Separator className="my-4" />
          
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Transparent Pricing</p>
              <p>
                All gas fees, network costs, and platform services are included in the displayed price. 
                No hidden fees or surprise charges during minting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}