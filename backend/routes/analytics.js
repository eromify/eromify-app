const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken } = require('../middleware/auth');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const router = express.Router();

// Get user analytics dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get influencers count
    const { count: totalInfluencers } = await supabase
      .from('influencers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get content generation stats
    const { count: totalContent } = await supabase
      .from('generated_content')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    // Get content by type
    const { data: contentByType } = await supabase
      .from('generated_content')
      .select('content_type')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    // Get content by platform
    const { data: contentByPlatform } = await supabase
      .from('generated_content')
      .select('platform')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    // Get daily content generation
    const { data: dailyContent } = await supabase
      .from('generated_content')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Process data for charts
    const contentTypeStats = contentByType?.reduce((acc, item) => {
      acc[item.content_type] = (acc[item.content_type] || 0) + 1;
      return acc;
    }, {}) || {};

    const platformStats = contentByPlatform?.reduce((acc, item) => {
      acc[item.platform] = (acc[item.platform] || 0) + 1;
      return acc;
    }, {}) || {};

    // Process daily data
    const dailyStats = {};
    dailyContent?.forEach(item => {
      const date = item.created_at.split('T')[0];
      dailyStats[date] = (dailyStats[date] || 0) + 1;
    });

    const dailyChart = Object.entries(dailyStats).map(([date, count]) => ({
      date,
      count
    }));

    res.json({
      success: true,
      analytics: {
        summary: {
          totalInfluencers: totalInfluencers || 0,
          totalContent: totalContent || 0,
          period
        },
        charts: {
          contentByType: Object.entries(contentTypeStats).map(([type, count]) => ({
            type,
            count
          })),
          contentByPlatform: Object.entries(platformStats).map(([platform, count]) => ({
            platform,
            count
          })),
          dailyGeneration: dailyChart
        }
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

// Get influencer performance analytics
router.get('/influencer/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const influencerId = req.params.id;

    // Verify influencer belongs to user
    const { data: influencer, error: influencerError } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', influencerId)
      .eq('user_id', userId)
      .single();

    if (influencerError || !influencer) {
      return res.status(404).json({
        success: false,
        error: 'Influencer not found'
      });
    }

    // Get content generated for this influencer
    const { data: content, error: contentError } = await supabase
      .from('generated_content')
      .select('*')
      .eq('influencer_id', influencerId)
      .order('created_at', { ascending: false });

    if (contentError) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch influencer content'
      });
    }

    // Calculate stats
    const totalContent = content.length;
    const contentByType = content.reduce((acc, item) => {
      acc[item.content_type] = (acc[item.content_type] || 0) + 1;
      return acc;
    }, {});

    const contentByPlatform = content.reduce((acc, item) => {
      acc[item.platform] = (acc[item.platform] || 0) + 1;
      return acc;
    }, {});

    const recentContent = content.slice(0, 10);

    res.json({
      success: true,
      influencer: {
        ...influencer,
        stats: {
          totalContent,
          contentByType,
          contentByPlatform,
          recentContent
        }
      }
    });

  } catch (error) {
    console.error('Influencer analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch influencer analytics'
    });
  }
});

// Get usage statistics
router.get('/usage', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    // Get current month usage
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const { count: monthlyContent } = await supabase
      .from('generated_content')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString());

    // Define limits based on plan
    const limits = {
      free: { content: 10, influencers: 3 },
      basic: { content: 100, influencers: 10 },
      pro: { content: 500, influencers: 50 },
      enterprise: { content: 2000, influencers: 200 }
    };

    const userPlan = subscription?.plan || 'free';
    const userLimits = limits[userPlan];

    res.json({
      success: true,
      usage: {
        current: {
          content: monthlyContent || 0,
          influencers: 0 // Will be calculated separately
        },
        limits: userLimits,
        plan: userPlan,
        remaining: {
          content: Math.max(0, userLimits.content - (monthlyContent || 0))
        }
      }
    });

  } catch (error) {
    console.error('Usage analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch usage statistics'
    });
  }
});

module.exports = router;
