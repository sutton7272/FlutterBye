import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { EarlyAccessGate } from "@/components/early-access-gate";


import { MinimalChatTest } from "@/components/minimal-chat-test";
import { SkyeChatFinal } from "@/components/skye-chat-final";
import { WorkingChat } from "@/components/working-chat";
import { DebugChat } from "@/components/debug-chat";
import { OptimizedSkyeChatbot } from "@/components/optimized-skye-chatbot";
import { useState, useEffect, lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OptimizedSuspense } from "@/components/performance-optimized-suspense";
import { OptimizedLoadingSpinner } from "@/components/optimized-loading";
import NotFound from "@/pages/not-found";

// Lazy loaded pages for better performance
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Create = lazy(() => import("@/pages/create"));
const Trade = lazy(() => import("@/pages/trade"));
const Intelligence = lazy(() => import("@/pages/intelligence"));
const Home = lazy(() => import("@/pages/home"));
const Marketplace = lazy(() => import("@/pages/marketplace"));
const Portfolio = lazy(() => import("@/pages/portfolio"));
const Mint = lazy(() => import("@/pages/mint"));
const MintBasic = lazy(() => import("@/pages/mint-basic"));
const MintAIEnhanced = lazy(() => import("@/pages/mint-ai-enhanced"));
const MintVoice = lazy(() => import("@/pages/mint-voice"));
const MintMultimedia = lazy(() => import("@/pages/mint-multimedia"));

const Redeem = lazy(() => import("@/pages/redeem"));
const Activity = lazy(() => import("@/pages/activity"));
const Explore = lazy(() => import("@/pages/explore"));
const HowItWorks = lazy(() => import("@/pages/how-it-works"));
const FreeCodes = lazy(() => import("@/pages/free-codes"));
const Admin = lazy(() => import("@/pages/admin"));
const TransactionHeatmapPage = lazy(() => import("@/pages/heatmap"));
const SmsIntegrationPage = lazy(() => import("@/pages/sms-integration").then(m => ({ default: m.SmsIntegrationPage })));
const SMSDemoPage = lazy(() => import("@/pages/sms-demo").then(m => ({ default: m.SMSDemoPage })));
const SMSNexusPage = lazy(() => import("@/pages/sms-nexus").then(m => ({ default: m.SMSNexusPage })));
const WalletManagementPage = lazy(() => import("@/pages/wallet-management").then(m => ({ default: m.WalletManagementPage })));
const RewardsPage = lazy(() => import("@/pages/rewards").then(m => ({ default: m.RewardsPage })));
const JourneyPage = lazy(() => import("@/pages/journey"));
const BadgesPage = lazy(() => import("@/pages/badges"));
const InfoPage = lazy(() => import("@/pages/info"));

