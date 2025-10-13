# Admin Panel Credentials

## 🔐 Admin Account Setup

Your admin panel requires you to create an admin account on first use.

### Creating Your Admin Account

1. Navigate to `/admin/create-account`
2. Enter your email and password
3. Click "Create Admin Account"
4. Login with your credentials at `/admin`

### Default Account (Development Only)

For development/testing purposes only, there is a default account:

```
Email:    vihaa22030@admin.com
Password: vihaa22030
```

⚠️ **IMPORTANT:** This default account should NEVER be used in production!

## 📝 How It Works

1. **Automatic Creation**: The default admin account is automatically created when the server starts for the first time
2. **One-Time Setup**: If any user already exists in the database, the default account is NOT created
3. **Secure**: The account is created with email verification already confirmed

## 🚀 How to Login

### Step 1: Access Admin Panel
- Click the **"Admin Panel"** button on your portfolio landing page
- Or navigate directly to `/admin` route

### Step 2: Use Default Credentials
- Enter the email: `vihaa22030@admin.com`
- Enter the password: `vihaa22030`
- Click **"Sign In"**

### Step 3: You're In!
- Access the full admin dashboard
- Manage projects, profile, resume, and skills

## ⚠️ Security Recommendations

### After First Login, You Should:

1. **Create Your Own Account**
   - Click "Create an account" on login page
   - Use your real email and strong password
   - Delete the default account (optional)

2. **Change Default Credentials** (Alternative)
   - Go to Profile Editor in admin dashboard
   - Update email and password
   - Save changes

3. **For Production Use**
   - Never use default credentials in production
   - Always use unique, strong passwords
   - Enable Google OAuth for additional security

## 🔄 Reset Default Account

If you need to reset the default account:

1. Delete all users from Supabase dashboard
2. Restart the server
3. Default account will be recreated automatically

## 📋 Multiple Admin Accounts

You can create multiple admin accounts:

1. Login with default credentials
2. Logout
3. Click "Create an account" on login page
4. Enter new admin details
5. Both accounts will have full access

## 🛡️ Account Features

All admin accounts (default or custom) can:

- ✅ Manage all projects (add, edit, delete)
- ✅ Edit profile information
- ✅ Upload and manage resume
- ✅ Manage skills and tech stack
- ✅ View all portfolio data
- ✅ Full admin dashboard access

## 🆘 Troubleshooting

### Can't Login?

1. **Check credentials are exact**
   - Email: `vihaa22030@admin.com`
   - Password: `vihaa22030`
   - No spaces, case-sensitive

2. **Server not running?**
   - Ensure Supabase functions are deployed
   - Check server logs for errors

3. **Already have users?**
   - If other users exist, default account won't be created
   - Create a new account instead

### Google OAuth Not Working?

- Google OAuth requires additional setup
- See `GOOGLE_OAUTH_SETUP.md` for instructions
- Use email/password login as default

---

**Quick Start:** Just use `vihaa22030@admin.com` / `vihaa22030` to login and start managing your portfolio right away!
