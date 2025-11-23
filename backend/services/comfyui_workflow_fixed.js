// Fixed ComfyUI workflow with explicit connections (no "Anything Everywhere" nodes)
// This matches your original workflow but with proper API connections

function buildFixedWorkflow({ prompt, negativePrompt, resolution, loraModel, numInferenceSteps, guidanceScale, seed }) {
  return {
    // Core nodes
    "11": {
      "inputs": {
        "ckpt_name": "bigLust_v16.safetensors"
      },
      "class_type": "CheckpointLoaderSimple",
      "_meta": { "title": "Load Checkpoint" }
    },
    "58": {
      "inputs": {
        "lora_name": loraModel || "bria.safetensors",
        "strength_model": 1,
        "strength_clip": 1,
        "model": ["11", 0],
        "clip": ["11", 1]
      },
      "class_type": "LoraLoader",
      "_meta": { "title": "Load LoRA" }
    },
    
    // Text encoding
    "46": {
      "inputs": {
        "text": prompt,
        "clip": ["58", 1]
      },
      "class_type": "CLIPTextEncode",
      "_meta": { "title": "Positive Prompt" }
    },
    "47": {
      "inputs": {
        "text": negativePrompt || "text, watermark",
        "clip": ["58", 1]
      },
      "class_type": "CLIPTextEncode",
      "_meta": { "title": "Negative Prompt" }
    },
    
    // Resolution setup
    "43": {
      "inputs": {
        "resolution": resolution.name
      },
      "class_type": "SDXL Resolutions (JPS)",
      "_meta": { "title": "SDXL Resolutions (JPS)" }
    },
    "42": {
      "inputs": {
        "width": ["43", 0],
        "height": ["43", 1],
        "batch_size": 1
      },
      "class_type": "EmptyLatentImage",
      "_meta": { "title": "Empty Latent Image" }
    },
    
    // Main sampling
    "33": {
      "inputs": {
        "seed": seed,
        "steps": numInferenceSteps,
        "cfg": guidanceScale,
        "sampler_name": "dpmpp_sde",
        "scheduler": "karras",
        "denoise": 1,
        "model": ["58", 0],  // From LoRA
        "positive": ["46", 0],
        "negative": ["47", 0],
        "latent_image": ["42", 0]
      },
      "class_type": "KSampler",
      "_meta": { "title": "KSampler" }
    },
    
    // VAE Decode
    "35": {
      "inputs": {
        "samples": ["33", 0],
        "vae": ["11", 2]  // From checkpoint
      },
      "class_type": "VAEDecode",
      "_meta": { "title": "VAE Decode" }
    },
    
    // Preview Image (output)
    "34": {
      "inputs": {
        "images": ["35", 0]
      },
      "class_type": "PreviewImage",
      "_meta": { "title": "Preview Image" }
    }
  };
}

module.exports = { buildFixedWorkflow };

