import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
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
import Navbar from "@/components/navbar";
import { FloatingActionHub } from "@/components/floating-action-hub";
import { WalletProvider } from "@/components/wallet-adapter";

function Router() {
  return (
    <div className="dark">
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
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
        <Route component={NotFound} />
      </Switch>
      <FloatingActionHub />
    </div>
  );
}

function App() {
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
