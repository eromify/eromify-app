# ComfyUI Integration - Quick Start

## 🎯 Your ComfyUI URL
```
https://6sls4etwt4drfd-8188.proxy.runpod.net
```

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Export Your ComfyUI Workflow

1. Go to ComfyUI: `https://6sls4etwt4drfd-8188.proxy.runpod.net`
2. Click: **Settings (⚙️) → Save (API Format)**
3. Save the JSON file

### Step 2: Configure Backend

Add to `backend/.env`:
```bash
COMFYUI_URL=https://6sls4etwt4drfd-8188.proxy.runpod.net
```

Update `backend/services/comfyuiService.js`:
- Replace the workflow in `buildComfyUIWorkflow()` with YOUR workflow JSON
- Make these dynamic: `prompt`, `negativePrompt`, `width`, `height`, `steps`, `cfg`, `seed`

### Step 3: Test It

```bash
# Start backend
cd backend && npm run dev

# Login to get YOUR Eromify auth token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# Test generation (replace YOUR_TOKEN)
curl -X POST http://localhost:3001/api/content/generate-image-comfyui \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "beautiful woman, professional photo",
    "aspectRatio": "1:1"
  }'
```

---

## 🎨 Supported Aspect Ratios

Your workflow supports:
- `"1:1"` → 1024×1024 (square)
- `"16:9"` → 1344×768 (landscape)
- `"9:16"` → 768×1344 (portrait/stories)
- `"2:3"` → 832×1216 (portrait)
- `"3:2"` → 1216×832 (landscape)
- `"4:3"` → 1152×896 (landscape)
- `"3:4"` → 896×1152 (portrait)
- `"21:9"` → 1536×640 (ultrawide)
- `"9:21"` → 640×1536 (ultra portrait)

---

## 💡 Key Points

### Two Different Tokens:

1. **Eromify Auth Token** (what I meant):
   - For YOUR backend authentication
   - Get it by logging into YOUR Eromify app
   - Used in API requests: `Authorization: Bearer TOKEN`

2. **Runpod API Key** (you DON'T need this):
   - ComfyUI doesn't use API keys
   - No authentication needed for your ComfyUI URL

### URLs:

- **ComfyUI UI**: `https://6sls4etwt4drfd-8188.proxy.runpod.net` ✅
- **API adds /prompt**: Service auto-adds this ✅
- **Don't add /prompt yourself**: Just use base URL ✅

---

## 🔧 Example Request

```bash
POST /api/content/generate-image-comfyui
Authorization: Bearer YOUR_EROMIFY_TOKEN
Content-Type: application/json

{
  "prompt": "beautiful woman at beach, sunset, professional photography",
  "aspectRatio": "9:16",
  "loraModel": "influencer_lora_v1",
  "numInferenceSteps": 28,
  "guidanceScale": 7.5,
  "seed": 12345
}
```

**Response:**
```json
{
  "success": true,
  "image": {
    "url": "https://6sls4etwt4drfd-8188.proxy.runpod.net/view?filename=...",
    "creditsUsed": 5,
    "creditsRemaining": 1995
  }
}
```

---

## 🐛 Common Issues

**"COMFYUI_URL not configured"**
```bash
echo "COMFYUI_URL=https://6sls4etwt4drfd-8188.proxy.runpod.net" >> backend/.env
```

**"Access token required"**
```bash
# Login to YOUR backend first
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

**"Insufficient credits"**
```sql
-- Add credits to your test user
UPDATE users SET credits = 2000 WHERE email = 'your@email.com';
```

---

## 📚 Full Documentation

For detailed setup: **`COMFYUI_SETUP_GUIDE.md`**

---

**You're ready! 🚀**

