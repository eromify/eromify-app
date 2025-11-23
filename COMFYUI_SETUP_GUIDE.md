# ComfyUI on Runpod - Complete Setup Guide

## 🎯 Overview

You have ComfyUI running on Runpod at: `https://6sls4etwt4drfd-8188.proxy.runpod.net/`

This guide will help you integrate it with Eromify so users can generate images dynamically.

## 📋 What You Need

1. ✅ ComfyUI running on Runpod (you have this!)
2. ✅ Your workflow with LoRA models loaded
3. ⏳ Export your workflow in API format
4. ⏳ Configure the backend

---

## Step 1: Export Your ComfyUI Workflow

### 1.1 Open Your Workflow in ComfyUI

Go to: `https://6sls4etwt4drfd-8188.proxy.runpod.net/`

Make sure your workflow has:
- ✅ A text input node for the **positive prompt**
- ✅ A text input node for the **negative prompt**
- ✅ An Empty Latent Image node for **width/height**
- ✅ A KSampler node with **steps**, **cfg**, **seed**
- ✅ Optional: LoRA Loader node for influencer models
- ✅ A SaveImage node for the output

### 1.2 Save Workflow in API Format

1. In ComfyUI, click the **"Save (API Format)"** button (gear icon → Save (API Format))
2. This downloads a JSON file with your workflow
3. Open the JSON file - it will look something like this:

```json
{
  "3": {
    "inputs": {
      "seed": 12345,
      "steps": 28,
      "cfg": 7.5,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 1,
      "model": ["4", 0],
      "positive": ["6", 0],
      "negative": ["7", 0],
      "latent_image": ["5", 0]
    },
    "class_type": "KSampler"
  },
  "4": {
    "inputs": {
      "ckpt_name": "model.safetensors"
    },
    "class_type": "CheckpointLoaderSimple"
  },
  "5": {
    "inputs": {
      "width": 1024,
      "height": 1024,
      "batch_size": 1
    },
    "class_type": "EmptyLatentImage"
  },
  "6": {
    "inputs": {
      "text": "beautiful woman, professional photo",
      "clip": ["4", 1]
    },
    "class_type": "CLIPTextEncode"
  },
  "7": {
    "inputs": {
      "text": "ugly, blurry, low quality",
      "clip": ["4", 1]
    },
    "class_type": "CLIPTextEncode"
  },
  "8": {
    "inputs": {
      "samples": ["3", 0],
      "vae": ["4", 2]
    },
    "class_type": "VAEDecode"
  },
  "9": {
    "inputs": {
      "filename_prefix": "eromify",
      "images": ["8", 0]
    },
    "class_type": "SaveImage"
  }
}
```

### 1.3 Identify the Node IDs

From your workflow JSON, identify:
- **KSampler node ID** (usually "3") - controls steps, cfg, seed
- **Empty Latent Image node ID** (usually "5") - controls width, height
- **Positive prompt node ID** (usually "6") - for the main prompt
- **Negative prompt node ID** (usually "7") - for negative prompt
- **LoRA Loader node ID** (if you have one) - for influencer models
- **SaveImage node ID** (usually "9") - for the output

---

## Step 2: Update the ComfyUI Service

### 2.1 Open the Service File

Open: `backend/services/comfyuiService.js`

### 2.2 Replace the `buildComfyUIWorkflow` Function

Find the `buildComfyUIWorkflow` function (around line 118) and replace the entire workflow object with YOUR workflow JSON.

**Important:** Make these fields dynamic:

