# 🎉 Runpod ComfyUI Integration - Setup Summary

## ✅ What I Built For You

I've created a complete integration between your Eromify backend and your ComfyUI instance running on Runpod.

---

## 📦 Files Created

### **Core Integration:**
1. **`backend/services/comfyuiService.js`** - ComfyUI API integration
2. **`backend/services/runpodService.js`** - Alternative Runpod REST API integration
3. **`backend/routes/content.js`** - Updated with 2 new endpoints

### **Documentation:**
4. **`COMFYUI_SETUP_GUIDE.md`** - Complete ComfyUI setup guide
5. **`COMFYUI_QUICK_START.md`** - Quick 3-step setup
6. **`RUNPOD_SETUP_GUIDE.md`** - Generic Runpod API guide
7. **`RUNPOD_QUICK_START.md`** - Quick Runpod reference
8. **`SETUP_SUMMARY.md`** - This file!

### **Testing Tools:**
9. **`backend/test-runpod.js`** - Node.js test script
10. **`RUNPOD_TEST_EXAMPLES.sh`** - Shell script with curl examples
11. **`Runpod_Image_Generation.postman_collection.json`** - Postman collection

---

## 🎯 Your Situation

### What You Have:
- ✅ **ComfyUI** running on Runpod at: `https://6sls4etwt4drfd-8188.proxy.runpod.net`
- ✅ **LoRA models** of all your influencers loaded in ComfyUI
- ✅ **Workflow** with dynamic prompt & aspect ratio support

### What You Need:
1. Export your ComfyUI workflow in API format
2. Configure the backend with your workflow
3. Test the integration locally

---

## 🚀 Quick Start (3 Steps)

### **Step 1: Add URL to .env**

```bash
cd backend
echo "COMFYUI_URL=https://6sls4etwt4drfd-8188.proxy.runpod.net" >> .env
```

### **Step 2: Export Your Workflow**

1. Go to: `https://6sls4etwt4drfd-8188.proxy.runpod.net`
2. Click: **Settings (⚙️) → Save (API Format)**
3. Open the downloaded JSON file
4. Edit `backend/services/comfyuiService.js`
5. Replace the workflow in `buildComfyUIWorkflow()` function (line ~118)
6. Make sure these are dynamic:
   - `prompt` (positive prompt text)
   - `negativePrompt` (negative prompt text)
   - `resolution.width` and `resolution.height`
   - `numInferenceSteps` (steps)
   - `guidanceScale` (cfg)
   - `seed`
   - `loraModel` (if using LoRA)

### **Step 3: Test It**

```bash
# Start backend
npm run dev

# In another terminal, login to get YOUR auth token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# Test image generation (replace YOUR_TOKEN)
curl -X POST http://localhost:3001/api/content/generate-image-comfyui \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "beautiful woman, professional photo, high quality",
    "aspectRatio": "1:1"
  }'
```

---

## 🔑 Understanding the Tokens

### **Token #1: Eromify Auth Token** (What I Meant)

- **What**: Your backend authentication token
- **Purpose**: Authenticate users in YOUR Eromify app
- **Where**: Get it by logging into your Eromify backend
- **How**: `curl -X POST http://localhost:3001/api/auth/login ...`
- **Used in**: `Authorization: Bearer YOUR_EROMIFY_TOKEN`

**This has NOTHING to do with Runpod/ComfyUI!**

### **Token #2: Runpod API Key** (You DON'T Need This)

- **What**: Runpod authentication key
- **Purpose**: For Runpod serverless endpoints with auth
- **Do you need it?**: ❌ NO - ComfyUI doesn't use API keys
- **Skip**: You don't need this for ComfyUI

---

## 🎨 Your Aspect Ratios

Your ComfyUI workflow supports these (from your screenshot):

| API Input | Resolution | ComfyUI Name |
|-----------|------------|--------------|
| `"1:1"` | 1024×1024 | square - 1024x1024 (1:1) |
| `"4:3"` | 1152×896 | landscape - 1152x896 (4:3) |
| `"3:2"` | 1216×832 | landscape - 1216x832 (3:2) |
| `"16:9"` | 1344×768 | landscape - 1344x768 (16:9) |
| `"21:9"` | 1536×640 | landscape - 1536x640 (21:9) |
| `"3:4"` | 896×1152 | portrait - 896x1152 (3:4) |
| `"2:3"` | 832×1216 | portrait - 832x1216 (2:3) |
| `"9:16"` | 768×1344 | portrait - 768x1344 (9:16) |
| `"9:21"` | 640×1536 | portrait - 640x1536 (9:21) |

The integration automatically converts aspect ratios to the correct resolution!

---

## 📡 API Endpoints

