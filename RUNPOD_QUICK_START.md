# Runpod Image Generation - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Add Environment Variables

Create or edit `backend/.env`:

```bash
RUNPOD_ENDPOINT_URL=https://your-endpoint-id.proxy.runpod.net
RUNPOD_API_KEY=your_api_key  # Optional
```

### Step 2: Start Backend

```bash
cd backend
npm run dev
```

### Step 3: Get Auth Token

**Option A - Login via API:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

**Option B - From Browser:**
1. Login to your app
2. Open DevTools (F12) → Network tab
3. Copy Bearer token from any API request

### Step 4: Test the API

**Quick Test with curl:**
```bash
curl -X POST http://localhost:3001/api/content/generate-image-runpod \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "beautiful woman, professional photo, high quality",
    "aspectRatio": "1:1"
  }'
```

**Or use the test script:**
```bash
# Edit the script and add your token
nano backend/test-runpod.js  # Update TEST_TOKEN

# Run it
node backend/test-runpod.js
```

**Or use the shell script:**
```bash
# Edit and add your token
nano RUNPOD_TEST_EXAMPLES.sh  # Update TOKEN variable

# Run a test
./RUNPOD_TEST_EXAMPLES.sh test_simple
```

**Or use Postman:**
1. Import `Runpod_Image_Generation.postman_collection.json`
2. Set `AUTH_TOKEN` variable
3. Run any request

## 📝 API Endpoint

```
POST /api/content/generate-image-runpod
```

**Required:**
- `prompt` (string) - What you want to generate

**Optional:**
- `aspectRatio` (string) - "1:1", "16:9", "9:16", "2:3", "3:2", "4:5", "5:4", "4:3", "3:4"
- `loraModel` (string) - Specific LoRA model name
- `influencerId` (string) - UUID of influencer (auto-selects LoRA)
- `numInferenceSteps` (number) - 20-50 (default: 28)
- `guidanceScale` (number) - 5-15 (default: 7.5)
- `seed` (number) - For reproducible results
- `negativePrompt` (string) - What to avoid

## 🎨 Example Requests

### 1. Simple Portrait
```json
{
  "prompt": "beautiful woman, professional photo",
  "aspectRatio": "1:1"
}
```

### 2. With LoRA Model
```json
{
  "prompt": "fashion influencer, professional photoshoot",
  "aspectRatio": "9:16",
  "loraModel": "influencer_lora_v1"
}
```

### 3. Reproducible (with seed)
```json
{
  "prompt": "stunning woman, beach sunset",
  "aspectRatio": "16:9",
  "seed": 12345
}
```

### 4. High Quality
```json
{
  "prompt": "professional headshot, studio lighting",
  "aspectRatio": "2:3",
  "numInferenceSteps": 40,
  "guidanceScale": 9.0
}
```

## ✅ Success Response

```json
{
  "success": true,
  "message": "Image generated successfully with Runpod",
  "image": {
    "url": "https://your-image-url.png",
    "creditsUsed": 5,
    "creditsRemaining": 1995,
    "metadata": {
      "prompt": "...",
      "aspectRatio": "1:1",
      "generationService": "runpod",
      "generatedAt": "2025-11-21T18:30:00.000Z"
    }
  }
}
```

## ❌ Error Response

```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🔧 Supported Aspect Ratios

| Ratio | Dimensions | Best For |
|-------|------------|----------|
| 1:1   | 1024x1024  | Instagram Posts, Profile Pictures |
| 16:9  | 1344x768   | YouTube Thumbnails, Landscape |
| 9:16  | 768x1344   | Instagram Stories, TikTok, Reels |
| 2:3   | 768x1152   | Pinterest, Portraits |
| 3:2   | 1152x768   | Photography, Wide Shots |
| 4:5   | 896x1120   | Instagram Posts (Portrait) |
| 5:4   | 1120x896   | Instagram Posts (Landscape) |
| 4:3   | 1024x768   | Traditional Photography |
| 3:4   | 768x1024   | Traditional Portraits |

## 🐛 Common Issues

### "RUNPOD_ENDPOINT_URL not configured"
➡️ Add `RUNPOD_ENDPOINT_URL` to your `.env` file and restart backend

### "Access token required" or "Invalid token"
➡️ Get a fresh auth token using the login endpoint

### "Insufficient credits"
➡️ Add credits to your test user:
```sql
UPDATE users SET credits = 2000 WHERE email = 'your@email.com';
```

### "Runpod API error (401)"
➡️ Add `RUNPOD_API_KEY` to your `.env` file if your endpoint requires auth

### "No image URL in Runpod response"
➡️ Check your Runpod template's output format (see full guide)

## 📚 Full Documentation

For complete documentation, see:
- `RUNPOD_SETUP_GUIDE.md` - Comprehensive setup guide
- `backend/services/runpodService.js` - Service implementation
- `backend/routes/content.js` - API endpoint code

## 🎯 Quick Tips

- **For speed**: Use `numInferenceSteps: 20`
- **For quality**: Use `numInferenceSteps: 40`
- **For consistency**: Use same `seed` value
- **For variety**: Don't specify `seed`

## 📞 Need Help?

1. Check backend console logs for detailed error messages
2. Test your Runpod endpoint directly on Runpod dashboard
3. Verify environment variables are set correctly
4. Read the full setup guide: `RUNPOD_SETUP_GUIDE.md`

---

**Ready to go! 🎉**

Your Runpod integration is set up and ready for local testing. Once everything works locally, you can deploy to production by updating the environment variables on your hosting platform.

