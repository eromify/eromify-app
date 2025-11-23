# Local Testing Guide for Replicate & Runway

## Prerequisites
- Backend server running on `http://localhost:3001`
- Frontend server running on `http://localhost:5174`
- API keys configured in `backend/.env`:
  - `REPLICATE_API_TOKEN` ✓
  - `RUNWAY_API_KEY` ✓
- Development mode configured (credit checks are bypassed for testing)
- **IMPORTANT**: Replicate account needs to have credit/billing set up for testing. Add a payment method at https://replicate.com/account/billing

## Step-by-Step Testing

### 1. Open the Application
Navigate to: **http://localhost:5174**

### 2. Register/Login
- Click "Register" if you don't have an account
- Fill in:
  - Email: `test@example.com`
  - Password: `test123456`
  - Full Name: `Test User`
- Click "Create Account"

### 3. Create an Influencer (Required for Image Generation)
After registration/onboarding:
- Go to **"Influencers"** in the sidebar
- Click **"Create Influencer"**
- Fill in:
  - Name: `Test Influencer`
  - Niche: `Fashion`
  - Description: `AI fashion influencer`
  - Personality: `Trendy and confident`
  - Target Audience: `18-35 fashion enthusiasts`
  - Content Style: `Modern and stylish`
- Upload a face image (optional, for face consistency)
- Click **"Create"**

### 4. Test Replicate Image Generation

#### Via Frontend UI:
1. Go to **"Generate"** in the sidebar (Sparkles icon)
2. Select your influencer
3. Enter a prompt, e.g.: `Beautiful woman in a red dress on a beach at sunset`
4. Choose a style: `Photorealistic`
5. Click **"Generate Image (10 credits)"**
6. Wait 20-60 seconds for generation
7. View and download the generated image

#### Via API directly:
```bash
# First, login to get a token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'

# Replace YOUR_TOKEN and INFLUENCER_ID below
curl -X POST http://localhost:3001/api/content/generate-image \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "influencerId": "INFLUENCER_ID",
    "prompt": "Beautiful woman in a red dress on a beach at sunset",
    "style": "photorealistic"
  }'
```

### 5. Test Runway Video Generation

#### Via Frontend UI:
1. First, generate an image (Step 4 above)
2. Go to **"Generate Video"** in the sidebar (Video icon)
3. Paste the image URL you generated
4. Enter a motion prompt, e.g.: `Gentle breeze moving through hair, camera slowly zooming out`
5. Click **"Generate Video"**
6. Wait 30-120 seconds for generation
7. Video status will update automatically
8. Download the video when ready

#### Via API directly:
```bash
# Generate video from image
curl -X POST http://localhost:3001/api/content/generate-video \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "imageUrl": "https://replicate.delivery/pbxt/...your-image-url",
    "prompt": "Gentle breeze moving through hair",
    "duration": 5
  }'

# Check video status
curl -X GET http://localhost:3001/api/content/video-status/JOB_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Other Features to Test

#### Image Upscaling:
1. Go to **"Upscale"** in the sidebar
2. Upload or paste an image URL
3. Select scale (2x or 4x)
4. Click **"Upscale Image"**

#### Image Editing:
1. Go to **"Edit Image"** in the sidebar
2. Upload an image
3. Enter editing instructions
4. Click **"Edit Image"**

## API Models Used

### Replicate:
- **PhotoMaker** (`tencentarc/photomaker:6c59992c...`): Face-consistent image generation
- **SDXL** (`stability-ai/sdxl:39ed52f2...`): Standard image generation
- **IP-Adapter Face ID Plus** (`fofr/sdxl-ip-adapter-face-id-plus`): Alternative face consistency

### Runway:
- **Gen-3 Alpha**: Image-to-video generation
- Endpoint: `/generations/image-to-video`

## Expected Costs

- **Image Generation**: ~10 credits
- **Video Generation**: ~50 credits (5 seconds)
- Check your credits balance in **"Get Credits"** page

## Troubleshooting

### Backend not starting:
```bash
# Check if port is in use
lsof -i:3001

# Kill existing process
lsof -ti:3001 | xargs kill -9

# Restart backend
cd backend && npm run dev
```

### API errors:
- Check `backend/.env` has valid API keys
- Check backend terminal for error logs
- Verify Supabase connection in backend logs

### Credits issues:
- Free tier has limited credits
- Register for more or add credits manually in database
- Check `subscriptions` table in Supabase

## Logs to Monitor

**Backend terminal** will show:
- Replicate/Runway API calls
- Generation progress
- Errors and warnings

**Browser console** will show:
- Frontend API requests
- Response data
- Any client-side errors

## Next Steps

After successful local testing:
1. Test in production environment
2. Monitor API costs
3. Optimize generation parameters
4. Add caching for generated content
5. Implement webhooks for async generation

