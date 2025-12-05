# 🚀 FaceGuard AI Deployment Guide

## Prerequisites

- GitHub account
- Supabase account (free tier works)
- OpenAI API key with credits
- Railway/Render account (for backend)
- Vercel account (for frontend - coming soon)

---

## 📦 Step 1: Setup Supabase Database

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and name your project
4. Set a strong database password
5. Select region closest to your users
6. Wait for project to initialize (~2 minutes)

### 1.2 Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy entire contents of `backend/database/schema.sql`
4. Paste and click **Run**
5. Verify tables created in **Table Editor**

### 1.3 Get API Credentials

1. Go to **Project Settings** > **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
3. Save these for later

---

## 🔑 Step 2: Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or login
3. Go to **API Keys**
4. Click **Create new secret key**
5. Copy the key (starts with `sk-`)
6. **Add credits** to your account ($5-10 recommended)

---

## 🚂 Step 3: Deploy Backend to Railway

### 3.1 Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **New Project**
4. Select **Deploy from GitHub repo**
5. Choose `FaceGuardAI` repository

### 3.2 Configure Environment Variables

In Railway dashboard:

1. Go to **Variables** tab
2. Add these variables:

```
PORT=3000
NODE_ENV=production
OPENAI_API_KEY=sk-your-openai-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=generate-a-random-secret-here
FRONTEND_URL=https://your-frontend-url.vercel.app
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.3 Deploy

1. Railway will auto-deploy
2. Wait for build to complete
3. Click **Generate Domain** to get public URL
4. Test: `https://your-app.railway.app/health`

---

## 🎨 Alternative: Deploy to Render

### 3.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **New** > **Web Service**
4. Connect `FaceGuardAI` repo

### 3.2 Configure

- **Name:** faceguard-ai
- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free

### 3.3 Add Environment Variables

Same as Railway (see above)

### 3.4 Deploy

Click **Create Web Service** and wait for deployment

---

## ✅ Step 4: Test Your Deployment

### 4.1 Health Check

```bash
curl https://your-backend-url.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "FaceGuard AI Server is running",
  "timestamp": "2024-12-05T..."
}
```

### 4.2 Test Signup

```bash
curl -X POST https://your-backend-url.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

### 4.3 Test Login

```bash
curl -X POST https://your-backend-url.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

Copy the `token` from response.

### 4.4 Test Scan

```bash
curl -X POST https://your-backend-url.railway.app/api/scan \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "photo=@/path/to/selfie.jpg"
```

---

## 🎯 Step 5: Monitor & Maintain

### Railway Dashboard

- **Logs:** View real-time logs
- **Metrics:** CPU, memory, network usage
- **Deployments:** Rollback if needed

### Supabase Dashboard

- **Table Editor:** View data
- **SQL Editor:** Run queries
- **Logs:** Database logs
- **Auth:** User management

### OpenAI Dashboard

- **Usage:** Monitor API calls
- **Costs:** Track spending
- **Limits:** Set usage limits

---

## 💰 Cost Estimates

**Free Tier:**
- Supabase: Free (500MB database, 50,000 monthly active users)
- Railway: $5/month credit (enough for small apps)
- Render: Free tier available
- OpenAI: Pay-per-use (~$0.01 per image analysis)

**Expected Monthly Costs:**
- 100 scans/month: ~$1-2 (OpenAI)
- Hosting: $0-5 (Railway/Render)
- Database: $0 (Supabase free tier)
- **Total: $1-7/month**

---

## 🔧 Troubleshooting

### "Module not found" error
```bash
# Rebuild on Railway/Render
npm install
```

### "Database connection failed"
- Check Supabase URL and key
- Verify schema was run
- Check RLS policies

### "OpenAI API error"
- Verify API key is correct
- Check you have credits
- Ensure key has Vision API access

### "File upload failed"
- Check MAX_FILE_SIZE setting
- Verify ALLOWED_FILE_TYPES
- Ensure uploads/ folder exists

---

## 📱 Next: Deploy Frontend

Coming soon - React frontend deployment guide!

---

## 🆘 Need Help?

- Check Railway/Render logs
- Review Supabase logs
- Test locally first
- Open GitHub issue

---

**Deployment complete! 🎉**
