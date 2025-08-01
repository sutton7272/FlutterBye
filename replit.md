# Flutterbye

## Overview

Flutterbye is a blockchain-powered messaging and value distribution protocol built on the Solana network. It enables users to create and send 27-character tokenized messages, where each message becomes a custom SPL token with the symbol "FlBY-MSG". The platform combines messaging with token economics, allowing users to attach value to messages, distribute tokens to specific wallets, upload custom token images, and create viral, meme-driven communication experiences in Web3.

### Phase 2 Features (Latest)
- **Token Holder Analysis**: Input any Solana token address/symbol to analyze top 25-500 wallet holders for targeted marketing campaigns
- **Consolidated Value Attachment**: Single unified system for attaching value pools to tokens with automatic per-token calculation
- **Expiration Date System**: Value-attached tokens can have expiration dates for time-limited redemption
- **Free Flutterbye Mint System**: Special mint type with redeemable codes for promotional distribution
- **Enhanced Admin Dashboard**: Comprehensive monitoring and management tools

## User Preferences

Preferred communication style: Simple, everyday language.

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