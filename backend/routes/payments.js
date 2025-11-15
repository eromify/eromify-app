const express = require('express');
const router = express.Router();
require('dotenv').config();
const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
const stripe = stripeKey ? require('stripe')(stripeKey) : null;
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken } = require('../middleware/auth');

// Use fallback values for development if env vars are not set
const supabaseUrl = process.env.SUPABASE_URL || 'https://eyteuevblxvhjhyeivqh.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dGV1ZXZibHh2aGpoeWVpdnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzYzNjAsImV4cCI6MjA3NTAxMjM2MH0.aTPGEVfNom78Cm9ZmwbMwyzTJ0KkqUE0uIHjBo-MZUA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Pricing plans configuration
const PRICING_PLANS = {
  builder: {
    monthly: {
      price: 1500, // $15.00 in cents
      credits: 500,
      influencerTrainings: 1
    },
    yearly: {
      price: 14400, // $144.00 in cents
      credits: 500,
      influencerTrainings: 1
    }
  },
  launch: {
    monthly: {
      price: 2900, // $29.00 in cents
      credits: 2000,
      influencerTrainings: 2
    },
    yearly: {
      price: 27600, // $276.00 in cents
      credits: 2000,
      influencerTrainings: 2
    }
  },
  growth: {
    monthly: {
      price: 7900, // $79.00 in cents
      credits: null, // Unlimited
      influencerTrainings: null // Unlimited
    },
    yearly: {
      price: 78000, // $780.00 in cents
      credits: null,
      influencerTrainings: null
    }
  }
};

// Only use mock subscriptions when explicitly enabled via env variable
// This ensures localhost behaves like production (requires actual payment)
const shouldUseMockSubscriptions =
  process.env.ENABLE_LOCAL_SUBSCRIPTION_MOCK === 'true';

// Create Stripe checkout session
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    console.log('💳 Creating checkout session for user:', req.user.id);
    console.log('💳 Request body:', req.body);
    
    const { plan, billing, promoCode } = req.body;
    const userId = req.user.id;

    // Validate plan and billing
    if (!PRICING_PLANS[plan] || !PRICING_PLANS[plan][billing]) {
      console.error('❌ Invalid plan or billing:', { plan, billing });
      return res.status(400).json({ error: 'Invalid plan or billing period' });
    }

    const planConfig = PRICING_PLANS[plan][billing];
    const isYearly = billing === 'yearly';

    // Prepare checkout session options
    const sessionOptions = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
              description: plan === 'growth'
                ? `Unlimited credits, Unlimited models`
                : `${planConfig.credits} credits, ${planConfig.influencerTrainings} influencer training${planConfig.influencerTrainings > 1 ? 's' : ''}`,
            },
            unit_amount: planConfig.price,
            recurring: isYearly ? {
              interval: 'year'
            } : {
              interval: 'month'
            }
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.NODE_ENV === 'production' 
        ? `https://www.eromify.com/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}&plan=${plan}&amount=${planConfig.price / 100}`
        : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}&plan=${plan}&amount=${planConfig.price / 100}`,
      cancel_url: process.env.NODE_ENV === 'production'
        ? `https://www.eromify.com/onboarding?payment=cancelled`
        : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/onboarding?payment=cancelled`,
      customer_email: req.user.email,
      ...(promoCode && { discounts: [{ promotion_code: promoCode }] }),
      metadata: {
        userId: userId,
        plan: plan,
        billing: billing,
        credits: plan === 'growth' ? 'unlimited' : planConfig.credits,
        influencerTrainings: plan === 'growth' ? 'unlimited' : planConfig.influencerTrainings
      }
    };


    // Support mocked checkout flow for local testing when Stripe keys aren't set
    const shouldMockCheckout =
      process.env.STRIPE_MOCK_MODE === 'true' ||
      !stripe ||
      (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV !== 'production');

    if (shouldMockCheckout) {
      console.log('🧪 Mock Stripe checkout enabled - skipping real Stripe request');

      const mockSessionId = `cs_test_local_${Date.now()}`;
      const successUrl = sessionOptions.success_url?.replace('{CHECKOUT_SESSION_ID}', mockSessionId) || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?payment=success&session_id=${mockSessionId}&plan=${plan}&amount=${planConfig.price / 100}`;

      try {
        // Mirror webhook logic so local testing marks the user as paid
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({
            subscription_plan: plan,
            subscription_billing: billing,
            credits: planConfig.credits === null ? null : planConfig.credits,
            influencer_trainings: planConfig.influencerTrainings === null ? null : planConfig.influencerTrainings,
            subscription_status: 'active'
          })
          .eq('id', userId);

        if (userUpdateError) {
          console.error('❌ Mock checkout user update error:', userUpdateError);
        }
      } catch (mockUpdateError) {
        console.error('❌ Mock checkout update exception:', mockUpdateError);
      }

      return res.json({
        sessionId: mockSessionId,
        url: successUrl,
        mocked: true
      });
    }

    // Create Stripe checkout session
    console.log('💳 Creating Stripe session with options:', JSON.stringify(sessionOptions, null, 2));
    console.log('🎫 Promotion codes enabled:', sessionOptions.allow_promotion_codes);
    
    try {
      const session = await stripe.checkout.sessions.create(sessionOptions);
      console.log('✅ Stripe session created:', session.id, 'URL:', session.url);
      console.log('🎫 Session allows promotion codes:', session.allow_promotion_codes);
      res.json({ sessionId: session.id, url: session.url });
    } catch (stripeError) {
      console.error('❌ Stripe checkout error:', stripeError);
      console.error('❌ Error details:', stripeError.message);
      res.status(500).json({ error: 'Failed to create checkout session: ' + stripeError.message });
    }
  } catch (error) {
    console.error('❌ Stripe checkout error:', error);
    console.error('❌ Error details:', error.message);
    res.status(500).json({ error: 'Failed to create checkout session: ' + error.message });
  }
});

