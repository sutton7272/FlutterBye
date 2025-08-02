# Flutterbye Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Configuration
```bash
# Required Environment Variables
DATABASE_URL=postgresql://...  # Already configured
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com  # For production
SOLANA_PRIVATE_KEY=...  # Your Solana wallet private key

# API Keys (Required for full functionality)
OPENAI_API_KEY=sk-...  # For AI emotion analysis
TWILIO_ACCOUNT_SID=AC...  # For SMS integration
TWILIO_AUTH_TOKEN=...  # For SMS authentication
TWILIO_PHONE_NUMBER=+1...  # Your Twilio phone number
HELIUS_API_KEY=...  # Optional: Enhanced Solana performance

# Production Settings
NODE_ENV=production
ENABLE_RATE_LIMITING=true
ENABLE_MONITORING=true
ENABLE_ADMIN_PANEL=true

# Business Configuration
FEE_COLLECTION_WALLET=...  # Your SOL wallet for fee collection
DEFAULT_MINTING_FEE_PERCENTAGE=2.5
DEFAULT_REDEMPTION_FEE_PERCENTAGE=1.0
ADMIN_WALLET_ADDRESSES=wallet1,wallet2,wallet3  # Admin wallet addresses
```

### 2. Database Setup
```bash
# Push database schema to production
npm run db:push

# Verify database connection
curl https://your-app-url.replit.app/api/health
```

### 3. Security Verification
- [x] Rate limiting enabled
- [x] Input sanitization active
- [x] Security headers configured
- [x] HTTPS enforcement ready
- [x] Admin access controls implemented

## Deployment Steps

### 1. Deploy to Replit
1. Click the "Deploy" button in your Replit workspace
2. Configure environment variables in the deployment settings
3. Enable auto-scaling and monitoring
4. Set up custom domain (optional)

### 2. Configure DNS (if using custom domain)
```
CNAME: your-domain.com → your-app.replit.app
```

### 3. SSL Certificate
- Automatic SSL through Replit (recommended)
- Or configure custom SSL certificate

### 4. Monitoring Setup
Access monitoring dashboards:
- Health: `https://your-app-url/api/health`
- Metrics: `https://your-app-url/api/admin/metrics`
- Analytics: `https://your-app-url/admin-analytics`

## Post-Deployment Verification

### 1. Health Checks
```bash
# Application health
curl https://your-app-url/api/health

# Database connectivity
curl https://your-app-url/api/admin/metrics

# Solana integration
curl https://your-app-url/api/solana/health
```

### 2. Feature Testing
1. **Token Creation**: Test minting flow with wallet connection
2. **SMS Integration**: Send test SMS (if Twilio configured)
3. **AI Features**: Test emotion analysis (if OpenAI configured)
4. **Admin Panel**: Verify admin access and controls
5. **Payment Flow**: Test fee collection and redemption

### 3. Performance Validation
- Response time < 200ms
- Error rate < 1%
- Database queries optimized
- Rate limiting functional

## Scaling Configuration

### Auto-Scaling Settings
```yaml
scale:
  min: 2  # Minimum instances
  max: 10  # Maximum instances
  cpu_threshold: 80%
  memory_threshold: 80%
```

### Resource Allocation
```yaml
resources:
  cpu: "2000m"  # 2 CPU cores
  memory: "2Gi"  # 2GB RAM
  disk: "20Gi"  # 20GB storage
```

## Monitoring & Alerts

### Key Metrics to Monitor
1. **Application Performance**
   - Response time
   - Error rate
   - Throughput (requests/minute)
   - Memory usage

2. **Business Metrics**
   - Token creation rate
   - User signups
   - Revenue (fees collected)
   - Feature adoption

3. **Blockchain Integration**
   - Solana RPC response time
   - Transaction success rate
   - Wallet connection rate

### Alert Thresholds
- Response time > 500ms
- Error rate > 5%
- Memory usage > 90%
- Disk usage > 80%

## Security Hardening

### 1. API Rate Limiting
```javascript
// Current rate limits
General: 100 requests/15min
Token creation: 3 requests/min
Wallet operations: 10 requests/min
Admin operations: 20 requests/min
```

### 2. Input Validation
- Message length: 27 characters max
- Wallet address validation
- Numeric value validation
- SQL injection prevention

### 3. Access Controls
- Admin role verification
- Wallet-based authentication
- Permission-based access

## Business Operations

### 1. Fee Collection
- Automatic fee calculation and collection
- Configurable percentage rates
- SOL wallet integration for payments

### 2. Analytics Dashboard
Access comprehensive analytics:
- User behavior tracking
- Token creation trends
- Revenue metrics
- SMS integration usage

### 3. Admin Management
- User role management
- Content moderation
- System configuration
- Performance monitoring

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check DATABASE_URL configuration
   echo $DATABASE_URL
   # Verify network connectivity
   ```

2. **Solana RPC Issues**
   ```bash
   # Test RPC endpoint
   curl -X POST https://api.mainnet-beta.solana.com -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
   ```

3. **API Key Errors**
   ```bash
   # Verify OpenAI API key
   curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
   ```

### Support Contacts
- Replit Support: For infrastructure issues
- Solana Discord: For blockchain integration
- Internal Team: For application-specific issues

## Maintenance

### Regular Tasks
1. **Weekly**: Review error logs and performance metrics
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Capacity planning and scaling review

### Backup Strategy
- Database: Automatic daily backups
- Configuration: Version controlled in Git
- Secrets: Secure key management

## Success Metrics

### Launch Targets (First 30 Days)
- 1,000+ registered users
- 10,000+ tokens created
- 99%+ uptime
- < 200ms average response time

### Growth Indicators
- Daily active users growth
- Token creation volume
- Revenue from fees
- Feature adoption rates

---

**Deployment Status**: Ready for Production Launch 🚀

**Next Steps**: Configure API keys → Deploy → Monitor → Scale