import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import Portfolio from "@/pages/portfolio";
import Mint from "@/pages/mint-restore-complete";

import Redeem from "@/pages/redeem";
import Activity from "@/pages/activity";
import Explore from "@/pages/explore";
import HowItWorks from "@/pages/how-it-works";
import FreeCodes from "@/pages/free-codes";
import Admin from "@/pages/admin";
import TransactionHeatmapPage from "@/pages/heatmap";
import SMSIntegration from "@/pages/sms-integration";
import { WalletManagementPage } from "@/pages/wallet-management";
import { RewardsPage } from "@/pages/rewards";
import JourneyPage from "@/pages/journey";
import BadgesPage from "@/pages/badges";
import InfoPage from "@/pages/info";

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
import Subscribe from "@/pages/subscribe";
import AdminSubscriptions from "@/pages/admin-subscriptions";
import AdminEarlyAccess from "@/pages/admin-early-access";
import AdminFreeCodes from "@/pages/admin-free-codes";
import AdminPricing from "@/pages/admin-pricing";
import AdminDefaultImage from "@/pages/admin-default-image";
import UnifiedAdminDashboard from "@/pages/admin-unified";
import TokenHolderMapPage from "@/pages/token-holder-map";
import CollaborativeCreation from "@/pages/collaborative-creation";
import ViralDashboard from "@/pages/viral-dashboard";
import EnhancedSMSIntegration from "@/pages/sms-enhanced";
import SMSTest from "@/pages/sms-test";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import MinimalTest from "@/pages/minimal-test";
import Navbar from "@/components/navbar";
import { PersonalizedDashboard } from "@/components/PersonalizedDashboard";

