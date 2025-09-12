# Scalix Web Application

## Overview
Scalix Web is a modern SaaS platform built with Next.js 14, TypeScript, and Tailwind CSS. It serves as the web interface for Scalix users to manage their accounts, billing, usage analytics, and access the desktop application.

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React hooks + Context
- **Backend**: API routes (to be integrated with Scalix backend)

### Project Structure
```
Scalix.world web/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── dashboard/               # User dashboard
│   ├── auth/                    # Authentication pages
│   ├── billing/                 # Billing & subscription
│   ├── settings/                # User settings
│   ├── admin/                   # Admin dashboard
│   └── api/                     # API routes
├── components/                  # Reusable components
│   ├── ui/                      # Base UI components
│   ├── auth/                    # Authentication components
│   ├── HeroSection.tsx          # Landing page sections
│   ├── FeaturesSection.tsx
│   ├── PricingSection.tsx
│   ├── TestimonialsSection.tsx
│   ├── CTASection.tsx
│   └── Footer.tsx
├── hooks/                       # Custom React hooks
│   └── useAuth.ts              # Authentication hook
├── lib/                         # Utilities and configurations
├── styles/                      # Global styles
├── types/                       # TypeScript type definitions
└── utils/                       # Helper functions
```

## Pages Documentation

### 1. Landing Page (`app/page.tsx`)

**Purpose**: Main marketing page to convert visitors into users

**Components Used**:
- `Navigation` - Site navigation with auth buttons
- `HeroSection` - Main value proposition and CTA
- `FeaturesSection` - Feature showcase with benefits
- `PricingSection` - Pricing tiers with billing toggle
- `TestimonialsSection` - Social proof from users
- `CTASection` - Final call-to-action
- `Footer` - Site footer with links

**Key Features**:
- Responsive design (mobile-first)
- Framer Motion animations
- Sign-in modal integration
- Social proof metrics
- Pricing calculator
- Download links for desktop app

**SEO Optimization**:
- Meta tags for title, description, Open Graph
- Structured data for pricing
- Fast loading with optimized images

---

### 2. Authentication Pages (`app/auth/`)

#### Sign In Page (`auth/signin/page.tsx`)
**Purpose**: Allow existing users to access their accounts

**Features**:
- Email/password authentication
- "Remember me" option
- Forgot password link
- Social login (Google, GitHub)
- Form validation with Zod
- Error handling and loading states

#### Sign Up Page (`auth/signup/page.tsx`)
**Purpose**: Convert visitors into registered users

**Features**:
- Email/password registration
- Password strength validation
- Terms of service agreement
- Social login options
- Email verification flow
- Welcome email after signup

#### Password Reset Page (`auth/reset-password/page.tsx`)
**Purpose**: Help users recover their accounts

**Features**:
- Email verification
- Secure token generation
- Password strength requirements
- Success/error messaging
- Rate limiting for security

#### Email Verification Page (`auth/verify-email/page.tsx`)
**Purpose**: Complete user registration process

**Features**:
- Token validation
- Account activation
- Resend verification option
- Clear success states
- Auto-redirect to dashboard

---

### 3. User Dashboard (`app/dashboard/`)

#### Main Dashboard (`dashboard/page.tsx`)
**Purpose**: Central hub for user account management

**Features**:
- Usage overview (tokens used/remaining)
- Recent activity feed
- Quick actions (New project, Settings)
- Pro status indicator
- Billing alerts/notifications
- Project shortcuts

#### Usage Analytics (`dashboard/usage/page.tsx`)
**Purpose**: Detailed usage tracking and insights

**Features**:
- Token usage over time (charts)
- Cost breakdown by model
- Usage by project
- Monthly/weekly/daily views
- Export usage data
- Usage predictions

#### Profile Settings (`dashboard/settings/page.tsx`)
**Purpose**: Manage user account information

**Features**:
- Personal information editing
- Password change
- Notification preferences
- Account deletion
- Privacy settings

#### API Keys Management (`dashboard/api-keys/page.tsx`)
**Purpose**: Manage API keys for integrations

**Features**:
- View existing API keys
- Generate new keys
- Revoke/delete keys
- Key usage statistics
- Security settings
- Key permissions

---

### 4. Billing & Subscription (`app/billing/`)

#### Billing Overview (`billing/page.tsx`)
**Purpose**: Main billing dashboard

**Features**:
- Current subscription plan
- Next billing date
- Payment method on file
- Billing history
- Download invoices
- Usage alerts

#### Upgrade/Downgrade (`billing/upgrade/page.tsx`)
**Purpose**: Change subscription plans

**Features**:
- Available plans comparison
- Feature differences
- Pricing calculator
- Confirm changes
- Proration details
- Immediate activation

#### Payment Methods (`billing/payment-methods/page.tsx`)
**Purpose**: Manage payment information

**Features**:
- Add new payment method
- Update existing cards
- Set default payment method
- Remove payment methods
- Billing address management

#### Billing History (`billing/history/page.tsx`)
**Purpose**: View past billing activity

**Features**:
- Past invoices list
- Download PDF invoices
- Payment status
- Refund requests
- Tax information
- Payment method used

#### Invoices (`billing/invoices/[id]/page.tsx`)
**Purpose**: Detailed invoice view

**Features**:
- Detailed invoice breakdown
- Line items (tokens, features)
- Tax calculations
- Payment status
- Contact support
- Download/print options

---

### 5. Team Management (`app/team/`)

#### Team Members (`team/members/page.tsx`)
**Purpose**: Manage team members and permissions

**Features**:
- List all team members
- Add new members by email
- Remove members
- Change member roles
- Member permissions matrix
- Bulk operations

