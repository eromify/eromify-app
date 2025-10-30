const express = require('express');
const router = express.Router();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY?.trim());
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
    console.log('Fetching subscription for user ID:', userId);
    // Prevent caching so clients don't see stale 304 responses
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_plan, subscription_billing, subscription_status, credits, influencer_trainings, stripe_customer_id, subscription_id')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      
      // If user not found in public.users table, return empty subscription
      if (error.code === 'PGRST116') {
        console.log('User not found in public.users table, returning empty subscription');
        // Try to create a minimal users row so subsequent checks work
        try {
          const { error: insertErr } = await supabase
            .from('users')
            .insert({ id: userId, email: req.user.email });
          if (insertErr) {
            console.log('Attempted to create missing user row failed:', insertErr);
          } else {
            console.log('Created missing user row for', req.user.email);
          }
        } catch (e) {
          console.log('Create missing user row exception:', e);
        }

        // Fallback: also try subscriptions table by user_id
        try {
          const { data: subFallback } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single();

          if (subFallback) {
            return res.status(200).json({
              plan: subFallback.plan ?? null,
              billing: subFallback.billing ?? null,
              status: 'active',
              credits: subFallback.credits ?? null,
              influencerTrainings: subFallback.influencer_trainings ?? null,
              hasActiveSubscription: true
            });
          }
        } catch (_) {}

        return res.status(200).json({
          plan: null,
          billing: null,
          status: null,
          credits: null,
          influencerTrainings: null,
          hasActiveSubscription: false
        });
      }
      
      return res.status(500).json({ error: 'Failed to fetch subscription' });
    }

    console.log('Subscription data found:', user);

    // If users table indicates active, return immediately
    if (user && user.subscription_status === 'active') {
      return res.status(200).json({
        plan: user.subscription_plan,
        billing: user.subscription_billing,
        status: user.subscription_status,
        credits: user.credits,
        influencerTrainings: user.influencer_trainings,
        hasActiveSubscription: true
      });
    }

    // Fallback: also check subscriptions table for an active record
    try {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (sub) {
        return res.status(200).json({
          plan: sub.plan ?? user?.subscription_plan ?? null,
          billing: sub.billing ?? user?.subscription_billing ?? null,
          status: 'active',
          credits: sub.credits ?? user?.credits ?? null,
          influencerTrainings: sub.influencer_trainings ?? user?.influencer_trainings ?? null,
          hasActiveSubscription: true
        });
      }
    } catch (_) {}

    // Default: no active subscription
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

