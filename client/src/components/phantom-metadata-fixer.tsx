import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Settings, ExternalLink, Copy, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface PhantomFixerProps {
  tokenMint?: string;
  tokenName?: string;
  tokenSymbol?: string;
}

export function PhantomMetadataFixer({ tokenMint, tokenName, tokenSymbol }: PhantomFixerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    mint: tokenMint || "",
    name: tokenName || "Flutterbye Message",
    symbol: tokenSymbol || "FLBY-MSG",
    secretKey: "",
    uri: "",
    description: ""
  });
  const { toast } = useToast();

  const generateMetadataJson = async () => {
    try {
      const response = await fetch('/api/phantom/generate-metadata-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          symbol: formData.symbol,
          description: formData.description || `${formData.name} - Value-bearing message token on Solana`
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Metadata JSON Generated",
          description: "Copy this JSON and host it at a public URL"
        });
        
        // Copy to clipboard
        navigator.clipboard.writeText(JSON.stringify(data.metadataJson, null, 2));
        
        return data.metadataJson;
      }
    } catch (error) {
      console.error('Error generating metadata JSON:', error);
      toast({
        title: "Error",
        description: "Failed to generate metadata JSON",
        variant: "destructive"
      });
    }
  };

  const fixTokenMetadata = async () => {
    if (!formData.mint || !formData.secretKey || !formData.uri) {
      toast({
        title: "Missing Information",
        description: "Please fill in mint address, secret key, and metadata URI",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/phantom/fix-token-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rpcUrl: "https://api.devnet.solana.com",
          secretKey: formData.secretKey,
          mint: formData.mint,
          name: formData.name,
          symbol: formData.symbol,
          uri: formData.uri
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        toast({
          title: "Success!",
          description: `Token metadata ${data.action} successfully`
        });
      } else {
        throw new Error(data.error || 'Failed to fix metadata');
      }
    } catch (error) {
      console.error('Error fixing token metadata:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fix token metadata",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard"
    });
  };

  return (
    <Card className="glassmorphism border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-electric-blue" />
          Fix Phantom Wallet Token Display
        </CardTitle>
        <p className="text-sm text-gray-400">
          Resolve "Unknown" token display in Phantom by creating proper Metaplex metadata
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {!result ? (
          <>
            {/* Token Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mint">Token Mint Address</Label>
                <Input
                  id="mint"
                  value={formData.mint}
                  onChange={(e) => setFormData({ ...formData, mint: e.target.value })}
                  placeholder="Your token's mint address"
                  className="bg-gray-800 border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretKey">Wallet Secret Key (Base58)</Label>
                <Input
                  id="secretKey"
                  type="password"
                  value={formData.secretKey}
                  onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                  placeholder="Your wallet's secret key"
                  className="bg-gray-800 border-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Token Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symbol">Token Symbol</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your token"
                className="bg-gray-800 border-gray-600"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uri">Metadata JSON URI</Label>
              <div className="flex gap-2">
                <Input
                  id="uri"
                  value={formData.uri}
                  onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
                  placeholder="https://your-domain.com/metadata.json"
                  className="bg-gray-800 border-gray-600"
                />
                <Button
                  onClick={generateMetadataJson}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Generate JSON
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Host the generated JSON at a public URL and paste the link here
              </p>
            </div>

            <Button
              onClick={fixTokenMetadata}
              disabled={isLoading}
              className="w-full electric-gradient"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Fixing Token Metadata...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Fix Phantom Display
                </div>
              )}
            </Button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Success!</span>
              <Badge variant="secondary">{result.action}</Badge>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Transaction Signature:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result.signature)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs font-mono break-all text-electric-blue">
                {result.signature}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-green-400">Next Steps:</h4>
              <ol className="text-sm text-gray-300 space-y-1">
                {result.nextSteps?.map((step: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-electric-blue font-bold">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => window.open(`https://explorer.solana.com/address/${formData.mint}?cluster=devnet`, '_blank')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-3 h-3" />
                View on Explorer
              </Button>
              <Button
                onClick={() => setResult(null)}
                variant="outline"
                size="sm"
              >
                Fix Another Token
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}