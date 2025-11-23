/**
 * Migration Script: Upload all marketplace images to Supabase Storage
 * This will save massive Vercel bandwidth costs
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
// Load environment from backend
try {
  require('dotenv').config({ path: './backend/.env' });
} catch(e) {
  // dotenv might not be installed in root, try without it
  console.log('Using environment variables from system');
}

// Initialize Supabase client with service role key
const supabaseUrl = process.env.SUPABASE_URL || 'https://eyteuevblxvhjhyeivqh.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment variables');
  console.log('Please set it in backend/.env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PUBLIC_DIR = path.join(__dirname, 'frontend/public');
const BUCKET_NAME = 'marketplace-assets';

// Files to upload (all model images + important assets)
const filesToUpload = [
  // Hero video
  'Hero-Landing-Video.mp4',
  'affiliate.mp4',
  
  // Landing page assets
  'generation-screenshot.webp',
  'marketplace.webp',
  'showcase1.webp',
  'showcase2.webp',
  'showcase3.webp',
  'video-generation.webp',
  'skin-upscale.webp',
  'step2-create-content.webp',
  'step3-export-monetize.webp',
];

// Get all model images from public directory
const getAllModelImages = () => {
  const files = fs.readdirSync(PUBLIC_DIR);
  const modelImages = files.filter(file => {
    return file.match(/^model\d+\s*\d*\.(png|jpeg|jpg|webp|PNG|JPEG|JPG)$/i) ||
           file.match(/^preview_\d+\.png$/i);
  });
  return modelImages;
};

async function createBucket() {
  console.log('📦 Creating storage bucket...');
  
  // Check if bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);
  
  if (bucketExists) {
    console.log('✅ Bucket already exists');
    return true;
  }
  
  // Create public bucket
  const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'video/mp4']
  });
  
  if (error) {
    console.log('⚠️  Bucket might already exist, continuing...');
    return true; // Continue anyway
  }
  
  console.log('✅ Bucket created successfully');
  return true;
}

async function uploadFile(filename) {
  const filePath = path.join(PUBLIC_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return null;
  }
  
  const fileBuffer = fs.readFileSync(filePath);
  const fileExt = path.extname(filename).toLowerCase();
  
  // Determine content type
  const contentTypeMap = {
    '.png': 'image/png',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4'
  };
  const contentType = contentTypeMap[fileExt] || 'application/octet-stream';
  
  console.log(`📤 Uploading ${filename}...`);
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filename, fileBuffer, {
      contentType,
      upsert: true // Overwrite if exists
    });
  
  if (error) {
    console.error(`❌ Failed to upload ${filename}:`, error.message);
    return null;
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filename);
  
  console.log(`✅ Uploaded: ${filename} → ${publicUrl}`);
  return publicUrl;
}

async function migrateImages() {
  console.log('🚀 Starting migration to Supabase Storage...\n');
  
  try {
    // Step 1: Create bucket
    await createBucket();
    console.log('');
    
    // Step 2: Get all model images
    const modelImages = getAllModelImages();
    const allFiles = [...filesToUpload, ...modelImages];
    
    console.log(`📊 Found ${allFiles.length} files to upload\n`);
    
    // Step 3: Upload files
    const results = [];
    for (const file of allFiles) {
      const url = await uploadFile(file);
      if (url) {
        results.push({ file, url });
      }
    }
    
    console.log(`\n✅ Migration complete! Uploaded ${results.length} files`);
    console.log('\n📋 Summary:');
    console.log(`   - Total files: ${allFiles.length}`);
    console.log(`   - Successful: ${results.length}`);
    console.log(`   - Failed: ${allFiles.length - results.length}`);
    
    // Step 4: Create URL mapping file
    const urlMap = {};
    results.forEach(({ file, url }) => {
      urlMap[`/${file}`] = url;
    });
    
    fs.writeFileSync(
      path.join(__dirname, 'supabase-url-mapping.json'),
      JSON.stringify(urlMap, null, 2)
    );
    
    console.log('\n📝 URL mapping saved to: supabase-url-mapping.json');
    console.log('\n🎯 Next steps:');
    console.log('   1. Run update script to replace URLs in marketplaceModels.js');
    console.log('   2. Deploy frontend to Vercel');
    console.log('   3. Verify images load correctly');
    console.log('   4. Delete images from frontend/public/ to save costs');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateImages();

