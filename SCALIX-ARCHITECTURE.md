# Scalix Architecture Overview

## 🏗️ System Architecture

Scalix is a comprehensive AI-powered platform consisting of three main applications, all connected through a centralized cloud API infrastructure.

### 📱 Core Applications

#### 1. **Scalix Electron App** (Main Product)
- **Location**: `Scalix world electron/`
- **Purpose**: Desktop application for AI app development
- **Technology**: Electron + React
- **Target Users**: End users/developers building AI applications

#### 2. **Scalix.world Web** (User-Facing Website)
- **Location**: `Scalix.world web/`
- **Purpose**: SaaS platform and marketing website
- **Technology**: Next.js + React
- **Port**: 3000
- **Target Users**: Potential customers and existing users

#### 3. **Scalix Internal Admin** (Management Portal)
- **Location**: `Scalix Internal Admin/`
- **Purpose**: Internal administration and management
- **Technology**: Next.js + React
- **Port**: 3002
- **Target Users**: Internal team members

### 🔗 Central API Infrastructure

#### **Scalix Cloud API** (Backend Services)
- **Location**: `scalix-cloud-api/`
- **Technology**: Node.js + Express + Firebase Admin SDK
- **Port**: 8080
- **Purpose**: Centralized backend for all applications

### 🌐 How Everything Connects

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Electron App   │    │   Web Platform   │    │  Admin Portal   │
│   (Desktop)     │    │   (scalix.world) │    │   (Internal)    │
│                 │    │                  │    │                 │
│ • AI Development│    │ • User Dashboard │    │ • Team Mgmt     │
│ • App Building  │    │ • API Keys       │    │ • Analytics     │
│ • Local Features│    │ • Billing        │    │ • System Health │
└─────────┬───────┘    └─────────┬────────┘    └─────────┬───────┘
          │                     │                       │
          └─────────────────────┼───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │   Scalix Cloud API   │
                    │   (Firebase Backend) │
                    │                      │
                    │ • Authentication     │
                    │ • Database (Firestore│
                    │ • File Storage       │
                    │ • Real-time Sync     │
                    │ • API Rate Limiting  │
                    │ • Security & Audit   │
                    └──────────────────────┘
```

### ☁️ Google Cloud Integration

The system leverages Google Cloud credits through Firebase:

#### **Firebase Services Used:**
- **Firestore**: NoSQL database for all data storage
- **Firebase Auth**: Authentication across all applications
- **Firebase Storage**: File uploads and media storage
- **Firebase Admin SDK**: Server-side Firebase operations

#### **Architecture Benefits:**
- ✅ **Cost-Effective**: Leverages Google Cloud credits
- ✅ **Scalable**: Auto-scaling Firebase infrastructure
- ✅ **Real-time**: Live data synchronization
- ✅ **Secure**: Enterprise-grade security
- ✅ **Unified**: Single backend for all applications

### 🔧 Development Setup

#### Prerequisites:
- Node.js 18+
- npm or yarn
- Google Cloud Project with Firebase enabled

#### Quick Start:
```bash
# Start all servers
npm run dev-server  # from scalix-cloud-api/
npm run dev         # from Scalix.world web/
npm run dev         # from Scalix Internal Admin/
npm run dev         # from Scalix world electron/
```

#### Ports:
- **Cloud API**: http://localhost:8080
- **Web Platform**: http://localhost:3000
- **Admin Portal**: http://localhost:3002
- **Electron**: Local development server

### 🎨 Consistent Branding System

All applications use the same branding components:

#### **Logo Components:**
- `LogoWeb`: For web platform
- `LogoAdmin`: For admin portal
- `LogoElectron`: For desktop app

#### **Design System:**
- **Colors**: Blue to purple gradient theme
- **Typography**: Consistent font weights and sizes
- **Icons**: Lucide React icons
- **Components**: Shared UI components across apps

### 📊 Data Flow Architecture

#### **User Data Flow:**
```
User Action → Frontend App → Scalix Cloud API → Firestore → Response → Frontend
```

#### **Real-time Features:**
```
Frontend App ↔ WebSocket/SSE ↔ Cloud API ↔ Firestore ↔ Real-time Updates
```

#### **File Uploads:**
```
File Upload → Frontend → Cloud API → Firebase Storage → File URL → Database
```

### 🔐 Security & Authentication

#### **Multi-App Authentication:**
- Single Firebase Auth instance
- Cross-app session management
- Role-based access control
- API key management for external integrations

#### **Security Features:**
- Rate limiting per application
- CORS configuration per app
- Audit logging
- Data encryption at rest

### 📈 Scalability Features

#### **Horizontal Scaling:**
- Firebase auto-scaling
- Load balancing across regions
- CDN integration for static assets

#### **Performance Optimization:**
- Data caching layers
- Lazy loading
- Code splitting
- Image optimization

### 🚀 Deployment Architecture

#### **Production Setup:**
```
┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Google Cloud  │
│   (Web/Admin)   │    │   (API/Electron)│
│                 │    │                 │
│ • Next.js Apps  │    │ • Cloud Run     │
│ • Edge Functions│    │ • Cloud Storage │
│ • CDN           │    │ • Firestore     │
└─────────────────┘    └─────────────────┘
```

#### **CI/CD Pipeline:**
- GitHub Actions for automated testing
- Vercel for web deployments
- Google Cloud Build for API deployments
- Electron Builder for desktop releases

### 📋 Development Workflow

1. **Local Development**: All apps run locally with hot reload
2. **Testing**: Unit tests + E2E tests with Playwright
3. **Staging**: Deployed to staging environment
4. **Production**: Automated deployment to production

### 🔗 API Integration Points

#### **Internal Admin API Endpoints:**
- `/api/admin/team/*` - Team management
- `/api/admin/metrics/*` - System metrics
- `/api/admin/enterprise/*` - Customer management
- `/api/admin/billing/*` - Billing operations
- `/api/admin/support/*` - Support tickets

#### **Web Platform API Endpoints:**
- `/api/auth/*` - Authentication
- `/api/user/*` - User operations
- `/api/billing/*` - Subscription management
- `/api/chat/*` - AI chat functionality

#### **Electron App Integration:**
- Direct API calls to Cloud API
- File system operations
- Local caching with sync

This architecture ensures a unified, scalable, and maintainable system that leverages Google Cloud services effectively while providing consistent branding and user experience across all platforms.
