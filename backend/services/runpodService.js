const axios = require('axios');

// RunPod ComfyUI endpoint
const RUNPOD_ENDPOINT = 'https://qwner9w79n2dyp-8188.proxy.runpod.net';

// Map influencer IDs to their LoRA filenames
const INFLUENCER_LORA_MAP = {
  1: 'audrey',      // Audrey Sinclair
  2: 'mackenzie',   // Mackenzie Cole
  9: 'sloane',      // Sloane Bennett (archived)
  10: 'aria',       // Aria Chen
  11: 'model11',    // Model 11
  12: 'model12',    // Model 12
  13: 'mia',        // Mia Rodriguez
  14: 'nina',       // Nina Patel
  15: 'kimberly',   // Kimberly Smith
  16: 'marta',      // Marta Evans
  17: 'kaori',      // Kaori Nishimura
  18: 'zara',       // Zara Hassan
  19: 'adriana',    // Adriana Perez
  20: 'veronica',   // Veronica Millsap
  21: 'ava',        // Ava Diaz
  22: 'riya',       // Riya Yasin
  23: 'luna',       // Luna Williams
  24: 'bria',       // Bria Sanchez
  25: 'valentina',  // Valentina Gomez
  26: 'lina',       // Lina Morales
  27: 'model27',    // Model 27
  28: 'lila',       // Lila Miller
  29: 'alice',      // Alice Lin
  30: 'bailey',     // Bailey Summers
  31: 'rose',       // Rose Moore (archived)
  32: 'camilla',    // Camilla Gomez (archived)
  33: 'ariana',     // Ariana Garcia
  34: 'alia',       // Alia Wilson
  35: 'briar',      // Briar Westbrook
  36: 'helena',     // Helena Anderson (archived)
  37: 'sakura',     // Sakura Fujimoto
  38: 'scarlet',    // Scarlet Cunningham
  39: 'haruna',     // Haruna Sato
  40: 'rina',       // Rina Takahashi
  41: 'mei',        // Mei Suzuki
  42: 'yumi',       // Yumi Nakamura
  43: 'kim',        // Kim Nguyen
  44: 'reina',      // Reina Arai (archived)
  45: 'zoey',       // Zoey Paige
  46: 'ami',        // Ami Takeda (archived)
  47: 'natsumi',    // Natsumi Kato
  48: 'zara',       // Zara Vee
  49: 'sayaka',     // Sayaka Mori
  50: 'aiko',       // Aiko Tanaka
  51: 'ayaka',      // Ayaka Kobayashi
  52: 'chloe',      // Chloe Morales
  53: 'mio',        // Mio Ishikawa
  54: 'kylie',      // Kylie Murphy
  55: 'hana',       // Hana Yamamoto (archived)
  56: 'erika',      // Erika Matsuda
  57: 'mila',       // Mila Dash
  58: 'kylie',      // Kylie Walsh
  59: 'ava',        // Ava Rhodes
  60: 'kimberly',   // Kimberly Monroe
  61: 'alexis',     // Alexis Barrett
  62: 'gaia',       // Gaia Blake
  63: 'marta',      // Marta Matthews
  64: 'paige',      // Paige Franklin
  65: 'gabriella',  // Gabriella Steele (archived)
  66: 'hailey',     // Hailey Morgan
  67: 'jessica',    // Jessica Parker
  68: 'madison',    // Madison Walker
  69: 'amber',      // Amber Richardson
  70: 'autumn',     // Autumn Fisher (also Lauren Scott)
  71: 'julia',      // Julia Warren
  72: 'clara',      // Clara Coleman
  73: 'brianna',    // Brianna Collins
  74: 'tara',       // Tara Phillips
  75: 'karina',     // Karina Dawson
  76: 'addison',    // Addison Price
  77: 'megan',      // Megan Hayes
  78: 'isabella',   // Isabella Cross
  79: 'alexis',     // Alexis Collins
  80: 'gaia',       // Gaia Bailey
  81: 'emma',       // Emma Reed
  82: 'naima',      // Naima Johnson
  83: 'holly',      // Holly Arlington
  5: 'model5',      // Model 5
};

/**
 * Generate image using RunPod ComfyUI endpoint
 * @param {string} prompt - The text prompt for image generation
 * @param {number} influencerId - The ID of the influencer (to select LoRA)
 * @param {object} options - Additional options (aspectRatio, etc.)
 * @returns {Promise<string>} - URL of the generated image
 */
