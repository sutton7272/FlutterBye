import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { EarlyAccessGate } from "@/components/early-access-gate";


import { MinimalChatTest } from "@/components/minimal-chat-test";
import { SkyeChatFinal } from "@/components/skye-chat-final";
import { WorkingChat } from "@/components/working-chat";
import { DebugChat } from "@/components/debug-chat";
import { SkyeChatbot } from "@/components/skye-chatbot";
import { useState, useEffect, lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingSpinner } from "@/components/loading-spinner";
import { SuspenseWrapper } from "@/components/suspense-wrapper";
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
import Navbar from "@/components/navbar";
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
            <Navbar />
            <Home />
          </>
        )} />
        
        {/* Simplified Routes with navbar - unified navigation structure */}
        <Route path="/dashboard" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          </>
        )} />
        <Route path="/create" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<LoadingSpinner />}>
              <Create />
            </Suspense>
          </>
        )} />
        <Route path="/campaign-builder" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <CampaignBuilder />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/trade" component={() => (
          <>
            <Navbar />
            <Suspense fallback={<LoadingSpinner />}>
              <Trade />
            </Suspense>
          </>
        )} />
        <Route path="/flutterai" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <FlutterAIDashboard />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/flutter-wave" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <FlutterWave />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/flutter-art" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <FlutterArt />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/chat" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <Chat />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/intelligence" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <Intelligence />
            </SuspenseWrapper>
          </>
        )} />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/home" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <Dashboard />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/marketplace" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <Trade />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/portfolio" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <Trade />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/mint" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <Mint />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/mint/basic" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <MintBasic />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/mint/ai-enhanced" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <MintAIEnhanced />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/mint/voice" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <MintVoice />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/mint/multimedia" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <MintMultimedia />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/redeem" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <Redeem />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/activity" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <Activity />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/trending" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <Explore />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/how-it-works" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <HowItWorks />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/free-codes" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <FreeCodes />
            </SuspenseWrapper>
          </>
        )} />
        <Route path="/search" component={() => (
          <>
            <Navbar />
            <SuspenseWrapper>
              <SearchPage />
            </SuspenseWrapper>
          </>
        )} />
        {/* Admin Gateway - Password Protected Entry Point */}
        <Route path="/admin" component={AdminGateway} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" component={() => (
          <AdminRouteGuard>
            <SuspenseWrapper>
              <AdminDashboard />
            </SuspenseWrapper>
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/flutterai" component={() => (
          <AdminRouteGuard>
            <Navbar />
            <SuspenseWrapper>
              <FlutterAIDashboard />
            </SuspenseWrapper>
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/phase1" component={() => (
          <AdminRouteGuard>
            <Navbar />
            <SuspenseWrapper>
              <Phase1Dashboard />
            </SuspenseWrapper>
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/phase2" component={() => (
          <AdminRouteGuard>
            <Navbar />
            <SuspenseWrapper>
              <Phase2Dashboard />
            </SuspenseWrapper>
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/phase3" component={() => (
          <AdminRouteGuard>
            <Navbar />
            <SuspenseWrapper>
              <Phase3Dashboard />
            </SuspenseWrapper>
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/phase4" component={() => (
          <AdminRouteGuard>
            <Navbar />
            <Phase4Dashboard />
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/performance" component={() => (
          <AdminRouteGuard>
            <Navbar />
            <PerformanceDashboard />
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/ai-enhanced" component={() => (
          <AdminRouteGuard>
            <Navbar />
            <AIEnhancedDashboard />
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/cost-effective-ai" component={() => (
          <AdminRouteGuard>
            <Navbar />
            <CostEffectiveAIPanel />
          </AdminRouteGuard>
        )} />
        
        <Route path="/admin/unified" component={() => (
          <AdminRouteGuard>
            <Navbar />
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
        <Route path="/advanced-analytics" component={() => (
          <>
            <Navbar />
            <AdvancedAnalytics />
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
            <SuspenseWrapper>
              <InfoPage />
            </SuspenseWrapper>
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
        <Route path="/final-5-percent-dashboard" component={() => (
          <>
            <Navbar />
            <Final5PercentDashboard />
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
        <Route path="/flutterblog-bot" component={() => (
          <>
            <Navbar />
            <FlutterBlogBot />
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
        
        <Route path="/admin/flutterblog-bot" component={() => (
          <>
            <FlutterBlogBot />
          </>
        )} />
        <Route path="/monitoring" component={() => (
          <>
            <Navbar />
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
        <Route path="/production-deployment" component={() => (
          <>
            <Navbar />
            <ProductionDeployment />
          </>
        )} />
        <Route path="/dual-environment" component={() => {
          const DualEnvironment = lazy(() => import('./pages/dual-environment'));
          return (
            <>
              <Navbar />
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
              <Navbar />
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
              <Navbar />
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
              <Navbar />
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
            <Navbar />
            <AIMarketingBot />
          </>
        )} />
        <Route path="/admin-custodial-wallet" component={() => (
          <>
            <Navbar />
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
              <SkyeChatbot />
            </TooltipProvider>
          </WebSocketProvider>
        </WalletProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
