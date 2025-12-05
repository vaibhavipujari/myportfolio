# Google OAuth Setup Instructions

Your admin panel has Google OAuth integration ready, but it requires configuration in Supabase first.

## ⚠️ Current Status
Google login is showing "provider is not enabled" error because it hasn't been configured yet.

## 🔧 How to Enable Google OAuth

Follow these steps to enable Google login for your admin panel:

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Configure OAuth consent screen if needed
6. For Application type, select **Web application**
7. Add authorized redirect URIs:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
   Replace `YOUR_PROJECT_ID` with your actual Supabase project ID
8. Click **Create** and save your:
   - Client ID
   - Client Secret

### Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication → Providers**
4. Find **Google** in the list
5. Toggle it to **Enabled**
6. Enter your Google OAuth credentials:
   - **Client ID** (from Step 1)
   - **Client Secret** (from Step 1)
7. Click **Save**

### Step 3: Update Authorized Redirect URIs

1. Go back to Google Cloud Console
2. Navigate to **APIs & Services → Credentials**
3. Click your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, ensure you have:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
5. Also add your frontend URL if testing locally:
   ```
   http://localhost:5173/admin
   ```
6. Click **Save**

### Step 4: Test Google Login

1. Go to your portfolio site
2. Click **Admin Panel**
3. Click **Continue with Google**
4. You should be redirected to Google login
5. After login, you'll be redirected back to the admin dashboard

## 🔐 Alternative: Use Email/Password

While Google OAuth is being set up, you can use the email/password login:

1. Click **Admin Panel**
2. Click **Create an account** 
3. Enter your details
4. Use email/password to login

## 📚 Additional Resources

- [Supabase Google Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)

## ✅ After Setup

Once configured, users can:
- Login with Google account (one click)
- Login with email/password (traditional)
- Both methods work seamlessly
- Sessions persist across page refreshes

---

**Note:** Google OAuth setup is optional. The admin panel works perfectly with email/password authentication without any additional configuration.
