const express = require('express');
const router = express.Router();
require('dotenv').config();
const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
const stripe = stripeKey ? require('stripe')(stripeKey) : null;
const { getSupabaseAdmin } = require('../lib/supabaseAdmin');
const { authenticateToken } = require('../middleware/auth');

// Use admin client to bypass RLS
const supabase = getSupabaseAdmin();

// AI Girlfriend Pricing Plans Configuration
// These are separate from influencer creation plans
// Uses dynamic price_data like the other plans - no need for Stripe price IDs
const AI_GIRLFRIEND_PRICING_PLANS = {
  '1month': {
    price: 1299, // $12.99 in cents
    tokens: 100, // Monthly tokens
    billing: 'monthly'
  },
  '3months': {
    price: 2400, // $24.00 in cents (billed every 3 months)
    tokens: 100, // Monthly tokens
    billing: 'quarterly'
  },
  '12months': {
    price: 4800, // $48.00 in cents (billed yearly)
    tokens: 100, // Monthly tokens
    billing: 'yearly'
  }
};

// Free tier limits
const FREE_TIER_LIMITS = {
  dailyMessages: 10,
  dailyGenerations: 3,
  imagesBlurred: true
};

// Paid tier limits
const PAID_TIER_LIMITS = {
  dailyMessages: null, // Unlimited
  dailyGenerations: null, // Unlimited (within token limits)
  imagesBlurred: false,
  monthlyTokens: 100
};

