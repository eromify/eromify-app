/**
 * Test script for RunPod ComfyUI video generation
 * 
 * Usage: node test-video-generation.cjs
 */

const { generateVideoWithRunPod } = require('./backend/services/runpodVideoService');

async function testVideoGeneration() {
  try {
    console.log('🧪 Testing RunPod Video Generation...\n');
    
    const testPrompt = 'Adriana takes a selfie in her bedroom';
    const testModelId = 19; // Adriana Perez
    
    console.log(`📝 Prompt: ${testPrompt}`);
    console.log(`👤 Model ID: ${testModelId} (Adriana Perez)`);
    console.log(`🎭 LoRAs: adriana high 100.safetensors + adriana low 100.safetensors\n`);
    
    console.log('⏳ Generating video (this will take 2-5 minutes)...\n');
    
    const videoUrl = await generateVideoWithRunPod(testPrompt, testModelId, {
      aspectRatio: '16:9',
      duration: 49
    });
    
    console.log('\n✅ SUCCESS!');
    console.log(`🎬 Video URL: ${videoUrl}\n`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

testVideoGeneration();

