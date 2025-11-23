const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * ComfyUI Image Generation Service for Runpod
 * This service handles image generation using ComfyUI API running on Runpod
 * with custom LoRA models for influencer-specific images
 */

/**
 * Generate image using ComfyUI API
 * @param {string} prompt - The text prompt for image generation
 * @param {object} options - Generation options
 * @returns {Promise<string>} - Generated image URL
 */
async function generateImageWithComfyUI(prompt, options = {}) {
  try {
    const {
      aspectRatio = '1:1',
      loraModel = null,
      numInferenceSteps = 28,
      guidanceScale = 7.5,
      seed = null,
      negativePrompt = ''
    } = options;

    console.log('🎨 ComfyUI Image Generation:', {
      prompt: prompt.substring(0, 100) + '...',
      aspectRatio,
      loraModel,
      numInferenceSteps,
      guidanceScale
    });

    // Convert aspect ratio to ComfyUI resolution format
    const resolution = convertAspectRatioToComfyUIFormat(aspectRatio);

    // Generate a random seed if not provided
    const finalSeed = seed || Math.floor(Math.random() * 1000000000);

    // Build ComfyUI workflow
    const workflow = buildComfyUIWorkflow({
      prompt,
      negativePrompt,
      resolution,
      loraModel,
      numInferenceSteps,
      guidanceScale,
      seed: finalSeed
    });

    console.log('📋 ComfyUI Workflow:', JSON.stringify(workflow, null, 2));

    // Queue the workflow in ComfyUI
    const promptResponse = await queueComfyUIWorkflow(workflow);
    const promptId = promptResponse.prompt_id;

    console.log(`📤 Workflow queued with prompt_id: ${promptId}`);

    // Poll for completion
    const imageUrl = await pollForComfyUICompletion(promptId);

    console.log('✅ ComfyUI image generated successfully:', imageUrl);
    return imageUrl;

  } catch (error) {
    console.error('❌ ComfyUI image generation error:', error);
    throw new Error(`Failed to generate image with ComfyUI: ${error.message}`);
  }
}

/**
 * Convert aspect ratio to ComfyUI resolution format
 * Matches the resolutions available in your ComfyUI workflow
 */
function convertAspectRatioToComfyUIFormat(aspectRatio) {
  const ratioMap = {
    '1:1': { name: 'square - 1024x1024 (1:1)', width: 1024, height: 1024 },
    '4:3': { name: 'landscape - 1152x896 (4:3)', width: 1152, height: 896 },
    '3:2': { name: 'landscape - 1216x832 (3:2)', width: 1216, height: 832 },
    '16:9': { name: 'landscape - 1344x768 (16:9)', width: 1344, height: 768 },
    '21:9': { name: 'landscape - 1536x640 (21:9)', width: 1536, height: 640 },
    '3:4': { name: 'portrait - 896x1152 (3:4)', width: 896, height: 1152 },
    '2:3': { name: 'portrait - 832x1216 (2:3)', width: 832, height: 1216 },
    '9:16': { name: 'portrait - 768x1344 (9:16)', width: 768, height: 1344 },
    '9:21': { name: 'portrait - 640x1536 (9:21)', width: 640, height: 1536 }
  };
  
  return ratioMap[aspectRatio] || ratioMap['1:1'];
}

/**
 * Build ComfyUI workflow JSON
 * This is your actual ComfyUI workflow with dynamic parameters
 */
function buildComfyUIWorkflow({ prompt, negativePrompt, resolution, loraModel, numInferenceSteps, guidanceScale, seed }) {
  // Simplified working workflow - just the 1st pass (basic generation with LoRA)
  const workflow = {
    "11": {
      "inputs": {
        "ckpt_name": "bigLust_v16.safetensors"
      },
      "class_type": "CheckpointLoaderSimple",
      "_meta": { "title": "Load Checkpoint" }
    },
    "58": {
      "inputs": {
        "lora_name": loraModel || "bria.safetensors",
        "strength_model": 1,
        "strength_clip": 1,
        "model": ["11", 0],
        "clip": ["11", 1]
      },
      "class_type": "LoraLoader",
      "_meta": { "title": "Load LoRA" }
    },
    "46": {
      "inputs": {
        "text": prompt,
        "clip": ["58", 1]
      },
      "class_type": "CLIPTextEncode",
      "_meta": { "title": "Positive Prompt" }
    },
    "47": {
      "inputs": {
        "text": negativePrompt || "text, watermark",
        "clip": ["58", 1]
      },
      "class_type": "CLIPTextEncode",
      "_meta": { "title": "Negative Prompt" }
    },
    "43": {
      "inputs": {
        "resolution": resolution.name
      },
      "class_type": "SDXL Resolutions (JPS)",
      "_meta": { "title": "SDXL Resolutions (JPS)" }
    },
    "42": {
      "inputs": {
        "width": ["43", 0],
        "height": ["43", 1],
        "batch_size": 1
      },
      "class_type": "EmptyLatentImage",
      "_meta": { "title": "Empty Latent Image" }
    },
    "33": {
      "inputs": {
        "seed": seed,
        "steps": numInferenceSteps,
        "cfg": guidanceScale,
        "sampler_name": "dpmpp_sde",
        "scheduler": "karras",
        "denoise": 1,
        "model": ["58", 0],
        "positive": ["46", 0],
        "negative": ["47", 0],
        "latent_image": ["42", 0]
      },
      "class_type": "KSampler",
      "_meta": { "title": "KSampler" }
    },
    "35": {
      "inputs": {
        "samples": ["33", 0],
        "vae": ["11", 2]
      },
      "class_type": "VAEDecode",
      "_meta": { "title": "VAE Decode" }
    },
    "34": {
      "inputs": {
        "images": ["35", 0]
      },
      "class_type": "PreviewImage",
      "_meta": { "title": "Preview Image" }
    }
  };

  return workflow;
}

