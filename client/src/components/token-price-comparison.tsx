import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { TrendingDown, DollarSign, Zap, Crown, Award, Star } from "lucide-react";

interface PricingTier {
  id: string;
  tierName: string;
  minTokens: number;
  maxTokens: number | null;
  basePrice: number;
  discountPercentage: string;
  description: string;
  isActive: boolean;
}

interface PriceComparison {
  quantity: number;
  pricePerToken: number;
  totalPrice: number;
  savings: number;
  tier: PricingTier;
}

const PRESET_QUANTITIES = [1, 10, 50, 100, 500, 1000];

const getTierIcon = (tierName: string) => {
  if (tierName.toLowerCase().includes('premium') || tierName.toLowerCase().includes('enterprise')) {
    return Crown;
  }
  if (tierName.toLowerCase().includes('bulk') || tierName.toLowerCase().includes('volume')) {
    return Award;
  }
  if (tierName.toLowerCase().includes('starter') || tierName.toLowerCase().includes('basic')) {
    return Star;
  }
  return Zap;
};

const getTierColor = (discountPercentage: string) => {
  const discount = parseInt(discountPercentage);
  if (discount >= 25) return "from-purple-600 to-pink-600";
  if (discount >= 15) return "from-blue-600 to-cyan-600";
  if (discount >= 5) return "from-green-600 to-emerald-600";
  return "from-gray-600 to-slate-600";
};

export function TokenPriceComparison({ onQuantitySelect }: { onQuantitySelect?: (quantity: number) => void }) {
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [priceComparisons, setPriceComparisons] = useState<PriceComparison[]>([]);

  // Fetch pricing tiers
  const { data: pricingTiers, isLoading: tiersLoading } = useQuery({
    queryKey: ["/api/admin/pricing-tiers"],
    retry: false,
  });

  // Calculate price comparisons when tiers load
  useEffect(() => {
    if (pricingTiers && Array.isArray(pricingTiers)) {
      const calculateComparisons = async () => {
        const comparisons: PriceComparison[] = [];
        
        for (const quantity of PRESET_QUANTITIES) {
          try {
            const response = await fetch("/api/calculate-token-price", {
              method: "POST",
              body: JSON.stringify({ quantity }),
              headers: { "Content-Type": "application/json" }
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Calculate savings compared to base price (quantity 1)
            const basePrice = pricingTiers.find((tier: PricingTier) => tier.minTokens === 1)?.basePrice || 2.00;
            const savings = (basePrice - data.pricePerToken) * quantity;
            
            comparisons.push({
              quantity,
              pricePerToken: data.pricePerToken,
              totalPrice: data.totalPrice,
              savings: Math.max(0, savings),
              tier: data.tier
            });
          } catch (error) {
            console.error(`Failed to calculate price for quantity ${quantity}:`, error);
          }
        }
        
        setPriceComparisons(comparisons);
      };

      calculateComparisons();
    }
  }, [pricingTiers]);

  const handleQuantitySelect = (quantity: number) => {
    setSelectedQuantity(quantity);
    onQuantitySelect?.(quantity);
  };

  if (tiersLoading) {
    return (
      <Card className="premium-card electric-frame">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gradient">
            <DollarSign className="w-5 h-5 text-electric-green animate-pulse" />
            Price Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="premium-card electric-frame circuit-glow">
      <CardHeader className="border-b border-electric-blue/20">
        <CardTitle className="flex items-center gap-2 text-gradient">
          <DollarSign className="w-5 h-5 text-electric-green animate-pulse" />
          Token Price Comparison
        </CardTitle>
        <p className="text-sm text-gray-400">
          Compare pricing across different quantity tiers and save with volume discounts
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {priceComparisons.map((comparison) => {
            const IconComponent = getTierIcon(comparison.tier?.tierName || "");
            const isSelected = selectedQuantity === comparison.quantity;
            const hasDiscount = comparison.savings > 0;
            
            return (
              <div
                key={comparison.quantity}
                className={`
                  relative overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer
                  ${isSelected 
                    ? 'border-electric-blue bg-gradient-to-br from-blue-900/30 to-green-900/30 scale-105 shadow-lg shadow-electric-blue/25' 
                    : 'border-gray-700 bg-slate-800/50 hover:border-electric-blue/50 hover:bg-slate-800/70'
                  }
                `}
                onClick={() => handleQuantitySelect(comparison.quantity)}
              >
                {/* Background gradient for tier */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getTierColor(comparison.tier?.discountPercentage || "0")} opacity-10`}></div>
                
                <div className="relative p-4 space-y-3">
                  {/* Header with quantity and tier */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-electric-blue" />
                      <span className="font-bold text-white">{comparison.quantity.toLocaleString()}</span>
                      <span className="text-sm text-gray-400">tokens</span>
                    </div>
                    {hasDiscount && (
                      <Badge className="bg-green-600/20 text-green-400 border-green-400 text-xs">
                        {comparison.tier?.discountPercentage}% OFF
                      </Badge>
                    )}
                  </div>

                  {/* Pricing information */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Per Token:</span>
                      <span className="font-bold text-electric-green">
                        ${comparison.pricePerToken.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Total:</span>
                      <span className="text-lg font-bold text-white">
                        ${comparison.totalPrice.toFixed(2)}
                      </span>
                    </div>

                    {hasDiscount && (
                      <div className="flex items-center justify-between text-green-400">
                        <span className="text-sm flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          You Save:
                        </span>
                        <span className="font-bold">
                          ${comparison.savings.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tier information */}
                  {comparison.tier && (
                    <div className="pt-2 border-t border-gray-700">
                      <p className="text-xs text-gray-400 text-center">
                        {comparison.tier.tierName}
                      </p>
                    </div>
                  )}

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-electric-blue rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary section */}
        {priceComparisons.length > 0 && (
          <div className="mt-6 pt-4 border-t border-electric-blue/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-400">Base Price</p>
                <p className="font-bold text-white">
                  ${priceComparisons[0]?.pricePerToken.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Best Discount</p>
                <p className="font-bold text-green-400">
                  {Math.max(...priceComparisons.map(c => parseInt(c.tier?.discountPercentage || "0")))}% OFF
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Max Savings</p>
                <p className="font-bold text-electric-green">
                  ${Math.max(...priceComparisons.map(c => c.savings)).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Tiers Available</p>
                <p className="font-bold text-circuit-teal">
                  {new Set(priceComparisons.map(c => c.tier?.tierName)).size}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action button */}
        {selectedQuantity && (
          <div className="mt-4 pt-4 border-t border-electric-blue/20">
            <Button 
              onClick={() => onQuantitySelect?.(selectedQuantity)}
              className="w-full bg-gradient-to-r from-electric-blue to-circuit-teal hover:from-electric-blue/80 hover:to-circuit-teal/80"
            >
              Mint {selectedQuantity.toLocaleString()} Tokens for ${priceComparisons.find(c => c.quantity === selectedQuantity)?.totalPrice.toFixed(2)}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}