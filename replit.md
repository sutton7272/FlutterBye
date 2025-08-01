# Flutterbye

## Overview

Flutterbye is a Solana blockchain-powered platform for tokenized messaging and value distribution. It allows users to create 27-character tokenized messages, each becoming a unique SPL token ("FLBY-MSG"). The platform integrates messaging with token economics, enabling value attachment to messages, token distribution to specific wallets, custom token image uploads, and the creation of viral, meme-driven communication in Web3. Key capabilities include analyzing token holders for targeted marketing, a consolidated system for attaching value to tokens with expiration dates, a free token minting system for promotional distribution, and Limited Edition Token sets where users can create exclusive collections with predetermined quantities and special pricing. The platform features real-time blockchain chat functionality, SMS-to-blockchain integration for minting "emotional" tokens, comprehensive gamified rewards system, and complete admin content management tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite.
- **Routing**: Wouter for client-side routing.
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui.
- **Styling**: Tailwind CSS with custom CSS variables, dark mode support.
- **State Management**: TanStack React Query for server state management.
- **Form Handling**: React Hook Form with Zod validation.
- **UI/UX Decisions**: "boop.fun"-inspired design with black backgrounds, vibrant gradients, meme culture language, scrolling marquee text, live activity feeds, and a purple/pink/cyan color scheme. Emphasis on gamified engagement with points, badges, levels, streaks, and leaderboards. Comprehensive admin interface for dynamic content management (text, images, layout, themes) with live preview. Limited Edition Token interface with creation dialogs, progress bars, rarity badges, and minting controls.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **API Design**: RESTful API.
- **Admin Panel**: Comprehensive dashboard for pricing controls, user management, analytics, data export, and dynamic content editing.
- **Fee Management**: Configurable percentage fees for value creation (minting) and redemption, with automatic fee collection to an admin-specified wallet.
- **Authentication and Authorization**: Wallet-based authentication using Solana wallet adapters. Admin role-based access control with granular permissions.

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM.
- **Schema**: Comprehensive schema for users, tokens, holdings, transactions, airdrop signups, market listings, redeemable codes, limited edition sets, chat rooms/messages, SMS integration, and content management.
- **Connection**: Neon Database serverless PostgreSQL.
- **Migrations**: Drizzle Kit.
- **Image Storage**: Base64 encoding with resizing and validation.

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