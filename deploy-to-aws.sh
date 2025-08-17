#!/bin/bash

# FlutterBye AWS Deployment Script
set -e

echo "🚀 Starting FlutterBye AWS Deployment..."

# Configuration
AWS_REGION="us-east-1"
ECR_REPOSITORY="flutterbye-backend"
S3_BUCKET="flutterbye-frontend"
CLOUDFRONT_DISTRIBUTION_ID=""
ECS_CLUSTER="flutterbye-cluster"
ECS_SERVICE="flutterbye-service"

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install it first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Build Frontend
echo "📦 Building frontend..."
npm run build:frontend

# Deploy Frontend to S3
echo "☁️ Deploying frontend to S3..."
aws s3 sync dist/ s3://$S3_BUCKET/ --delete --exclude "*.map"

# Invalidate CloudFront cache
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
fi

# Build Backend Docker Image
echo "🐳 Building backend Docker image..."
docker build -t $ECR_REPOSITORY:latest .

# Get ECR login token
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

# Tag and push to ECR
echo "📤 Pushing Docker image to ECR..."
ECR_URI=$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest
docker tag $ECR_REPOSITORY:latest $ECR_URI
docker push $ECR_URI

# Update ECS service
echo "🔄 Updating ECS service..."
aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment --region $AWS_REGION

# Wait for deployment to complete
echo "⏳ Waiting for deployment to complete..."
aws ecs wait services-stable --cluster $ECS_CLUSTER --services $ECS_SERVICE --region $AWS_REGION

echo "✅ Deployment completed successfully!"
echo "🌐 Production site: https://flutterbye.io"
echo "🛠️ Development site: https://flutterbye.io/dev"

# Run health check
echo "🏥 Running health check..."
sleep 30
if curl -f https://flutterbye.io/health; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed. Please check the logs."
    exit 1
fi

echo "🎉 FlutterBye is now live on AWS!"