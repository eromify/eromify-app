const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// RunPod ComfyUI endpoint for VIDEO generation
const RUNPOD_ENDPOINT = 'https://2k9rz5l136lrge-8188.proxy.runpod.net';

// Map influencer IDs to their LoRA filenames (video needs high and low noise)
const INFLUENCER_VIDEO_LORA_MAP = {
  1: 'audrey',      // Audrey Sinclair
  2: 'mackenzie',   // Mackenzie Cole
  10: 'aria',       // Aria Chen
  13: 'mia',        // Mia Rodriguez
  14: 'nina',       // Nina Patel
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
  28: 'lila',       // Lila Miller
  29: 'alice',      // Alice Lin
  30: 'bailey',     // Bailey Summers
  33: 'ariana',     // Ariana Garcia
  34: 'alia',       // Alia Wilson
  35: 'briar',      // Briar Westbrook
  37: 'sakura',     // Sakura Fujimoto
  38: 'scarlet',    // Scarlet Cunningham
  39: 'haruna',     // Haruna Sato
  40: 'rina',       // Rina Takahashi
  41: 'mei',        // Mei Suzuki
  42: 'yumi',       // Yumi Nakamura
  43: 'kim',        // Kim Nguyen
  50: 'aiko',       // Aiko Tanaka
  51: 'ayaka',      // Ayaka Kobayashi
  52: 'chloe',      // Chloe Morales
  53: 'mio',        // Mio Ishikawa
  56: 'erika',      // Erika Matsuda
  57: 'mila',       // Mila Dash
  58: 'kylie',      // Kylie Walsh
  59: 'ava',        // Ava Rhodes
  60: 'kimberly',   // Kimberly Monroe
  61: 'alexis',     // Alexis Barrett
  62: 'gaia',       // Gaia Blake
  63: 'marta',      // Marta Matthews
  64: 'paige',      // Paige Franklin
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
};

/**
 * Generate video using RunPod ComfyUI endpoint
 * @param {string} prompt - The text prompt for video generation
 * @param {number} influencerId - The ID of the influencer (to select LoRAs)
 * @param {object} options - Additional options (aspectRatio, duration, etc.)
 * @returns {Promise<string>} - URL of the generated video
 */
