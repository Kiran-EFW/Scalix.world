# 🚀 Stripe Integration Setup Guide

This guide will help you set up Stripe payment processing for your Scalix application.

## 📋 Prerequisites

1. **Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Test Mode**: Use Stripe's test mode for development
3. **Environment Variables**: Configure your API keys

## 🔧 Step 1: Stripe Dashboard Setup

### 1.1 Create Products and Prices

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** in the left sidebar
3. Click **Create Product** for each plan:

#### Free Plan (Optional - if you want to charge for free tier)
- **Name**: Scalix Free
- **Description**: Perfect for getting started with AI development
- **Price**: $0.00 (one-time or recurring)

#### Pro Plan
- **Name**: Scalix Pro
- **Description**: For serious developers building AI applications
- **Price**: $29.99/month
- **Features**: Add metadata for features like "10,000 AI tokens"

#### Team Plan
- **Name**: Scalix Team
- **Description**: For development teams and organizations
- **Price**: $99.99/month
- **Features**: Add metadata for features like "50,000 AI tokens"

### 1.2 Get API Keys

1. Go to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. **Important**: Never expose your secret key in client-side code!

### 1.3 Set Up Webhooks

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://yourdomain.com/api/stripe/webhooks`
4. **Events to listen for**:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

## ⚙️ Step 2: Environment Configuration

Update your `.env.local` file with the Stripe credentials:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs (from your Stripe Dashboard)
STRIPE_FREE_PRICE_ID=price_your_free_price_id
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
STRIPE_TEAM_PRICE_ID=price_your_team_price_id
```

## 🔗 Step 3: Customer Portal Setup (Optional)

1. Go to **Billing** → **Customer Portal** in Stripe Dashboard
2. Enable the customer portal
3. Configure what customers can manage:
   - Update payment methods
   - Cancel subscriptions
   - Download invoices
4. Copy the portal URL for your environment variables

## 🎯 Step 4: Testing the Integration

### 4.1 Test Cards

Use these test card numbers in Stripe Checkout:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### 4.2 Test the Flow

1. Visit your pricing page: `http://localhost:3000/pricing`
2. Click "Start Pro Trial" or "Upgrade to Pro"
3. Complete checkout with test card
4. Verify webhook events in Stripe Dashboard
5. Check customer data in your billing dashboard

## 🔄 Step 5: Production Deployment

### 5.1 Switch to Live Mode

1. Go to your Stripe Dashboard
2. Toggle **Test mode** to **Live mode**
3. Get your live API keys
4. Update environment variables with live keys
5. Update webhook endpoint URL to your production domain

### 5.2 Update Webhook Endpoint

1. Update webhook URL to your production domain
2. Regenerate webhook signing secret for production
3. Test with live mode (use small amounts)

## 🛠️ Step 6: Customization Options

### 6.1 Customize Checkout

Modify the checkout session in `/api/stripe/create-checkout-session/route.ts`:

```typescript
const session = await stripe.checkout.sessions.create({
  // ... existing config
  allow_promotion_codes: true,
  billing_address_collection: 'required',
  tax_rates: ['txr_your_tax_rate_id'],
  metadata: {
    user_id: userId,
    plan_type: planType,
  },
})
```

### 6.2 Customize Customer Portal

Configure what customers can manage in the Stripe Dashboard:

- Payment methods
- Subscription details
- Billing history
- Cancellation options

### 6.3 Handle Subscription Events

Update the webhook handler to manage:

- User plan updates in your database
- Email notifications
- Feature access control
- Usage limit resets

## 📊 Step 7: Monitoring & Analytics

### 7.1 Stripe Dashboard

Monitor in your Stripe Dashboard:
- Revenue analytics
- Failed payments
- Customer lifecycle
- Churn rates

### 7.2 Application Metrics

Track in your application:
- Conversion rates from free to paid
- User engagement by plan type
- Support ticket volume by plan
- Feature usage analytics

## 🆘 Troubleshooting

### Common Issues:

1. **Webhook signature verification fails**
   - Check webhook secret is correct
   - Ensure raw request body is used

2. **Checkout session creation fails**
   - Verify price IDs are correct
   - Check API keys have proper permissions

3. **Customer portal not working**
   - Ensure customer exists in Stripe
   - Check portal configuration in dashboard

### Debug Mode:

Add console logs to see webhook events:
```typescript
console.log('Webhook event:', event.type, event.data.object)
```

## 🔒 Security Best Practices

1. **Never expose secret keys** in client-side code
2. **Verify webhook signatures** to prevent spoofing
3. **Use HTTPS** for all webhook endpoints
4. **Store sensitive data securely** (encrypt if needed)
5. **Implement proper error handling** without exposing sensitive info

## 📞 Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: Available in your dashboard
- **Community**: [Stripe Developers Discord](https://stripe.com/go/developer-chat)

---

## 🎉 You're All Set!

Your Scalix application now has full Stripe integration for:
- ✅ Secure payment processing
- ✅ Subscription management
- ✅ Customer portal access
- ✅ Webhook event handling
- ✅ Real-time billing data

Users can now upgrade from free to Pro/Team plans seamlessly! 🚀
