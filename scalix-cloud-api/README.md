# 🚀 Scalix Cloud API

Cost-optimized cloud API for Scalix business logic using Google Cloud Run and Firestore.

## 💰 Cost Optimization

- **Firestore**: NoSQL database with free tier (first 1GB free)
- **Cloud Run**: Serverless containers, pay only for actual usage
- **No dedicated servers**: Auto-scaling based on traffic
- **Memory-based rate limiting**: No additional Redis costs

**Estimated Cost**: $10-50/month (vs $200-500 with traditional Cloud SQL setup)

## 🏗️ Architecture

```
Internet → Cloud Load Balancer → Cloud Run (API)
                                    ↓
                               Firestore (Database)
```

## 🚀 Quick Start

### 1. Prerequisites
- Google Cloud Platform account
- Firebase project with Firestore enabled
- Node.js 18+

### 2. Environment Setup
```bash
cp env.example .env
# Edit .env with your GCP/Firestore credentials
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Initialize Database
```bash
# Set CREATE_SAMPLE_KEY=true to create a test API key
CREATE_SAMPLE_KEY=true npm run init-db
```

### 5. Run Locally
```bash
npm run dev
```

## 📋 API Endpoints

### Health Check
```http
GET /health
```

### API Key Validation
```http
POST /api/validate-key
Content-Type: application/json

{
  "apiKey": "scalix_xxxxx"
}
```

### Usage Tracking
```http
POST /api/usage/track
Authorization: Bearer <api-key>
Content-Type: application/json

{
  "metric": "ai_tokens",
  "amount": 150,
  "metadata": {
    "model": "gpt-4",
    "feature": "code-generation"
  }
}
```

### Usage Summary
```http
GET /api/usage/summary
Authorization: Bearer <api-key>
```

## 🚀 Deployment to Google Cloud

### 1. Build Container
```bash
# Create Dockerfile
echo 'FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]' > Dockerfile
```

### 2. Deploy to Cloud Run
```bash
# Build and deploy
gcloud run deploy scalix-cloud-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10
```

### 3. Enable Firestore
```bash
# Enable Firestore API
gcloud services enable firestore.googleapis.com

# Initialize Firestore in native mode
gcloud firestore databases create --region=us-central1
```

### 4. Set Environment Variables
```bash
# Set secrets in Cloud Run
gcloud run services update scalix-cloud-api \
  --set-env-vars "GCP_PROJECT_ID=your-project-id" \
  --set-secrets "FIREBASE_PRIVATE_KEY=firebase-key:latest"
```

## 🔧 Configuration

### Environment Variables
- `GCP_PROJECT_ID`: Your Google Cloud project ID
- `FIREBASE_PRIVATE_KEY_ID`: Firebase service account key ID
- `FIREBASE_PRIVATE_KEY`: Firebase service account private key
- `FIREBASE_CLIENT_EMAIL`: Firebase service account email
- `FIREBASE_CLIENT_ID`: Firebase client ID
- `FIREBASE_CLIENT_X509_CERT_URL`: Firebase cert URL
- `PORT`: Server port (default: 8080)
- `NODE_ENV`: Environment (development/production)

### Rate Limiting
- **100 requests per minute** per IP
- **15-minute block** if exceeded
- Memory-based (no additional costs)

## 📊 Database Schema

### Plans Collection
```javascript
{
  id: "free",
  name: "free",
  displayName: "Free",
  price: 0, // cents
  maxAiTokens: 10000,
  maxApiCalls: 100,
  maxStorage: 1073741824, // 1GB
  maxTeamMembers: 1,
  advancedFeatures: false,
  prioritySupport: false
}
```

### API Keys Collection
```javascript
{
  key: "scalix_xxxxx",
  plan: "free",
  isActive: true,
  features: ["basic_ai", "chat"],
  expiresAt: null,
  createdAt: FirestoreTimestamp
}
```

### Usage Collection
```javascript
{
  apiKeyId: "api-key-doc-id",
  metric: "ai_tokens",
  amount: 150,
  timestamp: FirestoreTimestamp,
  metadata: { model: "gpt-4" },
  ip: "192.168.1.1",
  userAgent: "Electron/25.0.0"
}
```

### Usage Aggregates Collection
```javascript
{
  apiKeyId: "api-key-doc-id",
  metric: "ai_tokens",
  period: "month",
  periodStart: FirestoreTimestamp,
  total: 15420,
  lastUpdated: FirestoreTimestamp
}
```

## 🔍 Monitoring

### Health Checks
- Automatic health checks every 30 seconds
- Metrics exported to Cloud Monitoring
- Error rates and latency tracking

### Cost Monitoring
- Cloud Billing alerts for budget thresholds
- Usage metrics in Cloud Monitoring
- Automatic scaling based on traffic

## 🧪 Testing

### Local Testing
```bash
# Health check
curl http://localhost:8080/health

# API key validation
curl -X POST http://localhost:8080/api/validate-key \
  -H "Content-Type: application/json" \
  -d '{"apiKey":"your-test-key"}'
```

### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 http://localhost:8080/health
```

## 🔒 Security

- **Helmet.js** for security headers
- **CORS** configured for specific origins
- **Rate limiting** to prevent abuse
- **Input validation** on all endpoints
- **Firestore security rules** (implement in production)

## 📈 Scaling

- **Horizontal scaling**: Cloud Run auto-scales instances
- **Database scaling**: Firestore scales automatically
- **Global distribution**: Multi-region deployment possible
- **Caching**: Memorystore Redis for session data (if needed)

## 🚨 Troubleshooting

### Common Issues

1. **Firestore connection fails**
   - Check Firebase credentials in `.env`
   - Verify Firestore is enabled in GCP

2. **Rate limiting triggers**
   - Reduce request frequency
   - Check IP allowlists

3. **Cold starts**
   - Expected with Cloud Run
   - Use Cloud CDN for static content

### Logs
```bash
# View Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50

# View Firestore usage
gcloud firestore operations list
```

## 🎯 Next Steps

1. **Deploy to staging environment**
2. **Test with desktop app integration**
3. **Set up monitoring and alerts**
4. **Implement Stripe billing integration**
5. **Add team collaboration features**

---

**Built for cost-efficiency and scalability** 🚀💰