async function generateVideoWithRunPod(prompt, influencerId, options = {}) {
  try {
    const { aspectRatio = '16:9', duration = 5 } = options; // duration in SECONDS
    
    // Convert seconds to frames (24 fps)
    const FRAME_RATE = 24;
    const durationInFrames = Math.round(duration * FRAME_RATE);
    
    const loraName = INFLUENCER_VIDEO_LORA_MAP[influencerId];
    
    if (!loraName) {
      throw new Error(`No LoRA mapping found for influencer ID: ${influencerId}`);
    }
    
    const highNoiseLoraFilename = `${loraName} high 100.safetensors`;
    const lowNoiseLoraFilename = `${loraName} low 100.safetensors`;
    
    console.log(`🎬 Generating video with RunPod ComfyUI...`);
    console.log(`📦 Influencer ID: ${influencerId}`);
    console.log(`🎭 LoRA Name: ${loraName}`);
    console.log(`🎭 High Noise LoRA: ${highNoiseLoraFilename}`);
    console.log(`🎭 Low Noise LoRA: ${lowNoiseLoraFilename}`);
    console.log(`📐 Aspect Ratio: ${aspectRatio}`);
    console.log(`⏱️  Duration: ${duration} seconds (${durationInFrames} frames)`);
    console.log(`💬 Prompt: ${prompt}`);
    
    // Map aspect ratio to video dimensions
    const dimensionsMap = {
      '1:1': { width: 832, height: 832 },
      '9:16': { width: 480, height: 832 },   // Vertical/Story
      '16:9': { width: 832, height: 480 },   // Horizontal/Landscape
      '4:5': { width: 640, height: 800 },    // Instagram
      '2:3': { width: 640, height: 960 }     // Portrait
    };
    
    const dimensions = dimensionsMap[aspectRatio] || dimensionsMap['16:9'];
    console.log(`📏 Dimensions: ${dimensions.width}x${dimensions.height}`);
    
    // Load the workflow template
    const workflowTemplate = require('../../eromify-video-gen.json');
    
    // Clone the workflow to avoid mutating the original
    const workflow = JSON.parse(JSON.stringify(workflowTemplate));
    
    // Update the high noise LoRA in node 44
    workflow["44"].inputs.lora_name = highNoiseLoraFilename;
    
    // Update the low noise LoRA in node 45
    workflow["45"].inputs.lora_name = lowNoiseLoraFilename;
    
    // Update the positive prompt in node 29
    workflow["29"].inputs.text = prompt;
    
    // Update video dimensions and duration in node 28
    workflow["28"].inputs.width = dimensions.width;
    workflow["28"].inputs.height = dimensions.height;
    workflow["28"].inputs.length = durationInFrames; // Use frames, not seconds
    
    // Generate random seeds for variation
    const randomSeed = Math.floor(Math.random() * 1000000000000000);
    workflow["24"].inputs.seed = randomSeed;
    workflow["30"].inputs.seed = randomSeed + 1;
    
    // Fix VAE connection (node 25 needs VAE input - Anything Everywhere doesn't work in API)
    workflow["25"].inputs.vae = ["26", 0];
    
    // Call RunPod endpoint
    console.log(`🚀 Sending request to RunPod...`);
    
    const response = await axios.post(`${RUNPOD_ENDPOINT}/prompt`, {
      prompt: workflow
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 600000 // 10 minute timeout (videos take longer)
    });
    
    console.log(`✅ RunPod response received:`, response.data);
    
    const promptId = response.data.prompt_id;
    
    if (!promptId) {
      throw new Error('No prompt_id returned from RunPod');
    }
    
    // Poll for completion (videos take much longer than images)
    let attempts = 0;
    const maxAttempts = 180; // 15 minutes max (180 * 5 seconds)
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      try {
        const historyResponse = await axios.get(`${RUNPOD_ENDPOINT}/history/${promptId}`, {
          timeout: 30000 // 30 second timeout for each poll
        });
        const history = historyResponse.data[promptId];
        
        if (history && history.status && history.status.completed) {
          console.log(`✅ Video generation completed!`);
          
          // Extract video URL from outputs
          const outputs = history.outputs;
          
          // Look for video output (node 27 is VHS_VideoCombine)
          for (const nodeId in outputs) {
            const output = outputs[nodeId];
            if (output.gifs && output.gifs.length > 0) {
              const video = output.gifs[0];
              const videoUrl = `${RUNPOD_ENDPOINT}/view?filename=${video.filename}&subfolder=${video.subfolder || ''}&type=${video.type || 'output'}`;
              console.log(`🎬 Video URL from RunPod:`, videoUrl);
              
              // Download the video and save it locally
              console.log(`📥 Downloading video from:`, videoUrl);
              const videoResponse = await axios.get(videoUrl, { 
                responseType: 'arraybuffer',
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 60000 // 60 second timeout
              });
              
              console.log(`📦 Downloaded ${videoResponse.data.byteLength} bytes`);
              
              // Create videos directory if it doesn't exist
              const videosDir = path.join(__dirname, '../../frontend/public/videos');
              try {
                await mkdir(videosDir, { recursive: true });
              } catch (err) {
                // Directory might already exist
              }
              
              // Generate unique filename
              const timestamp = Date.now();
              const filename = `video_${influencerId}_${timestamp}.mp4`;
              const filePath = path.join(videosDir, filename);
              
              // Save video file
              await writeFile(filePath, videoResponse.data);
              console.log(`💾 Video saved to:`, filePath);
              
              // Return the public URL
              const publicUrl = `/videos/${filename}`;
              console.log(`🌐 Public URL:`, publicUrl);
              return publicUrl;
            }
          }
          
          throw new Error('No video found in outputs');
        }
        
        console.log(`⏳ Waiting for completion... (attempt ${attempts + 1}/${maxAttempts}, elapsed: ${Math.round((attempts * 5) / 60)} min ${(attempts * 5) % 60} sec)`);
      } catch (pollError) {
        console.warn(`⚠️ Poll attempt ${attempts + 1} error:`, pollError.message);
      }
      
      attempts++;
    }
    
    throw new Error('Video generation timed out');
    
  } catch (error) {
    console.error('❌ RunPod video generation error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw new Error(`Failed to generate video with RunPod: ${error.message}`);
  }
}

module.exports = {
  generateVideoWithRunPod,
  INFLUENCER_VIDEO_LORA_MAP
};

