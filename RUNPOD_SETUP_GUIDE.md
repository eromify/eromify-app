# Runpod Image Generation Integration - Setup Guide

This guide will help you test the Runpod image generation API endpoint locally with Eromify.

## 🎯 Overview

The Runpod integration allows you to generate images using custom LoRA models for your influencers. The system is designed to be dynamic, accepting:
- **Custom prompts** (user can input any text)
- **Dynamic aspect ratios** (1:1, 16:9, 9:16, 2:3, 3:2, 4:5, 5:4, 4:3, 3:4)
- **LoRA model selection** (specific to each influencer)
- **Inference steps & guidance scale** (fine-tune generation quality)
- **Seed values** (for reproducible results)

## 📁 Files Created/Modified

### New Files:
1. **`backend/services/runpodService.js`** - Core Runpod API integration service
2. **`backend/test-runpod.js`** - Test script for local testing
3. **`RUNPOD_SETUP_GUIDE.md`** - This guide

### Modified Files:
1. **`backend/routes/content.js`** - Added new endpoint `/api/content/generate-image-runpod`
2. **`backend/env.example`** - Added Runpod environment variables

## 🚀 Setup Instructions

### Step 1: Configure Environment Variables

1. **Get your Runpod endpoint URL:**
   - Go to your Runpod serverless endpoint
   - Copy the endpoint URL (e.g., `https://6sls4etwt4drfd-8188.proxy.runpod.net`)
   - Copy your API key if you have authentication enabled

2. **Update your `.env` file:**

```bash
# Add these lines to your backend/.env file (create .env if it doesn't exist)
RUNPOD_ENDPOINT_URL=https://your-endpoint-id.proxy.runpod.net
RUNPOD_API_KEY=your_runpod_api_key  # Optional, only if your endpoint requires auth
```

### Step 2: Verify Runpod Template Configuration

Your Runpod template should:

1. **Accept input in this format:**
```json
{
  "input": {
    "prompt": "your prompt here",
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 28,
    "guidance_scale": 7.5,
    "output_format": "png",
    "output_quality": 90,
    "lora_model": "optional_lora_model_name",
    "seed": 12345,
    "negative_prompt": "optional negative prompt"
  }
}
```

2. **Return output in one of these formats:**
```json
// Format 1 (preferred):
{
  "output": {
    "image_url": "https://..."
  }
}

// Format 2:
{
  "output": ["https://..."]
}

// Format 3:
{
  "output": "https://..."
}

// Format 4:
{
  "image": "https://..."
}

// Format 5:
{
  "images": ["https://..."]
}
```

The service will automatically detect and handle any of these formats.

### Step 3: Start Your Backend Server

```bash
cd backend
npm install  # Install dependencies if you haven't
npm run dev  # Start the development server
```

You should see:
```
🚀 Server running on port 3001
📊 Health check: http://localhost:3001/health
```

### Step 4: Get an Authentication Token

You need a valid auth token to test the API. Here are your options:

**Option A: Login through your frontend**
1. Start your frontend application
2. Login with your credentials
3. Open browser DevTools (F12) → Network tab
4. Make any API request
5. Look for the `Authorization` header
6. Copy the token (it looks like: `Bearer eyJhbGc...`)

**Option B: Use curl to login**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

Copy the token from the response.

### Step 5: Update the Test Script

Edit `backend/test-runpod.js`:

```javascript
// Line 12 - Replace with your actual token
const TEST_TOKEN = 'your_actual_token_here';
```

### Step 6: Run the Test

```bash
cd backend
node test-runpod.js
```

You should see output like:
```
🚀 Runpod Image Generation API Test Suite
============================================================

📋 Environment Check:
  RUNPOD_ENDPOINT_URL: ✅ Set
  RUNPOD_API_KEY: ✅ Set

🏥 Checking backend health...
✅ Backend is healthy

============================================================
Running Test Cases...
============================================================

🧪 Testing: Simple Portrait - 1:1
📝 Payload: {
  "prompt": "beautiful woman, professional photo, high quality",
  "aspectRatio": "1:1",
  ...
}
✅ Success! (15.3s)
🖼️  Image URL: https://...
```

## 🔧 API Usage

### Endpoint
```
POST /api/content/generate-image-runpod
```

### Headers
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Request Body
```json
{
  "prompt": "beautiful woman at the beach, sunset, professional photography",
  "aspectRatio": "16:9",
  "loraModel": "influencer_model_name",
  "influencerId": "uuid-of-influencer",
  "numInferenceSteps": 28,
  "guidanceScale": 7.5,
  "seed": 12345,
  "negativePrompt": "ugly, blurry, low quality"
}
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | ✅ Yes | - | Text description of the image to generate |
| `aspectRatio` | string | No | `"1:1"` | Image aspect ratio: `"1:1"`, `"16:9"`, `"9:16"`, `"2:3"`, `"3:2"`, `"4:5"`, `"5:4"`, `"4:3"`, `"3:4"` |
| `loraModel` | string | No | `null` | Name of the LoRA model to use (influencer-specific) |
| `influencerId` | string | No | `null` | UUID of the influencer (for context and auto LoRA selection) |
| `numInferenceSteps` | number | No | `28` | Number of denoising steps (higher = better quality, slower) |
| `guidanceScale` | number | No | `7.5` | How closely to follow the prompt (higher = more literal) |
| `seed` | number | No | `null` | Random seed for reproducibility |
| `negativePrompt` | string | No | `null` | Things to avoid in the generation |

### Response (Success)
```json
{
  "success": true,
  "message": "Image generated successfully with Runpod",
  "image": {
    "url": "https://your-image-url.png",
    "creditsUsed": 5,
    "creditsRemaining": 1995,
    "metadata": {
      "influencer": "Influencer Name",
      "prompt": "enhanced prompt...",
      "aspectRatio": "16:9",
      "loraModel": "model_name",
      "generationService": "runpod",
      "generatedAt": "2025-11-21T18:30:00.000Z"
    }
  }
}
```

### Response (Error)
```json
{
  "success": false,
  "error": "Error message here",
  "details": "Stack trace (development only)"
}
```

## 🧪 Testing Different Scenarios

### Test 1: Simple Portrait (1:1)
```bash
curl -X POST http://localhost:3001/api/content/generate-image-runpod \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "beautiful woman, professional photo, high quality",
    "aspectRatio": "1:1"
  }'
