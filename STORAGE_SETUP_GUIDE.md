# Supabase Storage Setup Guide

## Current Status

✅ **Database:** Connected and working  
✅ **Browser/PDF:** Connected and working  
⚠️ **Storage:** Needs S3 credentials from Supabase Dashboard

## Why Storage Needs Setup

Supabase Storage supports S3-compatible API, but it requires **separate S3 credentials** (Access Key ID and Secret Access Key) that are different from your API keys (anon/service_role).

The current `.env` uses JWT tokens which won't work with the S3 API. You need to generate actual S3 credentials.

## Step-by-Step: Get Supabase Storage S3 Credentials

### Option 1: Via Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/zlgrpahmdldfzmjltqiw
   - Navigate to **Storage** in the left sidebar

2. **Enable S3 API:**
   - Go to **Storage** > **Settings** (or **Configuration**)
   - Look for **"S3 API"** or **"S3 Compatibility"** section
   - Enable S3 API if not already enabled

3. **Generate S3 Credentials:**
   - In the S3 API settings, click **"Generate Access Key"** or **"Create S3 Credentials"**
   - This will generate:
     - **S3 Access Key ID** (looks like: `AKIAIOSFODNN7EXAMPLE`)
     - **S3 Secret Access Key** (looks like: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)
   - **Save these credentials** - you won't be able to see the secret key again!

4. **Update .env:**
   ```bash
   STORAGE_ACCESS_KEY=[Your S3 Access Key ID]
   STORAGE_SECRET_KEY=[Your S3 Secret Access Key]
   ```

5. **Create Storage Bucket:**
   - Go to **Storage** > **Buckets**
   - Click **"New bucket"**
   - Name: `default`
   - Make it **Public** (or configure policies)
   - Click **"Create bucket"**

6. **Restart Application:**
   ```bash
   pkill -f "pnpm dev"
   pnpm dev
   ```

### Option 2: Check Supabase Documentation

If the S3 API option isn't visible in your dashboard:
- Supabase Storage S3 compatibility might be in beta or require a specific plan
- Check: https://supabase.com/docs/guides/storage/s3/compatibility
- You may need to contact Supabase support or use the REST API instead

## Alternative: Use Supabase Storage REST API

If S3 credentials aren't available, you would need to modify the storage service to use Supabase Storage REST API instead of the S3-compatible API. This requires code changes.

## Current Workaround

The app is configured with `STORAGE_SKIP_BUCKET_CHECK=true`, which means:
- ✅ The app will start even if storage isn't configured
- ✅ Core features (creating/editing resumes) work fine
- ⚠️ File uploads (avatars, images) won't work
- ⚠️ Resume preview images won't be generated

**The application is fully functional for core features without storage!**

## Testing Storage

Once you've updated the S3 credentials, test with:

```bash
curl http://localhost:3000/api/health | python3 -m json.tool
```

You should see:
```json
{
  "storage": {
    "status": "up"
  }
}
```

## Summary

**What's Working:**
- ✅ Database (Supabase PostgreSQL)
- ✅ Browser/PDF generation (System Chrome)
- ✅ All core application features

**What Needs Setup:**
- ⚠️ Storage (get S3 credentials from Supabase Dashboard)

**The app works without storage** - you can create accounts, build resumes, and use all features. File uploads are the only thing that won't work until storage is configured.

