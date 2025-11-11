const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('Auth middleware - token received:', token ? token.substring(0, 20) + '...' : 'no token');

    if (!token) {
      console.log('Auth middleware - no token provided');
      return res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
    }

    // Dev token bypass removed for security

    // Try to verify as JWT token first (for normal login)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret');
      console.log('Auth middleware - JWT token verified, user:', decoded.email);
      req.user = {
        id: decoded.userId,
        email: decoded.email
      };
      next();
      return;
    } catch (jwtError) {
      console.log('Auth middleware - JWT verification failed, trying Supabase...');
    }

    // If JWT fails, try Supabase token verification
    console.log('Auth middleware - verifying token with Supabase...');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.log('Auth middleware - Supabase verification failed:', error);
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    }

    console.log('Auth middleware - Supabase token verified, user:', user.email);
    req.user = {
      id: user.id,
      email: user.email
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Authentication error' 
    });
  }
};

const requireSubscription = (plan) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Authentication required' 
        });
      }

      // Skip subscription check in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: skipping subscription check');
        req.subscription = { plan: 'free', status: 'active' };
        next();
        return;
      }

      // Get user subscription from database
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', req.user.id)
        .eq('status', 'active')
        .single();

      if (error || !subscription) {
        return res.status(403).json({ 
          success: false, 
          error: 'Active subscription required' 
        });
      }

      // Check if user's plan meets requirements
      const planLevels = { free: 0, basic: 1, pro: 2, enterprise: 3 };
      const userPlanLevel = planLevels[subscription.plan] || 0;
      const requiredPlanLevel = planLevels[plan] || 0;

      if (userPlanLevel < requiredPlanLevel) {
        return res.status(403).json({ 
          success: false, 
          error: `Upgrade to ${plan} plan required` 
        });
      }

      req.subscription = subscription;
      next();
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        error: 'Subscription verification error' 
      });
    }
  };
};

module.exports = { authenticateToken, requireSubscription };

