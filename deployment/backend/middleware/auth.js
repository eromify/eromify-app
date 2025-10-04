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

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.userId,
      email: decoded.email
    };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token expired' 
      });
    }

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

