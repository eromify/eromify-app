# RunPod ComfyUI Integration - Complete

## ✅ What Was Integrated

### 1. New Service File: `backend/services/runpodService.js`
- Connects to your RunPod ComfyUI endpoint: `https://qwner9w79n2dyp-8188.proxy.runpod.net`
- Maps marketplace model IDs (1-83) to LoRA filenames (e.g., `adriana.safetensors`, `audrey.safetensors`)
- Dynamically swaps LoRAs in the ComfyUI workflow based on which influencer is selected
- Handles workflow execution, polling, and image URL extraction

### 2. Updated API Route: `/content/generate-image-runpod`
- New simplified endpoint that accepts:
  - `marketplaceModelId`: The ID from `marketplaceModels.js` (1-83)
  - `prompt`: Your image generation prompt
- Automatically:
  - Checks user credits
  - Selects the correct LoRA for the influencer
  - Generates the image
  - Returns the image URL
  - Saves to database

### 3. Test Script: `test-runpod-generation.js`
- Simple Node.js script to test the integration
- Tests with Adriana Perez (ID 19)

## 🎯 How It Works

1. **User selects an influencer** from marketplace (e.g., Audrey Sinclair, ID 1)
2. **Frontend calls** `/api/content/generate-image-runpod` with:
   ```json
   {
     "marketplaceModelId": 1,
     "prompt": "A professional photo of a woman..."
   }
   ```
3. **Backend:**
   - Maps ID 1 → `audrey.safetensors`
   - Loads your ComfyUI workflow template
   - Updates node 58 with correct LoRA
   - Updates node 46 with prompt
   - Randomizes seeds for variation
   - Sends to RunPod endpoint
   - Polls until complete
   - Returns image URL

## 📋 Influencer → LoRA Mapping

| ID | Name | LoRA File |
|----|------|-----------|
| 1 | Audrey Sinclair | audrey.safetensors |
| 2 | Mackenzie Cole | mackenzie.safetensors |
| 19 | Adriana Perez | adriana.safetensors |
| 21 | Ava Diaz | ava.safetensors |
| 22 | Riya Yasin | riya.safetensors |
| ... | ... | ... |

*(Full mapping in `runpodService.js`)*

## 🧪 Testing

### Option 1: Using the test script
```bash
cd /Users/vincentcampbell/Desktop/Eromify\ 2
node test-runpod-generation.js
```

### Option 2: Using curl (with authentication)
```bash
curl -X POST http://localhost:3000/api/content/generate-image-runpod \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "marketplaceModelId": 19,
    "prompt": "A beautiful woman with long brown hair wearing a white sweater"
  }'
```

### Option 3: From your frontend
```javascript
const response = await fetch('/api/content/generate-image-runpod', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    marketplaceModelId: 19, // Adriana Perez
    prompt: 'A professional portrait photo...'
  })
});

const data = await response.json();
console.log('Image URL:', data.image.url);
```

## 🔧 Configuration

### RunPod Endpoint
Currently set to: `https://qwner9w79n2dyp-8188.proxy.runpod.net`

To change, edit `backend/services/runpodService.js`:
```javascript
const RUNPOD_ENDPOINT = 'https://YOUR-NEW-ENDPOINT.proxy.runpod.net';
```

### Workflow Template
The system loads: `eromify-image-generation-api-endpoint.json`

This workflow includes:
- **Node 11**: Checkpoint (bigLust_v16.safetensors)
- **Node 58**: LoRA Loader (dynamically updated)
- **Node 46**: Positive Prompt (dynamically updated)
- **Node 47**: Negative Prompt
- **Nodes 7, 25, 33, 48, 50, 51**: Seeds (randomized)

## 📝 Next Steps

1. **Test the integration** using the test script
2. **Verify RunPod endpoint** is running
3. **Check LoRA files** are in Jupyter filesystem
4. **Integrate into frontend** (update UI to call new endpoint)
5. **For video generation**: Follow same pattern once we figure out the video ComfyUI export

## 🐛 Troubleshooting

### "No LoRA mapping found"
- Check that the marketplace model ID exists in `INFLUENCER_LORA_MAP`
- IDs should match those in `frontend/src/data/marketplaceModels.js`

### "RunPod endpoint timeout"
- Check that your RunPod pod is running
- Verify the proxy URL is correct
- Check ComfyUI is loaded and ready

### "No prompt_id returned"
- RunPod endpoint might not be responding correctly
- Check the endpoint format matches ComfyUI API

### Image not found in outputs
- Workflow might have changed
- Check which nodes are configured as output nodes (SaveImage/PreviewImage)

## ✨ What's Different from Replicate

- **No content moderation** - Your own pod, your own rules
- **Custom LoRAs** - Each influencer has their own trained model
- **Full control** - Modify workflow, parameters, everything
- **Cost effective** - Pay for pod time, not per generation

## 🎉 Summary

✅ RunPod ComfyUI integrated
✅ All 80+ influencers mapped to LoRAs  
✅ API endpoint ready
✅ Test script provided
✅ Kept it simple (no crazy code changes like yesterday!)

**Ready to test!** 🚀

