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
      <Switch>
        <Route path="/" component={LaunchCountdown} />
        <Route path="/launch" component={LaunchCountdown} />
        
        {/* Routes with navbar - only accessible when authenticated */}
        <Route path="/home" component={() => (
          <>
            <Navbar />
            <Home />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/marketplace" component={() => (
          <>
            <Navbar />
            <Marketplace />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/portfolio" component={() => (
          <>
            <Navbar />
            <Portfolio />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/mint" component={() => (
          <>
            <Navbar />
            <Mint />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/redeem" component={() => (
          <>
            <Navbar />
            <Redeem />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/activity" component={() => (
          <>
            <Navbar />
            <Activity />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/explore" component={() => (
          <>
            <Navbar />
            <Explore />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/how-it-works" component={() => (
          <>
            <Navbar />
            <HowItWorks />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/free-codes" component={() => (
          <>
            <Navbar />
            <FreeCodes />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/admin" component={() => (
          <>
            <Navbar />
            <Admin />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/sms" component={() => (
          <>
            <Navbar />
            <SmsIntegrationPage />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/wallets" component={() => (
          <>
            <Navbar />
            <WalletManagementPage />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/rewards" component={() => (
          <>
            <Navbar />
            <RewardsPage />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/journey" component={() => (
          <>
            <Navbar />
            <JourneyPage />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/heatmap" component={() => (
          <>
            <Navbar />
            <TransactionHeatmapPage />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/badges" component={() => (
          <>
            <Navbar />
            <BadgesPage />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/chat" component={() => (
          <>
            <Navbar />
            <Chat />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/limited-edition" component={() => (
          <>
            <Navbar />
            <LimitedEdition />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/search" component={() => (
          <>
            <Navbar />
            <AdvancedSearch />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/admin-system" component={() => (
          <>
            <Navbar />
            <AdminSystem />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/confetti-demo" component={() => (
          <>
            <Navbar />
            <ConfettiDemo />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/electric-demo" component={() => (
          <>
            <Navbar />
            <ElectricDemo />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/greeting-cards" component={() => (
          <>
            <Navbar />
            <GreetingCards />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/enterprise" component={() => (
          <>
            <Navbar />
            <EnterpriseCampaigns />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/flby/staking" component={() => (
          <>
            <Navbar />
            <FlbyStaking />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/flby/governance" component={() => (
          <>
            <Navbar />
            <FlbyGovernance />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/flby/airdrop" component={() => (
          <>
            <Navbar />
            <FlbyAirdrop />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/admin/staking" component={() => (
          <>
            <Navbar />
            <AdminStaking />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/admin/early-access" component={() => (
          <>
            <Navbar />
            <AdminEarlyAccess />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/referrals" component={() => (
          <>
            <Navbar />
            <ReferralRewards />
            <FloatingActionHub />
          </>
        )} />
        <Route component={NotFound} />
      </Switch>
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
