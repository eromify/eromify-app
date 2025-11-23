/**
 * Test script for RunPod ComfyUI image generation
 * 
 * Usage: node test-runpod-generation.js
 * 
 * This will test generating an image with Adriana Perez (ID 19)
 */

const { generateImageWithRunPod } = require('./backend/services/runpodService');

async function testImageGeneration() {
  try {
    console.log('🧪 Testing RunPod ComfyUI Integration...\n');
    
    const testPrompt = 'A professional portrait photo of a beautiful woman with long brown hair, wearing a white sweater, natural lighting, high quality';
    const testModelId = 19; // Adriana Perez
    
    console.log(`📝 Prompt: ${testPrompt}`);
    console.log(`👤 Model ID: ${testModelId} (Adriana Perez)`);
    console.log(`🎭 LoRA: adriana.safetensors\n`);
    
    console.log('⏳ Generating image...\n');
    
    const imageUrl = await generateImageWithRunPod(testPrompt, testModelId);
    
    console.log('\n✅ SUCCESS!');
    console.log(`🖼️  Image URL: ${imageUrl}\n`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

testImageGeneration();

