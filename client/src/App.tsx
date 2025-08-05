import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { EarlyAccessGate } from "@/components/early-access-gate";
import { useState, useEffect, lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// New Simplified Pages
import Dashboard from "@/pages/dashboard";
import Create from "@/pages/create";
import Trade from "@/pages/trade";
import Intelligence from "@/pages/intelligence";
import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import Portfolio from "@/pages/portfolio";
import Mint from "@/pages/mint";
import MintBasic from "@/pages/mint-basic";
import MintAIEnhanced from "@/pages/mint-ai-enhanced";
import MintVoice from "@/pages/mint-voice";
import MintMultimedia from "@/pages/mint-multimedia";

import Redeem from "@/pages/redeem";
import Activity from "@/pages/activity";
import Explore from "@/pages/explore";
import HowItWorks from "@/pages/how-it-works";
import FreeCodes from "@/pages/free-codes";
import Admin from "@/pages/admin";
import TransactionHeatmapPage from "@/pages/heatmap";
import { SmsIntegrationPage } from "@/pages/sms-integration";
import { SMSDemoPage } from "@/pages/sms-demo";
import { SMSNexusPage } from "@/pages/sms-nexus";
import { WalletManagementPage } from "@/pages/wallet-management";
import { RewardsPage } from "@/pages/rewards";
import JourneyPage from "@/pages/journey";
import BadgesPage from "@/pages/badges";
import InfoPage from "@/pages/info";

import { Chat } from "@/pages/chat";
import FlutterWave from "@/pages/flutter-wave";
import FlutterArt from "@/pages/flutter-art";
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
import Payments from "@/pages/payments";
import AIPayments from "@/pages/ai-payments";
import PaymentSuccess from "@/pages/payment-success";
import AdminSubscriptions from "@/pages/admin-subscriptions";
import AdminEarlyAccess from "@/pages/admin-early-access";
import SearchPage from "@/pages/search";
import AdminFreeCodes from "@/pages/admin-free-codes";
import AdminPricing from "@/pages/admin-pricing";
import AdminDefaultImage from "@/pages/admin-default-image";
import UnifiedAdminDashboard from "@/pages/admin-unified";
import TokenHolderMapPage from "@/pages/token-holder-map";
import CollaborativeCreation from "@/pages/collaborative-creation";
import FlutterAIDashboard from "@/pages/flutterai-dashboard";
import EnterpriseDashboard from "@/pages/enterprise-dashboard";
import ViralDashboard from "@/pages/viral-dashboard";
import MessageNFTCreator from "@/pages/message-nft-creator";
import NFTClaim from "@/pages/nft-claim";
import AllOpportunities from "@/pages/AllOpportunities";
import AdminAPIMonetization from "@/pages/admin-api-monetization";
import NFTMarketplace from "@/pages/nft-marketplace";
import AIShowcase from "@/pages/ai-showcase";
import { LivingAIPage } from "@/pages/living-ai";
import AIComprehensiveOverview from "@/pages/ai-comprehensive-overview";
import RevolutionaryAIShowcase from "@/pages/revolutionary-ai-showcase";
import AIFeaturesTest from "@/pages/ai-features-test";
import DynamicPricingDashboard from "@/pages/dynamic-pricing-dashboard";
import CelestialDashboard from "@/pages/CelestialDashboard";
import EnterpriseSalesDashboard from "@/pages/enterprise-sales-dashboard";
import APIMonetizationDashboard from "@/pages/api-monetization-dashboard";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { PersonalizedDashboard } from "@/components/PersonalizedDashboard";
import { ErrorBoundary } from "@/components/error-boundary";
import { OfflineIndicator } from "@/components/offline-indicator";
import { PWAInstallPrompt, PWANotificationPrompt } from "@/components/pwa-features";
import { CommandPalette } from "@/components/command-palette";
import { WebSocketProvider } from "@/components/websocket-provider";
import { ThemeProvider } from "@/components/theme-provider";

import { WalletProvider } from "@/components/wallet-adapter";
import { TestImage } from "@/components/test-image";
function Router() {
  return (
    <ErrorBoundary>
      <div className="dark min-h-screen flex flex-col bg-transparent">
        <div className="flex-1 bg-transparent">
          <Switch>
        <Route path="/" component={() => (
          <>
            <Navbar />
            <Dashboard />
          </>
        )} />
        <Route path="/launch" component={LaunchCountdown} />
        
        {/* Simplified Routes with navbar - unified navigation structure */}
        <Route path="/dashboard" component={() => (
          <>
            <Navbar />
            <Dashboard />
          </>
        )} />
        <Route path="/create" component={() => (
          <>
            <Navbar />
            <Create />
          </>
        )} />
        <Route path="/trade" component={() => (
          <>
            <Navbar />
            <Trade />
          </>
        )} />
        <Route path="/flutterai" component={() => (
          <>
            <Navbar />
            <FlutterAIDashboard />
          </>
        )} />
        <Route path="/flutter-wave" component={() => (
          <>
            <Navbar />
            <FlutterWave />
          </>
        )} />
        <Route path="/flutter-art" component={() => (
          <>
            <Navbar />
            <FlutterArt />
          </>
        )} />
        <Route path="/chat" component={() => (
          <>
            <Navbar />
            <Chat />
          </>
        )} />
        <Route path="/intelligence" component={() => (
          <>
            <Navbar />
            <Intelligence />
          </>
        )} />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/home" component={() => (
          <>
            <Navbar />
            <Dashboard />
          </>
        )} />
        <Route path="/marketplace" component={() => (
          <>
            <Navbar />
            <Trade />
          </>
        )} />
        <Route path="/portfolio" component={() => (
          <>
            <Navbar />
            <Trade />
          </>
        )} />
        <Route path="/mint" component={() => (
          <>
            <Navbar />
            <Mint />
          </>
        )} />
        <Route path="/mint/basic" component={() => (
          <>
            <Navbar />
            <MintBasic />
          </>
        )} />
        <Route path="/mint/ai-enhanced" component={() => (
          <>
            <Navbar />
            <MintAIEnhanced />
          </>
        )} />
        <Route path="/mint/voice" component={() => (
          <>
            <Navbar />
            <MintVoice />
          </>
        )} />
        <Route path="/mint/multimedia" component={() => (
          <>
            <Navbar />
            <MintMultimedia />
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
        <Route path="/search" component={() => (
          <>
            <Navbar />
            <SearchPage />
          </>
        )} />
        <Route path="/admin" component={() => (
          <>
            <Navbar />
            <UnifiedAdminDashboard />
          </>
        )} />
        
        {/* Admin routes should use the new admin page structure */}
        <Route path="/admin-unified" component={() => (
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
            <SmsIntegrationPage />
          </>
        )} />
        <Route path="/sms-demo" component={() => (
          <>
            <Navbar />
            <SMSDemoPage />
          </>
        )} />
        <Route path="/sms-nexus" component={() => (
          <>
            <Navbar />
            <SMSNexusPage />
          </>
        )} />
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
        <Route path="/flutter-wave" component={() => (
          <>
            <FlutterWave />
          </>
        )} />
        <Route path="/flutter-art" component={() => (
          <>
            <FlutterArt />
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
        <Route path="/enterprise-intelligence" component={() => (
          <>
            <Navbar />
            <EnterpriseDashboard />
          </>
        )} />
        <Route path="/enterprise-sales" component={() => (
          <>
            <Navbar />
            <EnterpriseSalesDashboard />
          </>
        )} />
        <Route path="/api-monetization" component={() => (
          <>
            <Navbar />
            <APIMonetizationDashboard />
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
        {/* Redirect old admin routes to unified dashboard */}
        <Route path="/admin/staking" component={() => {
          window.location.href = '/admin-unified?tab=staking';
          return null;
        }} />
        <Route path="/admin/early-access" component={() => {
          window.location.href = '/admin-unified?tab=access';
          return null;
        }} />
        <Route path="/admin/free-codes" component={() => {
          window.location.href = '/admin-unified?tab=codes';
          return null;
        }} />
        <Route path="/admin/default-image" component={() => {
          window.location.href = '/admin-unified?tab=settings';
          return null;
        }} />
        <Route path="/admin/pricing" component={() => {
          window.location.href = '/admin-unified?tab=pricing';
          return null;
        }} />
        <Route path="/admin/subscriptions" component={() => {
          window.location.href = '/admin-unified?tab=pricing';
          return null;
        }} />
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
        <Route path="/payments" component={() => (
          <>
            <Navbar />
            <Payments />
          </>
        )} />
        <Route path="/ai-payments" component={() => (
          <>
            <Navbar />
            <AIPayments />
          </>
        )} />
        <Route path="/payment-success" component={PaymentSuccess} />
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
        <Route path="/message-nfts" component={() => (
          <>
            <Navbar />
            <MessageNFTCreator />
          </>
        )} />
        <Route path="/nft-marketplace" component={() => (
          <>
            <Navbar />
            <NFTMarketplace />
          </>
        )} />
        {/* Redirect old AI pages to unified AI Hub */}
        <Route path="/ai-showcase" component={() => {
          window.location.href = '/ai-overview?tab=showcase';
          return null;
        }} />
        <Route path="/living-ai" component={() => {
          window.location.href = '/ai-overview?tab=living';
          return null;
        }} />
        <Route path="/ai-overview" component={() => (
          <>
            <Navbar />
            <AIComprehensiveOverview />
          </>
        )} />
        <Route path="/ai-test" component={() => (
          <>
            <Navbar />
            <AIFeaturesTest />
          </>
        )} />
        <Route path="/ai-features-test" component={() => (
          <>
            <Navbar />
            <AIFeaturesTest />
          </>
        )} />
        <Route path="/flutterai" component={() => (
          <>
            <Navbar />
            <FlutterAIDashboard />
          </>
        )} />
        <Route path="/flutterai-dashboard" component={() => (
          <>
            <Navbar />
            <FlutterAIDashboard />
          </>
        )} />
        <Route path="/all-opportunities" component={() => (
          <>
            <Navbar />
            <AllOpportunities />
          </>
        )} />
        <Route path="/admin/api-monetization" component={() => {
          window.location.href = '/admin-unified?tab=api';
          return null;
        }} />
        <Route path="/revolutionary-ai" component={() => {
          const RevolutionaryAIShowcase = lazy(() => import('./pages/revolutionary-ai-showcase'));
          return (
            <>
              <Navbar />
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading Revolutionary AI...</p>
                  </div>
                </div>
              }>
                <RevolutionaryAIShowcase />
              </Suspense>
            </>
          );
        }} />
        <Route path="/ai-marketing-dashboard" component={() => {
          const AIMarketingDashboard = lazy(() => import('./pages/ai-marketing-dashboard'));
          return (
            <>
              <Navbar />
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading AI Marketing Dashboard...</p>
                  </div>
                </div>
              }>
                <AIMarketingDashboard />
              </Suspense>
            </>
          );
        }} />
        <Route path="/claim/:collectionId" component={NFTClaim} />
        <Route path="/claim/:collectionId/:tokenNumber" component={NFTClaim} />
        <Route path="/dynamic-pricing" component={() => (
          <>
            <Navbar />
            <DynamicPricingDashboard />
          </>
        )} />
        <Route path="/celestial" component={() => (
          <>
            <CelestialDashboard />
          </>
        )} />
        <Route path="/cosmic-wallet" component={() => (
          <>
            <CelestialDashboard />
          </>
        )} />
        <Route component={NotFound} />
        </Switch>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  // Register service worker for PWA functionality
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <WebSocketProvider>
            <TooltipProvider>
              <Toaster />
              <OfflineIndicator />
              <PWAInstallPrompt />
              <PWANotificationPrompt />
              <CommandPalette />
              <Router />
            </TooltipProvider>
          </WebSocketProvider>
        </WalletProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
