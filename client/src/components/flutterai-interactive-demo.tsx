import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Play, Loader2, Brain, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function FlutterAIInteractiveDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [demoResults, setDemoResults] = useState<any>(null);
  const { toast } = useToast();

  // Create mutation hook for demo
  const walletAnalysisMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/ai/wallet-analysis-demo", {
        method: "POST",
        body: { walletAddress: "8o85ELbk7Ny8WNQjCEo5pHjPctcMbWxsK1qC6tYFdHa7" }
      });
      return response;
    },
    onSuccess: (data) => {
      setDemoResults(data);
      toast({
        title: "AI Analysis Complete",
        description: "FlutterAI intelligence results are ready!"
      });
    },
    onError: (error) => {
      toast({
        title: "Demo Error",
        description: "Failed to run AI analysis demo",
        variant: "destructive"
      });
    }
  });

  const startInteractiveDemo = () => {
    setIsOpen(true);
    // Auto-run demo
    setTimeout(() => {
      walletAnalysisMutation.mutate();
    }, 1000);
  };

  const closeDemo = () => {
    setIsOpen(false);
  };

  const isLoading = walletAnalysisMutation.isPending;
  const isCompleted = !!demoResults;

  return (
    <>
      <Button 
        onClick={startInteractiveDemo}
        className="bg-gradient-to-r from-electric-blue to-circuit-teal hover:from-electric-blue/80 hover:to-circuit-teal/80 text-white px-4 py-2 text-sm w-full flex items-center justify-center gap-2 shadow-lg"
      >
        <Play className="w-4 h-4" />
        Start Interactive Demo
      </Button>

      <Dialog open={isOpen} onOpenChange={closeDemo}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border-2 border-electric-blue/30">
          <DialogHeader className="space-y-4 pb-6 border-b border-slate-700">
            <DialogTitle className="text-2xl font-bold text-gradient flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-electric-blue/20 to-purple/20">
                <Brain className="w-6 h-6 text-electric-blue" />
              </div>
              FlutterAI Intelligence Demo
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-6">
            <Card className="electric-frame border-2 border-electric-blue/30 min-h-[400px]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4">🧠 AI Intelligence Analysis</h3>
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-electric-blue animate-spin" />
                        <span className="text-electric-blue font-medium">Running AI Analysis...</span>
                      </div>
                      <div className="text-sm text-gray-300">
                        Analyzing wallet intelligence, behavioral patterns, and predictive insights...
                      </div>
                    </div>
                  ) : isCompleted ? (
                    <div className="space-y-3">
                      <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        AI Analysis Complete!
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Intelligence Score:</span>
                          <Badge className="bg-electric-blue/20 text-electric-blue font-bold">847/1000</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Risk Level:</span>
                          <Badge className="bg-green-500/20 text-green-400">Low</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Portfolio Health:</span>
                          <Badge className="bg-purple-500/20 text-purple-400">Excellent</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Viral Potential:</span>
                          <Badge className="bg-yellow-500/20 text-yellow-400">High</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Trading Score:</span>
                          <Badge className="bg-cyan-500/20 text-cyan-400">892/1000</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Network Activity:</span>
                          <Badge className="bg-orange-500/20 text-orange-400">Very Active</Badge>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-electric-blue/10 rounded border-l-2 border-electric-blue">
                        <div className="text-electric-blue text-xs font-medium">🚀 REVOLUTIONARY: Advanced AI intelligence system operational!</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                      <p className="text-gray-400">Demo will auto-start...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">
                Experience FlutterAI's revolutionary intelligence platform
              </p>
              <Button 
                variant="outline" 
                onClick={closeDemo}
                className="border-slate-600 text-gray-300 hover:bg-slate-800"
              >
                Close Demo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}