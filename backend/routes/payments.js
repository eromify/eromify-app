const express = require('express');
const router = express.Router();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY?.trim());
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken } = require('../middleware/auth');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Pricing plans configuration
const PRICING_PLANS = {
  builder: {
    monthly: {
      price: 1200, // $12.00 in cents
      credits: 500,
      influencerTrainings: 1
    },
    yearly: {
      price: 10800, // $108.00 in cents (9 * 12)
      credits: 500,
      influencerTrainings: 1
    }
  },
  launch: {
    monthly: {
      price: 2500, // $25.00 in cents
      credits: 2000,
      influencerTrainings: 2
    },
    yearly: {
      price: 22800, // $228.00 in cents (19 * 12)
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
      price: 78000, // $780.00 in cents (65 * 12)
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

    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_plan, subscription_billing, subscription_status, credits, influencer_trainings, stripe_customer_id, subscription_id')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch subscription' });
    }

    res.json({
      plan: user.subscription_plan,
      billing: user.subscription_billing,
      status: user.subscription_status,
      credits: user.credits,
      influencerTrainings: user.influencer_trainings,
      hasActiveSubscription: user.subscription_status === 'active'
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