const Chat = lazy(() => import("@/pages/chat").then(m => ({ default: m.Chat })));
const FlutterWave = lazy(() => import("@/pages/flutter-wave"));
const FlutterArt = lazy(() => import("@/pages/flutter-art"));
const LimitedEdition = lazy(() => import("@/pages/limited-edition"));
const AdvancedSearch = lazy(() => import("@/pages/advanced-search"));
const AdminSystem = lazy(() => import("@/pages/admin-system"));
const ConfettiDemo = lazy(() => import("@/pages/confetti-demo"));
const ElectricDemo = lazy(() => import("@/pages/electric-demo"));
const GreetingCards = lazy(() => import("@/pages/greeting-cards"));
const EnterpriseCampaigns = lazy(() => import("@/pages/enterprise-campaigns"));
const FlbyStaking = lazy(() => import("@/pages/flby-staking"));
const FlbyGovernance = lazy(() => import("@/pages/flby-governance"));
const FlbyAirdrop = lazy(() => import("@/pages/flby-airdrop"));
const AdminStaking = lazy(() => import("@/pages/admin-staking"));
const ReferralRewards = lazy(() => import("@/pages/referral-rewards"));
const LaunchCountdown = lazy(() => import("@/pages/launch-countdown"));
const Subscribe = lazy(() => import("@/pages/subscribe"));
const Payments = lazy(() => import("@/pages/payments"));
const AIPayments = lazy(() => import("@/pages/ai-payments"));
const PaymentSuccess = lazy(() => import("@/pages/payment-success"));
const AdminSubscriptions = lazy(() => import("@/pages/admin-subscriptions"));
const AdminEarlyAccess = lazy(() => import("@/pages/admin-early-access"));
const SearchPage = lazy(() => import("@/pages/search"));
const AdminFreeCodes = lazy(() => import("@/pages/admin-free-codes"));
const AdminPricing = lazy(() => import("@/pages/admin-pricing"));
const AdminDefaultImage = lazy(() => import("@/pages/admin-default-image"));
const AdminCustodialWallet = lazy(() => import("@/pages/admin-custodial-wallet"));
const UnifiedAdminDashboard = lazy(() => import("@/pages/admin-unified"));
import TokenHolderMapPage from "@/pages/token-holder-map";
import CollaborativeCreation from "@/pages/collaborative-creation";
import FlutterAIDashboard from "@/pages/flutterai-dashboard";
import EnterpriseDashboard from "@/pages/enterprise-dashboard";
import AdvancedAnalytics from "@/pages/advanced-analytics";
import ViralDashboard from "@/pages/viral-dashboard";
import MessageNFTCreator from "@/pages/message-nft-creator";
import Phase1Dashboard from "@/pages/phase1-dashboard";
import Phase2Dashboard from "@/pages/phase2-dashboard";
import Phase3Dashboard from "@/pages/phase3-dashboard";
import Phase4Dashboard from "@/pages/phase4-dashboard";
import PerformanceDashboard from "@/components/performance-dashboard";
import AIEnhancedDashboard from "@/components/ai-enhanced-dashboard";
import CostEffectiveAIPanel from "@/components/cost-effective-ai-panel";
import NFTClaim from "@/pages/nft-claim";
import AllOpportunities from "@/pages/AllOpportunities";
import AdminAPIMonetization from "@/pages/admin-api-monetization";
import FlutterBlogBot from "@/pages/flutterblog-bot";
import MonitoringDashboard from "@/pages/monitoring-dashboard";
import FlutterBlogPerformance from "@/pages/FlutterBlog-Performance";
import CampaignBuilder from "@/pages/campaign-builder";
import AIMarketingBot from "@/pages/ai-marketing-bot";
import WalletTest from "@/pages/WalletTest";
import ProductionDeployment from "@/pages/ProductionDeployment";
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
import Final5PercentDashboard from "@/pages/final-5-percent-dashboard";
import { OptimizedNavbar } from "@/components/optimized-navbar";
import Footer from "@/components/footer";
import { PersonalizedDashboard } from "@/components/PersonalizedDashboard";
import { ErrorBoundary } from "@/components/error-boundary";
import { PWAInstallPrompt, PWANotificationPrompt } from "@/components/pwa-features";
import { CommandPalette } from "@/components/command-palette";
import { WebSocketProvider } from "@/components/websocket-provider-disabled";
import { ThemeProvider } from "@/components/theme-provider";
import { FlyingButterflies } from "@/components/flying-butterflies";

