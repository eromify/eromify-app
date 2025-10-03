const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken } = require('../middleware/auth');
const Joi = require('joi');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const router = express.Router();

// Validation schemas
const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).optional(),
  avatar: Joi.string().uri().optional(),
  bio: Joi.string().max(500).optional()
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get user's subscription info
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .single();

    // Get user's stats
    const { count: influencerCount } = await supabase
      .from('influencers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    const { count: contentCount } = await supabase
      .from('generated_content')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatar: user.avatar_url,
        bio: user.bio,
        createdAt: user.created_at,
        subscription: subscription || null,
        stats: {
          influencers: influencerCount || 0,
          contentGenerated: contentCount || 0
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { fullName, avatar, bio } = value;
    const updateData = {};

    if (fullName) updateData.full_name = fullName;
    if (avatar) updateData.avatar_url = avatar;
    if (bio) updateData.bio = bio;

    updateData.updated_at = new Date().toISOString();

    const { data: user, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user.id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatar: user.avatar_url,
        bio: user.bio
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Get recent influencers
    const { data: recentInfluencers } = await supabase
      .from('influencers')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent content
    const { data: recentContent } = await supabase
      .from('generated_content')
      .select(`
        *,
        influencers (
          name,
          niche
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get content generation stats for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: contentStats } = await supabase
      .from('generated_content')
      .select('created_at, content_type')
      .eq('user_id', req.user.id)
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Process stats
    const stats = {
      totalInfluencers: recentInfluencers?.length || 0,
      totalContent: recentContent?.length || 0,
      contentByType: {},
      contentByDay: {}
    };

    contentStats?.forEach(item => {
      const date = item.created_at.split('T')[0];
      const type = item.content_type;

      // Count by type
      stats.contentByType[type] = (stats.contentByType[type] || 0) + 1;

      // Count by day
      stats.contentByDay[date] = (stats.contentByDay[date] || 0) + 1;
    });

    res.json({
      success: true,
      dashboard: {
        recentInfluencers: recentInfluencers || [],
        recentContent: recentContent || [],
        stats
      }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
});

// Get user subscription info
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch subscription'
      });
    }

    res.json({
      success: true,
      subscription: subscription || null
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription'
    });
  }
});

module.exports = router;