```javascript
function buildComfyUIWorkflow({ prompt, negativePrompt, resolution, loraModel, numInferenceSteps, guidanceScale, seed }) {
  const workflow = {
    // YOUR WORKFLOW JSON HERE - but replace these values:
    
    "3": {  // Your KSampler node
      "inputs": {
        "seed": seed,  // ← Dynamic
        "steps": numInferenceSteps,  // ← Dynamic
        "cfg": guidanceScale,  // ← Dynamic
        // ... rest of your inputs
      }
    },
    
    "5": {  // Your Empty Latent Image node
      "inputs": {
        "width": resolution.width,  // ← Dynamic
        "height": resolution.height,  // ← Dynamic
        // ... rest of your inputs
      }
    },
    
    "6": {  // Your positive prompt node
      "inputs": {
        "text": prompt,  // ← Dynamic
        // ... rest of your inputs
      }
    },
    
    "7": {  // Your negative prompt node
      "inputs": {
        "text": negativePrompt || "ugly, blurry, low quality",  // ← Dynamic
        // ... rest of your inputs
      }
    }
    
    // ... rest of your workflow nodes
  };

  // If LoRA model is specified, add/modify the LoRA loader node
  if (loraModel) {
    workflow["10"] = {  // Or your actual LoRA Loader node ID
      "inputs": {
        "lora_name": loraModel,  // ← Dynamic
        "strength_model": 1.0,
        "strength_clip": 1.0,
        // ... connect to your model and clip
      },
      "class_type": "LoraLoader"
    };
  }

  return workflow;
}
```

### 2.3 Update the SaveImage Node ID

Find the `pollForComfyUICompletion` function (around line 186) and update the SaveImage node ID:

```javascript
// Change "9" to your actual SaveImage node ID
const saveImageNode = outputs["9"] || outputs[Object.keys(outputs)[0]];
```

---

## Step 3: Configure Environment Variables

### 3.1 Update Your `.env` File

Add this to `backend/.env`:

```bash
# ComfyUI Configuration
COMFYUI_URL=https://6sls4etwt4drfd-8188.proxy.runpod.net
```

Or you can use the existing `RUNPOD_ENDPOINT_URL`:

```bash
# Runpod/ComfyUI Configuration
RUNPOD_ENDPOINT_URL=https://6sls4etwt4drfd-8188.proxy.runpod.net
```

**Note:** You DON'T need `RUNPOD_API_KEY` for ComfyUI - it doesn't use API keys by default.

---

## Step 4: Test the Integration

### 4.1 Start Your Backend

```bash
cd backend
npm run dev
```

### 4.2 Get Your Auth Token

**Login to get your Eromify auth token:**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

Copy the token from the response.

### 4.3 Test Image Generation

```bash
curl -X POST http://localhost:3001/api/content/generate-image-comfyui \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "beautiful woman, professional photo, high quality",
    "aspectRatio": "1:1",
    "numInferenceSteps": 28,
    "guidanceScale": 7.5
  }'
```

### 4.4 Check the Logs

Watch your backend console for logs:

```
🎨 ComfyUI Image Generation Request: { prompt: '...', aspectRatio: '1:1', ... }
💳 Checking credits for user abc123, cost: 5
✅ Credits deducted. New balance: 1995
🎨 ComfyUI Image Generation: { prompt: '...', aspectRatio: '1:1', ... }
📋 ComfyUI Workflow: { ... }
📡 Queueing workflow at: https://6sls4etwt4drfd-8188.proxy.runpod.net/prompt
📤 ComfyUI Request: { method: 'POST', endpoint: '...', hasData: true }
📥 ComfyUI Response: { statusCode: 200, dataLength: 123 }
📤 Workflow queued with prompt_id: abc-123-def
⏳ Polling ComfyUI for completion...
✅ ComfyUI image generated successfully: https://...
```

---

## Step 5: Configure LoRA Models

### 5.1 Add LoRA Models to Your Workflow

1. In ComfyUI, add a **LoRA Loader** node
2. Connect it between your Checkpoint Loader and KSampler
3. Note the node ID
4. Save the workflow in API format again

### 5.2 Store LoRA Model Names in Database

For each influencer, store the LoRA model name:

```sql
-- Update influencer with LoRA model
UPDATE influencers 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{lora_model}',
  '"influencer_lora_v1"'
)
WHERE id = 'your-influencer-uuid';
```

### 5.3 Test with LoRA

```bash
curl -X POST http://localhost:3001/api/content/generate-image-comfyui \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "professional photoshoot",
    "aspectRatio": "9:16",
    "loraModel": "influencer_lora_v1"
  }'
```

---

## 📊 Supported Aspect Ratios

Your ComfyUI workflow supports these (from the screenshot):

