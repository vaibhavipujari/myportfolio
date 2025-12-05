# ⚡ Quick Deploy Guide - TL;DR Version

Get your portfolio live in 15 minutes!

## 1️⃣ Setup Supabase (5 min)

```bash
# 1. Create project at https://supabase.com/dashboard
# 2. Go to SQL Editor, run this:
```

```sql
CREATE TABLE IF NOT EXISTS kv_store_9576ae76 (
  key TEXT PRIMARY KEY,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE kv_store_9576ae76 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON kv_store_9576ae76
  FOR ALL USING (true) WITH CHECK (true);
```

```bash
# 3. Get credentials from Project Settings → API:
# - Project URL
# - anon public key
# - service_role key
```

## 2️⃣ Deploy Edge Function (3 min)

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy server

# Set secrets
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your_anon_key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set SUPABASE_DB_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```

## 3️⃣ Update Frontend Config (1 min)

**Edit `/utils/supabase/info.tsx`:**

```tsx
export const projectId = 'YOUR_PROJECT_REF';
export const publicAnonKey = 'YOUR_ANON_PUBLIC_KEY';
```

## 4️⃣ Deploy to Vercel (3 min)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts, deploy!
```

**Or use Vercel Dashboard:**
1. Push to GitHub
2. Go to https://vercel.com → Import
3. Select repo → Deploy

## 5️⃣ Setup Admin (3 min)

1. Visit: `https://your-site.vercel.app/admin/create-account`
2. Create admin account
3. Login at: `https://your-site.vercel.app/admin`
4. Upload resume in **AI Parser** tab
5. Save all sections

## ✅ Done!

**Portfolio Live:** `https://your-site.vercel.app`
**Admin Panel:** `https://your-site.vercel.app/admin`

---

## 🔥 Common Issues

**Build fails?**
```bash
rm -rf node_modules
npm install
npm run build
```

**Edge function errors?**
```bash
supabase functions logs server
supabase functions deploy server --no-verify-jwt
```

**Can't login?**
- Check Supabase → Authentication is enabled
- Verify credentials in `info.tsx`

---

See `DEPLOYMENT_GUIDE.md` for detailed instructions.
