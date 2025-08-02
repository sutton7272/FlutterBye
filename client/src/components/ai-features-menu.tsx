import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brain, ArrowLeftRight, TrendingUp, Sparkles, Zap, Target } from "lucide-react";

export function AIFeaturesMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-white hover:text-electric-blue transition-colors relative group"
        >
          <Brain className="w-4 h-4 mr-2" />
          AI Features
          <Sparkles className="w-3 h-3 ml-1 text-electric-green animate-pulse" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-slate-800/95 border-slate-700 backdrop-blur-sm"
        align="center"
      >
        <DropdownMenuLabel className="text-electric-blue font-semibold">
          Revolutionary AI Tools
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        
        <DropdownMenuItem className="text-white hover:bg-slate-700/50 cursor-pointer">
          <Link href="/ai-emotion-analyzer" className="flex items-center gap-3 w-full">
            <div className="p-1 rounded bg-purple-500/20">
              <Brain className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="font-medium">Emotion Analyzer</div>
              <div className="text-xs text-gray-400">AI-powered sentiment pricing</div>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-white hover:bg-slate-700/50 cursor-pointer">
          <Link href="/predictive-analytics" className="flex items-center gap-3 w-full">
            <div className="p-1 rounded bg-blue-500/20">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="font-medium">Predictive Analytics</div>
              <div className="text-xs text-gray-400">Market intelligence & insights</div>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-white hover:bg-slate-700/50 cursor-pointer">
          <Link href="/cross-chain-bridge" className="flex items-center gap-3 w-full">
            <div className="p-1 rounded bg-green-500/20">
              <ArrowLeftRight className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <div className="font-medium">Cross-Chain Bridge</div>
              <div className="text-xs text-gray-400">Multi-blockchain portability</div>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-700" />
        
        <div className="p-2">
          <div className="text-xs text-center text-gray-400 mb-2">
            🚀 World's First AI-Powered Blockchain Messaging
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-electric-green">
            <Zap className="w-3 h-3" />
            <span>Revolutionary Features</span>
            <Target className="w-3 h-3" />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}