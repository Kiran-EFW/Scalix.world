#!/bin/bash

# Scalix Cloud API Deployment Script
# Cost-optimized deployment to Google Cloud Run

set -e

echo "🚀 Deploying Scalix Cloud API to Google Cloud Run..."

# Configuration
PROJECT_ID=${GCP_PROJECT_ID:-"your-project-id"}
SERVICE_NAME="scalix-cloud-api"
REGION="us-central1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found. Please install Google Cloud SDK first.${NC}"
    exit 1
fi

# Check if user is logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n 1 > /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to gcloud. Running 'gcloud auth login'...${NC}"
    gcloud auth login
fi

# Set project
echo -e "${YELLOW}🔧 Setting project to ${PROJECT_ID}...${NC}"
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo -e "${YELLOW}🔌 Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable firestore.googleapis.com

# Initialize Firestore if not exists
echo -e "${YELLOW}📊 Checking Firestore database...${NC}"
if ! gcloud firestore databases describe --database="(default)" &> /dev/null; then
    echo -e "${YELLOW}📊 Creating Firestore database...${NC}"
    gcloud firestore databases create --region=${REGION}
else
    echo -e "${GREEN}✅ Firestore database already exists${NC}"
fi

# Build and deploy to Cloud Run
echo -e "${YELLOW}🏗️  Building and deploying to Cloud Run...${NC}"
gcloud run deploy ${SERVICE_NAME} \
  --source . \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --concurrency 100 \
  --timeout 300 \
  --set-env-vars "NODE_ENV=production,GCP_PROJECT_ID=${PROJECT_ID}" \
  --set-secrets "FIREBASE_PRIVATE_KEY=firebase-key:latest" \
  --set-secrets "FIREBASE_PRIVATE_KEY_ID=firebase-key-id:latest" \
  --set-secrets "FIREBASE_CLIENT_EMAIL=firebase-client-email:latest" \
  --set-secrets "FIREBASE_CLIENT_ID=firebase-client-id:latest" \
  --set-secrets "FIREBASE_CLIENT_X509_CERT_URL=firebase-cert-url:latest"

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(status.url)")

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${GREEN}🌐 Service URL: ${SERVICE_URL}${NC}"
echo -e "${GREEN}💰 Estimated monthly cost: $10-50${NC}"

# Health check
echo -e "${YELLOW}🔍 Running health check...${NC}"
if curl -f -s "${SERVICE_URL}/health" > /dev/null; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo -e "${YELLOW}⚠️  Please check the logs: gcloud logging read \"resource.type=cloud_run_revision\" --limit=10${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Scalix Cloud API is ready!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your desktop app to use: ${SERVICE_URL}"
echo "2. Update your web app to use: ${SERVICE_URL}"
echo "3. Test API key validation and usage tracking"
echo "4. Set up monitoring and alerts"

echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "# View logs: gcloud logging read \"resource.type=cloud_run_revision\" --limit=10"
echo "# View metrics: gcloud monitoring dashboards create scalix-api-dashboard"
echo "# Update service: gcloud run deploy ${SERVICE_NAME} --source ."