### **Option 1: ComfyUI (Recommended)**
```
POST /api/content/generate-image-comfyui
```
✅ Works directly with your ComfyUI instance
✅ Supports all your aspect ratios
✅ Supports dynamic prompts and LoRA models

### **Option 2: Generic Runpod**
```
POST /api/content/generate-image-runpod
```
⚠️ For custom Runpod serverless endpoints (not ComfyUI)

---

## 🧪 Example Request

```bash
curl -X POST http://localhost:3001/api/content/generate-image-comfyui \
  -H "Authorization: Bearer YOUR_EROMIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "beautiful woman at beach, sunset, professional photography",
    "aspectRatio": "9:16",
    "loraModel": "influencer_model_v1",
    "numInferenceSteps": 28,
    "guidanceScale": 7.5,
    "seed": 12345,
    "negativePrompt": "ugly, blurry, low quality"
  }'
```

**Parameters:**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `prompt` | ✅ Yes | - | Text description of image |
| `aspectRatio` | No | `"1:1"` | See table above for options |
| `loraModel` | No | `null` | LoRA model filename |
| `influencerId` | No | `null` | UUID to auto-select LoRA |
| `numInferenceSteps` | No | `28` | Quality vs speed (20-50) |
| `guidanceScale` | No | `7.5` | Prompt adherence (5-15) |
| `seed` | No | random | For reproducible results |
| `negativePrompt` | No | `""` | Things to avoid |

---

## 💡 Key Features

✅ **Dynamic Prompts** - Users can input any text
✅ **9 Aspect Ratios** - Matching your ComfyUI workflow exactly
✅ **LoRA Support** - Connect specific models to influencers
✅ **Reproducible** - Use seeds for consistent results
✅ **Credit System** - Integrated with your existing credits (5 credits per image)
✅ **Database Logging** - All generations saved automatically
✅ **Negative Prompts** - Avoid unwanted elements

---

## 🗂️ LoRA Model Setup

### Store LoRA in Database:

```sql
UPDATE influencers 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{lora_model}',
  '"influencer_lora_v1"'
)
WHERE id = 'your-influencer-uuid';
```

### Use in API:

```bash
# Option A: Specify LoRA directly
{
  "prompt": "...",
  "loraModel": "influencer_lora_v1"
}

# Option B: Auto-select via influencer
{
  "prompt": "...",
  "influencerId": "uuid-here"  // Auto-loads LoRA from database
}
```

---

## 🐛 Common Issues & Solutions

### ❌ "COMFYUI_URL not configured"
```bash
# Add to .env
echo "COMFYUI_URL=https://6sls4etwt4drfd-8188.proxy.runpod.net" >> backend/.env
```

### ❌ "Access token required"
```bash
# This is YOUR Eromify token - login first
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

### ❌ "Insufficient credits"
```sql
-- Add credits to test user
UPDATE users SET credits = 2000 WHERE email = 'your@email.com';
```

### ❌ "ComfyUI API error (404)"
- Make sure URL is: `https://6sls4etwt4drfd-8188.proxy.runpod.net`
- DON'T add `/prompt` (service adds it automatically)

### ❌ "No image URL in response"
- Update SaveImage node ID in `pollForComfyUICompletion` function
- Check your workflow JSON structure

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **`COMFYUI_QUICK_START.md`** | 3-step quick setup |
| **`COMFYUI_SETUP_GUIDE.md`** | Complete ComfyUI guide |
| **`RUNPOD_QUICK_START.md`** | Generic Runpod reference |
| **`RUNPOD_SETUP_GUIDE.md`** | Generic Runpod full guide |

---

## ✅ Next Steps

1. **Export Workflow** - Save your ComfyUI workflow in API format
2. **Update Service** - Replace workflow in `comfyuiService.js`
3. **Test Locally** - Use the quick start commands above
4. **Add LoRA Models** - Store model names in database
5. **Deploy** - Add `COMFYUI_URL` to production env vars

---

## 🎯 Summary

**What is what:**

1. **ComfyUI URL** = `https://6sls4etwt4drfd-8188.proxy.runpod.net`
   - Your Runpod ComfyUI instance
   - No API key needed

2. **Eromify Auth Token** = Your backend login token
   - Get it by logging into YOUR Eromify app
   - Used in API calls: `Authorization: Bearer TOKEN`

3. **Workflow JSON** = Your ComfyUI workflow structure
   - Export from ComfyUI in API format
   - Paste into `comfyuiService.js`

4. **LoRA Models** = Influencer-specific models
   - Store filenames in database
   - Auto-loaded when generating images

---

## 🎉 You're All Set!

Everything is ready for local testing. Just:
1. Add the URL to `.env`
2. Export & configure your workflow
3. Test with curl or Postman

**For questions, check the guides or watch the backend console logs!**

---

**Happy Generating! 🚀**

