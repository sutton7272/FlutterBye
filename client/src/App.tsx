import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { EarlyAccessGate } from "@/components/early-access-gate";
import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import Portfolio from "@/pages/portfolio";
import Mint from "@/pages/mint";

import Redeem from "@/pages/redeem";
import Activity from "@/pages/activity";
import Explore from "@/pages/explore";
import HowItWorks from "@/pages/how-it-works";
import FreeCodes from "@/pages/free-codes";
import Admin from "@/pages/admin";
import TransactionHeatmapPage from "@/pages/heatmap";
import { SmsIntegrationPage } from "@/pages/sms-integration";
import { WalletManagementPage } from "@/pages/wallet-management";
import { RewardsPage } from "@/pages/rewards";
import JourneyPage from "@/pages/journey";
import BadgesPage from "@/pages/badges";

import { Chat } from "@/pages/chat";
import LimitedEdition from "@/pages/limited-edition";
import AdvancedSearch from "@/pages/advanced-search";
import AdminSystem from "@/pages/admin-system";
import ConfettiDemo from "@/pages/confetti-demo";
import ElectricDemo from "@/pages/electric-demo";
import GreetingCards from "@/pages/greeting-cards";
import EnterpriseCampaigns from "@/pages/enterprise-campaigns";
import FlbyStaking from "@/pages/flby-staking";
import FlbyGovernance from "@/pages/flby-governance";
import FlbyAirdrop from "@/pages/flby-airdrop";
import AdminStaking from "@/pages/admin-staking";
import ReferralRewards from "@/pages/referral-rewards";
import LaunchCountdown from "@/pages/launch-countdown";
import AdminEarlyAccess from "@/pages/admin-early-access";
import Navbar from "@/components/navbar";
import { FloatingActionHub } from "@/components/floating-action-hub";
import { WalletProvider } from "@/components/wallet-adapter";

function Router() {
  return (
    <div className="dark">
      <Navbar />
      <Switch>
        <Route path="/" component={LaunchCountdown} />
        <Route path="/home" component={Home} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/mint" component={Mint} />
        <Route path="/redeem" component={Redeem} />
        <Route path="/activity" component={Activity} />
        <Route path="/explore" component={Explore} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/free-codes" component={FreeCodes} />
        <Route path="/admin" component={Admin} />
        <Route path="/sms" component={SmsIntegrationPage} />
        <Route path="/wallets" component={WalletManagementPage} />
        <Route path="/rewards" component={RewardsPage} />
        <Route path="/journey" component={JourneyPage} />
        <Route path="/heatmap" component={TransactionHeatmapPage} />
        <Route path="/badges" component={BadgesPage} />

        <Route path="/chat" component={Chat} />
        <Route path="/limited-edition" component={LimitedEdition} />
        <Route path="/search" component={AdvancedSearch} />
        <Route path="/admin-system" component={AdminSystem} />
        <Route path="/confetti-demo" component={ConfettiDemo} />
        <Route path="/electric-demo" component={ElectricDemo} />
        <Route path="/greeting-cards" component={GreetingCards} />
        <Route path="/enterprise" component={EnterpriseCampaigns} />
        <Route path="/flby/staking" component={FlbyStaking} />
        <Route path="/flby/governance" component={FlbyGovernance} />
        <Route path="/flby/airdrop" component={FlbyAirdrop} />
        <Route path="/admin/staking" component={AdminStaking} />
        <Route path="/admin/early-access" component={AdminEarlyAccess} />
        <Route path="/referrals" component={ReferralRewards} />
        <Route path="/launch" component={LaunchCountdown} />
        <Route component={NotFound} />
      </Switch>
      <FloatingActionHub />
    </div>
  );
}

function App() {
  const [hasEarlyAccess, setHasEarlyAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    // Check if launch mode is enabled or user has early access
    const storedAccess = localStorage.getItem("flutterbye_early_access");
    const isLaunchMode = localStorage.getItem("flutterbye_launch_mode") === "true";
    
    if (isLaunchMode || storedAccess === "granted") {
      setHasEarlyAccess(true);
    }
    setIsCheckingAccess(false);
  }, []);

  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Flutterbye...</p>
        </div>
      </div>
    );
  }

  if (!hasEarlyAccess) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
