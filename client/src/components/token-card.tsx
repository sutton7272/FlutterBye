import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Token } from "@shared/schema";
import { Coins, TrendingUp, TrendingDown } from "lucide-react";

interface TokenCardProps {
  token: Token;
  onBuy?: () => void;
  onSell?: () => void;
  showActions?: boolean;
  userQuantity?: number;
  priceChange?: number;
}

export default function TokenCard({ 
  token, 
  onBuy, 
  onSell, 
  showActions = true,
  userQuantity,
  priceChange 
}: TokenCardProps) {
  const getIconColor = (message: string) => {
    const hash = message.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const colors = [
      "from-primary to-blue-500",
      "from-green-400 to-blue-500", 
      "from-purple-400 to-pink-500",
      "from-yellow-400 to-orange-500",
      "from-red-400 to-pink-500",
      "from-teal-400 to-blue-500",
      "from-indigo-400 to-purple-500",
      "from-cyan-400 to-blue-500"
    ];
    return colors[hash % colors.length];
  };

  const formatValue = (value: string | null) => {
    if (!value) return "Free";
    const num = parseFloat(value);
    return num === 0 ? "Free" : `${num} SOL`;
  };

  return (
    <Card className="glassmorphism token-card cursor-pointer">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          {token.imageUrl ? (
            <div className="w-12 h-12 mx-auto mb-3 rounded-full overflow-hidden">
              <img 
                src={token.imageUrl}
                alt={token.message || "Token"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${getIconColor(token.message)} rounded-full flex items-center justify-center`}>
              <Coins className="text-xl text-white" />
            </div>
          )}
          <h3 className="font-bold text-lg truncate" title={token.message}>
            {token.message}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {token.symbol}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Supply:</span>
            <span>{token.totalSupply.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Available:</span>
            <span>{token.availableSupply.toLocaleString()}</span>
          </div>
          {userQuantity !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Owned:</span>
              <span className="font-semibold">{userQuantity}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Value:</span>
            <span className="text-primary font-semibold">
              {formatValue(token.valuePerToken)}
            </span>
          </div>
          {priceChange !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Change:</span>
              <span className={`flex items-center font-semibold ${
                priceChange >= 0 ? "text-green-400" : "text-red-400"
              }`}>
                {priceChange >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="space-y-2">
            {onBuy && (
              <Button 
                onClick={onBuy}
                className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-blue-500 hover:to-primary"
              >
                Buy Token
              </Button>
            )}
            {onSell && userQuantity && userQuantity > 0 && (
              <Button 
                onClick={onSell}
                variant="destructive"
                className="w-full"
              >
                Sell Token
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
