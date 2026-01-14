# ⚡ VERCEL 500 ERROR - QUICK FIX (2 MINUTES)

## 🎯 THE PROBLEM

Your Vercel deployment is showing:
```
POST /api/auth/signup 500 (Internal Server Error)
```

**Cause:** Missing environment variables in Vercel

---

## ✅ THE FIX (2 MINUTES)

### **STEP 1: Add Environment Variables**

1. Go to: https://vercel.com/dashboard
2. Click your project: **face-guard-ai-2**
3. Click **Settings** → **Environment Variables**
4. Add these **3 REQUIRED** variables:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your_random_32_character_secret_key_here
```

5. Click **Save**

---

### **STEP 2: Get Your Values**

**A) Supabase Credentials:**
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`

**B) JWT Secret:**
Run this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output → `JWT_SECRET`

---

### **STEP 3: Redeploy**

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait 30 seconds

---

### **STEP 4: Test**

Visit: https://face-guard-ai-2.vercel.app/health

**Should see:**
```json
{
  "status": "ok",
  "message": "FaceGuard AI Server is running"
}
```

---

## 🚀 DONE!

Now try signup again:
1. Go to: https://face-guard-ai-2.vercel.app/signup
2. Fill in the form
3. Click "Create Account"
4. Should work! ✅

---

## 🆘 STILL NOT WORKING?

**Check Vercel Logs:**
1. Vercel Dashboard → Your Project
2. **Deployments** → Click latest
3. **View Function Logs**
4. Look for error messages

**Common Issues:**
- ❌ Wrong SUPABASE_URL format
- ❌ Wrong SUPABASE_ANON_KEY
- ❌ JWT_SECRET too short (needs 32+ chars)

---

## 📋 COMPLETE ENV VARS (Optional)

**Minimum Required:**
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
JWT_SECRET=abc123...
NODE_ENV=production
```

**Full Setup (Add Later):**
```env
# Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...

# JWT
JWT_SECRET=abc123...

# OpenAI (for scans)
OPENAI_API_KEY=sk-...

# Razorpay (for payments)
RAZORPAY_ENABLED=false
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Environment
NODE_ENV=production
```

---

**⚡ Total Time: 2 minutes | Difficulty: Easy**