```

### Test 2: Landscape with Specific LoRA (16:9)
```bash
curl -X POST http://localhost:3001/api/content/generate-image-runpod \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "stunning woman at the beach, sunset, professional photography",
    "aspectRatio": "16:9",
    "loraModel": "beach_influencer_v1",
    "guidanceScale": 8.0
  }'
```

### Test 3: With Influencer Context (Auto LoRA)
```bash
curl -X POST http://localhost:3001/api/content/generate-image-runpod \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "instagram style fashion photo",
    "aspectRatio": "2:3",
    "influencerId": "your-influencer-uuid-here"
  }'
```

### Test 4: Reproducible Generation (with seed)
```bash
curl -X POST http://localhost:3001/api/content/generate-image-runpod \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "professional headshot, studio lighting",
    "aspectRatio": "1:1",
    "seed": 12345
  }'
```

## 🎨 LoRA Model Integration

### Automatic LoRA Selection
If you provide an `influencerId`, the system will automatically look for a LoRA model in the influencer's metadata:

```sql
-- Example: Update influencer with LoRA model info
UPDATE influencers 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{lora_model}',
  '"influencer_lora_v1"'
)
WHERE id = 'your-influencer-uuid';
```

### Manual LoRA Override
You can always override the automatic selection by providing a `loraModel` parameter in the request.

## 🐛 Troubleshooting

### Error: "RUNPOD_ENDPOINT_URL not configured"
- Make sure your `.env` file has `RUNPOD_ENDPOINT_URL` set
- Restart your backend server after adding the variable

### Error: "Runpod API error (401)"
- Check if your endpoint requires authentication
- Add `RUNPOD_API_KEY` to your `.env` file
- Verify the API key is correct

### Error: "No image URL in Runpod response"
- Check your Runpod template's output format
- The service expects one of the formats listed in Step 2
- Enable debug logging by checking the backend console output

### Error: "Insufficient credits"
- Make sure your user has credits in the database
- Check the `users` table → `credits` column
- For testing, you can manually add credits:
  ```sql
  UPDATE users SET credits = 2000 WHERE email = 'your@email.com';
  ```

### Error: "Access token required" or "Invalid token"
- Your auth token might be expired
- Get a fresh token by logging in again
- Update the `TEST_TOKEN` in `test-runpod.js`

## 📊 Monitoring & Logs

When testing, watch your backend console for detailed logs:

```
🎨 Runpod Image Generation Request: { prompt: '...', aspectRatio: '1:1', ... }
💳 Checking credits for user abc123, cost: 5
✅ Credits deducted. New balance: 1995
🚀 Runpod Image Generation: { prompt: '...', aspectRatio: '1:1', ... }
📡 Making request to Runpod endpoint: https://...
📤 Sending request with options: { hostname: '...', port: 443, ... }
📥 Received response: { statusCode: 200, dataLength: 1234 }
📦 Parsed response: { output: { image_url: 'https://...' } }
✅ Successfully extracted image URL: https://...
✅ Runpod image generated successfully
```

## 🔐 Security Notes

- **Never commit your `.env` file** to git
- **Use environment variables** for all secrets
- **Enable API key authentication** on your Runpod endpoint in production
- **Rate limit** your endpoint to prevent abuse
- **Monitor costs** on Runpod dashboard

## 📈 Next Steps

Once testing is successful:

1. **Deploy to Production**
   - Add environment variables to your hosting platform (Render, Heroku, etc.)
   - Update `RUNPOD_ENDPOINT_URL` with your production endpoint

2. **Set up Multiple LoRA Models**
   - Create different LoRA models for each influencer
   - Store LoRA model names in the `influencers` table metadata

3. **Optimize Performance**
   - Adjust `num_inference_steps` for speed/quality tradeoff
   - Use lower values (20-25) for faster generation
   - Use higher values (30-40) for better quality

4. **Monitor Usage**
   - Track generation costs on Runpod dashboard
   - Monitor credit usage in your database
   - Set up alerts for high usage

## 💡 Tips

- **For consistent results**: Use the same seed value
- **For variety**: Leave seed as `null` (random)
- **For speed**: Lower `numInferenceSteps` to 20-25
- **For quality**: Increase `numInferenceSteps` to 30-40
- **For prompt adherence**: Increase `guidanceScale` to 8-10
- **For creative freedom**: Lower `guidanceScale` to 5-7

## 📞 Support

If you encounter issues:
1. Check the backend console logs
2. Verify your Runpod template is working (test directly on Runpod)
3. Check your environment variables
4. Review this guide thoroughly

---

**Happy Testing! 🎉**

For the official deployment, remember to:
- Use production endpoint URL
- Enable authentication
- Set up monitoring
- Configure rate limiting
- Test thoroughly before launch

