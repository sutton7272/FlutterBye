# FlutterBye AWS Migration Plan

## Migration Overview
- **Production**: www.flutterbye.io (AWS hosting with custom minting backend)
- **Development**: Continue on Replit for development workflow
- **Important**: dev.flutterbye.io is a separate site by other developers (NOT our development environment)
- **Backend**: Replace Replit's blockchain services with your dev team's minting process

## Phase 1: Code Export & Preparation

### 1.1 Export FlutterBye Code from Replit
```bash
# Download entire project as ZIP from Replit
# Or use git clone if you have GitHub integration
git clone https://github.com/your-org/flutterbye.git
```

### 1.2 Clean Up for AWS Deployment
Remove Replit-specific dependencies:
- Remove `@replit/vite-plugin-cartographer`
- Remove `@replit/vite-plugin-runtime-error-modal`
- Update environment configuration for AWS

### 1.3 Separate Frontend & Backend
Your current structure is perfect for AWS:
- **Frontend**: React + TypeScript + Vite (client/ directory)
- **Backend**: Node.js + Express + TypeScript (server/ directory)

## Phase 2: Backend Integration

### 2.1 Replace Solana Services
Your dev team needs to provide:
- Custom minting API endpoints
- Token creation services
- Wallet integration services

Replace these files with your team's backend:
- `server/solana-service.ts`
- `server/core-token-service.ts`
- `server/flby-token-mainnet.ts`

### 2.2 Backend Environment Variables
```env
# Database
DATABASE_URL=your_aws_postgres_url

# Custom Minting Service
MINTING_API_URL=your_custom_minting_api
MINTING_API_KEY=your_minting_api_key

# Blockchain
SOLANA_RPC_URL=your_solana_rpc
SOLANA_NETWORK=mainnet-beta

# AI Services
OPENAI_API_KEY=your_openai_key

# Social Media
TWITTER_API_KEY=your_twitter_key
TWITTER_API_SECRET=your_twitter_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_secret

# SMS
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

## Phase 3: AWS Infrastructure Setup

### 3.1 AWS Services Required
1. **EC2/ECS**: For backend hosting
2. **S3**: For static file storage
3. **CloudFront**: CDN for frontend
4. **RDS**: PostgreSQL database
5. **Route 53**: Domain management
6. **Application Load Balancer**: Traffic routing
7. **Certificate Manager**: SSL certificates

### 3.2 Domain Configuration
- **Production**: www.flutterbye.io → AWS CloudFront
- **Development**: Continue on Replit (no public URL change needed)
- **Note**: dev.flutterbye.io is a separate site by other developers

## Phase 4: Deployment Architecture

### 4.1 Production (flutterbye.io)
```
User → Route 53 → CloudFront → ALB → ECS/EC2
                      ↓
                   S3 (Static Assets)
                      ↓
                   RDS (Database)
```

### 4.2 Development Workflow
After migration:
- **Active Development**: Continue on Replit
- **Production Deployment**: AWS (www.flutterbye.io)
- **Optional Staging**: staging.flutterbye.io on AWS

## Phase 5: Step-by-Step Migration

### Step 1: Prepare Local Environment
```bash
# 1. Download from Replit
# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.production
cp .env.example .env.development

# 4. Test locally
npm run build
npm run start
```

### Step 2: Set Up AWS Infrastructure
```bash
# Use AWS CLI or CloudFormation
aws configure
aws cloudformation create-stack --stack-name flutterbye-prod
```

### Step 3: Database Migration
```bash
# 1. Export data from Replit PostgreSQL
pg_dump $REPLIT_DATABASE_URL > flutterbye_backup.sql

# 2. Import to AWS RDS
psql $AWS_DATABASE_URL < flutterbye_backup.sql

# 3. Run migrations
npm run db:push
```

### Step 4: Deploy Backend
```bash
# 1. Build backend
npm run build

# 2. Deploy to ECS/EC2
# (Use Docker or direct deployment)

# 3. Configure load balancer
# 4. Set up SSL certificate
```

### Step 5: Deploy Frontend
```bash
# 1. Build frontend for production
npm run build

# 2. Upload to S3
aws s3 sync dist/ s3://flutterbye-frontend/

# 3. Configure CloudFront
# 4. Set up Route 53 DNS
```

### Step 6: Configure Domain and DNS
```bash
# 1. Configure Route 53 for www.flutterbye.io
# 2. Point to CloudFront distribution
# 3. Test SSL certificate
# 4. Update DNS propagation
```

## Phase 7: Post-Migration Development Workflow

### Continued Development on Replit
After migration, you can continue developing on Replit with this workflow:

1. **Code Development**: Continue using Replit for all development work
2. **Testing**: Test features in your Replit environment
3. **Deployment**: Deploy changes to AWS production when ready

### Development Environment Options
**Option A: Keep Replit as Pure Dev Environment**
- Develop and test on Replit
- Deploy to AWS for production
- No public dev URL needed

**Option B: Create Staging Environment**
- Deploy a staging version to AWS (e.g., staging.flutterbye.io)
- Use for final testing before production
- Replit remains for active development

### Deployment Pipeline
```bash
# Development → Replit
# Testing → Replit or AWS Staging
# Production → AWS (www.flutterbye.io)
```

## Phase 6: Backend Integration Checklist

### Your Dev Team Needs to Provide:
1. **Minting API Endpoints**:
   ```typescript
   POST /api/mint/token
   POST /api/mint/transfer
   GET /api/mint/status
   ```

2. **Authentication Integration**:
   ```typescript
   POST /api/auth/wallet
   GET /api/auth/verify
   ```

3. **Blockchain Operations**:
   ```typescript
   POST /api/blockchain/create-token
   POST /api/blockchain/burn-redeem
   GET /api/blockchain/balance
   ```

### Files to Replace:
- `server/solana-service.ts` → Your minting service
- `server/core-token-service.ts` → Your token operations
- `server/routes-solana.ts` → Your blockchain routes

## Phase 7: Environment Configuration

### 7.1 Production Environment (flutterbye.io)
- Custom minting backend
- AWS RDS database
- Production Solana network
- Full feature set

### 7.2 Development Environment (flutterbye.io/dev)
- Simplified minting (or mock)
- Development database
- DevNet Solana
- Basic MVP features

## Phase 8: Testing & Deployment

### 8.1 Pre-deployment Checklist
- [ ] Custom minting backend integrated
- [ ] Database migrated and tested
- [ ] All environment variables configured
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] Load balancer health checks passing

### 8.2 Deployment Steps
1. Deploy backend to AWS
2. Deploy frontend to CloudFront
3. Configure Route 53 DNS
4. Test production environment
5. Set up development environment
6. Configure monitoring and alerts

## Phase 9: Monitoring & Maintenance

### 9.1 AWS Monitoring
- CloudWatch for logs and metrics
- Application Load Balancer health checks
- RDS monitoring
- Cost monitoring

### 9.2 Application Monitoring
Your existing monitoring is ready:
- Performance monitoring middleware
- Error tracking
- Business metrics

## Next Steps

1. **Immediate**: Download code from Replit
2. **This Week**: Set up AWS infrastructure
3. **Integration**: Work with your dev team on minting backend
4. **Testing**: Deploy to staging environment first
5. **Go Live**: Deploy to production flutterbye.io

## Cost Estimation (AWS)
- **Small Setup**: $200-500/month
- **Medium Setup**: $500-1500/month
- **Large Setup**: $1500+/month

## Support & Assistance
I can help you with:
- Code modifications for AWS
- Environment configuration
- Deployment scripts
- Integration with your team's backend
- Setting up the development environment