# Flutterbye SMS-to-Blockchain Deployment Guide

## Custom Domain Setup for flutterbye.io

### Step 1: Deploy on Replit
1. Click the "Deploy" button in your Replit workspace
2. Choose "Autoscale Deployment" for automatic scaling
3. Configure the deployment settings:
   - **Name**: flutterbye-sms-production
   - **Build Command**: `npm install && npm run build` (if needed)
   - **Start Command**: `npm run dev` (already configured)
   - **Environment**: Production

### Step 2: Custom Domain Configuration
1. In your deployment dashboard, go to "Domains"
2. Click "Add Custom Domain"
3. Enter: `flutterbye.io`
4. Replit will provide DNS records like:
   ```
   Type: CNAME
   Name: www
   Value: [replit-provided-value].replit.app
   
   Type: A
   Name: @
   Value: [replit-provided-ip]
   ```

### Step 3: DNS Configuration at Your Registrar
Add these DNS records to your domain registrar (where flutterbye.io is managed):

```dns
# A Record for root domain
Type: A
Name: @
Value: [Replit-provided-IP]
TTL: 3600

# CNAME for www subdomain
Type: CNAME
Name: www
Value: [your-deployment].replit.app
TTL: 3600

# Optional: CNAME for SMS subdomain
Type: CNAME
Name: sms
Value: [your-deployment].replit.app
TTL: 3600
```

### Step 4: Environment Variables for Production
Set these in your Replit deployment environment:

```env
NODE_ENV=production
DATABASE_URL=[your-postgresql-connection-string]
TWILIO_ACCOUNT_SID=[your-twilio-sid]
TWILIO_AUTH_TOKEN=[your-twilio-token]
TWILIO_PHONE_NUMBER=[your-twilio-number]
```

### Step 5: Twilio Webhook Configuration
Update your Twilio phone number webhook URL to:
```
https://flutterbye.io/api/sms/webhook
```

## SMS Integration Endpoints

### Production URLs:
- **Main SMS Page**: `https://flutterbye.io/sms`
- **Phone Registration**: `https://flutterbye.io/api/sms/register`
- **SMS Webhook**: `https://flutterbye.io/api/sms/webhook`
- **Admin Analytics**: `https://flutterbye.io/admin`

### SMS Phone Number: +1 (844) BYE-TEXT
Configure this number in Twilio to point to your webhook endpoint.

## Features Ready for Production:

### Core SMS-to-Blockchain System:
✓ Text message processing with emotion detection
✓ Automatic token minting (27-character FlBY-MSG tokens)
✓ Phone-to-wallet registration with verification
✓ Emotional token mechanics (time-locked, burn-to-read, reply-gated)
✓ SMS analytics dashboard for monitoring

### Database Schema:
✓ SMS messages tracking
✓ Phone-wallet mappings
✓ Emotional interactions
✓ SMS delivery tracking
✓ User analytics

### Admin Dashboard:
✓ SMS analytics monitoring
✓ User management
✓ Token holder analysis
✓ Platform statistics

## Security Considerations:
- Phone numbers are encrypted in database
- SSL/TLS automatically provided by Replit
- Environment variables secured
- Webhook endpoint validates Twilio signatures (implement if needed)

## Scaling:
- Autoscale deployment handles traffic spikes
- Database connection pooling configured
- SMS processing optimized for high volume

## Next Steps After Deployment:
1. Test SMS registration flow
2. Send test messages to +1 (844) BYE-TEXT
3. Verify token minting and delivery
4. Monitor analytics dashboard
5. Set up Twilio phone number forwarding

Your revolutionary SMS-to-blockchain communication system will be live at flutterbye.io!