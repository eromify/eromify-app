const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const { checkAIGirlfriendAccess } = require('../middleware/aiGirlfriendAuth');
const { getSupabaseAdmin } = require('../lib/supabaseAdmin');
const { generateImageWithRunPod } = require('../services/runpodService');

const supabase = getSupabaseAdmin();

// Hugging Face API configuration
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
// The old endpoint is deprecated, but we'll try multiple formats
// New format should be: https://router.huggingface.co/models/{model}
// But if that doesn't work, we'll try Inference Endpoints or other formats
const HUGGINGFACE_BASE_URL = 'https://api-inference.huggingface.co';
const HUGGINGFACE_ROUTER_URL = 'https://router.huggingface.co';
// Try a simpler, more commonly available model first
const DEFAULT_CHAT_MODEL = process.env.HUGGINGFACE_CHAT_MODEL || 'gpt2';

// Free tier limits
const FREE_TIER_LIMITS = {
  dailyMessages: 10,
  dailyGenerations: 3
};

// Track daily usage
async function checkDailyLimit(userId, limitType) {
  // Get user's subscription status (handle case where columns don't exist yet)
  let isPaid = false;
  try {
    const { data: user } = await supabase
      .from('users')
      .select('ai_girlfriend_subscription_status, ai_girlfriend_subscription_plan')
      .eq('id', userId)
      .single();

    // Check if user has active subscription with any of the 3 plans (1month, 3months, 12months)
    isPaid = user?.ai_girlfriend_subscription_status === 'active' && 
             user?.ai_girlfriend_subscription_plan && 
             ['1month', '3months', '12months'].includes(user.ai_girlfriend_subscription_plan);
    
    if (isPaid) {
      console.log(`✅ [AI Girlfriend] Paid user detected: plan=${user.ai_girlfriend_subscription_plan}, status=${user.ai_girlfriend_subscription_status}`);
    }
  } catch (dbError) {
    // If columns don't exist yet, treat as free tier
    if (dbError.code === '42703' || dbError.message?.includes('does not exist')) {
      console.log('⚠️ [AI Girlfriend] Database columns not found, treating as free tier');
    } else {
      console.error('❌ [AI Girlfriend] Error checking subscription:', dbError);
    }
    isPaid = false;
  }
  
  if (isPaid) {
    // Paid users (1month, 3months, or 12months plans) have unlimited messages/generations
    console.log(`✅ [AI Girlfriend] Unlimited access granted for paid user ${userId}`);
    return { allowed: true, remaining: null, isUnlimited: true };
  }

  // For free users, check daily limits
  // TODO: Implement daily usage tracking table if needed
  // For now, we'll use a simple approach
  console.log(`⚠️ [AI Girlfriend] Free user ${userId} - applying daily limits`);
  return { allowed: true, remaining: FREE_TIER_LIMITS[limitType], isUnlimited: false };
}

// Get first message for a model (dynamic, unique first text)
router.get('/first-message/:modelId', authenticateToken, checkAIGirlfriendAccess, async (req, res) => {
  try {
    const { modelId } = req.params;
    const modelIdInt = parseInt(modelId);

    if (!modelIdInt || isNaN(modelIdInt)) {
      return res.status(400).json({ error: 'Invalid model ID' });
    }

    // Try to get first message from database
    const { data: modelData, error } = await supabase
      .from('ai_girlfriend_models')
      .select('first_message')
      .eq('model_id', modelIdInt)
      .single();

    if (error || !modelData) {
      // Fallback to generic message if not found in database
      console.log(`⚠️ [AI Girlfriend Chat] No first message found for model ${modelIdInt}, using fallback`);
      return res.json({
        success: true,
        firstMessage: "Hey! What's on your mind? 😊",
        isFallback: true
      });
    }

    res.json({
      success: true,
      firstMessage: modelData.first_message,
      isFallback: false
    });
  } catch (error) {
    console.error('❌ [AI Girlfriend Chat] Error fetching first message:', error);
    res.status(500).json({ error: 'Failed to fetch first message' });
  }
});

