# Flutterbye

## Overview
Flutterbye, a Solvitur Inc. product, is a Solana blockchain-powered platform for tokenized messaging and value distribution, aiming to be the Web3 communication layer. It enables creation of unique SPL token messages ("FLBY-MSG"), attaching value, distributing tokens, and fostering viral communication. Key capabilities include targeted marketing via token holder analysis, value attachment with expiration dates, a free token minting system, Limited Edition Token sets, real-time blockchain chat, SMS-to-blockchain integration for "emotional" tokens, a gamified rewards system, and admin content management with marketing analytics.

**Vision**: To transform into the universal communication protocol for Web3, incorporating AI-powered features and cross-chain capabilities to revolutionize value and emotional communication across the blockchain ecosystem. The platform features a Command Palette, WebSocket real-time intelligence, AI Chat with specialist personalities, Multi-Chain Integration, Advanced Filtering, Mobile-responsive design, and a comprehensive Theme Provider. It leverages a revolutionary "Living AI Personality System" using OpenAI GPT-4o for predictive analytics, dynamic UI generation, emotional intelligence, and quantum content generation.

The platform includes a comprehensive "Platform Diagnostics Center" for health monitoring and diagnostics, and enterprise-grade deployment infrastructure with MainNet blockchain integration, multi-region architecture, and bank-level security. FlutterWave, an AI-driven SMS-to-blockchain product, harnesses emotional intelligence and viral prediction algorithms. Full AI integration extends to AI Admin Service, AI Content Service, and Universal AI Enhancement Buttons.

**Enterprise Wallet Infrastructure**: Production-ready bank-level multi-signature escrow wallet system supporting high-value enterprise contracts ($200K-$2M). Supports SOL, USDC, and FLBY currencies with comprehensive API endpoints for wallet creation, balance monitoring, fund release, and compliance reporting, targeting $5M-$50M ARR.

**Skye AI Chatbot System**: Production-ready floating AI chatbox with working input functionality and full personality system, integrated with FlutterAI intelligence system for wallet analysis and behavioral insights.

**Enhanced Social Media Automation**: Comprehensive AI-powered social media management platform with image support and advanced hashtag optimization. Features include automated post generation with site library image integration, AI-generated original images using OpenAI, real-time hashtag performance tracking, trend-based hashtag selection, and time-optimized content scheduling. The system supports multi-category content generation (product, community, educational, promotional) with intelligent image selection based on content context. **Status**: All functionality verified operational but currently rate-limited by Twitter API (17/17 daily posts used, resets in ~20 hours). System ready for production deployment once rate limits reset.

Navigation features "🚀 Trending" with comprehensive viral acceleration tools. Revenue generation infrastructure is complete, including an enterprise sales pipeline tracking and API monetization system. Core blockchain operations for SPL token creation, value attachment, burn-to-redeem, and transfer are operational on Solana DevNet, with secure Phantom wallet integration ready for MainNet deployment.

**Early Access Protection System**: Implemented comprehensive access control with LaunchCountdown as public landing page featuring countdown timer, demo sections, and email signup. Early access authentication protects all site navigation and platform features while keeping the landing page publicly accessible. Navigation becomes visible after successful early access validation through the landing page card. Social automation dashboard accessible through admin interface with proper authentication guards.

**Voice & Music Attachment**: Functionality temporarily removed from create/mint pages as requested by user (not yet fully developed). Feature will be added back later when development is complete. All related imports, components, and UI elements have been cleaned up.

**Token Price Comparison**: Component removed from mint page as it was not functioning properly. The pricing comparison widget has been cleaned up from the user interface.

**Token Holder Analysis Enhancement**: Repositioned the powerful Token Holder Analysis feature to be permanently visible in the main form column rather than hidden behind a button click. This valuable wallet targeting tool is now prominently displayed in the mint page to emphasize its importance for precision marketing campaigns.

