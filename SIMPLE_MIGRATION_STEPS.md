# ⚡ Simple 3-Step Migration (No Special Keys Needed!)

## Step 1: Create Bucket (2 minutes)

1. Go to: https://supabase.com/dashboard/project/eyteuevblxvhjhyeivqh/storage/buckets
2. Click **"New bucket"** button
3. Settings:
   - **Name**: `marketplace-assets`
   - **Public bucket**: ✅ Check this box (IMPORTANT!)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: Leave empty (allows all)
4. Click **"Create bucket"**

---

## Step 2: Upload Files (I'll do this)

Once you've created the bucket above, tell me and I'll run:

```bash
node migrate-to-supabase-storage.cjs
```

Since the bucket is public, the upload should work with the anon key.

---

## Step 3: Update Code & Deploy

After upload succeeds, I'll:
1. Update all image URLs in the code
2. Test locally
3. Deploy to production

---

## Alternative: Bulk Upload Via UI

If the script fails, you can also:

1. Go to the bucket: https://supabase.com/dashboard/project/eyteuevblxvhjhyeivqh/storage/buckets/marketplace-assets
2. Click "Upload files"
3. Drag and drop all files from `/frontend/public/model*.* `
4. Let me know when done, I'll update the code

This is slower but guaranteed to work!

---

**Ready to start?** Just create that bucket and let me know! 🚀

