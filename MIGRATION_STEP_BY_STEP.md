# FlutterBye AWS Migration - Step by Step Guide

## Before We Start
- This guide assumes you've never done cloud deployment before
- We'll go slowly and explain each step
- You'll need: A computer, AWS account, and about 2-3 hours

## Step 1: Download Your Code from Replit

### Option A: Download as ZIP (Easiest)
1. In your Replit workspace, look for the menu (three dots or hamburger menu)
2. Click "Download as ZIP"
3. Save it to your computer (like your Desktop)
4. Extract/unzip the folder

### Option B: Use Git (If you have GitHub connected)
1. Open Terminal on your computer
2. Run: `git clone [your-github-repo-url]`

**What you should have now:** A folder on your computer with all your FlutterBye code

## Step 2: Set Up Your Computer for Development

### Install Required Software
1. **Node.js** (Version 18 or newer)
   - Go to nodejs.org
   - Download and install
   - Test: Open terminal, type `node --version`

2. **AWS CLI** (Amazon's command line tool)
   - Go to aws.amazon.com/cli
   - Download and install
   - Test: Type `aws --version`

### Test Your Code Locally
1. Open terminal in your FlutterBye folder
2. Run these commands:
   ```bash
   npm install
   npm run build
   npm run dev
   ```
3. If it works, you'll see your site at localhost:5000

**What you should have now:** Your FlutterBye site running on your computer

## Step 3: Create AWS Account and Basic Setup

### Create AWS Account
1. Go to aws.amazon.com
2. Click "Create AWS Account"
3. Fill out your information
4. Add payment method (they have free tier)

### Set Up AWS CLI
1. Go to AWS Console → IAM → Users
2. Create new user with "Programmatic access"
3. Give it "AdministratorAccess" permissions (for now)
4. Save the Access Key and Secret Key
5. In terminal, run: `aws configure`
6. Enter your keys when prompted

**What you should have now:** AWS account ready to use

## Step 4: Prepare Your Code for AWS

### Clean Up Replit-Specific Code
We need to remove some Replit-only features:

1. Edit `package.json` - remove these lines:
   - `@replit/vite-plugin-cartographer`
   - `@replit/vite-plugin-runtime-error-modal`

2. Edit `vite.config.ts` - remove Replit plugin imports

3. Create new environment file for AWS:
   ```bash
   cp .env.local .env.production
   ```

**What you should have now:** Code ready for AWS deployment

## Step 5: Set Up AWS Infrastructure

This is where we create all the AWS services you need.

### Create Database (RDS)
1. AWS Console → RDS → Create Database
2. Choose PostgreSQL
3. Choose "Free tier" template
4. Set database name: `flutterbye`
5. Set username: `postgres`
6. Set password: (write this down!)
7. Wait 10-15 minutes for it to create

### Create File Storage (S3)
1. AWS Console → S3 → Create Bucket
2. Name it: `flutterbye-frontend-[random-numbers]`
3. Keep all default settings
4. Click Create

### Create Server (EC2 or App Runner)
We'll use App Runner (easier for beginners):
1. AWS Console → App Runner → Create Service
2. Choose "Source code repository" 
3. We'll set this up in the next step

**What you should have now:** Basic AWS infrastructure

## Step 6: Deploy Your Database

### Export Data from Replit
1. In Replit, open the Database tab
2. Or use this command in Replit terminal:
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```
3. Download the backup.sql file

### Import to AWS RDS
1. Get your AWS database connection string from RDS console
2. On your computer, run:
   ```bash
   psql [your-aws-database-url] < backup.sql
   ```

**What you should have now:** Your data moved to AWS

## Step 7: Deploy Your Backend

### Build Your Backend
1. In your project folder:
   ```bash
   npm run build
   ```

### Create Dockerfile
Create a file called `Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Deploy to App Runner
1. Push your code to GitHub (App Runner needs this)
2. In App Runner, connect to your GitHub repo
3. It will automatically build and deploy

**What you should have now:** Your backend running on AWS

## Step 8: Deploy Your Frontend

### Build Frontend
```bash
npm run build
```

### Upload to S3
```bash
aws s3 sync dist/ s3://your-bucket-name/
```

### Set Up CloudFront (CDN)
1. AWS Console → CloudFront → Create Distribution
2. Point it to your S3 bucket
3. Wait 15-20 minutes for deployment

**What you should have now:** Your frontend served from AWS

## Step 9: Configure Your Domain

### Set Up DNS
1. AWS Console → Route 53 → Hosted Zones
2. Create hosted zone for `flutterbye.io`
3. Point `www.flutterbye.io` to your CloudFront distribution

### Set Up SSL Certificate
1. AWS Console → Certificate Manager
2. Request certificate for `www.flutterbye.io`
3. Validate via DNS

**What you should have now:** www.flutterbye.io pointing to your AWS site

## Step 10: Final Configuration

### Update Environment Variables
In your AWS App Runner service, add these environment variables:
- `DATABASE_URL`: Your AWS RDS connection string
- `NODE_ENV`: `production`
- All your API keys (OpenAI, Twitter, etc.)

### Test Everything
1. Visit www.flutterbye.io
2. Test minting functionality
3. Test all major features

**What you should have now:** Fully working FlutterBye on AWS!

## What's Next?

After migration, you can:
- Continue developing on Replit
- Deploy updates to AWS when ready
- Monitor your AWS costs and performance

## Need Help?

If you get stuck on any step:
1. Double-check you followed the step exactly
2. Look for error messages - they usually tell you what's wrong
3. Ask for help with the specific error message

Let's start with Step 1 - do you want to download your code as a ZIP file or do you have GitHub connected to your Replit?