async function generateImageWithRunPod(prompt, influencerId, options = {}) {
  try {
    const { aspectRatio = '2:3' } = options;
    
    const loraName = INFLUENCER_LORA_MAP[influencerId];
    
    if (!loraName) {
      throw new Error(`No LoRA mapping found for influencer ID: ${influencerId}`);
    }
    
    const loraFilename = `${loraName}.safetensors`;
    
    console.log(`🎨 Generating image with RunPod ComfyUI...`);
    console.log(`📦 Influencer ID: ${influencerId}`);
    console.log(`🎭 LoRA: ${loraFilename}`);
    console.log(`📐 Aspect Ratio: ${aspectRatio}`);
    console.log(`💬 Prompt: ${prompt.substring(0, 100)}...`);
    
    // Map aspect ratio to dimensions
    const dimensionsMap = {
      '1:1': { width: 1024, height: 1024 },
      '2:3': { width: 896, height: 1152 },
      '3:2': { width: 1152, height: 896 },
      '4:5': { width: 896, height: 1120 },
      '9:16': { width: 768, height: 1344 },
      '16:9': { width: 1344, height: 768 }
    };
    
    const dimensions = dimensionsMap[aspectRatio] || dimensionsMap['2:3'];
    console.log(`📏 Dimensions: ${dimensions.width}x${dimensions.height}`);
    
    // Load the workflow template (optimized with 25 steps)
    const workflowTemplate = require('../eromify-image-gen.json');
    
    // Clone the workflow to avoid mutating the original
    const workflow = JSON.parse(JSON.stringify(workflowTemplate));
    
    // Update the LoRA in node 58
    workflow["58"].inputs.lora_name = loraFilename;
    
    // Update the positive prompt in node 46
    workflow["46"].inputs.text = prompt;
    
    // Update dimensions in node 43 (SDXL Resolutions)
    const resolutionMap = {
      '1:1': 'square - 1024x1024 (1:1)',
      '2:3': 'portrait - 896x1152 (3:4)',
      '3:2': 'landscape - 1152x896 (4:3)',
      '4:5': 'portrait - 896x1120 (4:5)',
      '9:16': 'portrait - 768x1344 (9:16)',
      '16:9': 'landscape - 1344x768 (16:9)'
    };
    
    const resolution = resolutionMap[aspectRatio] || resolutionMap['2:3'];
    workflow["43"].inputs.resolution = resolution;
    console.log(`📐 Resolution: ${resolution}`);
    
    // Generate random seed for variation (only node 33 now)
    const randomSeed = Math.floor(Math.random() * 1000000000000000);
    workflow["33"].inputs.seed = randomSeed;
    
    // Call RunPod endpoint
    console.log(`🚀 Sending request to RunPod...`);
    
    const response = await axios.post(`${RUNPOD_ENDPOINT}/prompt`, {
      prompt: workflow
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 300000 // 5 minute timeout
    });
    
    console.log(`✅ RunPod response received:`, response.data);
    
    // The response format depends on your RunPod setup
    // Adjust this based on what your endpoint returns
    const promptId = response.data.prompt_id;
    
    if (!promptId) {
      throw new Error('No prompt_id returned from RunPod');
    }
    
    // Poll for completion
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max (60 * 5 seconds)
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      try {
        const historyResponse = await axios.get(`${RUNPOD_ENDPOINT}/history/${promptId}`);
        const history = historyResponse.data[promptId];
        
        if (history && history.status && history.status.completed) {
          console.log(`✅ Image generation completed!`);
          
          // Extract image URL from outputs
          // Adjust based on your ComfyUI output node configuration
          const outputs = history.outputs;
          
          // Look for SaveImage or PreviewImage nodes
          for (const nodeId in outputs) {
            const output = outputs[nodeId];
            if (output.images && output.images.length > 0) {
              const image = output.images[0];
              const imageUrl = `${RUNPOD_ENDPOINT}/view?filename=${image.filename}&subfolder=${image.subfolder || ''}&type=${image.type || 'output'}`;
              console.log(`🖼️ Image URL:`, imageUrl);
              return imageUrl;
            }
          }
          
          throw new Error('No image found in outputs');
        }
        
        console.log(`⏳ Waiting for completion... (attempt ${attempts + 1}/${maxAttempts})`);
      } catch (pollError) {
        console.warn(`⚠️ Poll attempt ${attempts + 1} error:`, pollError.message);
      }
      
      attempts++;
    }
    
    throw new Error('Image generation timed out');
    
  } catch (error) {
    console.error('❌ RunPod image generation error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw new Error(`Failed to generate image with RunPod: ${error.message}`);
  }
}

module.exports = {
  generateImageWithRunPod,
  INFLUENCER_LORA_MAP
};