## User Preferences
Preferred communication style: Simple, everyday language.
Design preference: Electric blue and green color scheme with animated electrical pulse effects running through frames and borders, creating a high-energy circuit aesthetic.
Priority focus: Initial release strategy focusing on coin minting as the core entry point, with strategic roadmap for $100M ARR target.
Migration Strategy: Successfully deployed to Vercel hosting platform through GitHub repository integration. FlutterBye platform is now live with global CDN distribution, automatic HTTPS, and ready for www.flutterbye.io domain mapping. Replit remains the development environment with automatic GitHub sync for continuous deployment. Vercel deployment provides superior performance and reliability compared to previous AWS Elastic Beanstalk attempts.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite.
- **Routing**: Wouter for client-side routing.
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui.
- **Styling**: Tailwind CSS with custom CSS variables, dark mode support.
- **State Management**: TanStack React Query for server state management.
- **Form Handling**: React Hook Form with Zod validation.
- **AI Integration**: Custom useAIContent hook for conversational AI features with ARIA companion system.
- **UI/UX Decisions**: High-energy electric circuit design with dark navy backgrounds, electric blue and green color scheme with animated pulse effects. Features animated electrical borders, circuit flow gradients, and pulsing glow effects, emphasizing gamified engagement with points, badges, levels, streaks, and leaderboards. Includes a comprehensive admin interface for dynamic content management with live preview and advanced marketing analytics. ARIA AI Chat provides a conversational interface with real-time mood tracking and intelligent responses.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **API Design**: RESTful API with multi-currency transaction support.
- **Payment System**: Comprehensive multi-currency support (SOL, USDC, FLBY) with real-time exchange rates and fee discounts for FLBY.
- **FLBY Token Economics**: Native token integration with fee discounts, governance rights, staking rewards, and exclusive access.
- **Admin Panel**: Comprehensive dashboard for pricing controls, user management, marketing analytics, and dynamic content editing.
- **Fee Management**: Configurable percentage fees for value creation and redemption, with automatic collection and dynamic structure based on payment currency.
- **FlutterAI Intelligence System**: Revolutionary social credit scoring platform with comprehensive wallet intelligence gathering, AI-powered scoring, behavioral analysis, wealth indicators, activity patterns, demographic insights, marketing segment distribution, targeted marketing capabilities, batch processing, and comprehensive dashboard analytics.
- **Authentication and Authorization**: Wallet-based authentication using Solana wallet adapters. Admin role-based access control with granular permissions.
- **Security Infrastructure**: Production-grade rate limiting, input sanitization, security headers, Content Security Policy, and comprehensive validation.
- **Monitoring & Analytics**: Real-time performance monitoring, business metrics tracking, error aggregation, and health checks.
- **Production Features**: Environment configuration validation, auto-scaling support, SSL enforcement, and resource monitoring.

**Social Media Testing Suite**: Comprehensive testing endpoints for image-supported posts, hashtag optimization analysis, multi-category content generation, time-slot optimization, AI image generation capability, and site image library selection. Includes real-time performance monitoring and analytics-driven optimization strategies.
- **Default Token Image System**: Automated system using Flutterbye butterfly logo as default, with admin controls and API management.

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM.
- **Schema**: Comprehensive schema for users, tokens, holdings, transactions, airdrop signups, market listings, redeemable codes, limited edition sets, chat rooms/messages, SMS integration, content management, and system settings.
- **Connection**: Neon Database serverless PostgreSQL with connection pooling.
- **Migrations**: Drizzle Kit with production migration support.
- **Storage Layer**: DatabaseStorage class with optimized queries and error handling.
- **Image Storage**: Base64 encoding with resizing and validation.
- **System Settings**: Dynamic configuration for default token images and platform settings.

### SMS Integration Framework
- **Token Creation**: Automated emotional token creation from SMS messages.

## External Dependencies

### Blockchain Infrastructure
- **Solana Network**: For SPL token creation and distribution.
- **@neondatabase/serverless**: Serverless PostgreSQL database.
- **Wallet Adapters**: Phantom, Solflare.

### Development Tools
- **Drizzle ORM**: Type-safe database operations.
- **Drizzle Kit**: Database schema management.
- **Zod**: Runtime type validation.
- **TanStack React Query**: Server state management.

### UI Framework
- **Radix UI**: Accessible UI primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **shadcn/ui**: Pre-built component library.

### Build and Development
- **Vite**: Build tool and development server.
- **ESBuild**: JavaScript bundler.
- **TypeScript**: Type safety.
- **PostCSS**: CSS processing.

### Active External Integrations (Production-Ready)
- **OpenAI GPT-4o**: Advanced AI emotion analysis, campaign generation, message optimization, personalized recommendations, ARIA AI companion with interactive conversations, personalized greetings, mood detection, intent recognition, and contextual responses.
- **Twilio**: SMS-to-blockchain integration and notification system.
- **Helius**: Enhanced Solana RPC performance (optional).