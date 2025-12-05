# 🚀 Backend Deployment Instructions

## ✅ Backend Setup Complete!

I've prepared your backend for deployment. The Supabase Edge Function is now in the correct location.

---

## 📝 **What You Need to Do:**

### **Step 1: Install Supabase CLI**

Open a new terminal and run:

```bash
npm install -g supabase
```

### **Step 2: Login to Supabase**

```bash
supabase login
```

This will open your browser to authenticate.

### **Step 3: Link Your Project**

```bash
cd "c:\Users\vaibh\Downloads\Portfolio Website Setup"
supabase link --project-ref lscmynjpauibjmbyffbt
```

When prompted for the database password, enter your Supabase project database password.

### **Step 4: Deploy the Edge Function**

```bash
supabase functions deploy server
```

This will deploy your backend API to Supabase.

### **Step 5: Set Environment Variables**

```bash
supabase secrets set SUPABASE_URL=https://lscmynjpauibjmbyffbt.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

**To get your SERVICE_ROLE_KEY:**
1. Go to https://supabase.com/dashboard/project/lscmynjpauibjmbyffbt
2. Click "Project Settings" → "API"
3. Copy the `service_role` key (NOT the anon key)
4. Replace `YOUR_SERVICE_ROLE_KEY` in the command above

---

## 🔐 **Configure Google OAuth (Optional)**

If you want Google login to work:

### **Step 1: Go to Supabase Dashboard**

1. Visit: https://supabase.com/dashboard/project/lscmynjpauibjmbyffbt
2. Click **Authentication** → **Providers**
3. Find **Google** and toggle it ON

### **Step 2: Add Your Google Credentials**

From your `.env` file, you have:
- **Client ID:** `23667629388-hd5999no8au0avsejmu5lsonqujrqu9f.apps.googleusercontent.com`
- **Client Secret:** `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`

Paste these into the Supabase Google provider settings.

### **Step 3: Add Authorized Redirect URI in Google Cloud Console**

1. Go to https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. Add this to **Authorized redirect URIs**:
   ```
   https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback
   ```
4. Click **Save**

---

## ✅ **Verify Deployment**

After deploying, test your backend:

1. **Check Edge Functions:**
   - Go to https://supabase.com/dashboard/project/lscmynjpauibjmbyffbt/functions
   - You should see `server` function listed

2. **Test the API:**
   - Open your admin panel: http://localhost:3000/admin
   - Login with: `vihaa22030@admin.com` / `vihaa22030`
   - Try uploading a resume or editing profile
   - It should work!

---

## 🎯 **Summary**

**What I Did:**
- ✅ Created proper Supabase function structure
- ✅ Copied backend code to `supabase/functions/server/`
- ✅ Prepared deployment instructions

**What You Need to Do:**
1. Install Supabase CLI
2. Login and link project
3. Deploy the function
4. Set environment variables
5. (Optional) Configure Google OAuth

---

## 🆘 **If You Get Errors:**

### Error: "Database password required"
- You need your Supabase database password
- Find it in your Supabase dashboard or reset it

### Error: "Function already exists"
- That's OK! Just redeploy: `supabase functions deploy server --no-verify-jwt`

### Error: "Permission denied"
- Make sure you're logged in: `supabase login`

---

## 📞 **Need Help?**

Let me know if you encounter any errors during deployment!
