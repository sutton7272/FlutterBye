import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SimpleMultiChain() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/multi-chain/chains')
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-white text-center">
          Multi-Chain Intelligence Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((chain: any, index: number) => (
            <Card key={index} className="bg-slate-800/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  {chain.name}
                  <span className="text-blue-400">({chain.symbol})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-300">Network: {chain.name}</p>
                  <p className="text-gray-300">Currency: {chain.nativeCurrency}</p>
                  <p className="text-green-400">Status: Online</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}