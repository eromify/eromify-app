const express = require('express');
const router = express.Router();
require('dotenv').config();
const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
const stripe = stripeKey ? require('stripe')(stripeKey) : null;
const { getSupabaseAdmin } = require('./lib/supabaseAdmin');

// Use admin client to bypass RLS (required for webhook to update users table)
const supabase = getSupabaseAdmin();

// Pricing plans configuration (copied from payments.js)
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

// This route must be mounted before express.json so we can verify the signature
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  // Check if Stripe is configured
  if (!stripe) {
    console.error('❌ Stripe not configured - missing STRIPE_SECRET_KEY');
    return res.status(503).json({ error: 'Stripe not configured' });
  }
  
  // Check if webhook secret is configured
  if (!process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET === 'whsec_your_webhook_secret') {
    console.error('❌ Stripe webhook secret not configured properly');
    console.error('📝 Please set STRIPE_WEBHOOK_SECRET in your .env file');
    console.error('🔗 Get it from: Stripe Dashboard → Webhooks → Your endpoint → Signing secret');
    return res.status(503).json({ 
      error: 'Stripe webhook secret not configured',
      message: 'Please configure STRIPE_WEBHOOK_SECRET in environment variables'
    });
  }
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('✅ Webhook signature verified for event:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    console.error('📝 This usually means:');
    console.error('   1. Wrong webhook secret in .env');
    console.error('   2. Webhook endpoint URL mismatch in Stripe');
    console.error('   3. Request not from Stripe');
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('💳 Processing checkout.session.completed for session:', session.id);
        await handleSuccessfulPayment(session);
        break;
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log('🔄 Processing invoice.payment_succeeded for customer:', invoice.customer);
        await handleSubscriptionRenewal(invoice);
        break;
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        console.log('❌ Processing customer.subscription.deleted for subscription:', subscription.id);
        await handleSubscriptionCancellation(subscription);
        break;
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (e) {
    console.error('❌ Webhook processing error:', e);
    console.error('Stack trace:', e.stack);
    // Return 500 so Stripe will retry, but log the error for debugging
    res.status(500).json({ 
      error: 'Webhook processing error',
      message: e.message
    });
  }
});

// AI Girlfriend Pricing Plans
const AI_GIRLFRIEND_PRICING_PLANS = {
  '1month': {
    price: 1299,
    tokens: 100,
    billing: 'monthly'
  },
  '3months': {
    price: 799,
    tokens: 100,
    billing: 'quarterly'
  },
  '12months': {
    price: 399,
    tokens: 100,
    billing: 'yearly'
  }
};

