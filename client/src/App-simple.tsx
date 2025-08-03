import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Marketplace from "@/pages/marketplace";
import Navbar from "@/components/navbar";

function SimpleApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen" style={{ background: 'transparent' }}>
          <Switch>
            <Route path="/" component={() => (
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-6">
                  <h1 className="text-5xl font-bold text-white mb-4">
                    ⚡ QUANTUM MARKETPLACE ⚡
                  </h1>
                  <p className="text-xl text-gray-300 mb-8">
                    Revolutionary AI-powered trading platform with burn-to-redeem mechanics
                  </p>
                  <a 
                    href="/marketplace" 
                    className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Enter Marketplace
                  </a>
                </div>
              </div>
            )} />
            <Route path="/marketplace" component={() => (
              <>
                <Navbar />
                <Marketplace />
              </>
            )} />
            <Route component={() => (
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
                  <a href="/" className="text-blue-400 hover:text-blue-300">Go Home</a>
                </div>
              </div>
            )} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default SimpleApp;