// Create Stripe checkout session for AI girlfriend subscription
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    console.log('💳 [AI Girlfriend] Creating checkout session for user:', req.user.id);
    console.log('💳 [AI Girlfriend] Request body:', req.body);
    
    const { plan } = req.body; // plan: '1month', '3months', or '12months'
    const userId = req.user.id;

    // Validate plan
    if (!AI_GIRLFRIEND_PRICING_PLANS[plan]) {
      console.error('❌ [AI Girlfriend] Invalid plan:', plan);
      return res.status(400).json({ error: 'Invalid plan. Must be: 1month, 3months, or 12months' });
    }

    const planConfig = AI_GIRLFRIEND_PRICING_PLANS[plan];
    
    // Calculate billing interval (same pattern as other plans)
    let interval = 'month';
    let intervalCount = 1;
    
    if (plan === '3months') {
      interval = 'month';
      intervalCount = 3;
    } else if (plan === '12months') {
      interval = 'year';
      intervalCount = 1;
    }

    // Prepare checkout session options (using price_data like other plans)
    const sessionOptions = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `AI Girlfriend ${plan === '1month' ? 'Monthly' : plan === '3months' ? 'Quarterly' : 'Yearly'} Plan`,
              description: `Unlimited messages, 100 tokens/month, Unblurred images, Fast response time`,
            },
            unit_amount: planConfig.price,
            recurring: {
              interval: interval,
              interval_count: intervalCount
            }
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.NODE_ENV === 'production' 
        ? `https://www.eromify.com/discover?payment=success&session_id={CHECKOUT_SESSION_ID}&plan=${plan}`
        : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/discover?payment=success&session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: process.env.NODE_ENV === 'production'
        ? `https://www.eromify.com/ai-girlfriend-pricing?payment=cancelled`
        : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/ai-girlfriend-pricing?payment=cancelled`,
      customer_email: req.user.email,
      metadata: {
        userId: userId,
        plan: plan,
        subscriptionType: 'ai_girlfriend', // Important: distinguishes from influencer subscriptions
        tokens: planConfig.tokens
      }
    };

    // Support mocked checkout flow for local testing
    const shouldMockCheckout =
      process.env.STRIPE_MOCK_MODE === 'true' ||
      !stripe ||
      (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV !== 'production');

    if (shouldMockCheckout) {
      console.log('🧪 [AI Girlfriend] Mock Stripe checkout enabled - skipping real Stripe request');

      const mockSessionId = `cs_test_ai_gf_${Date.now()}`;
      const successUrl = sessionOptions.success_url?.replace('{CHECKOUT_SESSION_ID}', mockSessionId) || 
        `${process.env.FRONTEND_URL || 'http://localhost:5173'}/discover?payment=success&session_id=${mockSessionId}&plan=${plan}`;

      try {
        // Mirror webhook logic so local testing marks the user as paid
        const nextResetDate = new Date();
        nextResetDate.setMonth(nextResetDate.getMonth() + 1);
        nextResetDate.setDate(1); // First day of next month

        const { error: userUpdateError } = await supabase
          .from('users')
          .update({
            ai_girlfriend_subscription_plan: plan,
            ai_girlfriend_subscription_billing: planConfig.billing,
            ai_girlfriend_tokens: planConfig.tokens,
            ai_girlfriend_tokens_reset_date: nextResetDate.toISOString(),
            ai_girlfriend_subscription_status: 'active'
          })
          .eq('id', userId);

        if (userUpdateError) {
          console.error('❌ [AI Girlfriend] Mock checkout user update error:', userUpdateError);
        }
      } catch (mockUpdateError) {
        console.error('❌ [AI Girlfriend] Mock checkout update exception:', mockUpdateError);
      }

      return res.json({
        sessionId: mockSessionId,
        url: successUrl,
        mocked: true
      });
    }

    // Create Stripe checkout session
    console.log('💳 [AI Girlfriend] Creating Stripe session with options:', JSON.stringify(sessionOptions, null, 2));
    
    try {
      const session = await stripe.checkout.sessions.create(sessionOptions);
      console.log('✅ [AI Girlfriend] Stripe session created:', session.id, 'URL:', session.url);
      res.json({ sessionId: session.id, url: session.url });
    } catch (stripeError) {
      console.error('❌ [AI Girlfriend] Stripe checkout error:', stripeError);
      console.error('❌ [AI Girlfriend] Error details:', stripeError.message);
      res.status(500).json({ error: 'Failed to create checkout session: ' + stripeError.message });
    }
  } catch (error) {
    console.error('❌ [AI Girlfriend] Stripe checkout error:', error);
    console.error('❌ [AI Girlfriend] Error details:', error.message);
    res.status(500).json({ error: 'Failed to create checkout session: ' + error.message });
  }
});

// Get AI girlfriend subscription status
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('🔍 [AI Girlfriend] Subscription check for user:', userId);
    
    // Prevent caching
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    let user = null;
    try {
      const result = await supabase
        .from('users')
        .select('ai_girlfriend_subscription_plan, ai_girlfriend_subscription_billing, ai_girlfriend_subscription_status, ai_girlfriend_tokens, ai_girlfriend_tokens_reset_date')
        .eq('id', userId)
        .single();
      
      user = result.data;
      
      if (result.error) {
        const dbError = result.error;
        // Handle case where migration hasn't been run yet (columns missing)
        if (dbError.code === '42703' || dbError.message?.includes('ai_girlfriend_')) {
          console.warn('⚠️ [AI Girlfriend] Subscription columns missing, treating user as free tier');
          return res.status(200).json({
            plan: null,
            billing: null,
            status: null,
            tokens: 0,
            hasActiveSubscription: false,
            isFree: true,
            limits: FREE_TIER_LIMITS
          });
        }
        
        console.error('❌ [AI Girlfriend] Error fetching subscription:', dbError);
        return res.status(500).json({ error: 'Failed to fetch subscription' });
      }
    } catch (dbException) {
      console.error('❌ [AI Girlfriend] Exception fetching subscription:', dbException);
      return res.status(500).json({ error: 'Failed to fetch subscription' });
    }
    
    if (!user) {
      return res.status(200).json({
        plan: null,
        billing: null,
        status: null,
        tokens: 0,
        hasActiveSubscription: false,
        isFree: true,
        limits: FREE_TIER_LIMITS
      });
    }

    const hasActiveSubscription = user.ai_girlfriend_subscription_status === 'active';
    
    // Check if tokens need to be reset
    let tokens = user.ai_girlfriend_tokens || 0;
    const resetDate = user.ai_girlfriend_tokens_reset_date ? new Date(user.ai_girlfriend_tokens_reset_date) : null;
    const now = new Date();
    
    if (hasActiveSubscription && resetDate && now >= resetDate) {
      // Reset tokens and update reset date
      const nextResetDate = new Date();
      nextResetDate.setMonth(nextResetDate.getMonth() + 1);
      nextResetDate.setDate(1);
      
      const planConfig = AI_GIRLFRIEND_PRICING_PLANS[user.ai_girlfriend_subscription_plan];
      tokens = planConfig ? planConfig.tokens : 100;
      
      await supabase
        .from('users')
        .update({
          ai_girlfriend_tokens: tokens,
          ai_girlfriend_tokens_reset_date: nextResetDate.toISOString()
        })
        .eq('id', userId);
    }

    console.log('📊 [AI Girlfriend] Subscription data:', {
      userId,
      subscription_status: user.ai_girlfriend_subscription_status,
      subscription_plan: user.ai_girlfriend_subscription_plan,
      tokens: tokens,
      hasActiveSubscription
    });

    res.status(200).json({
      plan: user.ai_girlfriend_subscription_plan,
      billing: user.ai_girlfriend_subscription_billing,
      status: user.ai_girlfriend_subscription_status,
      tokens: tokens,
      tokensResetDate: user.ai_girlfriend_tokens_reset_date,
      hasActiveSubscription: hasActiveSubscription,
      isFree: !hasActiveSubscription,
      limits: hasActiveSubscription ? PAID_TIER_LIMITS : FREE_TIER_LIMITS
    });
  } catch (error) {
    console.error('❌ [AI Girlfriend] Subscription fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Cancel AI girlfriend subscription
router.post('/cancel-subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's AI girlfriend subscription ID
    const { data: user, error } = await supabase
      .from('users')
      .select('ai_girlfriend_subscription_id')
      .eq('id', userId)
      .single();

    if (error || !user.ai_girlfriend_subscription_id) {
      return res.status(400).json({ error: 'No active AI girlfriend subscription found' });
    }

    // Cancel subscription in Stripe
    if (stripe) {
      await stripe.subscriptions.cancel(user.ai_girlfriend_subscription_id);
    }

    res.json({ message: 'AI girlfriend subscription cancelled successfully' });
  } catch (error) {
    console.error('❌ [AI Girlfriend] Subscription cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Get pricing plans
router.get('/pricing-plans', (req, res) => {
  res.json(AI_GIRLFRIEND_PRICING_PLANS);
});

// Get limits (free vs paid)
router.get('/limits', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { data: user } = await supabase
      .from('users')
      .select('ai_girlfriend_subscription_status')
      .eq('id', userId)
      .single();

    const hasActiveSubscription = user?.ai_girlfriend_subscription_status === 'active';
    
    res.json({
      limits: hasActiveSubscription ? PAID_TIER_LIMITS : FREE_TIER_LIMITS,
      isFree: !hasActiveSubscription
    });
  } catch (error) {
    console.error('❌ [AI Girlfriend] Limits fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch limits' });
  }
});

module.exports = router;

