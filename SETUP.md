# PitchGrade — Setup Guide

## What's Already Done
- ✅ Better Auth (email/password + Google OAuth)
- ✅ Stripe Checkout integration ($9/mo subscription)
- ✅ Webhook endpoint for subscription status
- ✅ Auth + subscription gating on /api/analyze
- ✅ Rate limiting: 50 analyses per month per subscriber
- ✅ Landing page with pricing + sign-up CTA
- ✅ Sign in/sign up/dashboard pages
- ✅ SQLite database (auto-created as auth.db)

## What JD Needs to Do

### 1. Stripe Setup (Required)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **test** Secret Key and Publishable Key
3. Create a product + price:
   - Product: "PitchGrade Pro" → $9/month recurring
   - Copy the Price ID (starts with `price_`)
4. Set up webhook:
   - URL: `https://your-domain.com/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the webhook signing secret
5. Update `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_ID=price_...
   ```

### 2. Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Authorized redirect URI: `http://localhost:3001/api/auth/callback/google`
4. Update `.env` with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

### 3. OpenAI Key
```
OPENAI_API_KEY=sk-...
```

### 4. For Production (Vercel)
- SQLite won't work on Vercel serverless. Switch to Turso, Vercel Postgres, or PlanetScale.
- Update `src/lib/auth.ts` and `src/lib/subscription.ts` with production DB adapter.

## Running Locally
```bash
npm install
npm run dev  # runs on port 3001
```
