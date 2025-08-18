# Files Needed for Deployment

## Essential Files Only (Much Smaller ZIP):
- package.json
- package-lock.json
- All files in `client/` folder
- All files in `server/` folder  
- All files in `shared/` folder
- vite.config.ts
- tsconfig.json
- tailwind.config.ts
- drizzle.config.ts
- .env.local (rename to .env)

## Files to EXCLUDE (Reduce ZIP size):
- node_modules/ (AWS will install packages)
- attached_assets/ (large files)
- All the .md files (documentation)
- .git/ folder if present
- Any build folders

This should make your ZIP much smaller for GitHub upload.