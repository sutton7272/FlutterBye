import { TransactionHeatmap } from "@/components/transaction-heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Globe, Zap, TrendingUp } from "lucide-react";

function TransactionHeatmapPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Globe className="w-8 h-8 text-purple-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Global Transaction Heat Map
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Real-time visualization of token transactions, mints, transfers, and SMS interactions across the Flutterbye network.
          Watch the pulse of our blockchain ecosystem unfold in real-time.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="animate-pulse">
            <Activity className="w-3 h-3 mr-1" />
            LIVE DATA
          </Badge>
          <Badge variant="outline">
            <Zap className="w-3 h-3 mr-1" />
            REAL-TIME
          </Badge>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              2,341
            </div>
            <div className="text-sm text-muted-foreground">
              Transactions Today
            </div>
            <div className="text-xs text-green-600 mt-1">
              +12% from yesterday
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              847
            </div>
            <div className="text-sm text-muted-foreground">
              Active Wallets
            </div>
            <div className="text-xs text-blue-600 mt-1">
              +8% from yesterday
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              156
            </div>
            <div className="text-sm text-muted-foreground">
              SMS Messages
            </div>
            <div className="text-xs text-purple-600 mt-1">
              +23% from yesterday
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              94.2%
            </div>
            <div className="text-sm text-muted-foreground">
              Network Health
            </div>
            <div className="text-xs text-orange-600 mt-1">
              Excellent
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Heatmap */}
      <TransactionHeatmap />

      {/* Network Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Network Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <div className="font-medium">Peak Activity Hours</div>
                  <div className="text-sm text-muted-foreground">
                    2:00 PM - 6:00 PM UTC
                  </div>
                </div>
                <div className="text-2xl">🔥</div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <div className="font-medium">Most Active Token Type</div>
                  <div className="text-sm text-muted-foreground">
                    Emotional SMS Tokens (43%)
                  </div>
                </div>
                <div className="text-2xl">💝</div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <div className="font-medium">Network Clustering</div>
                  <div className="text-sm text-muted-foreground">
                    Strong social connections detected
                  </div>
                </div>
                <div className="text-2xl">🌐</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Real-time Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Transaction Velocity</span>
                  <span>87%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Network Congestion</span>
                  <span>23%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>SMS Integration Usage</span>
                  <span>64%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Value Distribution Efficiency</span>
                  <span>91%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '91%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use the Heat Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Interactive Controls</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Click nodes to view transaction details</li>
                <li>• Adjust intensity slider to filter activity levels</li>
                <li>• Change time scale to speed up/slow down visualization</li>
                <li>• Use play/pause to control real-time updates</li>
                <li>• Reset button clears the canvas and starts fresh</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Visual Elements</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Node size indicates transaction value</li>
                <li>• Color represents transaction type (mint, transfer, etc.)</li>
                <li>• Connections show token flows between wallets</li>
                <li>• Pulse effects highlight high-activity nodes</li>
                <li>• Grid background provides spatial reference</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TransactionHeatmapPage;