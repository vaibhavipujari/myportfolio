# 🔧 Fix: "Unable to exchange external code" Error

**Error Message**: `Unable to exchange external code: 4/0ATX87lMv79_PCX7qDNM0tp4ugUcaba_ZY8nx2I1-T7dQFqVmG1G0QGj4RW9P5qyVixW4iw`

**Status**: ❌ OAuth configuration mismatch

---

## 🔍 What This Error Means

This error occurs when:
1. ✅ Google successfully authenticates you
2. ✅ Google redirects back to Supabase with an authorization code
3. ❌ Supabase tries to exchange the code for an access token
4. ❌ Google rejects the exchange because the redirect URI doesn't match

**Root Cause**: The redirect URI in Google Cloud Console doesn't match Supabase's callback URL.

---

## ✅ Solution: Fix Redirect URI Configuration

### **Your Correct Configuration:**

**Supabase Callback URL** (cannot be changed):
```
https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback
```

**Google Cloud Console** must have EXACTLY this URI.

---

## 📝 Step-by-Step Fix

### **Step 1: Update Google Cloud Console**

1. **Go to**: https://console.cloud.google.com/apis/credentials

2. **Find your OAuth 2.0 Client**:
   - Client ID: `23667629388-hd5999no8au0avsejmu5lsonqujrqu9f`
   - Click on it to edit

3. **Under "Authorized redirect URIs"**, add/verify:
   ```
   https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback
   ```

4. **Under "Authorized JavaScript origins"**, add:
   ```
   http://localhost:3000
   https://lscmynjpauibjmbyffbt.supabase.co
   ```

5. **Remove any incorrect URIs** like:
   - ❌ `http://localhost:3000/auth/v1/callback` (localhost not allowed for redirect)
   - ❌ `https://lscmynjpauibjmbyffbt.supabase.co/auth/callback` (missing /v1)
   - ❌ Any other variations

6. **Click "Save"**

7. **IMPORTANT**: Wait 5-10 minutes for Google to propagate changes

---

### **Step 2: Verify Supabase Settings**

1. **Go to**: https://supabase.com/dashboard

2. **Select project**: `lscmynjpauibjmbyffbt`

3. **Navigate to**: Authentication → Providers → Google

4. **Verify settings**:
   - ✅ Google provider is **ENABLED** (toggle ON)
   - ✅ Client ID: `23667629388-hd5999no8au0avsejmu5lsonqujrqu9f.apps.googleusercontent.com`
   - ✅ Client Secret: `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`
   - ✅ Redirect URL (auto-filled): `https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback`

5. **Click "Save"**

---

### **Step 3: Test Again**

1. **Wait 5 minutes** after saving Google Cloud Console changes

2. **Clear browser cache** or use incognito mode

3. **Go to**: http://localhost:3000/admin

4. **Click**: "Continue with Google"

5. **Sign in** with your Google account

6. **Expected Result**: ✅ Redirected to Admin Dashboard

---

## 🎯 Correct OAuth Flow

```
User clicks "Continue with Google"
    ↓
Redirects to: accounts.google.com
    ↓
User signs in with Google
    ↓
Google redirects to: https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback?code=xxx
    ↓
Supabase exchanges code with Google (using redirect URI)
    ↓
✅ Google verifies redirect URI matches
    ↓
✅ Google returns access token
    ↓
✅ Supabase creates session
    ↓
✅ Redirects to: http://localhost:3000/admin
    ↓
✅ Admin Dashboard appears
```

---

## ❌ What Was Happening (Before Fix)

```
User clicks "Continue with Google"
    ↓
Redirects to: accounts.google.com
    ↓
User signs in with Google
    ↓
Google redirects to: https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback?code=xxx
    ↓
Supabase tries to exchange code with Google
    ↓
❌ Google checks redirect URI
    ↓
❌ Redirect URI doesn't match what's in Google Cloud Console
    ↓
❌ Google rejects the exchange
    ↓
❌ Error: "Unable to exchange external code"
    ↓
❌ Redirects back to login with error
```

---

## 🔍 Common Mistakes to Avoid

### ❌ **Wrong Redirect URIs**:
```
http://localhost:3000/auth/v1/callback          ❌ (localhost not allowed)
https://lscmynjpauibjmbyffbt.supabase.co/auth  ❌ (missing /v1/callback)
http://lscmynjpauibjmbyffbt.supabase.co/...    ❌ (must be https)
```

### ✅ **Correct Redirect URI**:
```
https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback  ✅
```

---

## 📋 Checklist

- [ ] Google Cloud Console: OAuth Client ID configured
- [ ] Redirect URI: `https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback`
- [ ] JavaScript origins: `http://localhost:3000` and `https://lscmynjpauibjmbyffbt.supabase.co`
- [ ] Supabase: Google provider enabled
- [ ] Supabase: Client ID and Secret added
- [ ] Waited 5 minutes for Google changes to propagate
- [ ] Cleared browser cache
- [ ] Tested login again

---

## 🆘 Still Not Working?

### Check These:

1. **OAuth Consent Screen**:
   - Go to: APIs & Services → OAuth consent screen
   - Status should be: "Testing" or "Published"
   - Add your email as a test user

2. **Client ID and Secret**:
   - Make sure they match exactly in both Google and Supabase
   - No extra spaces or characters

3. **Browser Console**:
   - Open DevTools (F12)
   - Check for error messages
   - Look for CORS errors

4. **Supabase Logs**:
   - Go to Supabase Dashboard → Logs
   - Check for authentication errors

---

## 🎉 After Fix

Once configured correctly, you should see:

1. Click "Continue with Google"
2. Google login page appears
3. Sign in with Google
4. Brief loading screen
5. **Admin Dashboard appears** ✅
6. URL is clean: `http://localhost:3000/admin`

---

## 📞 Quick Reference

**Your Supabase Project**:
- Project ID: `lscmynjpauibjmbyffbt`
- Callback URL: `https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback`

**Your Google OAuth**:
- Client ID: `23667629388-hd5999no8au0avsejmu5lsonqujrqu9f.apps.googleusercontent.com`
- Client Secret: `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`

**Required Redirect URI**:
```
https://lscmynjpauibjmbyffbt.supabase.co/auth/v1/callback
```

---

**Fix this redirect URI mismatch and Google OAuth will work!** 🚀