// Handle successful payment
async function handleSuccessfulPayment(session) {
  try {
    const { userId, plan, billing, credits, influencerTrainings, onboardingSelection, subscriptionType, tokens } = session.metadata || {};

    console.log('💳 Processing successful payment:', { userId, plan, billing, credits, influencerTrainings, subscriptionType, hasOnboardingSelection: !!onboardingSelection });

    // Validate required metadata
    if (!userId) {
      throw new Error('Missing userId in session metadata');
    }

    // Check if this is an AI girlfriend subscription
    if (subscriptionType === 'ai_girlfriend') {
      console.log('💳 [AI Girlfriend] Processing AI girlfriend subscription');
      
      if (!plan) {
        throw new Error(`Missing plan in session metadata for AI girlfriend subscription. Plan: ${plan}`);
      }

      if (!AI_GIRLFRIEND_PRICING_PLANS[plan]) {
        throw new Error(`Invalid AI girlfriend plan configuration: ${plan}`);
      }

      const planConfig = AI_GIRLFRIEND_PRICING_PLANS[plan];
      
      // Calculate next token reset date (first day of next month)
      const nextResetDate = new Date();
      nextResetDate.setMonth(nextResetDate.getMonth() + 1);
      nextResetDate.setDate(1);
      nextResetDate.setHours(0, 0, 0, 0);

      // Update AI girlfriend subscription in database
      const { error } = await supabase
        .from('users')
        .update({
          ai_girlfriend_subscription_plan: plan,
          ai_girlfriend_subscription_billing: planConfig.billing,
          ai_girlfriend_tokens: planConfig.tokens,
          ai_girlfriend_tokens_reset_date: nextResetDate.toISOString(),
          ai_girlfriend_subscription_status: 'active',
          ai_girlfriend_stripe_customer_id: session.customer,
          ai_girlfriend_subscription_id: session.subscription
        })
        .eq('id', userId);

      if (error) {
        console.error('❌ [AI Girlfriend] Database update error:', error);
        throw error;
      }

      console.log(`✅ [AI Girlfriend] Payment successful for user ${userId}, plan: ${plan}`);
      return; // Exit early, don't process influencer subscription logic
    }

    // Original influencer subscription logic
    if (!plan || !billing) {
      throw new Error(`Missing plan or billing in session metadata. Plan: ${plan}, Billing: ${billing}`);
    }

    // Validate plan configuration exists
    if (!PRICING_PLANS[plan] || !PRICING_PLANS[plan][billing]) {
      throw new Error(`Invalid plan configuration: ${plan}/${billing}`);
    }

    // Update user subscription in database
    const { error } = await supabase
      .from('users')
      .update({
        subscription_plan: plan,
        subscription_billing: billing,
        credits: credits === 'unlimited' ? null : (credits ? parseInt(credits) : PRICING_PLANS[plan][billing].credits),
        influencer_trainings: influencerTrainings === 'unlimited' ? null : (influencerTrainings ? parseInt(influencerTrainings) : PRICING_PLANS[plan][billing].influencerTrainings),
        subscription_status: 'active',
        stripe_customer_id: session.customer,
        subscription_id: session.subscription
      })
      .eq('id', userId);

    if (error) {
      console.error('❌ Database update error:', error);
      throw error;
    }

    console.log(`✅ Payment successful for user ${userId}, plan: ${plan}, billing: ${billing}`);

    // Create influencer from onboarding selection if provided
    if (onboardingSelection) {
      try {
        const selection = typeof onboardingSelection === 'string' 
          ? JSON.parse(onboardingSelection) 
          : onboardingSelection;
        
        console.log('🎨 Creating influencer from onboarding selection:', selection);

        const nicheNames = {
          'fashion': 'Fashion & Beauty',
          'fitness': 'Fitness & Health',
          'travel': 'Travel & Lifestyle',
          'gaming': 'Gaming & Tech',
          'food': 'Food & Cooking',
          'art': 'Art & Creativity',
          'business': 'Business & Finance',
          'other': 'Other'
        };

        const defaultDescription = selection.description && selection.description.length >= 10
          ? selection.description
          : `AI influencer ${selection.modelName ? `inspired by ${selection.modelName}` : selection.aiName}${selection.goal ? `, designed to help you ${selection.goal.replace(/-/g, ' ')}` : ''}.`;

        const platformsText = selection.platforms && selection.platforms.length
          ? `Focus platforms: ${selection.platforms.join(', ')}.`
          : 'Active across major social platforms.';

        const contentTypesText = selection.contentTypes && selection.contentTypes.length
          ? `Primary content types: ${selection.contentTypes.join(', ')}.`
          : 'Delivers engaging multimedia content.';

        const defaultPersonality = selection.personality && selection.personality.length >= 10
          ? selection.personality
          : `Confident, engaging, and aspirational persona with a ${selection.visualStyle || 'signature'} visual style.`;

        const defaultTargetAudience = selection.targetAudience && selection.targetAudience.length >= 10
          ? selection.targetAudience
          : `Ideal for audiences interested in ${nicheNames[selection.niche] || selection.niche} content. ${platformsText}`;

        const defaultContentStyle = selection.contentStyle && selection.contentStyle.length >= 10
          ? selection.contentStyle
          : `Combines ${selection.visualStyle || 'premium'} visuals with ${contentTypesText} ${selection.frequency ? `at a ${selection.frequency} cadence.` : ''}`.trim();

        const { data: influencer, error: createError} = await supabase
          .from('influencers')
          .insert([
            {
              user_id: userId,
              name: selection.modelName || selection.aiName || 'AI Influencer',
              description: defaultDescription,
              niche: nicheNames[selection.niche] || selection.niche || 'Lifestyle',
              personality: defaultPersonality,
              target_audience: defaultTargetAudience,
              content_style: defaultContentStyle,
              avatar_url: selection.modelImage || null,
              images: selection.modelImages || (selection.modelImage ? [selection.modelImage] : null),
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('❌ Failed to create influencer from onboarding:', createError);
        } else {
          console.log(`✅ Influencer created successfully:`, influencer.id);
        }
      } catch (parseError) {
        console.error('❌ Error parsing onboarding selection:', parseError);
      }
    }
  } catch (error) {
    console.error('❌ Error handling successful payment:', error);
    throw error;
  }
}

// Handle subscription renewal
async function handleSubscriptionRenewal(invoice) {
  try {
    const customerId = invoice.customer;
    const subscriptionId = invoice.subscription;
    
    console.log('🔄 Processing subscription renewal for customer:', customerId, 'subscription:', subscriptionId);
    
    // Check if this is an AI girlfriend subscription
    const { data: aiGirlfriendUser } = await supabase
      .from('users')
      .select('id, ai_girlfriend_subscription_plan, ai_girlfriend_subscription_id')
      .eq('ai_girlfriend_subscription_id', subscriptionId)
      .single();

    if (aiGirlfriendUser && aiGirlfriendUser.ai_girlfriend_subscription_id === subscriptionId) {
      // This is an AI girlfriend subscription renewal
      console.log('🔄 [AI Girlfriend] Processing AI girlfriend subscription renewal');
      
      const planConfig = AI_GIRLFRIEND_PRICING_PLANS[aiGirlfriendUser.ai_girlfriend_subscription_plan];
      if (!planConfig) {
        throw new Error(`Invalid AI girlfriend plan: ${aiGirlfriendUser.ai_girlfriend_subscription_plan}`);
      }

      // Calculate next token reset date
      const nextResetDate = new Date();
      nextResetDate.setMonth(nextResetDate.getMonth() + 1);
      nextResetDate.setDate(1);
      nextResetDate.setHours(0, 0, 0, 0);

      const { error: updateError } = await supabase
        .from('users')
        .update({
          ai_girlfriend_tokens: planConfig.tokens,
          ai_girlfriend_tokens_reset_date: nextResetDate.toISOString()
        })
        .eq('id', aiGirlfriendUser.id);

      if (updateError) {
        console.error('❌ [AI Girlfriend] Token renewal error:', updateError);
        throw updateError;
      }

      console.log(`✅ [AI Girlfriend] Tokens renewed for user ${aiGirlfriendUser.id}`);
      return; // Exit early
    }

    // Original influencer subscription renewal logic
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single();

    if (error || !user) {
      console.error('❌ User not found for customer ID:', customerId);
      throw new Error(`User not found for customer ID: ${customerId}`);
    }

    // Validate plan configuration exists
    if (!user.subscription_plan || !user.subscription_billing) {
      throw new Error(`User ${user.id} has no plan/billing configured`);
    }

    if (!PRICING_PLANS[user.subscription_plan] || !PRICING_PLANS[user.subscription_plan][user.subscription_billing]) {
      throw new Error(`Invalid plan configuration for user ${user.id}: ${user.subscription_plan}/${user.subscription_billing}`);
    }

    // Renew credits based on plan
    const planConfig = PRICING_PLANS[user.subscription_plan][user.subscription_billing];
    
    const { error: updateError } = await supabase
      .from('users')
      .update({
        credits: planConfig.credits === null ? null : planConfig.credits,
        influencer_trainings: planConfig.influencerTrainings === null ? null : planConfig.influencerTrainings
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('❌ Credit renewal error:', updateError);
      throw updateError;
    }

    console.log(`✅ Credits renewed for user ${user.id}`);
  } catch (error) {
    console.error('❌ Error handling subscription renewal:', error);
    throw error;
  }
}

// Handle subscription cancellation
async function handleSubscriptionCancellation(subscription) {
  try {
    console.log('❌ Processing subscription cancellation for subscription:', subscription.id);
    
    // Check if this is an AI girlfriend subscription
    const { data: aiGirlfriendUser } = await supabase
      .from('users')
      .select('id')
      .eq('ai_girlfriend_subscription_id', subscription.id)
      .single();

    if (aiGirlfriendUser) {
      // This is an AI girlfriend subscription cancellation
      console.log('❌ [AI Girlfriend] Processing AI girlfriend subscription cancellation');
      
      const { error } = await supabase
        .from('users')
        .update({
          ai_girlfriend_subscription_status: 'cancelled',
          ai_girlfriend_subscription_plan: null,
          ai_girlfriend_subscription_billing: null,
          ai_girlfriend_subscription_id: null
        })
        .eq('ai_girlfriend_subscription_id', subscription.id);

      if (error) {
        console.error('❌ [AI Girlfriend] Subscription cancellation error:', error);
        throw error;
      }

      console.log(`✅ [AI Girlfriend] Subscription cancelled for subscription ${subscription.id}`);
      return; // Exit early
    }

    // Original influencer subscription cancellation logic
    const { error } = await supabase
      .from('users')
      .update({
        subscription_status: 'cancelled',
        subscription_plan: null,
        subscription_billing: null
      })
      .eq('subscription_id', subscription.id);

    if (error) {
      console.error('❌ Subscription cancellation error:', error);
      throw error;
    }

    console.log(`✅ Subscription cancelled for subscription ${subscription.id}`);
  } catch (error) {
    console.error('❌ Error handling subscription cancellation:', error);
    throw error;
  }
}

module.exports = router;


