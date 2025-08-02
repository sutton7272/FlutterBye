import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TokenCard from "@/components/token-card";
import { Link } from "wouter";
import { type Token, type TokenHolding } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, Wallet, Coins, CreditCard, Download } from "lucide-react";

export default function Portfolio() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("owned");
  
  // Mock user ID - in real app, this would come from wallet connection
  const userId = "user-1";
  
  const { data: tokens = [] } = useQuery<Token[]>({
    queryKey: ["/api/tokens"],
  });

  const { data: holdings = [] } = useQuery<TokenHolding[]>({
    queryKey: ["/api/users", userId, "holdings"],
  });

  // Mock portfolio data
  const portfolioStats = {
    totalValue: "12.75",
    tokensOwned: 47,
    tokensCreated: 8,
    creditsAvailable: "2.4"
  };

  // Mock owned tokens with price changes
  const ownedTokensWithData = [
    { token: tokens[0], quantity: 5, priceChange: 15.2 },
    { token: tokens[1], quantity: 12, priceChange: 8.5 },
    { token: tokens[2], quantity: 2, priceChange: -2.1 },
  ].filter(item => item.token);

  const handleSellToken = (token: Token) => {
    toast({
      title: "Sell Order Placed",
      description: `Listing ${token.message} tokens for sale`,
    });
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: "Action Initiated",
      description: `${action} functionality coming soon`,
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Your FlBY-MSG Portfolio</h1>
          <p className="text-xl text-muted-foreground">Manage your created and owned message tokens</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portfolio Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="premium-card electric-frame">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gradient">Portfolio Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Value</span>
                    <span className="text-2xl font-bold text-primary">{portfolioStats.totalValue} SOL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tokens Owned</span>
                    <span className="text-xl font-semibold">{portfolioStats.tokensOwned}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tokens Created</span>
                    <span className="text-xl font-semibold">{portfolioStats.tokensCreated}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Credits Available</span>
                    <span className="text-xl font-semibold">{portfolioStats.creditsAvailable} SOL</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glassmorphism">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/mint">
                    <Button className="w-full bg-gradient-to-r from-primary to-blue-500">
                      <Coins className="w-4 h-4 mr-2" />
                      Create New Token
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full glassmorphism"
                    onClick={() => handleQuickAction("Redeem Credits")}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Redeem Credits
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full glassmorphism"
                    onClick={() => handleQuickAction("Export Portfolio")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Portfolio Content */}
          <div className="lg:col-span-2">
            <Card className="glassmorphism">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="owned">Owned Tokens</TabsTrigger>
                    <TabsTrigger value="created">Created Tokens</TabsTrigger>
                    <TabsTrigger value="history">Trading History</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="owned" className="mt-6">
                    {ownedTokensWithData.length === 0 ? (
                      <div className="text-center py-12">
                        <Wallet className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No tokens owned</h3>
                        <p className="text-muted-foreground mb-6">Start by purchasing tokens from the marketplace</p>
                        <Link href="/marketplace">
                          <Button className="bg-gradient-to-r from-primary to-blue-500">
                            Browse Marketplace
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {ownedTokensWithData.map(({ token, quantity, priceChange }) => (
                          <div key={token.id} className="flex items-center justify-between bg-slate-700/50 p-4 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center">
                                <Coins className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{token.message}</h4>
                                <p className="text-sm text-muted-foreground">FLBY-MSG • Qty: {quantity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary">{(parseFloat(token.valuePerToken) * quantity).toFixed(3)} SOL</p>
                              <p className={`text-sm flex items-center ${
                                priceChange >= 0 ? "text-green-400" : "text-red-400"
                              }`}>
                                {priceChange >= 0 ? (
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 mr-1" />
                                )}
                                {priceChange >= 0 ? "+" : ""}{priceChange}%
                              </p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleSellToken(token)}
                            >
                              Sell
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="created" className="mt-6">
                    {tokens.length === 0 ? (
                      <div className="text-center py-12">
                        <Coins className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No tokens created</h3>
                        <p className="text-muted-foreground mb-6">Create your first tokenized message</p>
                        <Link href="/mint">
                          <Button className="bg-gradient-to-r from-primary to-blue-500">
                            Create Token
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tokens.slice(0, 4).map((token) => (
                          <TokenCard
                            key={token.id}
                            token={token}
                            showActions={false}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                        <TrendingUp className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No trading history</h3>
                      <p className="text-muted-foreground">Your transaction history will appear here</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
