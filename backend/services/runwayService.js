const https = require('https');
const { URL } = require('url');

const RUNWAY_API_BASE = 'https://api.runwayml.com/v1';

/**
 * Generate video from image using Runway Gen-3
 * @param {string} imageUrl - URL of the source image
 * @param {string} prompt - Motion prompt for video generation
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Job object with jobId and status
 */
async function generateVideoFromImage(imageUrl, prompt, options = {}) {
  try {
    const {
      duration = 5, // seconds
      motionBucket = 127, // 1-255, higher = more motion
      watermark = false,
    } = options;

    // Runway Gen-3 Alpha image-to-video endpoint
    const response = await makeRequest('POST', '/generations/image-to-video', {
      image: imageUrl,
      prompt: prompt,
      duration: duration,
      motion_bucket: motionBucket,
      watermark: watermark,
    });

    return {
      jobId: response.id,
      status: response.status,
      createdAt: response.created_at,
    };
  } catch (error) {
    console.error('Runway video generation error:', error);
    throw new Error(`Failed to generate video: ${error.message}`);
  }
}

/**
 * Check generation status
 * @param {string} jobId - The job ID from generation request
 * @returns {Promise<object>} - Status object with video URL if ready
 */
async function checkGenerationStatus(jobId) {
  try {
    const response = await makeRequest('GET', `/generations/${jobId}`);
    
    return {
      jobId: response.id,
      status: response.status, // queued, processing, completed, failed
      progress: response.progress || 0,
      videoUrl: response.output?.[0] || null, // URL when completed
      error: response.error || null,
      createdAt: response.created_at,
      completedAt: response.completed_at,
    };
  } catch (error) {
    console.error('Runway status check error:', error);
    throw new Error(`Failed to check status: ${error.message}`);
  }
}

/**
 * Wait for generation to complete (polling helper)
 * @param {string} jobId - The job ID
 * @param {number} maxWaitTime - Maximum wait time in seconds (default 300s = 5min)
 * @param {number} pollInterval - Poll interval in seconds (default 2s)
 * @returns {Promise<string>} - Video URL when complete
 */
async function waitForGeneration(jobId, maxWaitTime = 300, pollInterval = 2) {
  const startTime = Date.now();
  const maxWaitMs = maxWaitTime * 1000;
  const pollIntervalMs = pollInterval * 1000;

  while (true) {
    const status = await checkGenerationStatus(jobId);

    if (status.status === 'completed' && status.videoUrl) {
      return status.videoUrl;
    }

    if (status.status === 'failed') {
      throw new Error(`Video generation failed: ${status.error || 'Unknown error'}`);
    }

    // Check timeout
    if (Date.now() - startTime > maxWaitMs) {
      throw new Error('Video generation timeout - job may still be processing');
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs * 1000));
  }
}

/**
 * Make HTTP request to Runway API
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body (for POST)
 * @returns {Promise<object>} - Response data
 */
function makeRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, RUNWAY_API_BASE);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    if (data && method !== 'GET') {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`Runway API error: ${parsed.error?.message || responseData}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request error: ${error.message}`));
    });

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

module.exports = {
  generateVideoFromImage,
  checkGenerationStatus,
  waitForGeneration,
};

