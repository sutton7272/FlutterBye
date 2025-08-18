# AWS Deployment Checklist - FlutterBye

## Files Fixed for Production:
✅ server/index.ts - Production mode configuration
✅ .ebextensions/nodecommand.config - AWS Node.js settings
✅ Procfile - AWS startup command

## Create Deployment ZIP:

### Exclude These Folders:
- `.git/` (128MB)
- `.local/` (585MB) 
- `attached_assets/` (57MB)
- `dist/` (13MB)

### Include Everything Else:
- client/
- server/ (with fixed index.ts)
- shared/
- public/
- data/
- migrations/
- contracts/
- social-automation/
- generated-content/
- .ebextensions/ (NEW)
- Procfile (NEW)
- package.json
- All config files

## Expected ZIP Size: ~50MB

## AWS Deployment Steps:
1. Create new ZIP with above files
2. Delete old AWS environment 
3. Create new Elastic Beanstalk application
4. Upload new ZIP
5. Wait 10-15 minutes for complete deployment

## After Successful Deployment:
1. Add database (PostgreSQL)
2. Configure environment variables (API keys)
3. Test functionality
4. Set up custom domain (www.flutterbye.io)