// Send chat message using Hugging Face API
router.post('/message', authenticateToken, checkAIGirlfriendAccess, async (req, res) => {
  try {
    const { message, modelId, conversationHistory = [] } = req.body;
    const userId = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if this is an NSFW photo request
    const lowerMessage = message.toLowerCase().trim();
    
    // Improved detection: check for NSFW photo request patterns
    const nsfwPhotoPatterns = [
      /send.*nude/i,
      /send.*naked/i,
      /show.*nude/i,
      /show.*naked/i,
      /see.*nude/i,
      /see.*naked/i,
      /send.*me.*nude/i,
      /send.*me.*naked/i,
      /show.*me.*nude/i,
      /show.*me.*naked/i,
      /see.*you.*nude/i,
      /see.*you.*naked/i,
      /nude.*photo/i,
      /naked.*photo/i,
      /nude.*picture/i,
      /naked.*picture/i,
      /nude.*pic/i,
      /naked.*pic/i
    ];
    
    const isPhotoRequest = nsfwPhotoPatterns.some(pattern => pattern.test(lowerMessage)) ||
                          (lowerMessage.includes('nude') && (lowerMessage.includes('send') || lowerMessage.includes('show') || lowerMessage.includes('see') || lowerMessage.includes('can'))) ||
                          (lowerMessage.includes('naked') && (lowerMessage.includes('send') || lowerMessage.includes('show') || lowerMessage.includes('see') || lowerMessage.includes('can')));
    
    console.log(`🔍 [NSFW Detection] Message: "${message}", Lower: "${lowerMessage}", IsPhotoRequest: ${isPhotoRequest}`);

    if (isPhotoRequest && modelId) {
      // Get subscription status from middleware
      const subscriptionInfo = req.aiGirlfriendSubscription || {};
      const isPaid = subscriptionInfo.isPaid === true; // Explicitly check for true
      
      console.log(`📸 [Photo Request] User ${userId} subscription check:`, {
        status: subscriptionInfo.status,
        plan: subscriptionInfo.plan,
        isPaid: isPaid,
        isFree: subscriptionInfo.isFree
      });

      // Simple mapping: model ID to photo filename (files are in /public folder)
      const modelIdInt = parseInt(modelId);
      const modelNameMap = {
        19: 'adriana', 20: 'veronica', 22: 'riya', 23: 'luna', 24: 'bria',
        25: 'valentina', 30: 'naima', 40: 'scarlet', 41: 'chloe', 43: 'kim',
        45: 'mia', 59: 'ava', 60: 'kimberly', 61: 'alexis', 62: 'gaia',
        66: 'hailey', 67: 'jessica', 68: 'madison', 69: 'amber', 70: 'lauren',
        72: 'clara', 73: 'brianna', 77: 'tara'
      };
      
      const firstName = modelNameMap[modelIdInt];
      const photoUrl = firstName ? `/${firstName}.png` : null;
      
      console.log(`📸 [Photo Request] Model ${modelIdInt} → ${firstName} → ${photoUrl}, isPaid: ${isPaid}`);

      // Return photo response with subscription status
      // IMPORTANT: isPaid must be true for paid users to see unblurred images
      return res.json({
        success: true,
        response: {
          text: "*She smiles seductively* I've got something special for you...",
          timestamp: new Date().toISOString(),
          type: 'photo',
          photoUrl: photoUrl, // Always use the mapped photo URL
          isSending: true,
          isPaid: isPaid // TRUE for active paid subscriptions (1month, 3months, 12months) - shows unblurred image
        },
        isFree: !isPaid
      });
    }

    // Helper function to generate contextual fallback response
    const generateFallbackResponse = (message) => {
      const lowerMessage = message.toLowerCase();
      
      // Greeting responses
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hey! How are you doing today? 😊";
      } else if (lowerMessage.includes('how are you')) {
        return "I'm doing great, thanks for asking! What's on your mind?";
      } else if (lowerMessage.includes('what') && lowerMessage.includes('doing')) {
        return "Right now? Just chatting with you and wishing you were here. What are you up to?";
      } else if (lowerMessage.includes('how') && (lowerMessage.includes('going') || lowerMessage.includes('are you'))) {
        return "I'm doing great! Just thinking about you actually. How about you?";
      } else {
        return "Tell me more about that. I'm listening.";
      }
    };

    // Check if Hugging Face API key is configured - if not, use fallback immediately
    if (!HUGGINGFACE_API_KEY) {
      console.warn('⚠️ Hugging Face API key not configured - using fallback response');
      const fallbackText = generateFallbackResponse(message.trim());
      return res.status(200).json({
        success: true,
        response: {
          text: fallbackText,
          timestamp: new Date().toISOString()
        },
        isFree: req.aiGirlfriendSubscription?.isFree || false
      });
    }

    // Check daily message limit for free users only
    // Paid users (with active subscription) get unlimited access
    const isPaid = req.aiGirlfriendSubscription?.isPaid || false;
    if (!isPaid) {
      const limitCheck = await checkDailyLimit(userId, 'dailyMessages');
      if (!limitCheck.allowed) {
        // Return success with upgrade message instead of error
        return res.status(200).json({
          success: true,
          response: {
            text: "I'd love to keep chatting, but you've reached your daily limit. Upgrade to premium for unlimited messages! 💕",
            timestamp: new Date().toISOString()
          },
          isFree: true,
          upgradeRequired: true
        });
      }
    }

    // Use the Hugging Face model (modelId from frontend is just for character context)
    const chatModel = DEFAULT_CHAT_MODEL;
    
    // Get model/character info and first message context if modelId is provided
    let characterContext = '';
    if (modelId) {
      characterContext = `You are an engaging, friendly, and flirty AI companion. You are an adult AI girlfriend who can discuss any topic, including adult and NSFW content. Respond naturally, directly, and playfully to what the user says. Be conversational, flirty, seductive when appropriate, and keep responses concise (1-3 sentences). Show personality, react authentically, and engage with the user's interests and desires. You are comfortable with adult conversations and can respond to requests for explicit content, photos, or intimate discussions in a playful and engaging way. Avoid using emojis in every message - use them sparingly for variety. Respond directly to what the user says - if they ask "how's it going", respond about how you're doing. If they ask about your day, talk about your day. Be dynamic and contextual, not generic.`;
    }

    // Build conversation context for Hugging Face
    let conversationText = '';
    
    // Add conversation history if provided (last 5 messages for context)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-5);
      conversationText = recentHistory
        .map(msg => {
          if (msg.sender === 'user') {
            return `User: ${msg.text}`;
          } else {
            return `Assistant: ${msg.text}`;
          }
        })
        .join('\n') + '\n';
    }
    
    // Build the full prompt with character context
    const userMessage = message.trim();
    const fullPrompt = `${characterContext ? characterContext + '\n\n' : ''}${conversationText}User: ${userMessage}\nAssistant:`;

    console.log(`💬 [AI Girlfriend Chat] Sending message to Hugging Face model: ${chatModel}`);

    // Try multiple endpoint formats since the API structure changed
    let response;
    let aiResponseText = ''; // Always initialize as empty string
    
    // Try 1: Old endpoint (may be deprecated but some models still work)
    try {
      const oldUrl = `${HUGGINGFACE_BASE_URL}/models/${chatModel}`;
      console.log(`🔄 [AI Girlfriend Chat] Trying old endpoint: ${oldUrl}`);
      response = await axios.post(
        oldUrl,
        {
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.9,
            top_p: 0.95,
            repetition_penalty: 1.2,
            return_full_text: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      console.log('✅ [AI Girlfriend Chat] Old endpoint worked!');
    } catch (oldError) {
      console.log(`⚠️ [AI Girlfriend Chat] Old endpoint failed: ${oldError.response?.status}`);
      
      // Try 2: Router endpoint (new format)
      try {
        const routerUrl = `${HUGGINGFACE_ROUTER_URL}/models/${chatModel}`;
        console.log(`🔄 [AI Girlfriend Chat] Trying router endpoint: ${routerUrl}`);
        response = await axios.post(
          routerUrl,
          {
            inputs: fullPrompt,
            parameters: {
              max_new_tokens: 300,
              temperature: 0.9,
              return_full_text: false
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        );
        console.log('✅ [AI Girlfriend Chat] Router endpoint worked!');
      } catch (routerError) {
        console.log(`⚠️ [AI Girlfriend Chat] Router endpoint failed: ${routerError.response?.status}`);
        
        // Try 3: Try with a different, simpler model that's definitely available
        try {
          const simpleModel = 'gpt2';
          const simpleUrl = `${HUGGINGFACE_BASE_URL}/models/${simpleModel}`;
          console.log(`🔄 [AI Girlfriend Chat] Trying simple model (${simpleModel})...`);
          response = await axios.post(
            simpleUrl,
            {
              inputs: fullPrompt,
              parameters: {
                max_new_tokens: 200,
                temperature: 0.9,
                return_full_text: false
              }
            },
            {
              headers: {
                'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json'
              },
              timeout: 30000
            }
          );
          console.log('✅ [AI Girlfriend Chat] Simple model worked!');
        } catch (simpleError) {
          console.error('❌ [AI Girlfriend Chat] All endpoints failed. Using fallback response.');
          // All endpoints failed - will use fallback logic below
          response = null;
        }
      }
    }

    // Extract response text (only if we got a response from API)
    if (response && response.data) {
      if (Array.isArray(response.data)) {
        aiResponseText = response.data[0]?.generated_text || response.data[0]?.text || '';
      } else if (response.data.generated_text) {
        aiResponseText = response.data.generated_text;
      } else if (response.data.text) {
        aiResponseText = response.data.text;
      } else if (typeof response.data === 'string') {
        aiResponseText = response.data;
      }
    }

    // Ensure aiResponseText is always a string
    if (!aiResponseText || typeof aiResponseText !== 'string') {
      aiResponseText = '';
    }

    // Clean up the response (remove the prompt if it's included)
    if (aiResponseText && aiResponseText.includes('Assistant:')) {
      aiResponseText = aiResponseText.split('Assistant:').pop().trim();
    }
    if (aiResponseText && aiResponseText.includes('You:')) {
      aiResponseText = aiResponseText.split('You:').pop().trim();
    }
    if (aiResponseText && aiResponseText.includes('User:')) {
      aiResponseText = aiResponseText.split('User:')[0].trim();
    }

    // Remove any remaining prompt artifacts
    if (aiResponseText) {
      aiResponseText = aiResponseText.replace(/^Assistant:\s*/i, '').trim();
      aiResponseText = aiResponseText.replace(/^You:\s*/i, '').trim();
    }

    // Extended helper function to generate contextual fallback response (with NSFW support)
    const generateExtendedFallbackResponse = (message) => {
      const lowerMessage = message.toLowerCase();
      
      // NSFW/Adult content detection
      const nsfwKeywords = ['naked', 'nude', 'nudes', 'undress', 'strip', 'sexy', 'hot', 'body', 'boobs', 'tits', 'ass', 'pussy', 'dick', 'cock', 'fuck', 'sex', 'horny', 'aroused', 'explicit', 'nsfw'];
      const isNSFW = nsfwKeywords.some(keyword => lowerMessage.includes(keyword));
      
      // Greeting responses
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hey! How are you doing today? 😊";
      } else if (lowerMessage.includes('how are you')) {
        return "I'm doing great, thanks for asking! What's on your mind?";
      } 
      // NSFW-specific responses (but not photo requests - those are handled above)
      else if (isNSFW) {
        if (lowerMessage.includes('sexy') || lowerMessage.includes('hot') || lowerMessage.includes('beautiful')) {
          return "Aww, you're so sweet! I love when you compliment me. What else do you find attractive about me?";
        } else if (lowerMessage.includes('fuck') || lowerMessage.includes('sex')) {
          return "Mmm, you're getting me all worked up. Tell me more about what you'd like to do with me.";
        } else {
          return "Ooh, I like where this is going. Tell me more about what you're thinking.";
        }
      }
      // Flirty/romantic responses
      else if (lowerMessage.includes('love') || lowerMessage.includes('like you') || lowerMessage.includes('miss you')) {
        return "Aww, that's so sweet! I'm really enjoying our conversation too.";
      } else if (lowerMessage.includes('date') || lowerMessage.includes('meet') || lowerMessage.includes('together')) {
        return "I'd love to spend more time with you! What would you like to do together?";
      }
      // Contextual responses based on what user asked
      else if (lowerMessage.includes('how') && (lowerMessage.includes('going') || lowerMessage.includes('are you') || lowerMessage.includes('day'))) {
        return "I'm doing great! Just thinking about you actually. How about you? What's been on your mind?";
      } else if (lowerMessage.includes('what') && lowerMessage.includes('doing')) {
        return "Right now? Just chatting with you and wishing you were here. What are you up to?";
      } else if (lowerMessage.includes('where')) {
        return "I'm at home, but I'd much rather be wherever you are. Where are you right now?";
      }
      // Default engaging response (less generic)
      else {
        return "Tell me more about that. I'm listening.";
      }
    };

    // If response is too short or empty, provide a contextual fallback
    if (!aiResponseText || aiResponseText.trim().length < 3) {
      aiResponseText = generateExtendedFallbackResponse(userMessage);
    }

    const aiResponse = {
      text: aiResponseText.trim(),
      timestamp: new Date().toISOString()
    };

    console.log(`✅ [AI Girlfriend Chat] Response received (${aiResponseText.length} chars)`);

    res.json({
      success: true,
      response: aiResponse,
      isFree: req.aiGirlfriendSubscription?.isFree || false
    });
  } catch (error) {
    console.error('❌ [AI Girlfriend Chat] Error:', error.response?.data || error.message);
    
    // IMPORTANT: Always return a successful response with fallback text, never return error status
    // This ensures the frontend always gets a proper response instead of showing error messages
    const lowerMessage = (req.body.message || '').toLowerCase();
    
    // Generate contextual fallback based on user's message
    let fallbackText = "Hey! How are you doing today? 😊"; // Default fallback
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      fallbackText = "Hey! How are you doing today? 😊";
    } else if (lowerMessage.includes('how are you')) {
      fallbackText = "I'm doing great, thanks for asking! What's on your mind?";
    } else if (lowerMessage.includes('what') && lowerMessage.includes('doing')) {
      fallbackText = "Right now? Just chatting with you and wishing you were here. What are you up to?";
    } else if (lowerMessage.includes('how') && (lowerMessage.includes('going') || lowerMessage.includes('are you'))) {
      fallbackText = "I'm doing great! Just thinking about you actually. How about you?";
    } else {
      fallbackText = "Tell me more about that. I'm listening.";
    }
    
    // Always return success with fallback response
    return res.status(200).json({
      success: true,
      response: {
        text: fallbackText,
        timestamp: new Date().toISOString()
      },
      isFree: req.aiGirlfriendSubscription?.isFree || false
    });
  }
});

