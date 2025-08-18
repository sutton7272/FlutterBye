# FlutterBye

A Solana blockchain-powered platform for tokenized messaging and value distribution, aiming to be the Web3 communication layer.

🚀 **Production Deployment Status:** Complete AWS infrastructure setup and deployment ready via GitHub Actions.

## Quick AWS Deployment
Run the "Create AWS Environment and Deploy" workflow to automatically:
- Create AWS Elastic Beanstalk application and environment
- Deploy FlutterBye platform to production
- Configure Node.js 20 with proper environment variables

## Features

- SPL token creation and distribution
- AI-powered social media automation
- Enterprise wallet infrastructure
- Real-time blockchain chat
- SMS-to-blockchain integration
- Comprehensive analytics dashboard

## Deployment

This project automatically deploys to AWS Elastic Beanstalk via GitHub Actions when code is pushed to the main branch.

### Prerequisites

1. AWS Elastic Beanstalk application set up
2. GitHub repository secrets configured:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

### Local Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

Required environment variables for production:
- `NODE_ENV=production`
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- Additional API keys as needed

## Architecture

- **Frontend**: React with TypeScript, Vite
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Blockchain**: Solana DevNet/MainNet
- **Deployment**: AWS Elastic Beanstalk