import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

export default function SimpleMultiChainTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Multi-Chain Intelligence Test</h1>
          <p className="text-slate-300">Simple test to verify routing is working</p>
        </div>

        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <Globe className="w-8 h-8 text-cyan-400" />
            <CardTitle className="text-white">Test Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-white">
              <p className="mb-4">✅ Route is working correctly!</p>
              <p className="mb-4">✅ Component is rendering!</p>
              <p className="mb-4">✅ Styling is applied!</p>
              <p className="text-cyan-400">Ready to load full Multi-Chain Intelligence Dashboard</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}