# 🚀 Vercel Deployment Guide

## ✅ Fixed Issues

The 500 error was caused by:
1. ❌ Missing `vercel.json` configuration
2. ❌ App trying to start server in serverless environment
3. ❌ Environment variables not configured in Vercel

**All fixed!** ✅

---

## 📋 Pre-Deployment Checklist

### 1. Files Created/Updated
- ✅ `vercel.json` - Vercel configuration
- ✅ `app.js` - Updated for serverless
- ✅ `validateEnv.js` - Updated for Vercel

### 2. Environment Variables Needed in Vercel

You MUST add these in Vercel Dashboard:

**Required:**
- `JWT_SECRET` - Your JWT secret (32+ characters)

**Optional (for mock mode):**
- `TEST_MODE=true` - Enable mock mode
- `MOCK_MODE=true` - Enable mock mode

**If you have API keys:**
- `OPENAI_API_KEY` - Your OpenAI key
- `SUPABASE_URL` - Your Supabase URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key

---

## 🚀 Deployment Steps

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Add Vercel configuration"
git push
```

### Step 2: Deploy on Vercel

**Option A: Via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:

**Build Settings:**
- Framework Preset: **Other**
- Root Directory: `./` (or leave empty)
- Build Command: (leave empty - not needed)
- Output Directory: (leave empty)

**Environment Variables:**
Click "Environment Variables" and add:

```
JWT_SECRET = your-jwt-secret-here-32-chars-min
TEST_MODE = true
MOCK_MODE = true
```

(Add API keys if you have them)

5. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
vercel
```

Follow prompts and add environment variables.

---

### Step 3: Add Environment Variables in Vercel

**Critical Step!** After deployment:

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

**Required:**
```
JWT_SECRET = e4eec25512c97bdcb2e9b407fad0907e
```

**For Mock Mode (No API Keys):**
```
TEST_MODE = true
MOCK_MODE = true
```

**If You Have API Keys:**
```
OPENAI_API_KEY = sk-your-key-here
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_ANON_KEY = your-anon-key
```

4. **Important:** After adding variables, **redeploy**:
   - Go to **Deployments** tab
   - Click the 3 dots on latest deployment
   - Click **Redeploy**

---

## 🔍 Verify Deployment

### Test Health Endpoint

After deployment, test:
```
https://your-project.vercel.app/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "FaceGuard AI Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Test API Endpoint

```
https://your-project.vercel.app/api/auth/signup
```

---

## 🐛 Troubleshooting

### Still Getting 500 Error?

**1. Check Environment Variables**
- ✅ Go to Vercel Dashboard → Settings → Environment Variables
- ✅ Make sure `JWT_SECRET` is set
- ✅ Redeploy after adding variables

**2. Check Vercel Logs**
- Go to Vercel Dashboard → Deployments
- Click on your deployment
- Click "Functions" tab
- Check error logs

**3. Common Issues:**

**Error: "JWT_SECRET is required"**
→ Add `JWT_SECRET` in Vercel environment variables

**Error: "Cannot find module"**
→ Make sure `package.json` has all dependencies
→ Vercel installs dependencies automatically

**Error: "Function timeout"**
→ Increase timeout in `vercel.json` (already set to 30s)

**Error: "ENOENT: no such file or directory"**
→ Make sure `vercel.json` is in root directory
→ Check file paths in code

---

## 📝 Vercel Configuration Explained

### `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"  // Uses Node.js runtime
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.js"  // All routes go to app.js
    }
  ],
  "functions": {
    "app.js": {
      "maxDuration": 30  // 30 second timeout
    }
  }
}
```

---

## ✅ Success Checklist

- [ ] `vercel.json` file created
- [ ] Code pushed to GitHub
- [ ] Project imported in Vercel
- [ ] `JWT_SECRET` added in environment variables
- [ ] Other env vars added (if needed)
- [ ] Redeployed after adding env vars
- [ ] Health endpoint works
- [ ] API endpoints work

---

## 🎯 Quick Fix Summary

**The 500 error was because:**
1. ❌ No `vercel.json` → ✅ Created
2. ❌ App trying to listen on port → ✅ Fixed (only listens locally)
3. ❌ Env vars not in Vercel → ✅ Need to add in dashboard

**Next Steps:**
1. Add `JWT_SECRET` in Vercel dashboard
2. Redeploy
3. Test health endpoint

---

**After adding environment variables and redeploying, your app should work! 🚀**

