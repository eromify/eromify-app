const { getSupabaseAdmin } = require('../lib/supabaseAdmin');

// Admin client for database queries (bypasses RLS)
const supabase = getSupabaseAdmin();

/**
 * Middleware to require AI girlfriend subscription
 * This is separate from influencer creation subscriptions
 */
const requireAIGirlfriendSubscription = (requirePaid = false) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Authentication required' 
        });
      }

      // Get user's AI girlfriend subscription from database
      const { data: user, error } = await supabase
        .from('users')
        .select('ai_girlfriend_subscription_status, ai_girlfriend_subscription_plan')
        .eq('id', req.user.id)
        .single();

      if (error) {
        console.error('❌ [AI Girlfriend Auth] Error fetching user:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Subscription verification error' 
        });
      }

      // Check if user has active subscription with any of the 3 plans (1month, 3months, 12months)
      const isPaid = user?.ai_girlfriend_subscription_status === 'active' && 
                     user?.ai_girlfriend_subscription_plan && 
                     ['1month', '3months', '12months'].includes(user.ai_girlfriend_subscription_plan);
      
      if (isPaid) {
        console.log(`✅ [AI Girlfriend Auth] Paid user detected: plan=${user.ai_girlfriend_subscription_plan}, status=${user.ai_girlfriend_subscription_status}`);
      }
      
      // If requirePaid is true, check for active paid subscription
      if (requirePaid && !isPaid) {
        return res.status(403).json({ 
          success: false, 
          error: 'Active AI girlfriend subscription required',
          requiresSubscription: true
        });
      }

      // Set subscription info for use in route handlers
      req.aiGirlfriendSubscription = {
        status: user?.ai_girlfriend_subscription_status || null,
        plan: user?.ai_girlfriend_subscription_plan || null,
        isFree: !isPaid,
        isPaid: isPaid
      };

      next();
    } catch (error) {
      console.error('❌ [AI Girlfriend Auth] Error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Subscription verification error' 
      });
    }
  };
};

/**
 * Middleware to check if user has free or paid AI girlfriend access
 * Always allows access but provides subscription info in req.aiGirlfriendSubscription
 */
const checkAIGirlfriendAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    // Get user's AI girlfriend subscription (handle missing columns gracefully)
    let isPaid = false;
    let subscriptionStatus = null;
    let subscriptionPlan = null;
    let tokens = 0;
    
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('ai_girlfriend_subscription_status, ai_girlfriend_subscription_plan, ai_girlfriend_tokens')
        .eq('id', req.user.id)
        .single();

      if (!error && user) {
        subscriptionStatus = user.ai_girlfriend_subscription_status;
        subscriptionPlan = user.ai_girlfriend_subscription_plan;
        tokens = user.ai_girlfriend_tokens || 0;
        // Check if user has active subscription with any of the 3 plans (1month, 3months, 12months)
        isPaid = subscriptionStatus === 'active' && 
                 subscriptionPlan && 
                 ['1month', '3months', '12months'].includes(subscriptionPlan);
        
        if (isPaid) {
          console.log(`✅ [AI Girlfriend Auth] Paid user detected: plan=${subscriptionPlan}, status=${subscriptionStatus}`);
        }
      }
    } catch (dbError) {
      // If columns don't exist yet (migration not run), treat as free tier
      if (dbError.code === '42703' || dbError.message?.includes('does not exist')) {
        console.log('⚠️ [AI Girlfriend Auth] Database columns not found - run migration SQL');
      } else {
        console.error('❌ [AI Girlfriend Auth] Error fetching user:', dbError);
      }
    }
    
    req.aiGirlfriendSubscription = {
      status: subscriptionStatus,
      plan: subscriptionPlan,
      isFree: !isPaid,
      isPaid: isPaid,
      tokens: tokens
    };

    next();
  } catch (error) {
    console.error('❌ [AI Girlfriend Auth] Error:', error);
    // Don't block access on error, just mark as free
    req.aiGirlfriendSubscription = {
      status: null,
      plan: null,
      isFree: true,
      isPaid: false,
      tokens: 0
    };
    next();
  }
};

module.exports = { requireAIGirlfriendSubscription, checkAIGirlfriendAccess };

