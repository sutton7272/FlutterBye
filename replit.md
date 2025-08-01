# Flutterbye

## Overview

Flutterbye is a blockchain-powered messaging and value distribution protocol built on the Solana network. It enables users to create and send 27-character tokenized messages, where each message becomes a custom SPL token with the symbol "FlBY-MSG". The platform combines messaging with token economics, allowing users to attach value to messages, distribute tokens to specific wallets, upload custom token images, and create viral, meme-driven communication experiences in Web3.

### Phase 2 Features (Latest)
- **Token Holder Analysis**: Input any Solana token address/symbol to analyze top 25-500 wallet holders for targeted marketing campaigns
- **Consolidated Value Attachment**: Single unified system for attaching value pools to tokens with automatic per-token calculation
- **Expiration Date System**: Value-attached tokens can have expiration dates for time-limited redemption
- **Free Flutterbye Mint System**: Special mint type with redeemable codes for promotional distribution
- **Comprehensive Admin Dashboard**: Full backend administration with pricing controls, user management, data export, code generation, and activity logging

### SMS-to-Blockchain Integration (New Concept)
- **Text-to-Token System**: Users text messages to +1 (844) BYE-TEXT, automatically minting emotional tokens
- **Emotional Detection**: AI-powered emotion analysis creates specialized token types (hug, heart, apology, celebration)
- **Time-Locked Tokens**: Messages can be locked for specific durations (24 hours for apologies)
- **Burn-to-Read Mechanism**: Intimate messages require burning the token to reveal content
- **Reply-Gated System**: Some tokens require responses to unlock or complete the interaction
- **Crypto Onboarding Funnel**: Non-crypto users receive SMS notifications to claim their tokens
- **Phone-Wallet Registration**: Users can register phone numbers with Solana wallets for seamless delivery

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (Latest Session)

**boop.fun-Inspired Design Transformation (August 1, 2025)**
- Analyzed boop.fun website architecture and extracted key high-energy design elements
- Redesigned home page with black background, vibrant gradients, and meme culture language
- Implemented scrolling marquee text animations with phrases like "TURN MESSAGES INTO MONEY", "BUILD CULTS WITH CODE"
- Integrated new Flutterbye branding logo featuring digital butterfly with pixelated text effect
- Added live activity feed showcasing real-time SMS, mint, and redeem activities with user wallet addresses
- Created stats dashboard displaying tokens minted (10,847), SMS sent (2,341), value distributed ($47.2K), active users (892)
- Built feature cards highlighting SMS-to-blockchain, instant rewards, viral distribution, and community building
- Applied boop.fun aesthetic: bold typography, gradient backgrounds, crypto slang, and high-energy messaging
- Transformed user experience from traditional landing page to memeconomy-focused platform
- Enhanced visual hierarchy with purple/pink/cyan color scheme and backdrop-blur effects

**Previous Implementation - Personalized Blockchain Journey Dashboard (August 1, 2025)**
- Built comprehensive journey dashboard with achievement milestones tracking user blockchain adoption progression
- Created database schema for journey_milestones, user_journey_progress, journey_insights, and user_preferences
- Implemented JourneyService with milestone eligibility checking, progress calculation, and personalized insights generation
- Seeded 19 journey milestones across 5 categories: onboarding, engagement, mastery, social, and value distribution
- Built beautiful Journey page UI with gradient design showing journey progress, next milestones, achievements, and insights
- Integrated journey system with existing rewards system for automatic milestone award triggers
- Added AI-powered insight generation for weekly summaries, personal bests, and trend analysis
- Created comprehensive journey statistics including completion percentage, level progress, and favorite categories
- Added milestone categorization with visual progress tracking and achievement celebration
- Deployed personalized journey dashboard ready for user engagement and blockchain education

**Previous Implementation - Gamified User Engagement Rewards System (August 1, 2025)**
- Built comprehensive rewards system with points, badges, levels, streaks, and leaderboards
- Created database schema for user_rewards, badges, user_badges, reward_transactions, daily_challenges, and user_challenge_progress
- Implemented RewardsService with automatic point calculation, badge eligibility checking, and level progression
- Added 16 different badges across SMS, trading, milestone, and social categories with rarity system (common to legendary)
- Built dynamic daily challenges system with progress tracking and bonus point rewards
- Created beautiful Rewards page UI with gradient design showing user stats, badges, leaderboard, and transaction history
- Integrated rewards triggers throughout platform: SMS sending (10pts), token minting (15pts), phone registration (25pts), daily login (5pts)
- Added streak mechanics with bonus multipliers and 15-level progression system (100-75,000 points)
- Deployed fully functional gamification system ready for user engagement and retention

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for Home, Marketplace, Portfolio, and Mint
- **UI Components**: Radix UI primitives with custom styling using shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming, dark mode support
- **State Management**: TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form schemas

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured route handlers
- **Development Setup**: Vite middleware for development with HMR support
- **Error Handling**: Centralized error handling with structured error responses
- **Logging**: Custom request/response logging with performance metrics
- **Admin Panel**: Comprehensive backend dashboard with pricing controls, user management, analytics, and data export capabilities

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Comprehensive database schema including users, tokens, token holdings, transactions, airdrop signups, market listings, redeemable codes, and code redemptions
- **Connection**: Neon Database serverless PostgreSQL for cloud hosting
- **Migrations**: Drizzle Kit for database schema migrations and management
- **Development Storage**: In-memory storage implementation for development/testing
- **Image Storage**: Base64 encoding for token images with built-in resizing and validation

### Authentication and Authorization
- **Wallet Integration**: Solana wallet adapter integration (Phantom, Solflare support)
- **User Management**: Wallet address-based user identification and management
- **Session Handling**: PostgreSQL session storage with connect-pg-simple
- **Security**: No traditional authentication - relies on wallet signatures for user verification

## External Dependencies

### Blockchain Infrastructure
- **Solana Network**: Primary blockchain for SPL token creation and distribution
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **Wallet Adapters**: Integration with major Solana wallets (Phantom, Solflare)

### Development Tools
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect
- **Drizzle Kit**: Database schema management and migrations
- **Zod**: Runtime type validation for API endpoints and forms
- **TanStack React Query**: Server state management and caching

### UI Framework
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library using Radix UI and Tailwind

### Build and Development
- **Vite**: Fast build tool with HMR support and development server
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Type safety across frontend and backend
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer