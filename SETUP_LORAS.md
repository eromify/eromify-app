# Setting Up LoRA Models for Your Influencers

## 🎯 The Goal

Each influencer needs their own LoRA model so generated images look like them specifically!

**Example:**
- User selects "Riya Yasin" → Uses `riya.safetensors` LoRA → Images look like Riya
- User selects "Other Influencer" → Uses `other.safetensors` LoRA → Images look like that person

---

## ✅ Step 1: Add Metadata Column to Database

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Open your project
3. Go to **SQL Editor**
4. Paste the contents of `add-lora-to-influencers.sql`
5. Click **Run**

This adds a `metadata` column to store LoRA model names for each influencer.

---

## 🎨 Step 2: Link Influencers to Their LoRA Models

### What You Need:

1. **LoRA file names** in your ComfyUI:
   - Go to your ComfyUI: `https://6sls4etwt4drfd-8188.proxy.runpod.net`
   - Check what LoRA files you have loaded
   - Note the exact filenames (e.g., `riya.safetensors`, `bria.safetensors`)

2. **Your influencer names**:
   - You said you have 2 influencers
   - One is "Riya Yasin" (or similar)
   - What's the other one?

### Then Run This SQL:

In Supabase SQL Editor, run this for each influencer:

```sql
-- For Riya Yasin (replace with your actual LoRA filename)
UPDATE public.influencers 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{lora_model}',
  '"riya.safetensors"'
)
WHERE name ILIKE '%riya%';

-- For your second influencer (replace with actual name and LoRA)
UPDATE public.influencers 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{lora_model}',
  '"influencer2.safetensors"'
)
WHERE name ILIKE '%influencer-name%';

-- Verify it worked
SELECT id, name, metadata->'lora_model' as lora_model FROM public.influencers;
```

---

## 📋 Step 3: Tell Me Your Setup

**I need to know:**

1. **What are your 2 influencer names?**
   - Example: "Riya Yasin" and "Sophia Martinez"

2. **What LoRA files do you have in ComfyUI?**
   - Check ComfyUI's LoRA dropdown
   - Example: `riya.safetensors`, `bria.safetensors`, `sophia.safetensors`

3. **Which LoRA goes with which influencer?**
   - Riya Yasin → `riya.safetensors`
   - Sophia Martinez → `sophia.safetensors`

**Then I'll help you run the SQL to link them!**

---

## 🧪 Step 4: Test It

Once linked, when you generate images:

**API Call:**
```json
{
  "influencerId": "riya-uuid-here",
  "prompt": "beautiful woman at the beach",
  "aspectRatio": "9:16"
}
```

**What Happens:**
1. Backend sees `influencerId`
2. Looks up Riya in database
3. Finds `metadata.lora_model = "riya.safetensors"`
4. Passes that to ComfyUI
5. ComfyUI generates image using Riya's LoRA
6. **Result: Image looks like Riya!** ✨

---

## 💡 Quick Check: What LoRAs Are in ComfyUI?

The default one in your workflow is `bria.safetensors`. Do you have others loaded?

Check in ComfyUI:
1. Look at the LoRA Loader node (node 58)
2. Click on the `lora_name` dropdown
3. You'll see all available LoRA files

---

## 🚀 Ready?

**Tell me:**
1. Your 2 influencer names
2. Your LoRA filenames
3. Which LoRA goes with which influencer

And I'll help you set it up! 🎯