import { WalletProvider } from "@/components/wallet-adapter";
import { AuthProvider } from "@/hooks/useAuth";
import { TestImage } from "@/components/test-image";
function Router() {
  return (
    <div className="dark min-h-screen" style={{ background: 'transparent' }}>
      <Switch>
        <Route path="/" component={LaunchCountdown} />
        <Route path="/launch" component={LaunchCountdown} />
        
        {/* Routes with navbar - now accessible without authentication */}
        <Route path="/home" component={() => (
          <>
            <Navbar />
            <Home />
          </>
        )} />
        <Route path="/marketplace" component={() => (
          <>
            <Navbar />
            <Marketplace />
          </>
        )} />
        <Route path="/portfolio" component={() => (
          <>
            <Navbar />
            <Portfolio />
          </>
        )} />
        <Route path="/redeem" component={() => (
          <>
            <Navbar />
            <Redeem />
          </>
        )} />
        <Route path="/mint" component={() => (
          <>
            <Navbar />
            <Mint />
          </>
        )} />
        <Route path="/redeem" component={() => (
          <>
            <Navbar />
            <Redeem />
          </>
        )} />
        <Route path="/activity" component={() => (
          <>
            <Navbar />
            <Activity />
          </>
        )} />
        <Route path="/explore" component={() => (
          <>
            <Navbar />
            <Explore />
          </>
        )} />
        <Route path="/trending" component={() => (
          <>
            <Navbar />
            <Explore />
          </>
        )} />
        <Route path="/how-it-works" component={() => (
          <>
            <Navbar />
            <HowItWorks />
          </>
        )} />
        <Route path="/free-codes" component={() => (
          <>
            <Navbar />
            <FreeCodes />
          </>
        )} />
        <Route path="/admin" component={() => (
          <>
            <Navbar />
            <UnifiedAdminDashboard />
          </>
        )} />
        <Route path="/admin-legacy" component={() => (
          <>
            <Navbar />
            <Admin />
          </>
        )} />
        <Route path="/sms" component={() => (
          <>
            <Navbar />
            <SMSIntegration />
          </>
        )} />
        <Route path="/sms-enhanced" component={() => (
          <>
            <Navbar />
            <EnhancedSMSIntegration />
          </>
        )} />
        <Route path="/sms-classic" component={() => (
          <>
            <Navbar />
            <SMSIntegration />
          </>
        )} />
        <Route path="/sms-test" component={() => (
          <>
            <Navbar />
            <SMSTest />
          </>
        )} />
        <Route path="/minimal-test" component={MinimalTest} />
        <Route path="/wallets" component={() => (
          <>
            <Navbar />
            <WalletManagementPage />
          </>
        )} />
        <Route path="/rewards" component={() => (
          <>
            <Navbar />
            <RewardsPage />
          </>
        )} />
        <Route path="/journey" component={() => (
          <>
            <Navbar />
            <JourneyPage />
          </>
        )} />
        <Route path="/heatmap" component={() => (
          <>
            <Navbar />
            <TransactionHeatmapPage />
          </>
        )} />
        <Route path="/badges" component={() => (
          <>
            <Navbar />
            <BadgesPage />
          </>
        )} />
        <Route path="/chat" component={() => (
          <>
            <Navbar />
            <Chat />
          </>
        )} />
        <Route path="/limited-edition" component={() => (
          <>
            <Navbar />
            <LimitedEdition />
          </>
        )} />
        <Route path="/search" component={() => (
          <>
            <Navbar />
            <AdvancedSearch />
          </>
        )} />
        <Route path="/token-map" component={() => (
          <>
            <Navbar />
            <TokenHolderMapPage />
          </>
        )} />
        <Route path="/admin-system" component={() => (
          <>
            <Navbar />
            <AdminSystem />
          </>
        )} />
        <Route path="/confetti-demo" component={() => (
          <>
            <Navbar />
            <ConfettiDemo />
          </>
        )} />
        <Route path="/electric-demo" component={() => (
          <>
            <Navbar />
            <ElectricDemo />
          </>
        )} />
        <Route path="/greeting-cards" component={() => (
          <>
            <Navbar />
            <GreetingCards />
          </>
        )} />
        <Route path="/enterprise" component={() => (
          <>
            <Navbar />
            <EnterpriseCampaigns />
          </>
        )} />
        <Route path="/flby/staking" component={() => (
          <>
            <Navbar />
            <FlbyStaking />
          </>
        )} />
        <Route path="/flby/governance" component={() => (
          <>
            <Navbar />
            <FlbyGovernance />
          </>
        )} />
        <Route path="/flby/airdrop" component={() => (
          <>
            <Navbar />
            <FlbyAirdrop />
          </>
        )} />
        <Route path="/admin/staking" component={() => (
          <>
            <Navbar />
            <AdminStaking />
          </>
        )} />
        <Route path="/admin/early-access" component={() => (
          <>
            <Navbar />
            <AdminEarlyAccess />
          </>
        )} />
        <Route path="/admin/free-codes" component={() => (
          <>
            <Navbar />
            <AdminFreeCodes />
          </>
        )} />
        <Route path="/admin/default-image" component={() => (
          <>
            <Navbar />
            <AdminDefaultImage />
          </>
        )} />
        <Route path="/admin/pricing" component={() => (
          <>
            <Navbar />
            <AdminPricing />
          </>
        )} />
        <Route path="/admin/subscriptions" component={() => (
          <>
            <Navbar />
            <AdminSubscriptions />
          </>
        )} />
        <Route path="/referrals" component={() => (
          <>
            <Navbar />
            <ReferralRewards />
          </>
        )} />
        <Route path="/subscribe" component={() => (
          <>
            <Navbar />
            <Subscribe />
          </>
        )} />
        <Route path="/info" component={() => (
          <>
            <Navbar />
            <InfoPage />
          </>
        )} />
        <Route path="/personalization" component={() => (
          <>
            <Navbar />
            <PersonalizedDashboard />
          </>
        )} />
        <Route path="/collaborative-creation" component={() => (
          <>
            <Navbar />
            <CollaborativeCreation />
          </>
        )} />
        <Route path="/viral-dashboard" component={() => (
          <>
            <Navbar />
            <ViralDashboard />
          </>
        )} />
        <Route path="/analytics-dashboard" component={() => (
          <>
            <Navbar />
            <AnalyticsDashboard />
          </>
        )} />
        <Route path="/analytics" component={() => (
          <>
            <Navbar />
            <AnalyticsDashboard />
          </>
        )} />
        <Route path="/sms-integration" component={() => (
          <>
            <Navbar />
            <SMSIntegration />
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
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
