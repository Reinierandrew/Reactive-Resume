# Quick Start Guide - Supabase Setup

## ✅ What's Done

1. ✅ Docker removed (~5.4GB freed)
2. ✅ .env file configured with your Supabase keys
3. ✅ OpenAI API key added

## 🔑 Get Your Database Password

You need to get your Supabase database password to complete the setup:

### Option 1: From Supabase Dashboard (Easiest)

1. Go to: https://supabase.com/dashboard/project/zlgrpahmdldfzmjltqiw
2. Click **Settings** (gear icon) in the left sidebar
3. Click **Database** in the settings menu
4. Scroll to **Connection string** section
5. You'll see connection strings - copy the password from there
6. Or click **Reset database password** if you don't know it

### Option 2: Use Connection String Directly

1. In Supabase Dashboard > Settings > Database
2. Find the **Connection string** section
3. Copy the **URI** connection string (it includes the password)
4. Replace the `DATABASE_URL` in `.env` with the full connection string

## 📝 Update .env File

Once you have your database password, edit `.env` and replace:

```
DATABASE_URL=postgresql://postgres.zlgrpahmdldfzmjltqiw:[YOUR-DB-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

Or use the full connection string from Supabase Dashboard.

## 🗄️ Create Storage Bucket in Supabase

1. Go to Supabase Dashboard > **Storage**
2. Click **New bucket**
3. Name it: `default`
4. Make it **Public** (or configure policies as needed)
5. Click **Create bucket**

## 🚀 Run Setup

After updating the database password:

```bash
# Run database migrations
pnpm prisma:migrate:dev

# Start the application
pnpm dev
```

## ⚠️ Storage Note

Supabase Storage S3 compatibility might need additional setup. If you encounter storage errors:

1. The app will still work for creating/editing resumes
2. File uploads (avatars, previews) might not work until storage is fully configured
3. We may need to adjust the storage configuration

## 🖥️ Chrome Setup (For PDF Generation)

To enable PDF generation, start Chrome with remote debugging:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --headless
```

Or install Chrome if not already installed.

## ✅ Next Steps

1. Get database password from Supabase Dashboard
2. Update `.env` with the password
3. Create `default` bucket in Supabase Storage
4. Run `pnpm prisma:migrate:dev`
5. Start the app with `pnpm dev`

