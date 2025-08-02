import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { EarlyAccessGate } from "@/components/early-access-gate";
import { useState, useEffect, lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/components/wallet-adapter";
import Navbar from "@/components/navbar";
import { FloatingActionHub } from "@/components/floating-action-hub";

// Core pages loaded immediately
import NotFound from "@/pages/not-found";
import LaunchCountdown from "@/pages/launch-countdown";

// Lazy load main application pages
const Home = lazy(() => import("@/pages/home"));
const Marketplace = lazy(() => import("@/pages/marketplace"));
const Portfolio = lazy(() => import("@/pages/portfolio"));
const Mint = lazy(() => import("@/pages/mint"));
const Redeem = lazy(() => import("@/pages/redeem"));
const Activity = lazy(() => import("@/pages/activity"));
const Explore = lazy(() => import("@/pages/explore"));
const HowItWorks = lazy(() => import("@/pages/how-it-works"));
const FreeCodes = lazy(() => import("@/pages/free-codes"));

// Lazy load admin pages - consolidated into unified dashboard
const UnifiedAdminDashboard = lazy(() => import("@/pages/admin-unified"));

// Viral features are now consolidated into Marketplace and Enterprise pages

// Lazy load additional features
const Chat = lazy(() => import("@/pages/chat").then(module => ({ default: module.Chat })));
const LimitedEdition = lazy(() => import("@/pages/limited-edition"));
const AdvancedSearch = lazy(() => import("@/pages/advanced-search"));
const GreetingCards = lazy(() => import("@/pages/greeting-cards"));
const EnterpriseCampaigns = lazy(() => import("@/pages/enterprise-campaigns"));
const FlbyStaking = lazy(() => import("@/pages/flby-staking"));
const FlbyGovernance = lazy(() => import("@/pages/flby-governance"));
const FlbyAirdrop = lazy(() => import("@/pages/flby-airdrop"));
const ReferralRewards = lazy(() => import("@/pages/referral-rewards"));
const TokenHolderMapPage = lazy(() => import("@/pages/token-holder-map"));

// Lazy load remaining pages
const Admin = lazy(() => import("@/pages/admin"));
const SmsIntegrationPage = lazy(() => import("@/pages/sms-integration").then(module => ({ default: module.SmsIntegrationPage })));
const WalletManagementPage = lazy(() => import("@/pages/wallet-management").then(module => ({ default: module.WalletManagementPage })));
const RewardsPage = lazy(() => import("@/pages/rewards").then(module => ({ default: module.RewardsPage })));
const JourneyPage = lazy(() => import("@/pages/journey"));
const BadgesPage = lazy(() => import("@/pages/badges"));
const InfoPage = lazy(() => import("@/pages/info"));
const TransactionHeatmapPage = lazy(() => import("@/pages/heatmap"));
const AdminSystem = lazy(() => import("@/pages/admin-system"));
const ConfettiDemo = lazy(() => import("@/pages/confetti-demo"));
const ElectricDemo = lazy(() => import("@/pages/electric-demo"));
const AdminStaking = lazy(() => import("@/pages/admin-staking"));
const AdminEarlyAccess = lazy(() => import("@/pages/admin-early-access"));
const AdminFreeCodes = lazy(() => import("@/pages/admin-free-codes"));
const AdminPricing = lazy(() => import("@/pages/admin-pricing"));
const AdminDefaultImage = lazy(() => import("@/pages/admin-default-image"));

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="animate-pulse">
      <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
    </div>
  </div>
);
function Router() {
  return (
    <div className="dark min-h-screen" style={{ background: 'transparent' }}>
      <Switch>
        <Route path="/" component={LaunchCountdown} />
        <Route path="/launch" component={LaunchCountdown} />
        
        {/* Routes with navbar - only accessible when authenticated */}
        <Route path="/home" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/marketplace" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Marketplace />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        {/* Viral features consolidated into Marketplace and Enterprise pages */}
        <Route path="/portfolio" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Portfolio />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/mint" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Mint />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/redeem" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Redeem />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/activity" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Activity />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/explore" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Explore />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/how-it-works" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <HowItWorks />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/free-codes" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <FreeCodes />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/admin" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <UnifiedAdminDashboard />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/admin-legacy" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Admin />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/sms" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <SmsIntegrationPage />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/wallets" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <WalletManagementPage />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/rewards" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <RewardsPage />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/journey" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <JourneyPage />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/heatmap" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <TransactionHeatmapPage />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/badges" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <BadgesPage />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/chat" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Chat />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/limited-edition" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <LimitedEdition />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/search" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <AdvancedSearch />
            </Suspense>
            <FloatingActionHub />
          </>
        )} />
        <Route path="/token-map" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <TokenHolderMapPage />
            </Suspense>
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
        <Route path="/admin/free-codes" component={() => (
          <>
            <Navbar />
            <AdminFreeCodes />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/admin/default-image" component={() => (
          <>
            <Navbar />
            <AdminDefaultImage />
            <FloatingActionHub />
          </>
        )} />
        <Route path="/admin/pricing" component={() => (
          <>
            <Navbar />
            <AdminPricing />
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
        <Route path="/info" component={() => (
          <>
            <Navbar />
            <InfoPage />
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
