/**
 * Update all image URLs to use Supabase Storage
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_BASE_URL = 'https://eyteuevblxvhjhyeivqh.supabase.co/storage/v1/object/public/marketplace-assets';

// Load URL mapping
const urlMapping = JSON.parse(fs.readFileSync('supabase-url-mapping.json', 'utf8'));

// Files to update
const filesToUpdate = [
  'frontend/src/data/marketplaceModels.js',
  'frontend/src/pages/LandingPage.jsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${file} - not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let replacements = 0;
  
  // Replace all /model*.* and /preview_*.png paths with Supabase URLs
  Object.entries(urlMapping).forEach(([oldPath, newUrl]) => {
    const escapedOldPath = oldPath.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\[/g, '\\[').replace(/\]/g, '\\]');
    const regex = new RegExp(`"${escapedOldPath}"`, 'g');
    const matches = content.match(regex);
    
    if (matches) {
      content = content.replace(regex, `"${newUrl}"`);
      replacements += matches.length;
    }
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Updated ${file} - ${replacements} replacements`);
});

console.log('\n🎉 All URLs updated to Supabase Storage!');
console.log('\n🧪 Next steps:');
console.log('   1. Test locally: cd frontend && npm run dev');
console.log('   2. Check that all images load');
console.log('   3. If looks good, deploy to production');

