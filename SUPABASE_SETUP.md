# Supabase Setup Guide (No Docker Required)

This guide explains how to run Reactive Resume using Supabase cloud services instead of Docker, saving ~5.4GB of disk space.

## What's Changed

✅ **Removed:** Docker containers, images, and volumes (~5.4GB freed)
✅ **Using:** Supabase PostgreSQL database (cloud)
⚠️ **Storage:** Needs configuration (see below)
⚠️ **Chrome/PDF:** Needs setup (see below)

## Prerequisites

1. **Supabase Account** - You already have this
2. **Supabase Project** - `zlgrpahmdldfzmjltqiw.supabase.co`
3. **API Keys** - You have the service_role and anon keys

## Step 1: Get Your Supabase Database Password

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `zlgrpahmdldfzmjltqiw`
3. Go to **Settings** > **Database**
4. Find the **Connection string** section
5. Copy your database password (or reset it if needed)

## Step 2: Update .env File

Edit the `.env` file and replace `[YOUR-PASSWORD]` with your actual Supabase database password:

```bash
DATABASE_URL=postgresql://postgres.zlgrpahmdldfzmjltqiw:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

**Alternative connection string format** (if pooler doesn't work):
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.zlgrpahmdldfzmjltqiw.supabase.co:5432/postgres
```

## Step 3: Storage Configuration

⚠️ **Important:** Supabase Storage uses a REST API, not S3-compatible API. The current code uses Minio/S3 client, which won't work directly with Supabase Storage.

### Option A: Use Local Filesystem Storage (Recommended for now)

This requires code changes to the storage service. For now, you can:

1. **Temporarily disable storage features** - The app will work but file uploads won't function
2. **Or modify the storage service** to use Supabase Storage REST API (requires development)

### Option B: Use Supabase Storage with Code Changes

To use Supabase Storage, you would need to:
1. Modify `apps/server/src/storage/storage.service.ts` to use Supabase Storage REST API
2. Use the `@supabase/supabase-js` library instead of Minio client
3. Update the storage module configuration

**Supabase Storage API Example:**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zlgrpahmdldfzmjltqiw.supabase.co',
  'your-service-role-key'
)
```

### Option C: Use Another S3-Compatible Storage

You could use:
- AWS S3 (free tier available)
- DigitalOcean Spaces
- Cloudflare R2
- Any S3-compatible service

## Step 4: Chrome/PDF Generation Setup

The app uses Chrome/Browserless for PDF generation. Options:

### Option A: Use System Chrome (Recommended)

1. Install Chrome if not already installed
2. Start Chrome with remote debugging:
   ```bash
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --headless
   ```
3. Update `.env`:
   ```
   CHROME_URL=ws://localhost:9222
   ```

### Option B: Skip PDF Generation

If you don't need PDF generation immediately, you can:
- Set `CHROME_SKIP=true` (if the app supports it)
- Or handle PDF errors gracefully

### Option C: Use Cloud PDF Service

Use a service like:
- PDFShift
- HTMLPDF API
- Other cloud PDF generation services

## Step 5: Run Database Migrations

Once your `.env` is configured with the correct database password:

```bash
pnpm prisma:migrate:dev
```

This will create all necessary tables in your Supabase database.

## Step 6: Start the Application

```bash
pnpm dev
```

The app should start and connect to Supabase database.

## Troubleshooting

### Database Connection Issues

1. **Check your password** - Make sure it's correct in `.env`
2. **Check connection string format** - Try both pooler and direct connection
3. **Check Supabase dashboard** - Ensure your project is active
4. **Check network** - Ensure you can reach Supabase servers

### Storage Issues

If you see storage errors:
- The app will still work for most features
- File uploads (avatars, resume previews) won't work until storage is configured
- You can use the app to create and edit resumes, but PDF generation might fail

### Chrome/PDF Issues

If PDF generation fails:
- Check if Chrome is running on port 9222
- Or skip PDF features for now
- The app core functionality (creating/editing resumes) will still work

## Current Status

✅ **Database:** Configured to use Supabase (needs password)
⚠️ **Storage:** Needs code changes or alternative solution
⚠️ **Chrome/PDF:** Needs setup (system Chrome or alternative)

## Next Steps

1. **Immediate:** Update `.env` with your Supabase database password
2. **Short-term:** Set up Chrome for PDF generation
3. **Long-term:** Modify storage service to use Supabase Storage REST API or use alternative S3-compatible storage

## Benefits of This Setup

- ✅ **No Docker** - Saves ~5.4GB disk space
- ✅ **Cloud Database** - No local PostgreSQL needed
- ✅ **Scalable** - Supabase handles database scaling
- ✅ **Backup** - Supabase handles database backups
- ⚠️ **Internet Required** - Database is in the cloud
- ⚠️ **Storage Needs Work** - Requires code changes or alternative

## Removing Docker Completely

If you want to completely remove Docker Desktop from your Mac:

1. **Quit Docker Desktop** if it's running
2. **Uninstall via Docker Desktop:**
   - Open Docker Desktop
   - Click Troubleshoot (bug icon)
   - Click "Uninstall"
3. **Or manually remove:**
   ```bash
   rm -rf /Applications/Docker.app
   rm -rf ~/Library/Group\ Containers/group.com.docker
   rm -rf ~/Library/Application\ Support/Docker\ Desktop
   rm -rf ~/Library/Caches/com.docker.docker
   rm -rf ~/Library/Preferences/com.docker.docker.plist
   rm -rf ~/.docker
   ```

## Support

If you encounter issues:
1. Check Supabase dashboard for database status
2. Verify your API keys are correct
3. Check application logs for specific errors
4. Review the troubleshooting section above

