# ⚡ Quick Fix Checklist - Production Image/Video Generation

## What Was Fixed
✅ Auth middleware now uses admin client to bypass RLS
✅ Code committed and pushed to GitHub (commit: 6cc442ba)
✅ Render should be auto-deploying now

## 🚨 ACTION REQUIRED: Set Environment Variable

### Quick Steps (5 minutes):

1. **Open Render Dashboard**
   ```
   https://dashboard.render.com → Your Backend Service → Environment
   ```

2. **Check if `SUPABASE_SERVICE_ROLE_KEY` exists**
   - If YES: You're good! Wait for deployment to finish
   - If NO: Continue to step 3

3. **Get Service Role Key from Supabase**
   ```
   https://supabase.com/dashboard
   → Your Project
   → Settings → API
   → Copy "service_role" key (NOT anon key!)
   ```

4. **Add to Render**
   ```
   Key: SUPABASE_SERVICE_ROLE_KEY
   Value: eyJhbGc... (paste the service_role key)
   → Save Changes
   ```

5. **Wait 2-3 minutes** for Render to redeploy

6. **Test on Production**
   ```
   https://eromify.com/generate
   → Select influencer
   → Enter prompt
   → Click Generate
   → Should work! ✅
   ```

## How to Know It's Working

### ✅ Success Signs:
- Image generates successfully
- Network tab shows 200 OK response
- No "Active subscription required" error
- Console shows successful API calls

### ❌ Still Broken Signs:
- 403 Forbidden error
- "Active subscription required" message
- Check if environment variable is set in Render

## Need Help?
See: `PRODUCTION_FIX_DEPLOYMENT.md` for detailed troubleshooting

---
**Status**: Code is deployed, just need to verify SUPABASE_SERVICE_ROLE_KEY in Render

