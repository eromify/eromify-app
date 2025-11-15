const express = require('express');
const router = express.Router();
require('dotenv').config();
const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
const stripe = stripeKey ? require('stripe')(stripeKey) : null;
const { createClient } = require('@supabase/supabase-js');

// Use fallback values for development if env vars are not set
const supabaseUrl = process.env.SUPABASE_URL || 'https://eyteuevblxvhjhyeivqh.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dGV1ZXZibHh2aGpoeWVpdnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzYzNjAsImV4cCI6MjA3NTAxMjM2MH0.aTPGEVfNom78Cm9ZmwbMwyzTJ0KkqUE0uIHjBo-MZUA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('✅ Webhook signature verified for event:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
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
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

// Handle successful payment
async function handleSuccessfulPayment(session) {
  try {
    const { userId, plan, billing, credits, influencerTrainings, onboardingSelection } = session.metadata;

    console.log('💳 Processing successful payment:', { userId, plan, billing, credits, influencerTrainings, hasOnboardingSelection: !!onboardingSelection });

    // Update user subscription in database
    const { error } = await supabase
      .from('users')
      .update({
        subscription_plan: plan,
        subscription_billing: billing,
        credits: credits === 'unlimited' ? null : credits,
        influencer_trainings: influencerTrainings === 'unlimited' ? null : influencerTrainings,
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
    
    console.log('🔄 Processing subscription renewal for customer:', customerId);
    
    // Get user by Stripe customer ID
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single();

    if (error || !user) {
      console.error('❌ User not found for customer ID:', customerId);
      throw new Error(`User not found for customer ID: ${customerId}`);
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


