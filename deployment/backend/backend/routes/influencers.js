const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken, requireSubscription } = require('../middleware/auth');
const Joi = require('joi');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const router = express.Router();

// Validation schemas
const createInfluencerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  niche: Joi.string().valid('fashion', 'fitness', 'lifestyle', 'tech', 'food', 'travel', 'beauty', 'gaming', 'business', 'other').required(),
  personality: Joi.string().min(10).max(500).required(),
  targetAudience: Joi.string().min(10).max(500).required(),
  contentStyle: Joi.string().min(10).max(500).required()
});

// Get all influencers for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: influencers, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch influencers'
      });
    }

    res.json({
      success: true,
      influencers
    });

  } catch (error) {
    console.error('Get influencers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch influencers'
    });
  }
});

// Get single influencer
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data: influencer, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        error: 'Influencer not found'
      });
    }

    res.json({
      success: true,
      influencer
    });

  } catch (error) {
    console.error('Get influencer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch influencer'
    });
  }
});

// Create new influencer
router.post('/', authenticateToken, requireSubscription('free'), async (req, res) => {
  try {
    const { error, value } = createInfluencerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { name, description, niche, personality, targetAudience, contentStyle } = value;

    // Check user's influencer limit based on subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .single();

    const limits = { free: 3, basic: 10, pro: 50, enterprise: 200 };
    const limit = limits[subscription?.plan] || 3;

    const { count } = await supabase
      .from('influencers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    if (count >= limit) {
      return res.status(403).json({
        success: false,
        error: `Influencer limit reached. Upgrade your plan to create more influencers.`
      });
    }

    // Create influencer
    const { data: influencer, error: createError } = await supabase
      .from('influencers')
      .insert([
        {
          user_id: req.user.id,
          name,
          description,
          niche,
          personality,
          target_audience: targetAudience,
          content_style: contentStyle,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (createError) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create influencer'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Influencer created successfully',
      influencer
    });

  } catch (error) {
    console.error('Create influencer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create influencer'
    });
  }
});

// Update influencer
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { error, value } = createInfluencerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { name, description, niche, personality, targetAudience, contentStyle } = value;

    const { data: influencer, error: updateError } = await supabase
      .from('influencers')
      .update({
        name,
        description,
        niche,
        personality,
        target_audience: targetAudience,
        content_style: contentStyle,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (updateError) {
      return res.status(404).json({
        success: false,
        error: 'Influencer not found or update failed'
      });
    }

    res.json({
      success: true,
      message: 'Influencer updated successfully',
      influencer
    });

  } catch (error) {
    console.error('Update influencer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update influencer'
    });
  }
});

// Delete influencer
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('influencers')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(404).json({
        success: false,
        error: 'Influencer not found or delete failed'
      });
    }

    res.json({
      success: true,
      message: 'Influencer deleted successfully'
    });

  } catch (error) {
    console.error('Delete influencer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete influencer'
    });
  }
});

module.exports = router;

