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
      credits: 8000,
      influencerTrainings: 5
    },
    yearly: {
      price: 78000, // $780.00 in cents (65 * 12)
      credits: 8000,
      influencerTrainings: 5
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
              description: `${planConfig.credits} credits, ${planConfig.influencerTrainings} influencer training${planConfig.influencerTrainings > 1 ? 's' : ''}`,
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
        ? `https://www.eromify.com/dashboard?payment=success`
        : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?payment=success`,
      cancel_url: process.env.NODE_ENV === 'production'
        ? `https://www.eromify.com/credits?payment=cancelled`
        : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/credits?payment=cancelled`,
      customer_email: req.user.email,
      ...(promoCode && { discounts: [{ promotion_code: promoCode }] }),
      metadata: {
        userId: userId,
        plan: plan,
        billing: billing,
        credits: planConfig.credits,
        influencerTrainings: planConfig.influencerTrainings
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

// Handle successful payment (webhook)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleSuccessfulPayment(session);
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      await handleSubscriptionRenewal(invoice);
      break;
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      await handleSubscriptionCancellation(subscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Handle successful payment
async function handleSuccessfulPayment(session) {
  try {
    const { userId, plan, billing, credits, influencerTrainings } = session.metadata;

    // Update user subscription in database
    const { error } = await supabase
      .from('users')
      .update({
        subscription_plan: plan,
        subscription_billing: billing,
        credits: credits,
        influencer_trainings: influencerTrainings,
        subscription_status: 'active',
        stripe_customer_id: session.customer,
        subscription_id: session.subscription
      })
      .eq('id', userId);

    if (error) {
      console.error('Database update error:', error);
      return;
    }

    console.log(`Payment successful for user ${userId}, plan: ${plan}, billing: ${billing}`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

// Handle subscription renewal
async function handleSubscriptionRenewal(invoice) {
  try {
    const customerId = invoice.customer;
    
    // Get user by Stripe customer ID
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single();

    if (error || !user) {
      console.error('User not found for customer ID:', customerId);
      return;
    }

    // Renew credits based on plan
    const planConfig = PRICING_PLANS[user.subscription_plan][user.subscription_billing];
    
    const { error: updateError } = await supabase
      .from('users')
      .update({
        credits: planConfig.credits,
        influencer_trainings: planConfig.influencerTrainings
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Credit renewal error:', updateError);
      return;
    }

    console.log(`Credits renewed for user ${user.id}`);
  } catch (error) {
    console.error('Error handling subscription renewal:', error);
  }
}

// Handle subscription cancellation
async function handleSubscriptionCancellation(subscription) {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        subscription_status: 'cancelled',
        subscription_plan: null,
        subscription_billing: null
      })
      .eq('subscription_id', subscription.id);

    if (error) {
      console.error('Subscription cancellation error:', error);
      return;
    }

    console.log(`Subscription cancelled for subscription ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

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

