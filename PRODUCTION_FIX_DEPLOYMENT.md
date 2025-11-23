# Production Image/Video Generation Fix - Deployment Guide

## Issue Fixed
- **Problem**: Image and video generation were failing in production with "Active subscription required" error
- **Root Cause**: Auth middleware was using anon key to query users table, blocked by RLS policies
- **Solution**: Updated middleware to use admin client (service role key) for database queries

## Changes Made
File: `backend/middleware/auth.js`
- Added admin client initialization using `getSupabaseAdmin()` 
- Separated auth token verification (anon key) from DB queries (admin key)
- Subscription checks now bypass RLS policies properly

## Deployment Steps

### ✅ Step 1: Code Deployed (COMPLETED)
The fix has been committed and pushed to GitHub:
- Commit: 6cc442ba
- Message: "Fix: Use admin client for subscription checks to bypass RLS"

### 🔧 Step 2: Verify Render Environment Variable (ACTION REQUIRED)

**CRITICAL**: The backend requires `SUPABASE_SERVICE_ROLE_KEY` to be set in production.

1. **Go to Render Dashboard**
   - URL: https://dashboard.render.com
   - Find your backend service (eromify-backend or similar)

2. **Check Environment Variables**
   - Click "Environment" in the left sidebar
   - Look for: `SUPABASE_SERVICE_ROLE_KEY`

3. **If Missing - Get Service Role Key from Supabase**
   - Go to: https://supabase.com/dashboard
   - Select your Eromify project
   - Navigate to: Settings → API
   - Copy the **service_role** key (starts with `eyJhbGc...`)
   - ⚠️ Do NOT use the anon key - must be service_role key

4. **Add to Render**
   - In Render dashboard, click "Add Environment Variable"
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: (paste the service_role key)
   - Click "Save Changes"
   - Wait for automatic redeployment (~2-3 minutes)

### 🧪 Step 3: Test the Fix

Once deployed, test image/video generation:

1. **Test Image Generation**
   - Go to: https://eromify.com/generate
   - Select an influencer (e.g., Valentina Gomez)
   - Choose aspect ratio (Portrait 2:3)
   - Enter prompt: "valentina naked in her bedroom"
   - Click "Generate"
   - Should work without "Active subscription required" error

2. **Test Video Generation**
   - Go to video generation page
   - Select influencer and enter prompt
   - Click generate
   - Should work without 403 errors

3. **Check Console/Network Tab**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Look for `/api/content/generate-image-comfyui` request
   - Should return 200 status (not 403)
   - Response should include image URL

## Expected Results

### Before Fix:
```
❌ POST /content/generate-image-comfyui → 403 Forbidden
❌ Error: "Active subscription required"
```

### After Fix:
```
✅ POST /content/generate-image-comfyui → 200 OK
✅ Response: { success: true, image: { url: "...", ... } }
```

## Verification Checklist

- [ ] Code pushed to GitHub (commit 6cc442ba)
- [ ] Render deployment triggered and completed
- [ ] `SUPABASE_SERVICE_ROLE_KEY` environment variable is set in Render
- [ ] Backend redeployed with new environment variable
- [ ] Image generation works on production
- [ ] Video generation works on production
- [ ] No 403 "Active subscription required" errors

## Troubleshooting

### Still getting 403 errors?
1. Check Render logs: Look for environment variable warnings
2. Verify service role key is correct (not anon key)
3. Restart the service in Render dashboard
4. Check Supabase logs for RLS policy errors

### Getting 500 errors?
1. Check Render logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure Runpod endpoints are accessible

### Need to verify environment variable is loaded?
Check backend logs in Render - you should NOT see:
```
⚠️ SUPABASE_SERVICE_ROLE_KEY not set, using ANON_KEY for development
```

If you see this warning in production logs, the environment variable is not set correctly.

## Additional Notes

- The fix maintains backward compatibility with JWT and Supabase token verification
- Only database queries use the admin client - user authentication still uses anon key
- This follows security best practices by separating concerns
- All existing functionality remains unchanged

## Support

If issues persist after following these steps:
1. Check Render deployment logs
2. Verify subscription status in Supabase users table
3. Test with different user accounts
4. Check browser console for detailed error messages

---

**Deployed**: November 23, 2025
**Issue**: Production subscription check failing
**Fix**: Use admin client for RLS bypass
**Status**: Code deployed, awaiting environment variable verification