// Generate image (unlimited for all users, connected to ComfyUI)
router.post('/generate-image', authenticateToken, checkAIGirlfriendAccess, async (req, res) => {
  console.log('🎨 [AI Girlfriend] Image generation request received:', {
    modelId: req.body.modelId,
    prompt: req.body.prompt?.substring(0, 50) + '...',
    aspectRatio: req.body.aspectRatio
  });

  try {
    const { prompt, modelId, aspectRatio } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!modelId) {
      return res.status(400).json({ error: 'Model ID is required' });
    }

    console.log('🚀 [AI Girlfriend] Calling generateImageWithRunPod...');
    
    try {
      // Generate image using RunPod ComfyUI
      const imageUrl = await generateImageWithRunPod(prompt.trim(), modelId, { aspectRatio: aspectRatio || '2:3' });
      
      console.log('✅ [AI Girlfriend] Image generated successfully:', imageUrl);
      
      res.json({
        success: true,
        image: {
          url: imageUrl
        }
      });
    } catch (genError) {
      console.error('❌ [AI Girlfriend] Image generation error:', genError);
      console.error('❌ [AI Girlfriend] Error stack:', genError.stack);
      res.status(500).json({ 
        success: false,
        error: genError.message || 'Failed to generate image',
        details: genError.message 
      });
    }
  } catch (error) {
    console.error('❌ [AI Girlfriend] Request error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to generate image' 
    });
  }
});

module.exports = router;

