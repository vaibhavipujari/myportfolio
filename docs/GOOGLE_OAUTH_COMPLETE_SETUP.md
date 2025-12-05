# 🔐 Complete Google OAuth Setup Guide

**Your app is already configured to use Google OAuth!** You just need to enable it in Supabase and Google Cloud Console.

---

## ✅ What's Already Configured

Your application already has:
- ✅ Google Sign-In button on admin login page
- ✅ Automatic redirect to `/admin` after successful Google login
- ✅ Auth state management to show admin dashboard
- ✅ Error handling for OAuth failures

**All you need to do is configure the OAuth providers!**

---

## 📋 Step-by-Step Setup

### **Part 1: Google Cloud Console Setup**

#### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the **OAuth consent screen** first:
   - User Type: **External**
   - App name: `Your Portfolio` (or your choice)
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**
   - Scopes: Add `email` and `profile` (or skip for now)
   - Test users: Add your Google email
   - Click **Save and Continue**

#### 2. Configure OAuth Client ID

1. Application type: **Web application**
2. Name: `Portfolio Admin Login`
3. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   https://lscmynjpauibjmbyffbt.supabase.co
   ```
   
4. **Authorized redirect URIs:**
   ```
   http://localhost:3000/auth/v1/callback
   https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback
   ```

5. Click **Create**
6. **Copy your Client ID and Client Secret** (you'll need these!)

---

### **Part 2: Supabase Configuration**

#### 1. Enable Google Provider

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `lscmynjpauibjmbyffbt`
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list
5. Toggle it **ON** (enable it)

#### 2. Add Google Credentials

1. Paste your **Google Client ID** from Google Cloud Console
2. Paste your **Google Client Secret** from Google Cloud Console
3. **Redirect URL** (should be pre-filled):
   ```
   https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback
   ```
4. Click **Save**

---

### **Part 3: Update Your .env File (Optional)**

Your `.env` file already has Google credentials:
```env
Client_ID=23667629388-hd5999no8au0avsejmu5lsonqujrqu9f.apps.googleusercontent.com
Client_secret=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
```

**If these are your actual Google OAuth credentials:**
1. Use them in Supabase Dashboard (Part 2 above)
2. Make sure they're added to **Authorized redirect URIs** in Google Cloud Console

**If you created new credentials:**
1. Update your `.env` file with the new values
2. Use the new credentials in Supabase

---

## 🧪 Testing Google OAuth

### 1. Start Your Development Server

```bash
npm run dev
```

### 2. Test the Login Flow

1. Open browser: `http://localhost:3000/admin`
2. Click **"Continue with Google"** button
3. You should be redirected to Google login
4. Sign in with your Google account
5. After successful login, you'll be redirected back to `/admin`
6. You should see the **Admin Dashboard**

---

## 🎯 How It Works

### Authentication Flow:

```
User clicks "Continue with Google"
         ↓
signInWithGoogle() is called
         ↓
Redirects to Google OAuth
         ↓
User signs in with Google
         ↓
Google redirects to: https://[your-project].supabase.co/auth/v1/callback
         ↓
Supabase processes the callback
         ↓
Redirects to: http://localhost:3000/admin
         ↓
Admin.tsx detects auth state change
         ↓
Shows AdminDashboard component
```

### Code Locations:

1. **Google Sign-In Button**: `src/components/admin/AdminLogin.tsx` (line 91-106)
2. **OAuth Function**: `src/lib/auth.ts` (line 21-34)
3. **Redirect Configuration**: Line 25 sets `redirectTo: ${window.location.origin}/admin`
4. **Auth State Listener**: `src/pages/Admin.tsx` (line 36-44)

---

## 🔧 Troubleshooting

### Error: "Provider is not enabled"

**Solution**: Enable Google provider in Supabase Dashboard → Authentication → Providers

### Error: "redirect_uri_mismatch"

**Solution**: 
1. Check that redirect URI in Google Cloud Console matches:
   ```
   https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback
   ```
2. Make sure there are no trailing slashes
3. Wait 5 minutes for Google to propagate changes

### Error: "400 Bad Request"

**Solution**:
1. Verify Client ID and Secret are correct in Supabase
2. Check that OAuth consent screen is configured
3. Add your email as a test user in Google Cloud Console

### Google login works but doesn't redirect to admin panel

**Solution**: Already fixed! The code redirects to `/admin` automatically (line 25 in `auth.ts`)

### After login, shows login page again

**Solution**: Check browser console for errors. The auth state listener should detect the session and show the dashboard.

---

## 🚀 Production Deployment

When deploying to production (e.g., Vercel):

### 1. Update Google Cloud Console

Add your production URLs to **Authorized JavaScript origins**:
```
https://your-domain.vercel.app
https://your-custom-domain.com
```

Add to **Authorized redirect URIs**:
```
https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback
```

### 2. No Code Changes Needed!

The redirect URL uses `window.location.origin`, so it automatically works in production:
```typescript
redirectTo: `${window.location.origin}/admin`
```

---

## 📝 Summary

✅ **Your code is ready** - Google OAuth is fully implemented  
✅ **Redirects to admin panel** - Configured to go to `/admin` after login  
✅ **Auto-detects auth state** - Shows dashboard when logged in  

**All you need to do:**
1. Enable Google provider in Supabase Dashboard
2. Add your Google OAuth credentials
3. Test the login!

---

## 🎉 Quick Start Checklist

- [ ] Create Google OAuth credentials in Google Cloud Console
- [ ] Add redirect URI: `https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback`
- [ ] Enable Google provider in Supabase Dashboard
- [ ] Paste Client ID and Secret in Supabase
- [ ] Test login at `http://localhost:3000/admin`
- [ ] Click "Continue with Google"
- [ ] Verify redirect to admin dashboard

---

**Need help?** Check the [Supabase Google OAuth docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
