# Firebase Setup & Development

This guide explains how to set up and use Firebase for the Scalix Cloud API development.

## 📁 File Structure

```
scalix-cloud-api/
├── firebase.json              # Firebase project configuration
├── firestore.rules           # Firestore security rules
├── firestore.indexes.json    # Firestore indexes
├── .firebaserc              # Firebase project settings
├── firebase-config.js       # Shared Firebase configuration
├── test-firebase-emulator.js # Emulator connectivity test
└── env.example              # Environment variables template
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Install Firebase SDKs in each application
npm install firebase          # For web apps
npm install firebase-admin    # For cloud API
```

### 2. Firebase Project Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase in the API directory
cd scalix-cloud-api
firebase init --project your-project-id
```

### 3. Environment Configuration

Create a `.env` file in the `scalix-cloud-api` directory:

```env
# Firebase Configuration
GCP_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com

# Server Configuration
PORT=8080
NODE_ENV=development
```

### 4. Start Development Environment

```bash
# Start Firebase Emulator (from scalix-cloud-api directory)
npm run emulator

# Or use the comprehensive development script (from root)
./start-dev-with-emulator.ps1
```

## 🔧 Firebase Services Configuration

### Firestore Security Rules

The security rules in `firestore.rules` provide:

- **User Authentication**: Only authenticated users can access data
- **Role-Based Access**: Admin, internal-admin, and user roles
- **Data Isolation**: Users can only access their own data
- **Admin Override**: Admins can access all data

### Firestore Indexes

Indexes are configured in `firestore.indexes.json` for:
- User queries by role and creation date
- Team member queries by status and department
- API key queries by user and status
- Invoice and payment queries
- Support ticket queries by status and priority
- Activity log queries by type and timestamp

## 🧪 Testing

### Test Firebase Emulator Connection

```bash
cd scalix-cloud-api
npm run test:firebase
```

This will:
- Test Firestore connectivity
- Write and read test data
- Verify emulator is working correctly

### Test API Endpoints

```bash
# Test with emulator
npm run test:local

# Test with development server
npm run test:dev
```

## 🌐 Emulator Configuration

The Firebase emulator is configured to run on:
- **Firestore**: `localhost:8081`
- **Authentication**: `localhost:9099`
- **Emulator UI**: `localhost:4000`

### Emulator Data Persistence

Data is automatically imported/exported from `./firebase-data/` directory:

```bash
# Start with existing data
firebase emulators:start --import=./firebase-data

# Export data on exit
firebase emulators:start --export-on-exit=./firebase-data
```

## 🔗 Frontend Integration

### Web Applications

Update environment variables in frontend apps:

```env
# .env.local or .env.development
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Enable emulator in development
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

### Electron Application

Configure Firebase in the Electron app similarly to web apps, with additional desktop-specific settings.

## 📊 Data Structure

### Collections Overview

```
users/               # User profiles and authentication
├── {userId}/
    ├── profile data
    ├── preferences
    └── subscription info

teamMembers/         # Internal team management
├── {memberId}/
    ├── role
    ├── department
    └── permissions

apiKeys/            # API key management
├── {keyId}/
    ├── userId
    ├── tier
    └── usage stats

invoices/           # Billing and payments
├── {invoiceId}/
    ├── userId
    ├── amount
    └── status

support/            # Support tickets
├── {ticketId}/
    ├── userId
    ├── priority
    └── status

activities/         # System activity logs
├── {activityId}/
    ├── type
    ├── userId
    └── timestamp

settings/           # System configuration
├── {settingId}/
    └── configuration data
```

## 🚦 Development Workflow

1. **Start Emulator**: `npm run emulator`
2. **Test Connection**: `npm run test:firebase`
3. **Start API Server**: `npm run dev-server`
4. **Start Frontend Apps**: Run respective dev servers
5. **Test Integration**: Use emulator UI to verify data flow

## 🔒 Security Best Practices

- Never commit service account keys to version control
- Use environment variables for all sensitive configuration
- Regularly rotate Firebase service account keys
- Monitor Firebase usage and costs
- Implement proper error handling for Firebase operations

## 🐛 Troubleshooting

### Common Issues

**Emulator won't start:**
```bash
# Kill existing processes on ports
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

**Connection refused:**
- Ensure emulator is running on correct ports
- Check firewall settings
- Verify Firebase project configuration

**Authentication errors:**
- Confirm Firebase project is properly configured
- Check service account credentials
- Verify environment variables are loaded

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Emulator](https://firebase.google.com/docs/emulator-suite)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
