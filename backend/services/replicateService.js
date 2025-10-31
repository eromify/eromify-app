const Replicate = require('replicate');

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Generate image with face consistency using IP-Adapter Face ID Plus
 * @param {string} prompt - The text prompt for image generation
 * @param {string} faceImageUrl - URL of the face reference image (optional, for face consistency)
 * @param {object} options - Additional options (style, size, etc.)
 * @returns {Promise<string>} - URL of the generated image
 */
async function generateImageWithFaceConsistency(prompt, faceImageUrl = null, options = {}) {
  try {
    const {
      style = 'photorealistic',
      numOutputs = 1,
      guidanceScale = 7.5,
      numInferenceSteps = 30
    } = options;

    // Enhanced prompt with style
    const enhancedPrompt = `${prompt}, ${style} style, high quality, professional photography`;

    // Use PhotoMaker model for face consistency (best quality)
    // Model: tencentarc/photomaker
    // Alternative: fofr/sdxl-ip-adapter-face-id-plus
    
    let input = {
      prompt: enhancedPrompt,
      num_outputs: numOutputs,
      guidance_scale: guidanceScale,
      num_inference_steps: numInferenceSteps,
      output_format: 'png',
      output_quality: 90,
    };

    // If face image is provided, use PhotoMaker for consistency
    if (faceImageUrl) {
      // PhotoMaker requires input image
      input = {
        ...input,
        input_image: faceImageUrl,
      };
      
      // Use PhotoMaker model (face consistency)
      const output = await replicate.run(
        'tencentarc/photomaker:6c59992c1148c78251f0d54fa9bc87dfb3f78cd6',
        { input }
      );
      
      // PhotoMaker returns array of image URLs
      return Array.isArray(output) ? output[0] : output;
    } else {
      // Use standard SDXL for general generation
      const output = await replicate.run(
        'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        { input }
      );
      
      return Array.isArray(output) ? output[0] : output;
    }
  } catch (error) {
    console.error('Replicate image generation error:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

/**
 * Generate image using IP-Adapter Face ID Plus (alternative method)
 * @param {string} prompt - The text prompt
 * @param {string} faceImageUrl - Face reference image URL
 * @param {object} options - Additional options
 * @returns {Promise<string>} - Generated image URL
 */
async function generateImageWithIPAdapter(prompt, faceImageUrl, options = {}) {
  try {
    const {
      style = 'photorealistic',
      guidanceScale = 7.5,
    } = options;

    const enhancedPrompt = `${prompt}, ${style} style, high quality`;

    // IP-Adapter Face ID Plus model  
    const output = await replicate.run(
      'fofr/sdxl-ip-adapter-face-id-plus',
      {
        input: {
          image: faceImageUrl,
          prompt: enhancedPrompt,
          ip_adapter_scale: 0.8,
          guidance_scale: guidanceScale,
          num_outputs: 1,
          num_inference_steps: 30,
          output_format: 'png',
          output_quality: 90,
        }
      }
    );

    return Array.isArray(output) ? output[0] : output;
  } catch (error) {
    console.error('IP-Adapter generation error:', error);
    throw new Error(`Failed to generate image with IP-Adapter: ${error.message}`);
  }
}

/**
 * Wait for prediction to complete (Replicate is async)
 * @param {object} prediction - The prediction object from Replicate
 * @returns {Promise<string>} - Final output URL
 */
async function waitForPrediction(prediction) {
  try {
    let result = prediction;
    
    // Poll until complete
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status === 'succeeded') {
      return Array.isArray(result.output) ? result.output[0] : result.output;
    } else {
      throw new Error(`Prediction failed: ${result.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Prediction wait error:', error);
    throw error;
  }
}

module.exports = {
  generateImageWithFaceConsistency,
  generateImageWithIPAdapter,
  waitForPrediction,
  replicate, // Export client for direct use if needed
};

