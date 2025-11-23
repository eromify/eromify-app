# 📦 Supabase Storage Migration Guide

## Why This Matters
Your `/frontend/public` folder has **305MB** of images costing you money on Vercel. Moving to Supabase Storage = **FREE** (1GB storage, 2GB bandwidth/month).

---

## Step 1: Get Your Real Service Role Key

1. Go to: https://supabase.com/dashboard/project/eyteuevblxvhjhyeivqh/settings/api
2. Scroll to "Project API keys"
3. Copy the **`service_role`** key (NOT the anon key!)
4. Update `/Users/vincentcampbell/Desktop/Eromify 2/backend/.env`:
   
```bash
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
```

---

## Step 2: Create Storage Bucket Manually

1. Go to: https://supabase.com/dashboard/project/eyteuevblxvhjhyeivqh/storage/buckets
2. Click "New bucket"
3. Name: `marketplace-assets`
4. Make it **Public**
5. Click "Create bucket"

---

## Step 3: Run Migration Script

```bash
cd /Users/vincentcampbell/Desktop/Eromify\ 2/backend
node ../migrate-to-supabase-storage.cjs
```

This will:
- Upload all 322 model images to Supabase
- Upload Hero video and other assets
- Create a URL mapping file

---

## Step 4: Update Frontend Code

After migration completes, run:

```bash
node update-marketplace-urls.cjs
```

This will automatically replace all `/model*.png` paths with Supabase URLs.

---

## Step 5: Test Locally

```bash
cd frontend
npm run dev
```

Visit http://localhost:5173 and check that:
- Marketplace images load correctly
- Hero video plays
- No broken images

---

## Step 6: Deploy

```bash
cd /Users/vincentcampbell/Desktop/Eromify\ 2
git add .
git commit -m "Migrate images to Supabase Storage - massive cost savings"
git push origin main
```

Frontend auto-deploys to Vercel.

---

## Step 7: Clean Up (After Verifying)

Once everything works in production for a day or two:

```bash
# Delete images from public folder to save Vercel costs
cd frontend/public
rm model*.* preview_*.png
```

---

## Expected Savings

**Before:**
- 305MB assets on Vercel
- Every visitor downloads images
- $$$ bandwidth costs

**After:**
- Only essentials on Vercel (~10MB)
- Images served from Supabase CDN
- FREE up to 2GB/month

**Estimated savings: $50-200/month** depending on traffic! 💰

---

## Troubleshooting

### "RLS policy" error
- Make sure you're using the **service_role** key, not anon key
- Check that the bucket is marked as **Public**

### Images don't load
- Check browser console for CORS errors
- Verify bucket policy allows public access
- Make sure URLs in code match Supabase URLs

### Need to revert?
- Just change the URLs back in `marketplaceModels.js`
- Images are still in `frontend/public` until you delete them

