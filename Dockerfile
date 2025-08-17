# Multi-stage build for FlutterBye AWS deployment
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY aws-deployment-package.json ./package.json

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S flutterbye -u 1001

# Copy package.json and install production dependencies
COPY aws-deployment-package.json ./package.json
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=flutterbye:nodejs /app/dist ./dist
COPY --from=builder --chown=flutterbye:nodejs /app/node_modules ./node_modules

# Copy any necessary static files
COPY --chown=flutterbye:nodejs ./server/public ./server/public

# Switch to non-root user
USER flutterbye

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]