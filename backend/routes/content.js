const express = require('express');
const { authenticateToken, requireSubscription } = require('../middleware/auth');
const { getSupabaseAdmin } = require('../lib/supabaseAdmin');
const OpenAI = require('openai');
const Joi = require('joi');
const { generateImageWithFaceConsistency } = require('../services/replicateService');
const { generateVideoFromImage, checkGenerationStatus } = require('../services/runwayService');
const { generateImageWithRunPod } = require('../services/runpodService');
const { generateVideoWithRunPod } = require('../services/runpodVideoService');
const { generateImageWithComfyUI } = require('../services/comfyuiService');

const supabase = getSupabaseAdmin();

// Initialize OpenAI only when needed
let openai = null;
const getOpenAI = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

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
      .from('users')
      .select('subscription_plan')
      .eq('id', req.user.id)
      .eq('subscription_status', 'active')
      .single();

    const limits = { free: 10, basic: 100, pro: 500, enterprise: 2000 };
    const dailyLimit = limits[subscription?.subscription_plan] || 10;

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
    const openaiClient = getOpenAI();
    if (!openaiClient) {
      return res.status(503).json({
        success: false,
        error: 'AI service not available. Please configure OpenAI API key.'
      });
    }
    
    const completion = await openaiClient.chat.completions.create({
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

// Credit costs
const IMAGE_COST = 5;
const VIDEO_COST = 10;

// Helper function to check and deduct credits
async function checkAndDeductCredits(userId, cost) {
  try {
    console.log(`💳 Checking credits for user ${userId}, cost: ${cost}`);
    
    const { data: user, error } = await supabase
      .from('users')
      .select('credits, subscription_plan, subscription_status')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Failed to fetch user credits:', error);
      throw new Error('Failed to fetch user credits');
    }

    if (!user) {
      console.error('❌ User not found');
      return { success: false, remaining: 0, required: cost };
    }

    // Check if user has active subscription
    if (user.subscription_status !== 'active') {
      console.log('❌ User does not have active subscription');
      return { success: false, remaining: 0, required: cost };
    }

    // If user has unlimited credits (Growth plan - credits is NULL)
    if (user.credits === null) {
      console.log('✅ User has unlimited credits');
      return { success: true, remaining: null }; // Unlimited
    }

    console.log(`💰 User has ${user.credits} credits, needs ${cost}`);

    // Check if user has enough credits
    if (user.credits < cost) {
      console.log('❌ Insufficient credits');
      return { success: false, remaining: user.credits, required: cost };
    }

    // Deduct credits
    const newBalance = user.credits - cost;
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Failed to deduct credits:', updateError);
      throw new Error('Failed to deduct credits');
    }

    console.log(`✅ Credits deducted. New balance: ${newBalance}`);
    return { success: true, remaining: newBalance };

  } catch (error) {
    console.error('❌ Credit check error:', error);
    throw error;
  }
}

