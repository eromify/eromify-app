# Deployment Guide: Onboarding Process & Stripe Integration

## Summary of Changes Deployed

All the onboarding process and Stripe checkout integration have been successfully deployed to your production environment. Here's what was updated:

### Frontend Changes (Already Deployed ✅)
- **OnboardingPage.jsx**: Complete 7-step onboarding flow with:
  - Step 1: Welcome screen
  - Step 2: Goal and experience selection
  - Step 3: AI creation method (marketplace model selection)
  - Step 4: AI customization (name, niche, visual style)
  - Step 5: Platform and content preferences
  - Step 6: Preview and confirmation
  - Step 7: Plan selection with Stripe checkout integration
- **LoginPage.jsx**: Already redirects to `/onboarding` after successful login
- **RegisterPage.jsx**: Users will be redirected to `/onboarding` after registration
- **Google OAuth**: After Google sign-in, users are redirected to `/onboarding`
- **Checkout Modal**: Professional modal with plan summary and "Continue to Checkout" button
- **Mobile Responsive**: All pages optimized for mobile devices

### Backend Changes (Already Deployed ✅)
- **payments.js**: Updated with:
  - Environment-aware success/cancel URLs (production vs localhost)
  - Promo code support
  - Better error handling and logging
  - Proper plan mapping (Pro Plan → launch, Basic Plan → builder, Elite Plan → growth)

### Files Deployed
```
✅ /deployment/frontend/dist/ - Production build with all onboarding pages
✅ /deployment/frontend/index.html - Updated entry point
✅ /deployment/frontend/assets/ - Updated JS and CSS bundles
✅ /deployment/backend/routes/payments.js - Updated Stripe integration
✅ /deployment/backend/backend/routes/payments.js - Updated Stripe integration
```

## ⚠️ REQUIRED: Database Migration

You need to add the following columns to your Supabase `users` table to support the subscription system. Run this SQL in your Supabase SQL Editor:

```sql
-- Add subscription and payment fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS subscription_plan TEXT,
ADD COLUMN IF NOT EXISTS subscription_billing TEXT CHECK (subscription_billing IN ('monthly', 'yearly')),
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS influencer_trainings INTEGER DEFAULT 0;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON public.users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON public.users(subscription_status);
```

## Stripe Configuration

Ensure your backend `.env` file has the following Stripe keys configured:

```env
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
STRIPE_WEBHOOK_SECRET=whsec_... (for handling Stripe webhooks)
```

### Stripe Webhook Setup

You need to configure a webhook in your Stripe dashboard to handle payment events:

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-backend-domain.com/api/payments/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret and add it to your `.env` as `STRIPE_WEBHOOK_SECRET`

## How the Flow Works

### New User Flow:
1. User visits landing page and clicks "Get Started" or "Sign Up"
2. User registers with email/password or Google OAuth
3. After successful registration/login → **Redirected to `/onboarding`**
4. User completes 7-step onboarding process
5. On final step, user selects a plan (Pro, Basic, or Elite)
6. Clicking "Get Started" or "Select" opens checkout modal
7. Clicking "Continue to Checkout" → **Redirects to Stripe Checkout**
8. After successful payment → **Redirected to `/dashboard?payment=success`**
9. If payment cancelled → **Redirected to `/onboarding?payment=cancelled`**

### Returning User Flow:
1. User logs in
2. **Redirected to `/onboarding`** (since we're not tracking onboarding completion yet)
3. User can complete onboarding and select a plan

## Important Notes

### ⚠️ Current Behavior
- **ALL users** (new and returning) are redirected to `/onboarding` after login
- We did NOT implement the `onboarding_completed` tracking logic (per your request to not finish it yet)
- The landing page and login/registration flow were NOT modified

### Future Enhancement
If you want to track onboarding completion and only show onboarding to new users:
1. Update the onboarding completion logic in `OnboardingPage.jsx`
2. Update the `ProtectedRoute` component to check `user.onboarding_completed`
3. Redirect returning users directly to `/dashboard`

## Testing Checklist

Before going live, test the following:

### Frontend Testing
- [ ] Landing page loads correctly
- [ ] Login redirects to `/onboarding`
- [ ] Registration redirects to `/onboarding`
- [ ] Google OAuth redirects to `/onboarding`
- [ ] All 7 onboarding steps navigate correctly
- [ ] Model selection works (step 3)
- [ ] Plan selection opens checkout modal (step 7)
- [ ] Mobile responsive design works on all pages

### Stripe Testing
- [ ] "Continue to Checkout" button redirects to Stripe
- [ ] Test mode checkout completes successfully
- [ ] Success URL redirects to `/dashboard?payment=success`
- [ ] Cancel URL redirects to `/onboarding?payment=cancelled`
- [ ] Webhook receives `checkout.session.completed` event
- [ ] User's subscription data is saved to database
- [ ] Credits are added to user account

### Production Testing
- [ ] Switch Stripe keys from test to live mode
- [ ] Update webhook URL to production backend
- [ ] Test with real payment (small amount)
- [ ] Verify subscription appears in Stripe dashboard
- [ ] Verify user data is updated in Supabase

## Deployment Status

✅ Frontend built and deployed to `/deployment/frontend/`
✅ Backend routes updated in `/deployment/backend/`
✅ All onboarding pages included and mobile-optimized
✅ Stripe checkout integration complete
✅ Environment-aware URLs configured

⚠️ **YOU NEED TO RUN**: The Supabase SQL migration (see above)
⚠️ **YOU NEED TO CONFIGURE**: Stripe webhook endpoint

## Support

If you encounter any issues:
1. Check browser console for frontend errors
2. Check backend logs for API errors
3. Verify Stripe webhook is receiving events
4. Ensure database migration was successful
5. Confirm environment variables are set correctly

---

**Deployment Date**: October 9, 2025
**Status**: Ready for production testing after database migration

