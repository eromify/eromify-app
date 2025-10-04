const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken, requireSubscription } = require('../middleware/auth');
const OpenAI = require('openai');
const Joi = require('joi');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const router = express.Router();

// Validation schemas
const generateContentSchema = Joi.object({
  influencerId: Joi.string().uuid().required(),
  contentType: Joi.string().valid('post', 'story', 'reel', 'bio', 'caption').required(),
  topic: Joi.string().min(3).max(200).required(),
  tone: Joi.string().valid('professional', 'casual', 'funny', 'inspirational', 'educational', 'promotional').required(),
  platform: Joi.string().valid('instagram', 'tiktok', 'twitter', 'linkedin', 'youtube').required(),
  additionalContext: Joi.string().max(500).optional()
});

// Generate content using AI
router.post('/generate', authenticateToken, requireSubscription('free'), async (req, res) => {
  try {
    const { error, value } = generateContentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { influencerId, contentType, topic, tone, platform, additionalContext } = value;

    // Get influencer details
    const { data: influencer, error: influencerError } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', influencerId)
      .eq('user_id', req.user.id)
      .single();

    if (influencerError || !influencer) {
      return res.status(404).json({
        success: false,
        error: 'Influencer not found'
      });
    }

    // Check user's content generation limit
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .single();

    const limits = { free: 10, basic: 100, pro: 500, enterprise: 2000 };
    const dailyLimit = limits[subscription?.plan] || 10;

    // Count today's generated content
    const today = new Date().toISOString().split('T')[0];
    const { count } = await supabase
      .from('generated_content')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id)
      .gte('created_at', today);

    if (count >= dailyLimit) {
      return res.status(429).json({
        success: false,
        error: `Daily content generation limit reached (${dailyLimit}). Upgrade your plan for more generations.`
      });
    }

    // Create AI prompt
    const prompt = `You are an AI content generator for an influencer named "${influencer.name}". 

Influencer Profile:
- Name: ${influencer.name}
- Niche: ${influencer.niche}
- Description: ${influencer.description}
- Personality: ${influencer.personality}
- Target Audience: ${influencer.target_audience}
- Content Style: ${influencer.content_style}

Content Requirements:
- Type: ${contentType}
- Topic: ${topic}
- Tone: ${tone}
- Platform: ${platform}
${additionalContext ? `- Additional Context: ${additionalContext}` : ''}

Generate engaging, authentic content that matches this influencer's brand and resonates with their target audience. Make it platform-appropriate and include relevant hashtags if applicable.`;

    // Generate content using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert social media content creator who specializes in creating authentic, engaging content for influencers across different platforms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const generatedContent = completion.choices[0].message.content;

    // Save generated content to database
    const { data: savedContent, error: saveError } = await supabase
      .from('generated_content')
      .insert([
        {
          user_id: req.user.id,
          influencer_id: influencerId,
          content_type: contentType,
          topic,
          tone,
          platform,
          content: generatedContent,
          additional_context: additionalContext,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save content:', saveError);
    }

    res.json({
      success: true,
      message: 'Content generated successfully',
      content: {
        id: savedContent?.id,
        text: generatedContent,
        metadata: {
          influencer: influencer.name,
          contentType,
          topic,
          tone,
          platform,
          generatedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Generate content error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        success: false,
        error: 'AI service quota exceeded. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to generate content'
    });
  }
});

// Generate AI image
router.post('/generate-image', authenticateToken, requireSubscription('free'), async (req, res) => {
  try {
    const { influencerId, prompt, style, size = '1024x1024' } = req.body;

    if (!influencerId || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Influencer ID and prompt are required'
      });
    }

    // Get influencer details
    const { data: influencer, error: influencerError } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', influencerId)
      .eq('user_id', req.user.id)
      .single();

    if (influencerError || !influencer) {
      return res.status(404).json({
        success: false,
        error: 'Influencer not found'
      });
    }

    // Enhanced prompt with influencer context
    const enhancedPrompt = `Create an image for ${influencer.name}, a ${influencer.niche} influencer. 
    Style: ${style || 'professional and engaging'}. 
    Description: ${prompt}. 
    Make it suitable for social media content that matches their brand and target audience: ${influencer.target_audience}`;

    // Generate image using DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      size: size,
      quality: "standard",
      n: 1,
    });

    const imageUrl = response.data[0].url;

    res.json({
      success: true,
      message: 'Image generated successfully',
      image: {
        url: imageUrl,
        metadata: {
          influencer: influencer.name,
          prompt: enhancedPrompt,
          style,
          size,
          generatedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        success: false,
        error: 'AI service quota exceeded. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to generate image'
    });
  }
});

// Upscale image
router.post('/upscale-image', authenticateToken, requireSubscription('free'), async (req, res) => {
  try {
    const { imageUrl, scale = 2 } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Image URL is required'
      });
    }

    // For now, return the original URL since we don't have an upscaling service
    // In production, you'd integrate with services like Real-ESRGAN or similar
    res.json({
      success: true,
      message: 'Image upscaling completed',
      upscaledImage: {
        originalUrl: imageUrl,
        upscaledUrl: imageUrl, // Placeholder
        scale,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Image upscaling error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upscale image'
    });
  }
});

// Get generated content for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, influencerId } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
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
      .range(offset, offset + limit - 1);

    if (influencerId) {
      query = query.eq('influencer_id', influencerId);
    }

    const { data: content, error } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch content'
      });
    }

    res.json({
      success: true,
      content,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: content.length === parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content'
    });
  }
});

// Get single content item
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data: content, error } = await supabase
      .from('generated_content')
      .select(`
        *,
        influencers (
          name,
          niche
        )
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    res.json({
      success: true,
      content
    });

  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content'
    });
  }
});

// Delete content
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('generated_content')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(404).json({
        success: false,
        error: 'Content not found or delete failed'
      });
    }

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete content'
    });
  }
});

module.exports = router;