// Webhook endpoint removed - handled by stripeWebhook.js to avoid conflicts

// Webhook handler functions moved to stripeWebhook.js to avoid conflicts

// Get user subscription status
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('🔍🔍🔍 ===== SUBSCRIPTION CHECK START =====');
    console.log('🔍 User ID:', userId);
    console.log('🔍 User email:', req.user.email);
    console.log('🔍 Supabase client type:', supabase.constructor.name);
    
    // Prevent caching so clients don't see stale 304 responses
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

    console.log('🔍 Querying public.users table...');
    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_plan, subscription_billing, subscription_status, credits, influencer_trainings, stripe_customer_id, subscription_id')
      .eq('id', userId)
      .single();
    
    console.log('🔍 Query completed. Error:', error ? 'YES' : 'NO');
    console.log('🔍 User data:', user ? 'FOUND' : 'NULL');

    if (error) {
      console.error('❌ Supabase error fetching user:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        userId: userId
      });

      // PGRST116 = no rows returned (user not found)
      // PGRST200 = query succeeded but no rows
      if (error.code === 'PGRST116' || error.code === 'PGRST200') {
        console.log('⚠️ User not found in database, returning no subscription');
        return res.status(200).json({
          plan: null,
          billing: null,
          status: null,
          credits: null,
          influencerTrainings: null,
          hasActiveSubscription: false
        });
      }

      // Only use mock subscriptions if explicitly enabled
      if (shouldUseMockSubscriptions) {
        console.log('Using local subscription mock fallback due to Supabase error:', error.code);
        return res.status(200).json(buildMockSubscriptionResponse(req.query));
      }

      // For other errors, return a more descriptive error
      console.error('❌ Unexpected Supabase error, returning 500');
      return res.status(500).json({ 
        error: 'Failed to fetch subscription',
        details: error.message,
        code: error.code
      });
    }

    if (!user) {
      console.log('⚠️ User query succeeded but user is null');
      return res.status(200).json({
        plan: null,
        billing: null,
        status: null,
        credits: null,
        influencerTrainings: null,
        hasActiveSubscription: false
      });
    }

    console.log('📊 Subscription data found in users table:', {
      userId,
      subscription_status: user?.subscription_status,
      subscription_plan: user?.subscription_plan,
      subscription_billing: user?.subscription_billing,
      credits: user?.credits,
      influencer_trainings: user?.influencer_trainings,
      hasStripeCustomerId: !!user?.stripe_customer_id,
      hasSubscriptionId: !!user?.subscription_id
    });

    // If users table indicates active, return immediately
    if (user && user.subscription_status === 'active') {
      console.log('✅ User has active subscription in users table');
      return res.status(200).json({
        plan: user.subscription_plan,
        billing: user.subscription_billing,
        status: user.subscription_status,
        credits: user.credits,
        influencerTrainings: user.influencer_trainings,
        hasActiveSubscription: true
      });
    } else {
      console.log('⚠️ User subscription_status is NOT active:', user?.subscription_status);
    }

    // Fallback: also check subscriptions table for an active record
    console.log('🔍 Checking subscriptions table for active subscription...');
    try {
      const { data: sub, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (subError) {
        console.log('📋 Subscriptions table query error (or no record):', subError.code, subError.message);
      }

      if (sub) {
        console.log('✅ Found active subscription in subscriptions table:', {
          plan: sub.plan,
          billing: sub.billing,
          status: sub.status,
          credits: sub.credits
        });
        return res.status(200).json({
          plan: sub.plan ?? user?.subscription_plan ?? null,
          billing: sub.billing ?? user?.subscription_billing ?? null,
          status: 'active',
          credits: sub.credits ?? user?.credits ?? null,
          influencerTrainings: sub.influencer_trainings ?? user?.influencer_trainings ?? null,
          hasActiveSubscription: true
        });
      } else {
        console.log('❌ No active subscription found in subscriptions table');
      }
    } catch (subErr) {
      console.error('❌ Error checking subscriptions table:', subErr);
    }

    // Only use mock subscriptions if explicitly enabled
    // Without explicit enablement, users without subscriptions will be redirected to onboarding
    if (shouldUseMockSubscriptions) {
      console.log('Using local subscription mock fallback (no active subscription records).');
      return res.status(200).json(buildMockSubscriptionResponse(req.query));
    }

    // Default: no active subscription (matches production behavior)
    console.log('❌ Returning response with NO active subscription');
    console.log('📋 Final response data:', {
      plan: user?.subscription_plan ?? null,
      billing: user?.subscription_billing ?? null,
      status: user?.subscription_status ?? null,
      credits: user?.credits ?? null,
      influencerTrainings: user?.influencer_trainings ?? null,
      hasActiveSubscription: false
    });
    res.status(200).json({
      plan: user?.subscription_plan ?? null,
      billing: user?.subscription_billing ?? null,
      status: user?.subscription_status ?? null,
      credits: user?.credits ?? null,
      influencerTrainings: user?.influencer_trainings ?? null,
      hasActiveSubscription: false
    });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

const MOCK_PLANS = {
  builder: {
    billing: process.env.LOCAL_SUBSCRIPTION_BILLING_BUILDER || 'monthly',
    credits: Number(process.env.LOCAL_SUBSCRIPTION_CREDITS_BUILDER) || 500,
    influencerTrainings: Number(process.env.LOCAL_SUBSCRIPTION_TRAININGS_BUILDER) || 1
  },
  launch: {
    billing: process.env.LOCAL_SUBSCRIPTION_BILLING_LAUNCH || 'monthly',
    credits: Number(process.env.LOCAL_SUBSCRIPTION_CREDITS_LAUNCH) || 2000,
    influencerTrainings: Number(process.env.LOCAL_SUBSCRIPTION_TRAININGS_LAUNCH) || 2
  },
  growth: {
    billing: process.env.LOCAL_SUBSCRIPTION_BILLING_GROWTH || 'monthly',
    credits: Number(process.env.LOCAL_SUBSCRIPTION_CREDITS_GROWTH) || 5000,
    influencerTrainings: Number(process.env.LOCAL_SUBSCRIPTION_TRAININGS_GROWTH) || 5
  }
};

const buildMockSubscriptionResponse = (query = {}) => {
  const requestedPlan = typeof query.plan === 'string' ? query.plan.toLowerCase() : null;
  const defaultPlan = process.env.LOCAL_SUBSCRIPTION_PLAN || 'launch';
  const planKey = MOCK_PLANS[requestedPlan] ? requestedPlan : defaultPlan;
  const planConfig = MOCK_PLANS[planKey] || MOCK_PLANS.launch;

  return {
    plan: planKey,
    billing: planConfig.billing,
    status: 'active',
    credits: planConfig.credits,
    influencerTrainings: planConfig.influencerTrainings,
    hasActiveSubscription: true,
    mocked: true
  };
};

// Cancel subscription
router.post('/cancel-subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's subscription ID
    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_id')
      .eq('id', userId)
      .single();

    if (error || !user.subscription_id) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    // Cancel subscription in Stripe
    await stripe.subscriptions.cancel(user.subscription_id);

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Get pricing plans
router.get('/pricing-plans', (req, res) => {
  res.json(PRICING_PLANS);
});

module.exports = router;