#### Team Settings (`team/settings/page.tsx`)
**Purpose**: Configure team-wide settings

**Features**:
- Team name and description
- Default permissions
- Billing allocation
- Team usage limits
- Security policies

#### Team Usage (`team/usage/page.tsx`)
**Purpose**: Monitor team-wide usage

**Features**:
- Usage by team member
- Cost allocation
- Budget alerts
- Usage policies
- Cost optimization suggestions

---

### 6. Admin Dashboard (`app/admin/`)

#### User Management (`admin/users/page.tsx`)
**Purpose**: Administrative user management

**Features**:
- All users list with search/filter
- User status (active/inactive/suspended)
- Bulk user operations
- User export functionality
- User analytics

#### Subscription Management (`admin/subscriptions/page.tsx`)
**Purpose**: Manage all subscriptions

**Features**:
- All subscriptions overview
- Plan changes and upgrades
- Payment issues and dunning
- Churn analysis
- Revenue metrics

#### Analytics Dashboard (`admin/analytics/page.tsx`)
**Purpose**: Business intelligence and metrics

**Features**:
- User acquisition metrics
- Revenue analytics
- Feature usage statistics
- Performance monitoring
- Growth KPIs and charts

#### Content Management (`admin/content/page.tsx`)
**Purpose**: Manage website content

**Features**:
- Blog posts management
- Documentation updates
- Help articles
- Announcement system
- Content scheduling

#### System Settings (`admin/settings/page.tsx`)
**Purpose**: Global system configuration

**Features**:
- Global configurations
- Feature flags
- API rate limits
- Security policies
- System maintenance

---

### 7. Support & Help (`app/support/`)

#### Help Center (`support/help/page.tsx`)
**Purpose**: Self-service support

**Features**:
- Searchable documentation
- FAQ categories
- Video tutorials
- Troubleshooting guides
- Community forum integration

#### Contact Support (`support/contact/page.tsx`)
**Purpose**: Get help from support team

**Features**:
- Support ticket creation
- Live chat integration
- Phone/email contact options
- Priority support for Pro users
- File attachments

#### Status Page (`support/status/page.tsx`)
**Purpose**: System status and incidents

**Features**:
- Real-time system status
- Incident history
- Maintenance schedules
- Service uptime statistics
- Status API for integrations

---

### 8. Account Management (`app/account/`)

#### Account Deletion (`account/delete/page.tsx`)
**Purpose**: Allow users to delete their accounts

**Features**:
- Data export options
- Deletion confirmation
- Retention policy explanation
- Final confirmation with typing
- Account deactivation vs deletion

#### Data Export (`account/export/page.tsx`)
**Purpose**: GDPR-compliant data export

**Features**:
- Download user data (JSON/CSV)
- Export usage history
- Include/exclude data types
- GDPR compliance
- Data portability options

#### Privacy Settings (`account/privacy/page.tsx`)
**Purpose**: Manage privacy preferences

**Features**:
- Data collection preferences
- Cookie management
- Third-party integrations
- Privacy policy updates
- Data retention settings

---

## API Routes Documentation

### Authentication APIs (`app/api/auth/`)
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/profile` - Update profile

### Billing APIs (`app/api/billing/`)
- `GET /api/billing/subscription` - Get subscription
- `POST /api/billing/upgrade` - Upgrade plan
- `GET /api/billing/invoices` - List invoices
- `GET /api/billing/usage` - Usage statistics

### Admin APIs (`app/api/admin/`)
- `GET /api/admin/users` - List users
- `GET /api/admin/analytics` - Analytics data
- `POST /api/admin/announcements` - Create announcements

---

## Component Library

### UI Components (`components/ui/`)
- `Button` - Consistent button styles
- `Input` - Form input fields
- `Modal` - Modal dialogs
- `Card` - Content containers
- `Table` - Data tables
- `Badge` - Status indicators

### Auth Components (`components/auth/`)
- `SignInForm` - Sign in form with validation
- `SignUpForm` - Registration form
- `UserMenu` - User dropdown menu
- `SignInModal` - Modal authentication

### Layout Components
- `Navigation` - Main site navigation
- `Footer` - Site footer
- `Sidebar` - Dashboard sidebar
- `Header` - Page headers

---

## Environment Variables

```bash
# Required environment variables
NEXT_PUBLIC_API_BASE_URL=https://api.scalix.world
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

---

## Deployment

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Security Considerations

### Authentication
- JWT tokens with secure storage
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- CSRF protection

### Data Protection
- HTTPS everywhere
- Input sanitization
- SQL injection prevention
- GDPR compliance

### Privacy
- Data encryption at rest
- Secure cookie handling
- Privacy by design
- User data export/deletion

---

## Performance Optimization

### Frontend
- Code splitting with dynamic imports
- Image optimization with Next.js
- CSS optimization with Tailwind
- Bundle analysis

### Backend
- API response caching
- Database query optimization
- CDN integration
- Monitoring and alerting

---

## Testing Strategy

### Unit Tests
- Component testing with Jest
- API route testing
- Utility function testing

### Integration Tests
- Authentication flow testing
- Billing flow testing
- End-to-end user journeys

### E2E Tests
- Critical user flows
- Cross-browser testing
- Performance testing

---

## Monitoring & Analytics

### Application Monitoring
- Error tracking with Sentry
- Performance monitoring
- User analytics with Mixpanel
- Server monitoring

### Business Metrics
- User acquisition cost
- Customer lifetime value
- Churn rate analysis
- Feature usage tracking

---

This comprehensive documentation covers all aspects of the Scalix Web application, from individual pages to system architecture and operational considerations.
