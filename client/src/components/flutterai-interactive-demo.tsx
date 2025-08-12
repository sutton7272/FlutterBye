import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Play, Brain } from "lucide-react";

export function FlutterAIInteractiveDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const startInteractiveDemo = () => {
    setIsOpen(true);
    toast({
      title: "AI Demo Started",
      description: "FlutterAI intelligence demo is now running!"
    });
  };

  const closeDemo = () => {
    setIsOpen(false);
  };

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
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">🧠 AI Intelligence Analysis</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm max-w-md mx-auto">
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
                </div>
                <div className="mt-4 p-3 bg-electric-blue/10 rounded border-l-2 border-electric-blue max-w-md mx-auto">
                  <div className="text-electric-blue text-xs font-medium">🚀 REVOLUTIONARY: Advanced AI intelligence system operational!</div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}