import { WalletProvider } from "@/components/wallet-adapter";
import { TestImage } from "@/components/test-image";
import AdminGateway from "@/pages/admin-gateway";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminEscrow from "@/pages/admin-escrow";
import { AdminRouteGuard } from "@/components/admin-route-guard";
function Router() {
  return (
    <div className="dark min-h-screen flex flex-col bg-transparent">
      <div className="flex-1 bg-transparent">
        <Switch>
        <Route path="/" component={LaunchCountdown} />
        <Route path="/launch" component={LaunchCountdown} />
        <Route path="/home" component={() => (
          <>
            <OptimizedNavbar />
            <Home />
          </>
        )} />
        
        {/* Simplified Routes with navbar - unified navigation structure */}
        <Route path="/dashboard" component={() => (
          <>
            <OptimizedNavbar />
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          </>
        )} />
        <Route path="/create" component={() => (
          <>
            <OptimizedNavbar />
            <Suspense fallback={<LoadingSpinner />}>
              <Create />
            </Suspense>
          </>
        )} />
        <Route path="/campaign-builder" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <CampaignBuilder />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/trade" component={() => (
          <>
            <OptimizedNavbar />
            <Suspense fallback={<LoadingSpinner />}>
              <Trade />
            </Suspense>
          </>
        )} />
        <Route path="/flutterai" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <FlutterAIDashboard />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/flutter-wave" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <FlutterWave />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/flutter-art" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <FlutterArt />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/chat" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <Chat />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/intelligence" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <Intelligence />
            </OptimizedSuspense>
          </>
        )} />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/home" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <Dashboard />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/marketplace" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <Trade />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/portfolio" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <Trade />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/mint" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <Mint />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/mint/basic" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <MintBasic />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/mint/ai-enhanced" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <MintAIEnhanced />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/mint/voice" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <MintVoice />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/mint/multimedia" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <MintMultimedia />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/redeem" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <Redeem />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/activity" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <Activity />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/trending" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <Explore />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/how-it-works" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <HowItWorks />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/free-codes" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <FreeCodes />
            </OptimizedSuspense>
          </>
        )} />
        <Route path="/search" component={() => (
          <>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <SearchPage />
            </OptimizedSuspense>
          </>
        )} />
        {/* Admin Gateway - Password Protected Entry Point */}
        <Route path="/admin" component={AdminGateway} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" component={() => (
          <AdminRouteGuard>
            <OptimizedSuspense>
              <AdminDashboard />
            </OptimizedSuspense>
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/flutterai" component={() => (
          <AdminRouteGuard>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <FlutterAIDashboard />
            </OptimizedSuspense>
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/phase1" component={() => (
          <AdminRouteGuard>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <Phase1Dashboard />
            </OptimizedSuspense>
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/phase2" component={() => (
          <AdminRouteGuard>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <Phase2Dashboard />
            </OptimizedSuspense>
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/phase3" component={() => (
          <AdminRouteGuard>
            <OptimizedNavbar />
            <OptimizedSuspense>
              <Phase3Dashboard />
            </OptimizedSuspense>
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/phase4" component={() => (
          <AdminRouteGuard>
            <OptimizedNavbar />
            <Phase4Dashboard />
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/performance" component={() => (
          <AdminRouteGuard>
            <OptimizedNavbar />
            <PerformanceDashboard />
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/ai-enhanced" component={() => (
          <AdminRouteGuard>
            <OptimizedNavbar />
            <AIEnhancedDashboard />
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/cost-effective-ai" component={() => (
          <AdminRouteGuard>
            <OptimizedNavbar />
            <CostEffectiveAIPanel />
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/unified" component={() => (
          <AdminRouteGuard>
            <OptimizedNavbar />
            <UnifiedAdminDashboard />
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/escrow" component={() => (
          <AdminRouteGuard>
            <AdminEscrow />
          </AdminRouteGuard>
        )} />
        
        {/* Legacy Admin Route */}
        <Route path="/admin-legacy" component={() => (
          <>
            <OptimizedNavbar />
            <Admin />
          </>
        )} />
        <Route path="/sms" component={() => (
          <>
            <OptimizedNavbar />
            <SmsIntegrationPage />
          </>
        )} />
        <Route path="/sms-demo" component={() => (
          <>
            <OptimizedNavbar />
            <SMSDemoPage />
          </>
        )} />
        <Route path="/sms-nexus" component={() => (
          <>
            <OptimizedNavbar />
            <SMSNexusPage />
          </>
        )} />
        <Route path="/wallets" component={() => (
          <>
            <OptimizedNavbar />
            <WalletManagementPage />
          </>
        )} />
        <Route path="/rewards" component={() => (
          <>
            <OptimizedNavbar />
            <RewardsPage />
          </>
        )} />
        <Route path="/journey" component={() => (
          <>
            <OptimizedNavbar />
            <JourneyPage />
          </>
        )} />
        <Route path="/heatmap" component={() => (
          <>
            <OptimizedNavbar />
            <TransactionHeatmapPage />
          </>
        )} />
        <Route path="/badges" component={() => (
          <>
            <OptimizedNavbar />
            <BadgesPage />
          </>
        )} />
        <Route path="/chat" component={() => (
          <>
            <OptimizedNavbar />
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
            <OptimizedNavbar />
            <LimitedEdition />
          </>
        )} />
        <Route path="/search" component={() => (
          <>
            <OptimizedNavbar />
            <AdvancedSearch />
          </>
        )} />
        <Route path="/token-map" component={() => (
          <>
            <OptimizedNavbar />
            <TokenHolderMapPage />
          </>
        )} />
        <Route path="/admin-system" component={() => (
          <>
            <OptimizedNavbar />
            <AdminSystem />
          </>
        )} />
        <Route path="/confetti-demo" component={() => (
          <>
            <OptimizedNavbar />
            <ConfettiDemo />
          </>
        )} />
        <Route path="/electric-demo" component={() => (
          <>
            <OptimizedNavbar />
            <ElectricDemo />
          </>
        )} />
        <Route path="/greeting-cards" component={() => (
          <>
            <OptimizedNavbar />
            <GreetingCards />
          </>
        )} />
        <Route path="/enterprise" component={() => (
          <>
            <OptimizedNavbar />
            <EnterpriseCampaigns />
          </>
        )} />
        <Route path="/enterprise-intelligence" component={() => (
          <>
            <OptimizedNavbar />
            <EnterpriseDashboard />
          </>
        )} />
        <Route path="/advanced-analytics" component={() => (
          <>
            <OptimizedNavbar />
            <AdvancedAnalytics />
          </>
        )} />
        <Route path="/enterprise-sales" component={() => (
          <>
            <OptimizedNavbar />
            <EnterpriseSalesDashboard />
          </>
        )} />
        <Route path="/api-monetization" component={() => (
          <>
            <OptimizedNavbar />
            <APIMonetizationDashboard />
          </>
        )} />
        <Route path="/flby/staking" component={() => (
          <>
            <OptimizedNavbar />
            <FlbyStaking />
          </>
        )} />
        <Route path="/flby/governance" component={() => (
          <>
            <OptimizedNavbar />
            <FlbyGovernance />
          </>
        )} />
        <Route path="/flby/airdrop" component={() => (
          <>
            <OptimizedNavbar />
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
            <OptimizedNavbar />
            <ReferralRewards />
          </>
        )} />
        <Route path="/subscribe" component={() => (
          <>
            <OptimizedNavbar />
            <Subscribe />
          </>
        )} />
        <Route path="/payments" component={() => (
          <>
            <OptimizedNavbar />
            <Payments />
          </>
        )} />
        <Route path="/ai-payments" component={() => (
          <>
            <OptimizedNavbar />
            <AIPayments />
          </>
        )} />
        <Route path="/payment-success" component={PaymentSuccess} />
        <Route path="/info" component={() => (
          <>
            <OptimizedNavbar />
            <InfoPage />
          </>
        )} />
        <Route path="/personalization" component={() => (
          <>
            <OptimizedNavbar />
            <PersonalizedDashboard />
          </>
        )} />
        <Route path="/collaborative-creation" component={() => (
          <>
            <OptimizedNavbar />
            <CollaborativeCreation />
          </>
        )} />
        <Route path="/viral-dashboard" component={() => (
          <>
            <OptimizedNavbar />
            <ViralDashboard />
          </>
        )} />
        <Route path="/final-5-percent-dashboard" component={() => (
          <>
            <OptimizedNavbar />
            <Final5PercentDashboard />
          </>
        )} />
        <Route path="/message-nfts" component={() => (
          <>
            <OptimizedNavbar />
            <MessageNFTCreator />
          </>
        )} />
        <Route path="/nft-marketplace" component={() => (
          <>
            <OptimizedNavbar />
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
            <OptimizedNavbar />
            <AIComprehensiveOverview />
          </>
        )} />
        <Route path="/ai-test" component={() => (
          <>
            <OptimizedNavbar />
            <AIFeaturesTest />
          </>
        )} />
        <Route path="/ai-features-test" component={() => (
          <>
            <OptimizedNavbar />
            <AIFeaturesTest />
          </>
        )} />
        <Route path="/flutterai" component={() => (
          <>
            <OptimizedNavbar />
            <FlutterAIDashboard />
          </>
        )} />
        <Route path="/flutterai-dashboard" component={() => (
          <>
            <OptimizedNavbar />
            <FlutterAIDashboard />
          </>
        )} />
        <Route path="/flutterblog-bot" component={() => (
          <>
            <OptimizedNavbar />
            <FlutterBlogBot />
          </>
        )} />
        <Route path="/all-opportunities" component={() => (
          <>
            <OptimizedNavbar />
            <AllOpportunities />
          </>
        )} />
        <Route path="/admin/api-monetization" component={() => {
          window.location.href = '/admin-unified?tab=api';
          return null;
        }} />
        
        <Route path="/admin/flutterblog-bot" component={() => (
          <>
            <FlutterBlogBot />
          </>
        )} />
        <Route path="/monitoring" component={() => (
          <>
            <OptimizedNavbar />
            <MonitoringDashboard />
          </>
        )} />
        <Route path="/admin/monitoring" component={() => (
          <>
            <MonitoringDashboard />
          </>
        )} />
        <Route path="/admin/blog-performance" component={() => (
          <>
            <FlutterBlogPerformance />
          </>
        )} />
        
        <Route path="/revolutionary-ai" component={() => {
          const RevolutionaryAIShowcase = lazy(() => import('./pages/revolutionary-ai-showcase'));
          return (
            <>
              <OptimizedNavbar />
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
              <OptimizedNavbar />
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
            <OptimizedNavbar />
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
        <Route path="/production-deployment" component={() => (
          <>
            <OptimizedNavbar />
            <ProductionDeployment />
          </>
        )} />
        <Route path="/dual-environment" component={() => {
          const DualEnvironment = lazy(() => import('./pages/dual-environment'));
          return (
            <>
              <OptimizedNavbar />
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading Dual Environment...</p>
                  </div>
                </div>
              }>
                <DualEnvironment />
              </Suspense>
            </>
          );
        }} />
        <Route path="/production-readiness" component={() => {
          const ProductionReadiness = lazy(() => import('./pages/production-readiness'));
          return (
            <>
              <OptimizedNavbar />
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading Production Readiness...</p>
                  </div>
                </div>
              }>
                <ProductionReadiness />
              </Suspense>
            </>
          );
        }} />
        <Route path="/coin-minting-launch" component={() => {
          const CoinMintingLaunch = lazy(() => import('./pages/coin-minting-launch'));
          return (
            <>
              <OptimizedNavbar />
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading Launch Strategy...</p>
                  </div>
                </div>
              }>
                <CoinMintingLaunch />
              </Suspense>
            </>
          );
        }} />
        <Route path="/final-5-percent" component={() => {
          const Final5PercentDashboard = lazy(() => import('./pages/final-5-percent-dashboard'));
          return (
            <>
              <OptimizedNavbar />
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading Final 5% Dashboard...</p>
                  </div>
                </div>
              }>
                <Final5PercentDashboard />
              </Suspense>
            </>
          );
        }} />
        <Route path="/admin-ai-marketing" component={() => (
          <>
            <OptimizedNavbar />
            <AIMarketingBot />
          </>
        )} />
        <Route path="/admin-custodial-wallet" component={() => (
          <>
            <OptimizedNavbar />
            <AdminCustodialWallet />
          </>
        )} />
        <Route component={NotFound} />
        </Switch>
        </div>
        <Footer />
      </div>
  );
}

function App() {
  // Register service worker for PWA functionality (graceful failure)
  useEffect(() => {
    try {
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
    } catch (error) {
      console.log('Service worker setup failed gracefully:', error);
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <WebSocketProvider>
            <TooltipProvider>
              {/* Global Flying Butterflies Background for All Pages */}
              <FlyingButterflies />
              <Toaster />
              <PWAInstallPrompt />
              <PWANotificationPrompt />
              <CommandPalette />
              
              {/* Main App Content - Direct Router without Error Boundary */}
              <Router />
              
              {/* Floating AI Chat */}
              <OptimizedSkyeChatbot />
            </TooltipProvider>
          </WebSocketProvider>
        </WalletProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
