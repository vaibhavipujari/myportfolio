# 🚀 Deployment Guide - Modern Portfolio with Supabase Backend

This guide will walk you through deploying your full-stack portfolio application with React frontend and Supabase backend.

## 📋 Prerequisites

- Supabase account (https://supabase.com)
- Vercel/Netlify account (for frontend hosting)
- Google Cloud Console account (for OAuth - optional)
- Supabase CLI installed: `npm install -g supabase`

---

## 🗄️ Part 1: Supabase Backend Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - Project Name: `portfolio-backend` (or your choice)
   - Database Password: Create a strong password (save this!)
   - Region: Choose closest to your users
4. Click **"Create new project"**
5. Wait for setup to complete (~2 minutes)

### Step 2: Setup Database Tables

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste this SQL:

```sql
-- Create KV Store Table (already exists, but run if needed)
CREATE TABLE IF NOT EXISTS kv_store_9576ae76 (
  key TEXT PRIMARY KEY,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE kv_store_9576ae76 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since we use service role key on backend)
CREATE POLICY "Allow all operations" ON kv_store_9576ae76
  FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kv_store_updated_at
  BEFORE UPDATE ON kv_store_9576ae76
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

4. Click **"Run"** to execute

### Step 3: Create Storage Bucket for Resumes

1. Go to **Storage** in Supabase Dashboard
2. Click **"Create bucket"**
3. Bucket name: `make-9576ae76-resumes`
4. Set as **Private** bucket
5. Click **"Create bucket"**

### Step 4: Setup Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. **(Optional)** Enable **Google OAuth**:
   - Follow instructions in `GOOGLE_OAUTH_SETUP.md`
   - Add your Google Client ID and Secret
   - Add authorized redirect URL: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### Step 5: Get Your Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy these values (you'll need them):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (long string - KEEP SECRET!)
3. Also note your **Project Reference ID** from the URL

### Step 6: Deploy Supabase Edge Functions

1. **Login to Supabase CLI:**
   ```bash
   supabase login
   ```

2. **Link your project:**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   - Replace `YOUR_PROJECT_REF` with your project reference ID

3. **Deploy the edge function:**
   ```bash
   supabase functions deploy server
   ```

4. **Set environment variables for the function:**
   ```bash
   supabase secrets set SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   supabase secrets set SUPABASE_ANON_KEY=your_anon_key
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   supabase secrets set SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
   ```
   - Replace values with your actual credentials
   - For DB_URL, replace `[PASSWORD]` with your database password

5. **Verify deployment:**
   - Go to **Edge Functions** in Supabase Dashboard
   - You should see `server` function listed
   - Test it by clicking **"Invoke"**

---

## 🌐 Part 2: Frontend Deployment

### Option A: Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Update `utils/supabase/info.tsx`:**
   
   Replace the content with your actual Supabase credentials:
   ```tsx
   export const projectId = 'YOUR_PROJECT_REF';
   export const publicAnonKey = 'YOUR_ANON_PUBLIC_KEY';
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name? `my-portfolio` (or your choice)
   - Directory? `./` (current directory)
   - Override settings? **N**

4. **Your site will be live at:**
   - `https://your-project.vercel.app`

5. **Add custom domain (Optional):**
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add your custom domain (e.g., `yourname.com`)

### Option B: Deploy to Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Update `utils/supabase/info.tsx`** (same as Vercel)

3. **Build your project:**
   ```bash
   npm run build
   ```

4. **Deploy to Netlify:**
   ```bash
   netlify deploy --prod
   ```
   
   - Publish directory: `dist`
   - Follow prompts to create new site

5. **Your site will be live at:**
   - `https://your-site.netlify.app`

### Option C: Deploy via GitHub

**For Vercel:**
1. Push your code to GitHub
2. Go to https://vercel.com
3. Click **"Import Project"**
4. Select your GitHub repository
5. Configure:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variables (if needed)
7. Click **"Deploy"**

**For Netlify:**
1. Push your code to GitHub
2. Go to https://netlify.com
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect to GitHub and select your repo
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **"Deploy site"**

---

## 🔐 Part 3: Initial Admin Setup

### Create Your Admin Account

1. **Visit your deployed site:**
   ```
   https://your-site.vercel.app/admin/create-account
   ```

2. **Create admin account:**
   - Email: `your-email@admin.com`
   - Password: Choose a strong password
   - Click **"Create Admin Account"**

3. **Login to admin panel:**
   ```
   https://your-site.vercel.app/admin
   ```

4. **Setup your portfolio:**
   - Go to **AI Parser** tab
   - Upload your resume PDF
   - Click **"Parse Resume & Auto-Fill"**
   - Review and save Profile, Skills, and Projects

---

## 📝 Part 4: Configuration Checklist

### ✅ Backend Checklist

- [ ] Supabase project created
- [ ] Database tables created (kv_store_9576ae76)
- [ ] Storage bucket created (make-9576ae76-resumes)
- [ ] Authentication enabled (Email + Optional Google OAuth)
- [ ] Edge function deployed (server)
- [ ] Environment variables set for edge function

### ✅ Frontend Checklist

- [ ] `utils/supabase/info.tsx` updated with real credentials
- [ ] Project built successfully (`npm run build`)
- [ ] Deployed to Vercel/Netlify
- [ ] Site accessible via URL
- [ ] Admin account created
- [ ] Portfolio content populated

### ✅ Security Checklist

- [ ] Service role key kept secret (not in frontend code)
- [ ] Anon key used in frontend only
- [ ] Storage buckets are private
- [ ] Row Level Security enabled on database tables
- [ ] Strong admin password used

---

## 🔧 Troubleshooting

### Edge Function Not Working

**Problem:** 500 errors when accessing `/make-server-9576ae76/*` routes

**Solution:**
1. Check edge function logs:
   ```bash
   supabase functions logs server
   ```
2. Verify environment variables are set:
   ```bash
   supabase secrets list
   ```
3. Redeploy function:
   ```bash
   supabase functions deploy server --no-verify-jwt
   ```

### CORS Errors

**Problem:** Cross-origin errors in browser console

**Solution:**
- Edge function already has CORS enabled
- Make sure requests include `Authorization: Bearer ${publicAnonKey}` header
- Check that Supabase URL in `info.tsx` is correct

### Google OAuth Not Working

**Problem:** "Provider is not enabled" error

**Solution:**
1. Complete setup at https://supabase.com/docs/guides/auth/social-login/auth-google
2. Add authorized redirect URIs in Google Cloud Console:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
3. Enable Google provider in Supabase Dashboard → Authentication → Providers

### Build Errors

**Problem:** Build fails with module errors

**Solution:**
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Clear cache:
   ```bash
   npm run build -- --force
   ```

### Resume Parser Not Extracting Data

**Problem:** AI parser shows "Found: " with no items

**Solution:**
- PDF must be text-based (not scanned images)
- Try a different PDF or manually fill the forms
- Check browser console for errors

---

## 🎯 Next Steps After Deployment

1. **Customize Your Portfolio:**
   - Upload your actual resume
   - Add real project images
   - Update social links (GitHub, LinkedIn, Twitter)
   - Customize colors in `styles/globals.css`

2. **SEO Optimization:**
   - Add `meta` tags to `index.html`
   - Set up Google Analytics
   - Create `sitemap.xml`

3. **Custom Domain:**
   - Purchase domain from Namecheap, Google Domains, etc.
   - Add to Vercel/Netlify dashboard
   - Update DNS records

4. **Monitoring:**
   - Set up Supabase usage alerts
   - Monitor edge function logs
   - Check frontend performance with Lighthouse

5. **Backup:**
   - Export database regularly
   - Keep backup of environment variables
   - Version control everything with Git

---

## 📞 Support

- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com

---

## 🎉 Congratulations!

Your modern, full-stack portfolio is now live! 

**Your Site:** `https://your-site.vercel.app`
**Admin Panel:** `https://your-site.vercel.app/admin`

Share it with the world! 🚀