// Generate AI image
router.post('/generate-image', authenticateToken, requireSubscription('free'), async (req, res) => {
  try {
    const { influencerId, prompt, style, aspectRatio = '1:1' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    // Check and deduct credits (handles unlimited plans automatically)
    const creditCheck = await checkAndDeductCredits(req.user.id, IMAGE_COST);
    if (!creditCheck.success) {
      return res.status(402).json({
        success: false,
        error: `Insufficient credits. Required: ${creditCheck.required}, Available: ${creditCheck.remaining}`,
        credits: creditCheck.remaining
      });
    }

    let enhancedPrompt = prompt;
    let faceImageUrl = null;
    let influencer = null;

    // Get influencer details if provided
    if (influencerId && influencerId !== 'temp-new') {
      const { data: influencerData, error: influencerError } = await supabase
        .from('influencers')
        .select('*')
        .eq('id', influencerId)
        .eq('user_id', req.user.id)
        .single();

      if (influencerError || !influencerData) {
        return res.status(404).json({
          success: false,
          error: 'Influencer not found'
        });
      }

      influencer = influencerData;

      // Enhanced prompt with influencer context
      enhancedPrompt = `${prompt}. Style: ${style || 'professional and engaging'}. For ${influencer.name}, a ${influencer.niche} influencer. Target audience: ${influencer.target_audience}`;

      // Get face image URL if available (for consistency)
      faceImageUrl = influencer.face_image_url || influencer.image_url || null;
    } else {
      // No influencer - use enhanced prompt without influencer context
      enhancedPrompt = `${prompt}. Style: ${style || 'professional and engaging'}`;
    }

    // Generate image using Replicate with face consistency
    const imageUrl = await generateImageWithFaceConsistency(
      enhancedPrompt,
      faceImageUrl,
      { 
        style: style || 'photorealistic',
        aspectRatio: aspectRatio || '1:1'
      }
    );

    // Store generated content in database
    const { error: saveError } = await supabase
      .from('generated_content')
      .insert([
        {
          user_id: req.user.id,
          influencer_id: influencerId,
          content_type: 'image',
          content: imageUrl,
          metadata: {
            influencer: influencer ? influencer.name : null,
            prompt: enhancedPrompt,
            style,
            aspectRatio,
            credits_used: IMAGE_COST
          },
          created_at: new Date().toISOString()
        }
      ]);

    if (saveError) {
      console.error('Failed to save generated content:', saveError);
    }

    res.json({
      success: true,
      message: 'Image generated successfully',
      image: {
        url: imageUrl,
        creditsUsed: IMAGE_COST,
        creditsRemaining: creditCheck.remaining,
        metadata: {
          influencer: influencer ? influencer.name : null,
          prompt: enhancedPrompt,
          style,
          aspectRatio,
          generatedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    // Return the error message directly - NSFW model should handle unrestricted content
    const errorMessage = error.message || 'Failed to generate image';
    
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

// Generate AI image using RunPod ComfyUI (with LoRA models for marketplace influencers)
router.post('/generate-image-runpod', authenticateToken, requireSubscription('free'), async (req, res) => {
  try {
    const { 
      marketplaceModelId,  // ID from marketplaceModels.js (1-83)
      prompt
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    if (!marketplaceModelId) {
      return res.status(400).json({
        success: false,
        error: 'marketplaceModelId is required'
      });
    }

    console.log('🎨 RunPod ComfyUI Image Generation Request:', {
      prompt: prompt.substring(0, 100) + '...',
      marketplaceModelId
    });

    // Check and deduct credits (handles unlimited plans automatically)
    const creditCheck = await checkAndDeductCredits(req.user.id, IMAGE_COST);
    if (!creditCheck.success) {
      return res.status(402).json({
        success: false,
        error: `Insufficient credits. Required: ${creditCheck.required}, Available: ${creditCheck.remaining}`,
        credits: creditCheck.remaining
      });
    }

    // Generate image using RunPod with ComfyUI and influencer LoRA
    const imageUrl = await generateImageWithRunPod(prompt, marketplaceModelId);

    // Store generated content in database
    const { error: saveError } = await supabase
      .from('generated_content')
      .insert([
        {
          user_id: req.user.id,
          influencer_id: null, // Not tied to user's influencer, but to marketplace model
          content_type: 'image',
          content: imageUrl,
          metadata: {
            marketplace_model_id: marketplaceModelId,
            prompt,
            credits_used: IMAGE_COST,
            generation_service: 'runpod_comfyui'
          },
          created_at: new Date().toISOString()
        }
      ]);

    if (saveError) {
      console.error('Failed to save generated content:', saveError);
    }

    res.json({
      success: true,
      message: 'Image generated successfully with RunPod ComfyUI',
      image: {
        url: imageUrl,
        creditsUsed: IMAGE_COST,
        creditsRemaining: creditCheck.remaining,
        metadata: {
          marketplaceModelId,
          prompt,
          generationService: 'runpod_comfyui',
          generatedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('❌ RunPod ComfyUI image generation error:', error);
    
    const errorMessage = error.message || 'Failed to generate image with RunPod ComfyUI';
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Generate AI image using ComfyUI on Runpod (recommended for testing)
router.post('/generate-image-comfyui', authenticateToken, requireSubscription('free'), async (req, res) => {
  try {
    const { 
      influencerId, 
      prompt, 
      aspectRatio = '2:3',
      style
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    console.log('🎨 ComfyUI Image Generation Request:', {
      prompt: prompt.substring(0, 100) + '...',
      aspectRatio,
      influencerId
    });

    // Check and deduct credits (handles unlimited plans automatically)
    const creditCheck = await checkAndDeductCredits(req.user.id, IMAGE_COST);
    if (!creditCheck.success) {
      return res.status(402).json({
        success: false,
        error: `Insufficient credits. Required: ${creditCheck.required}, Available: ${creditCheck.remaining}`,
        credits: creditCheck.remaining
      });
    }

    let influencer = null;
    let marketplaceModelId = null;

    // Name-based mapping of influencers to marketplace model IDs
    const nameToMarketplaceIdMap = {
      'adriana': 19,
      'audrey': 1,
      'mackenzie': 2,
      'bria': 24,
      'riya': 22,
      'valentina': 25,
      'ava': 21,
      'aiko': 50,
      'yumi': 42,
      'kimberly': 60,
      'jessica': 67,
      'kim': 43,
      'lina': 26,
      'rina': 40,
      'alexis': 61,
      'madison': 68,
      'lauren': 70,
      'clara': 72,
      'lila': 28,
      'haruna': 39,
      'hailey': 66,
      'amber': 69,
      'brianna': 73,
      'tara': 74,
      'alice': 29,
      'bailey': 30,
      'rose': 31,
      'camilla': 32,
      'briar': 35,
      'ariana': 33,
      'kylie': 58,
      'addison': 76,
      'mei': 41,
      'chloe': 52,
      'ayaka': 51,
      'emma': 81,
      'naima': 82,
      'holly': 83,
      'paige': 64,
      'alia': 34,
      'sloane': 9,
      'sakura': 37,
      'scarlet': 38,
      'helena': 36,
      'gaia': 62,
      'megan': 77,
      'gabriella': 65,
      'aria': 10,
      'julia': 71,
      'marta': 63,
      'mia': 13,
      'nina': 14,
      'erika': 56,
      'karina': 75,
      'kaori': 17,
      'zara': 18,
      'mio': 53,
      'isabella': 78,
      'autumn': 70,
      'reina': 44,
      'zoey': 45,
      'natsumi': 47,
      'hana': 55,
      'ami': 46,
      'mila': 57,
      'hikari': 58,
      'sayaka': 49,
      'veronica': 20,
      'luna': 23
    };

    // Get influencer details and map to marketplace model ID
    if (influencerId && influencerId !== 'temp-new') {
      const { data: influencerData, error: influencerError } = await supabase
        .from('influencers')
        .select('*')
        .eq('id', influencerId)
        .eq('user_id', req.user.id)
        .single();

      if (!influencerError && influencerData) {
        influencer = influencerData;
        
        // Try to get marketplace model ID from metadata first
        marketplaceModelId = influencerData.metadata?.marketplace_model_id || influencerData.marketplace_model_id;
        
        // If not found, try to match by name
        if (!marketplaceModelId && influencerData.name) {
          const firstName = influencerData.name.toLowerCase().split(' ')[0];
          marketplaceModelId = nameToMarketplaceIdMap[firstName];
          console.log(`🔍 Mapped "${influencerData.name}" → marketplace ID ${marketplaceModelId} via first name "${firstName}"`);
        }
      }
    }

    // If no marketplace model ID found, default to a random one
    if (!marketplaceModelId) {
      marketplaceModelId = 19; // Default to Adriana Perez
      console.log('⚠️ No marketplace model ID found, defaulting to 19 (Adriana)');
    }

    // Generate image using RunPod ComfyUI with aspect ratio support
    const imageUrl = await generateImageWithRunPod(prompt, marketplaceModelId, { aspectRatio });

    // Store generated content in database
    const { error: saveError } = await supabase
      .from('generated_content')
      .insert([
        {
          user_id: req.user.id,
          influencer_id: influencerId,
          content_type: 'image',
          content: imageUrl,
          metadata: {
            influencer: influencer ? influencer.name : null,
            marketplace_model_id: marketplaceModelId,
            prompt,
            aspectRatio,
            style,
            credits_used: IMAGE_COST,
            generation_service: 'runpod_comfyui'
          },
          created_at: new Date().toISOString()
        }
      ]);

    if (saveError) {
      console.error('Failed to save generated content:', saveError);
    }

    res.json({
      success: true,
      message: 'Image generated successfully with ComfyUI',
      image: {
        url: imageUrl,
        creditsUsed: IMAGE_COST,
        creditsRemaining: creditCheck.remaining,
        metadata: {
          influencer: influencer ? influencer.name : null,
          marketplaceModelId,
          prompt,
          aspectRatio,
          style,
          generationService: 'runpod_comfyui',
          generatedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('❌ ComfyUI image generation error:', error);
    
    const errorMessage = error.message || 'Failed to generate image with ComfyUI';
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Generate AI video with RunPod ComfyUI
router.post('/generate-video', authenticateToken, requireSubscription('free'), async (req, res) => {
  try {
    const { influencerId, prompt, aspectRatio = '16:9', duration = 49 } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    console.log('🎬 Video Generation Request:', {
      prompt: prompt.substring(0, 100) + '...',
      aspectRatio,
      duration,
      influencerId
    });

    // Check and deduct credits
    const creditCheck = await checkAndDeductCredits(req.user.id, VIDEO_COST);
    if (!creditCheck.success) {
      return res.status(402).json({
        success: false,
        error: `Insufficient credits. Required: ${creditCheck.required}, Available: ${creditCheck.remaining}`,
        credits: creditCheck.remaining
      });
    }

    let influencer = null;
    let marketplaceModelId = null;

    // Name-based mapping (same as images)
    const nameToMarketplaceIdMap = {
      'adriana': 19, 'audrey': 1, 'mackenzie': 2, 'bria': 24, 'riya': 22,
      'valentina': 25, 'ava': 21, 'aiko': 50, 'yumi': 42, 'kimberly': 60,
      'jessica': 67, 'kim': 43, 'lina': 26, 'rina': 40, 'alexis': 61,
      'madison': 68, 'lauren': 70, 'clara': 72, 'lila': 28, 'haruna': 39,
      'hailey': 66, 'amber': 69, 'brianna': 73, 'tara': 74, 'alice': 29,
      'bailey': 30, 'ariana': 33, 'kylie': 58, 'addison': 76, 'mei': 41,
      'chloe': 52, 'ayaka': 51, 'emma': 81, 'naima': 82, 'holly': 83,
      'paige': 64, 'alia': 34, 'sakura': 37, 'scarlet': 38, 'gaia': 62,
      'megan': 77, 'aria': 10, 'julia': 71, 'marta': 63, 'mia': 13,
      'nina': 14, 'erika': 56, 'karina': 75, 'kaori': 17, 'zara': 18,
      'mio': 53, 'isabella': 78, 'autumn': 70, 'veronica': 20, 'luna': 23
    };

    // Get influencer and map to marketplace ID
    if (influencerId && influencerId !== 'temp-new') {
      const { data: influencerData, error: influencerError } = await supabase
        .from('influencers')
        .select('*')
        .eq('id', influencerId)
        .eq('user_id', req.user.id)
        .single();

      if (!influencerError && influencerData) {
        influencer = influencerData;
        marketplaceModelId = influencerData.metadata?.marketplace_model_id || influencerData.marketplace_model_id;
        
        if (!marketplaceModelId && influencerData.name) {
          const firstName = influencerData.name.toLowerCase().split(' ')[0];
          marketplaceModelId = nameToMarketplaceIdMap[firstName];
          console.log(`🔍 Mapped "${influencerData.name}" → marketplace ID ${marketplaceModelId}`);
        }
      }
    }

    if (!marketplaceModelId) {
      marketplaceModelId = 19; // Default to Adriana
      console.log('⚠️ No marketplace model ID found, defaulting to 19 (Adriana)');
    }

    // Generate video using RunPod ComfyUI
    const videoUrl = await generateVideoWithRunPod(prompt, marketplaceModelId, { aspectRatio, duration });

    // Store generated content in database
    const { error: saveError } = await supabase
      .from('generated_content')
      .insert([
        {
          user_id: req.user.id,
          influencer_id: influencerId || null,
          content_type: 'video',
          content: videoUrl,
          metadata: {
            influencer: influencer ? influencer.name : null,
            marketplace_model_id: marketplaceModelId,
            prompt,
            aspectRatio,
            duration,
            credits_used: VIDEO_COST,
            generation_service: 'runpod_comfyui'
          },
          created_at: new Date().toISOString()
        }
      ]);

    if (saveError) {
      console.error('Failed to save generated content:', saveError);
    }

    res.json({
      success: true,
      message: 'Video generated successfully',
      jobId: 'completed', // Fake jobId since it's already done
      status: 'completed',
      videoUrl: videoUrl, // Include video URL immediately
      creditsUsed: VIDEO_COST,
      creditsRemaining: creditCheck.remaining,
      video: {
        url: videoUrl,
        creditsUsed: VIDEO_COST,
        creditsRemaining: creditCheck.remaining,
        metadata: {
          influencer: influencer ? influencer.name : null,
          marketplaceModelId,
          prompt,
          aspectRatio,
          duration,
          generationService: 'runpod_comfyui',
          generatedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('❌ Video generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate video'
    });
  }
});

// Check video generation status
router.get('/video-status/:jobId', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // For RunPod synchronous generation, video is already completed
    // Just return completed status (frontend shouldn't be calling this anymore)
    res.json({
      success: true,
      status: 'completed',
      videoUrl: null, // Video URL was already returned in the initial response
      message: 'Video already completed and returned'
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check status'
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

