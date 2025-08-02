import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Coins, DollarSign, Zap } from "lucide-react";

export interface Currency {
  symbol: string;
  name: string;
  icon: React.ComponentType;
  address?: string;
  decimals: number;
  isNative?: boolean;
  isFlby?: boolean;
  exchangeRate?: number; // Rate to SOL
}

export const supportedCurrencies: Currency[] = [
  {
    symbol: "SOL",
    name: "Solana",
    icon: Coins,
    decimals: 9,
    isNative: true,
    exchangeRate: 1
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: DollarSign,
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
    exchangeRate: 0.01 // 1 USDC = 0.01 SOL (example rate)
  },
  {
    symbol: "FLBY",
    name: "Flutterbye Token",
    icon: Zap,
    address: "FLBY1234567890123456789012345678901234567890", // Placeholder
    decimals: 6,
    isFlby: true,
    exchangeRate: 0.001 // 1 FLBY = 0.001 SOL (example rate)
  }
];

interface CurrencySelectorProps {
  value: string;
  onValueChange: (currency: Currency) => void;
  disabled?: boolean;
  showExchangeRates?: boolean;
  excludeFlby?: boolean;
}

export default function CurrencySelector({ 
  value, 
  onValueChange, 
  disabled = false,
  showExchangeRates = false,
  excludeFlby = false
}: CurrencySelectorProps) {
  const availableCurrencies = excludeFlby 
    ? supportedCurrencies.filter(c => !c.isFlby)
    : supportedCurrencies;

  const selectedCurrency = availableCurrencies.find(c => c.symbol === value);

  return (
    <div className="space-y-2">
      <Select 
        value={value} 
        onValueChange={(symbol) => {
          const currency = availableCurrencies.find(c => c.symbol === symbol);
          if (currency) onValueChange(currency);
        }}
        disabled={disabled}
      >
        <SelectTrigger className="pulse-border">
          <SelectValue>
            {selectedCurrency && (
              <div className="flex items-center gap-2">
                <selectedCurrency.icon className="w-4 h-4" />
                <span>{selectedCurrency.symbol}</span>
                {selectedCurrency.isFlby && (
                  <Badge variant="secondary" className="text-xs">NATIVE</Badge>
                )}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableCurrencies.map((currency) => (
            <SelectItem key={currency.symbol} value={currency.symbol}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <currency.icon className="w-4 h-4" />
                  <span>{currency.symbol}</span>
                  <span className="text-muted-foreground text-xs">({currency.name})</span>
                </div>
                <div className="flex items-center gap-2">
                  {currency.isNative && (
                    <Badge variant="outline" className="text-xs">NATIVE</Badge>
                  )}
                  {currency.isFlby && (
                    <Badge variant="default" className="text-xs">FLBY</Badge>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {showExchangeRates && selectedCurrency && !selectedCurrency.isNative && (
        <div className="text-xs text-muted-foreground">
          1 {selectedCurrency.symbol} = {selectedCurrency.exchangeRate} SOL
        </div>
      )}
    </div>
  );
}