/**
 * Queue a workflow in ComfyUI
 */
async function queueComfyUIWorkflow(workflow) {
  const comfyuiUrl = process.env.COMFYUI_URL || process.env.RUNPOD_ENDPOINT_URL;
  
  if (!comfyuiUrl) {
    throw new Error('COMFYUI_URL or RUNPOD_ENDPOINT_URL not configured');
  }

  // Parse the URL and construct the /prompt endpoint
  const baseUrl = comfyuiUrl.replace(/\/$/, ''); // Remove trailing slash
  const promptEndpoint = `${baseUrl}/prompt`;

  console.log('📡 Queueing workflow at:', promptEndpoint);

  const payload = {
    prompt: workflow,
    client_id: `eromify_${Date.now()}`
  };

  return await makeComfyUIRequest('POST', promptEndpoint, payload);
}

/**
 * Poll ComfyUI for workflow completion and get the image URL
 */
async function pollForComfyUICompletion(promptId, maxWaitTime = 120000) {
  const comfyuiUrl = process.env.COMFYUI_URL || process.env.RUNPOD_ENDPOINT_URL;
  const baseUrl = comfyuiUrl.replace(/\/$/, '');
  const historyEndpoint = `${baseUrl}/history/${promptId}`;

  const startTime = Date.now();
  const pollInterval = 2000; // 2 seconds

  while (true) {
    // Check if we've exceeded max wait time
    if (Date.now() - startTime > maxWaitTime) {
      throw new Error('ComfyUI generation timeout after 2 minutes');
    }

    try {
      console.log('⏳ Polling ComfyUI for completion...');
      const history = await makeComfyUIRequest('GET', historyEndpoint);

      if (history[promptId]) {
        const promptHistory = history[promptId];
        
        // Check if workflow completed
        if (promptHistory.outputs) {
          // Extract image from outputs
          // The structure depends on your workflow's output nodes
          const outputs = promptHistory.outputs;
          
          // Simplified workflow outputs to node 34 (PreviewImage)
          const possibleOutputNodes = ["34", "35"];
          
          for (const nodeId of possibleOutputNodes) {
            const outputNode = outputs[nodeId];
            if (outputNode && outputNode.images && outputNode.images.length > 0) {
              const image = outputNode.images[0];
              // Construct the full image URL
              const imageUrl = `${baseUrl}/view?filename=${image.filename}&subfolder=${image.subfolder || ''}&type=${image.type || 'output'}`;
              console.log(`✅ Found image from node ${nodeId}:`, imageUrl);
              return imageUrl;
            }
          }
          
          // If none of the expected nodes have images, try any node with images
          for (const nodeId in outputs) {
            const outputNode = outputs[nodeId];
            if (outputNode && outputNode.images && outputNode.images.length > 0) {
              const image = outputNode.images[0];
              const imageUrl = `${baseUrl}/view?filename=${image.filename}&subfolder=${image.subfolder || ''}&type=${image.type || 'output'}`;
              console.log(`✅ Found image from node ${nodeId}:`, imageUrl);
              return imageUrl;
            }
          }
        }

        // Check if workflow failed
        if (promptHistory.status && promptHistory.status.status_str === 'error') {
          const errorMsg = promptHistory.status.messages?.join(', ') || 'Unknown error';
          throw new Error(`ComfyUI workflow failed: ${errorMsg}`);
        }
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));

    } catch (error) {
      if (error.message.includes('timeout') || error.message.includes('failed')) {
        throw error;
      }
      // Continue polling on other errors
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }
}

/**
 * Make HTTP request to ComfyUI API
 */
function makeComfyUIRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    const isHttps = url.protocol === 'https:';
    const httpModule = isHttps ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout for individual requests
    };

    let payload = '';
    if (data && method !== 'GET') {
      payload = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    console.log('📤 ComfyUI Request:', {
      method,
      endpoint,
      hasData: !!data
    });

    const req = httpModule.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          console.log('📥 ComfyUI Response:', {
            statusCode: res.statusCode,
            dataLength: responseData.length
          });

          if (res.statusCode !== 200) {
            console.error('❌ ComfyUI API error:', responseData);
            reject(new Error(`ComfyUI API error (${res.statusCode}): ${responseData}`));
            return;
          }

          const parsed = JSON.parse(responseData);
          resolve(parsed);

        } catch (error) {
          console.error('❌ Failed to parse ComfyUI response:', error);
          reject(new Error(`Failed to parse ComfyUI response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ ComfyUI request error:', error);
      reject(new Error(`ComfyUI request error: ${error.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      console.error('❌ ComfyUI request timeout');
      reject(new Error('ComfyUI request timeout'));
    });

    if (payload) {
      req.write(payload);
    }

    req.end();
  });
}

/**
 * Check ComfyUI health
 */
async function checkComfyUIHealth() {
  try {
    const comfyuiUrl = process.env.COMFYUI_URL || process.env.RUNPOD_ENDPOINT_URL;
    if (!comfyuiUrl) {
      return false;
    }

    const baseUrl = comfyuiUrl.replace(/\/$/, '');
    const systemStatsEndpoint = `${baseUrl}/system_stats`;

    console.log('🏥 Checking ComfyUI health...');
    await makeComfyUIRequest('GET', systemStatsEndpoint);
    return true;

  } catch (error) {
    console.error('❌ ComfyUI health check failed:', error);
    return false;
  }
}

module.exports = {
  generateImageWithComfyUI,
  checkComfyUIHealth,
  convertAspectRatioToComfyUIFormat
};