| Aspect Ratio | Resolution | Name in ComfyUI |
|--------------|------------|-----------------|
| `"1:1"` | 1024×1024 | square - 1024x1024 (1:1) |
| `"4:3"` | 1152×896 | landscape - 1152x896 (4:3) |
| `"3:2"` | 1216×832 | landscape - 1216x832 (3:2) |
| `"16:9"` | 1344×768 | landscape - 1344x768 (16:9) |
| `"21:9"` | 1536×640 | landscape - 1536x640 (21:9) |
| `"3:4"` | 896×1152 | portrait - 896x1152 (3:4) |
| `"2:3"` | 832×1216 | portrait - 832x1216 (2:3) |
| `"9:16"` | 768×1344 | portrait - 768x1344 (9:16) |
| `"9:21"` | 640×1536 | portrait - 640x1536 (9:21) |

---

## 🔧 API Endpoint

```
POST /api/content/generate-image-comfyui
```

**Required:**
- `Authorization: Bearer YOUR_EROMIFY_TOKEN` (header)
- `prompt` (body) - The text prompt

**Optional:**
- `aspectRatio` - One of: `"1:1"`, `"16:9"`, `"9:16"`, `"2:3"`, `"3:2"`, etc.
- `loraModel` - Name of LoRA model file (e.g., `"influencer_lora_v1"`)
- `influencerId` - UUID of influencer (auto-selects LoRA)
- `numInferenceSteps` - 20-50 (default: 28)
- `guidanceScale` - 5-15 (default: 7.5)
- `seed` - For reproducible results
- `negativePrompt` - What to avoid

---

## 🐛 Troubleshooting

### "COMFYUI_URL not configured"
➡️ Add `COMFYUI_URL` or `RUNPOD_ENDPOINT_URL` to your `.env`:
```bash
COMFYUI_URL=https://6sls4etwt4drfd-8188.proxy.runpod.net
```

### "ComfyUI API error (404)"
➡️ Your endpoint URL might be wrong. Make sure it's:
- ✅ `https://6sls4etwt4drfd-8188.proxy.runpod.net` (without `/prompt`)
- ❌ NOT: `https://6sls4etwt4drfd-8188.proxy.runpod.net/prompt`

The service automatically adds `/prompt` to the URL.

### "ComfyUI workflow failed"
➡️ Check your workflow JSON:
1. Make sure all node connections are correct
2. Verify your model file exists in ComfyUI
3. Test the workflow manually in ComfyUI first

### "No image URL in response"
➡️ Update the SaveImage node ID in `pollForComfyUICompletion`:
```javascript
const saveImageNode = outputs["YOUR_ACTUAL_NODE_ID"];
```

### "Access token required"
➡️ This is your **Eromify backend** token, not Runpod:
```bash
# Login to YOUR backend
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

---

## 📝 Summary

**What is what:**

1. **ComfyUI URL** = `https://6sls4etwt4drfd-8188.proxy.runpod.net`
   - This is your Runpod ComfyUI instance
   - No API key needed

2. **Eromify Auth Token** = Login token for YOUR backend
   - Get it by logging into your Eromify app
   - Used in: `Authorization: Bearer TOKEN`

3. **LoRA Models** = Your influencer-specific models
   - Stored in ComfyUI's `models/loras/` folder
   - Referenced by filename (e.g., `"influencer_lora_v1.safetensors"`)

---

## 🚀 Quick Start Commands

```bash
# 1. Add to .env
echo "COMFYUI_URL=https://6sls4etwt4drfd-8188.proxy.runpod.net" >> backend/.env

# 2. Start backend
cd backend && npm run dev

# 3. Login to get token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# 4. Test image generation (replace YOUR_TOKEN)
curl -X POST http://localhost:3001/api/content/generate-image-comfyui \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "beautiful woman, professional photo",
    "aspectRatio": "1:1"
  }'
```

---

## 📞 Need Help?

1. Export your workflow in API format from ComfyUI
2. Share the workflow JSON
3. Check backend logs for error messages
4. Make sure ComfyUI is accessible at the URL

---

**Ready to integrate! 🎉**

