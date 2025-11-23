/**
 * Test script for Runpod image generation endpoint
 * 
 * This script helps you test the Runpod integration locally
 * before deploying to production.
 * 
 * Usage:
 * 1. Make sure your .env file has RUNPOD_ENDPOINT_URL and RUNPOD_API_KEY
 * 2. Start your backend server: npm run dev
 * 3. Run this test: node test-runpod.js
 */

require('dotenv').config();
const https = require('https');
const http = require('http');

// Configuration
const BACKEND_URL = 'http://localhost:3001';
const TEST_TOKEN = 'your_test_auth_token_here'; // Get this from your login response

// Test data
const testCases = [
  {
    name: 'Simple Portrait - 1:1',
    payload: {
      prompt: 'beautiful woman, professional photo, high quality',
      aspectRatio: '1:1',
      numInferenceSteps: 28,
      guidanceScale: 7.5
    }
  },
  {
    name: 'Landscape - 16:9',
    payload: {
      prompt: 'stunning woman at the beach, sunset, professional photography',
      aspectRatio: '16:9',
      numInferenceSteps: 28,
      guidanceScale: 7.5
    }
  },
  {
    name: 'Portrait with LoRA - 2:3',
    payload: {
      prompt: 'attractive influencer, instagram style, fashion photo',
      aspectRatio: '2:3',
      loraModel: 'influencer_model_v1', // Replace with your actual LoRA model name
      numInferenceSteps: 30,
      guidanceScale: 8.0
    }
  },
  {
    name: 'Custom Seed for Consistency',
    payload: {
      prompt: 'beautiful woman, professional headshot, studio lighting',
      aspectRatio: '1:1',
      seed: 12345,
      numInferenceSteps: 28,
      guidanceScale: 7.5
    }
  }
];

/**
 * Make a request to the backend API
 */
function makeRequest(endpoint, method, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BACKEND_URL);
    const isHttps = url.protocol === 'https:';
    const httpModule = isHttps ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Add authorization token if provided
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && method !== 'GET') {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = httpModule.request(options, (res) => {
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
            reject(new Error(`API error (${res.statusCode}): ${JSON.stringify(parsed)}`));
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

/**
 * Test the Runpod endpoint
 */
async function testRunpodEndpoint(testCase) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Testing: ${testCase.name}`);
  console.log(`${'='.repeat(60)}`);
  console.log('📝 Payload:', JSON.stringify(testCase.payload, null, 2));

  try {
    const startTime = Date.now();
    const result = await makeRequest(
      '/api/content/generate-image-runpod',
      'POST',
      testCase.payload,
      TEST_TOKEN
    );
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`✅ Success! (${duration}s)`);
    console.log('📦 Response:', JSON.stringify(result, null, 2));
    console.log(`🖼️  Image URL: ${result.image?.url}`);

    return { success: true, result, duration };
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Test backend health
 */
async function testHealth() {
  console.log('🏥 Checking backend health...');
  try {
    const result = await makeRequest('/health', 'GET');
    console.log('✅ Backend is healthy:', result);
    return true;
  } catch (error) {
    console.error('❌ Backend health check failed:', error.message);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Runpod Image Generation API Test Suite');
  console.log('='.repeat(60));

  // Check environment variables
  console.log('\n📋 Environment Check:');
  console.log(`  RUNPOD_ENDPOINT_URL: ${process.env.RUNPOD_ENDPOINT_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`  RUNPOD_API_KEY: ${process.env.RUNPOD_API_KEY ? '✅ Set' : '⚠️  Optional'}`);

  if (!process.env.RUNPOD_ENDPOINT_URL) {
    console.error('\n❌ RUNPOD_ENDPOINT_URL is not set in your .env file!');
    console.log('\nPlease add it to your .env file:');
    console.log('RUNPOD_ENDPOINT_URL=https://your-endpoint-id.proxy.runpod.net');
    process.exit(1);
  }

  // Check backend health
  const isHealthy = await testHealth();
  if (!isHealthy) {
    console.error('\n❌ Backend is not running or unhealthy!');
    console.log('\nPlease start your backend server:');
    console.log('  cd backend && npm run dev');
    process.exit(1);
  }

  // Check authentication token
  if (!TEST_TOKEN || TEST_TOKEN === 'your_test_auth_token_here') {
    console.warn('\n⚠️  Warning: TEST_TOKEN is not set!');
    console.log('You need to set a valid auth token in this script.');
    console.log('\nSteps to get a token:');
    console.log('1. Login to your app or use the API to get a token');
    console.log('2. Update TEST_TOKEN in this script');
    console.log('3. Run this test again\n');
    process.exit(1);
  }

  // Run test cases
  console.log('\n' + '='.repeat(60));
  console.log('Running Test Cases...');
  console.log('='.repeat(60));

  const results = [];
  for (const testCase of testCases) {
    const result = await testRunpodEndpoint(testCase);
    results.push({ testCase: testCase.name, ...result });
    
    // Wait a bit between tests to avoid rate limiting
    if (testCases.indexOf(testCase) < testCases.length - 1) {
      console.log('\n⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.testCase}: ${r.error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Test suite completed!');
  console.log('='.repeat(60) + '\n');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { testRunpodEndpoint, runTests };

