import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/components/wallet-adapter";
import Navbar from "@/components/navbar";
import { FloatingActionHub } from "@/components/floating-action-hub";

// Import core pages directly to avoid loading issues
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-slate-900">
            <Switch>
              <Route path="/" component={() => (
                <>
                  <Navbar />
                  <Home />
                  <FloatingActionHub />
                </>
              )} />
              <Route path="/mint" component={() => (
                <>
                  <Navbar />
                  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-8">
                    <div className="max-w-4xl mx-auto">
                      <h1 className="text-4xl font-bold text-center mb-8">Mint Your Token</h1>
                      <p className="text-center text-lg mb-8">Create your 27-character tokenized message and turn it into value</p>
                    </div>
                  </div>
                  <FloatingActionHub />
                </>
              )} />
              <Route path="/marketplace" component={() => (
                <>
                  <Navbar />
                  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-8">
                    <div className="max-w-4xl mx-auto">
                      <h1 className="text-4xl font-bold text-center mb-8">Token Marketplace</h1>
                      <p className="text-center text-lg mb-8">Discover and trade tokenized messages</p>
                    </div>
                  </div>
                  <FloatingActionHub />
                </>
              )} />
              <Route path="/portfolio" component={() => (
                <>
                  <Navbar />
                  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-8">
                    <div className="max-w-4xl mx-auto">
                      <h1 className="text-4xl font-bold text-center mb-8">Your Portfolio</h1>
                      <p className="text-center text-lg mb-8">Manage your tokenized messages and assets</p>
                    </div>
                  </div>
                  <FloatingActionHub />
                </>
              )} />
              <Route path="/redeem" component={() => (
                <>
                  <Navbar />
                  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-8">
                    <div className="max-w-4xl mx-auto">
                      <h1 className="text-4xl font-bold text-center mb-8">Redeem Tokens</h1>
                      <p className="text-center text-lg mb-8">Redeem your tokenized messages for value</p>
                    </div>
                  </div>
                  <FloatingActionHub />
                </>
              )} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Toaster />
        </TooltipProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;