# Flutterbye

## Overview

Flutterbye is a revolutionary Solana blockchain-powered platform for tokenized messaging and value distribution, aiming to become the communication layer for Web3. It allows users to create 27-character tokenized messages, each becoming a unique SPL token ("FLBY-MSG"). The platform integrates messaging with token economics, enabling value attachment to messages, token distribution, custom token image uploads, and the creation of viral, meme-driven communication. Key capabilities include targeted marketing analysis, value attachment with expiration dates, a free token minting system for promotion, Limited Edition Token sets, real-time blockchain chat, SMS-to-blockchain integration for minting "emotional" tokens, a gamified rewards system, and comprehensive admin content management with marketing analytics.

**Vision**: To transform from tokenized messaging into the universal communication protocol for Web3, incorporating AI-powered features, cross-chain capabilities, and social mechanics that revolutionize how value and emotion are communicated across the blockchain ecosystem.

**Current Phase**: Production infrastructure is complete with enterprise-grade features, multi-currency support, and a comprehensive FLBY token economy. This includes advanced security middleware, intelligent caching, comprehensive backup systems, a professional admin dashboard, multi-currency payments (SOL, USDC, FLBY) with native token economics, and complete staking and governance infrastructure for the FLBY token. An FLBY airdrop rewards system with multiple earning mechanics and profit sharing is implemented. **VIRAL AMPLIFIERS CONSOLIDATED**: All viral growth features (viral sharing, celebrity integration, enterprise quick setup) are now efficiently integrated into existing pages - Marketplace includes viral sharing and celebrity tabs, Enterprise Campaigns includes quick setup functionality. This streamlined approach reduces navigation complexity while maintaining all viral growth capabilities. The platform features an electric blue and green theme with animated pulse effects and circuit aesthetics, serving casual users, enterprise clients, and token holders.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Electric blue and green color scheme with animated electrical pulse effects running through frames and borders, creating a high-energy circuit aesthetic.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite.
- **Routing**: Wouter for client-side routing.
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui.
- **Styling**: Tailwind CSS with custom CSS variables, dark mode support.
- **State Management**: TanStack React Query for server state management.
- **Form Handling**: React Hook Form with Zod validation.
- **UI/UX Decisions**: High-energy electric circuit design with dark navy backgrounds, electric blue and green color scheme with animated pulse effects, animated electrical borders, circuit flow gradients, and pulsing glow effects. Emphasis on gamified engagement (points, badges, levels, streaks, leaderboards). Comprehensive admin interface for dynamic content management (text, images, layout, themes) with live preview, advanced marketing analytics, and a Limited Edition Token interface with creation dialogs, progress bars, rarity badges, and minting controls.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **API Design**: RESTful API with multi-currency transaction support.
- **Payment System**: Comprehensive multi-currency support (SOL, USDC, FLBY) with real-time exchange rates, fee discounts for native FLBY token usage, and currency-specific transaction handling.
- **FLBY Token Economics**: Native token integration with 10% fee discounts, governance rights, staking rewards, and exclusive access benefits.
- **Admin Panel**: Comprehensive dashboard for pricing controls, user management, advanced marketing analytics, user behavior insights, revenue analytics, data export, and dynamic content editing.
- **Fee Management**: Configurable percentage fees for value creation (minting) and redemption, with automatic fee collection to an admin-specified wallet.
- **Authentication and Authorization**: Wallet-based authentication using Solana wallet adapters. Admin role-based access control with granular permissions.
- **Security Infrastructure**: Production-grade rate limiting, input sanitization, security headers, Content Security Policy, and comprehensive validation middleware.
- **Monitoring & Analytics**: Real-time performance monitoring, business metrics tracking, error aggregation, health checks, and comprehensive admin analytics dashboard.
- **Production Features**: Environment configuration validation, auto-scaling support, SSL enforcement, resource monitoring, and deployment automation.
- **Default Token Image System**: Automated system using Flutterbye butterfly logo as default for all tokens without custom images, with admin controls and API management.

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM.
- **Schema**: Comprehensive schema for users, tokens, holdings, transactions, airdrop signups, market listings, redeemable codes, limited edition sets, chat rooms/messages, SMS integration, content management, and system settings.
- **Connection**: Neon Database serverless PostgreSQL with connection pooling.
- **Migrations**: Drizzle Kit with production migration support.
- **Storage Layer**: DatabaseStorage class with optimized queries and error handling.
- **Image Storage**: Base64 encoding with resizing and validation.
- **System Settings**: Dynamic configuration system for default token images and admin-controlled platform settings.

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

### Future Integrations (Phase 2 - Post-Launch)
- **OpenAI**: For advanced AI emotion analysis and content optimization.
- **Twilio**: For SMS-to-blockchain integration and notifications.
- **Helius**: For enhanced Solana RPC performance (optional).