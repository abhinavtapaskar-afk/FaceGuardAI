# 🔴 VERCEL 500 ERROR - COMPLETE FIX GUIDE

## 🐛 ERRORS YOU'RE SEEING

```
POST https://face-guard-ai-2.vercel.app/api/auth/signup 500 (Internal Server Error)
GET https://face-guard-ai-2.vercel.app/favicon.ico 500 (Internal Server Error)
```

---

## 🔍 ROOT CAUSES

### **1. Missing Environment Variables** ⚠️
Vercel deployment doesn't have the required environment variables set.

### **2. Database Connection Failing** ⚠️
Supabase credentials are not configured in Vercel dashboard.

### **3. Missing Favicon** (Minor)
No favicon.ico file in public folder.

---

## ✅ COMPLETE FIX (5 MINUTES)

### **STEP 1: Add Environment Variables to Vercel**

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select your project: `face-guard-ai-2`

2. **Go to Settings → Environment Variables**

3. **Add These Variables:**

```env
# Database (REQUIRED)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT (REQUIRED)
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# OpenAI (REQUIRED for scans)
OPENAI_API_KEY=your_openai_api_key

# Razorpay (Optional - for payments)
RAZORPAY_ENABLED=false
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Affiliate (Optional)
AFFILIATE_TAG=yourtag-21
FLIPKART_ID=yourcode

# Environment
NODE_ENV=production
```

4. **Click "Save"**

5. **Redeploy:**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

### **STEP 2: Get Your Supabase Credentials**

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard

2. **Select Your Project**

3. **Go to Settings → API**

4. **Copy These Values:**
   - **Project URL** → Use as `SUPABASE_URL`
   - **anon public** key → Use as `SUPABASE_ANON_KEY`

**Example:**
```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **STEP 3: Generate JWT Secret**

**Option A: Use Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option B: Use Online Generator**
- Go to: https://www.grc.com/passwords.htm
- Copy the "63 random alpha-numeric characters" string

**Example:**
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

### **STEP 4: Add Favicon (Optional)**

Create a simple favicon to stop the 500 error:

1. **Create `public/favicon.ico`** in your project

2. **Or add this to `app.js`:**
```javascript
// Add after other routes
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content
});
```

---

## 🧪 VERIFY THE FIX

### **Test 1: Health Check**
```bash
curl https://face-guard-ai-2.vercel.app/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "FaceGuard AI Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **Test 2: API Root**
```bash
curl https://face-guard-ai-2.vercel.app/
```

**Expected Response:**
```json
{
  "name": "FaceGuard AI API",
  "version": "1.0.0",
  "status": "active",
  "endpoints": {
    "auth": "/api/auth",
    "scan": "/api/scan",
    "user": "/api/user",
    "progress": "/api/progress"
  }
}
```

### **Test 3: Signup**
1. Go to: https://face-guard-ai-2.vercel.app/signup
2. Fill in the form
3. Click "Create Account"
4. Should redirect to dashboard

---

## 🔧 ALTERNATIVE: USE MOCK MODE

If you don't have Supabase credentials yet, enable mock mode:

**In Vercel Environment Variables:**
```env
MOCK_MODE=true
```

**This will:**
- ✅ Use in-memory database
- ✅ Allow testing without Supabase
- ✅ No real data persistence
- ⚠️ Data resets on each deployment

---

## 📊 DEBUGGING VERCEL ERRORS

### **View Logs:**
1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments"
4. Click on latest deployment
5. Click "View Function Logs"

### **Common Errors:**

**Error: "Cannot find module '@supabase/supabase-js'"**
```bash
# Solution: Add to package.json dependencies
npm install @supabase/supabase-js
```

**Error: "SUPABASE_URL is not defined"**
```
# Solution: Add environment variables in Vercel dashboard
```

**Error: "Invalid JWT secret"**
```
# Solution: Generate a proper JWT secret (min 32 chars)
```

---

## 🎯 COMPLETE ENVIRONMENT VARIABLES CHECKLIST

**Required for Basic Functionality:**
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `JWT_SECRET`
- [ ] `NODE_ENV=production`

**Required for AI Scans:**
- [ ] `OPENAI_API_KEY`

**Optional (Can be added later):**
- [ ] `RAZORPAY_ENABLED=false`
- [ ] `RAZORPAY_KEY_ID`
- [ ] `RAZORPAY_KEY_SECRET`
- [ ] `AFFILIATE_TAG`
- [ ] `FLIPKART_ID`

---

## 🚀 QUICK FIX SUMMARY

**1. Add Environment Variables in Vercel:**
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - JWT_SECRET
   - NODE_ENV=production

**2. Redeploy:**
   - Vercel Dashboard → Deployments → Redeploy

**3. Test:**
   - Visit: https://face-guard-ai-2.vercel.app/health
   - Should return: `{ "status": "ok" }`

**4. Try Signup:**
   - Visit: https://face-guard-ai-2.vercel.app/signup
   - Create account
   - Should work!

---

## 📞 STILL GETTING 500 ERROR?

### **Check Vercel Function Logs:**

1. **Go to Vercel Dashboard**
2. **Click your project**
3. **Go to "Deployments"**
4. **Click latest deployment**
5. **Click "View Function Logs"**
6. **Look for error messages**

### **Common Log Errors:**

**"Error: connect ECONNREFUSED"**
- Database connection failed
- Check SUPABASE_URL and SUPABASE_ANON_KEY

**"Error: Invalid JWT secret"**
- JWT_SECRET is missing or too short
- Generate a new one (min 32 chars)

**"Error: Cannot find module"**
- Missing dependency
- Check package.json

**"Error: Environment variable not found"**
- Missing env var in Vercel dashboard
- Add it and redeploy

---

## 🎯 FINAL CHECKLIST

Before asking for help, verify:
- [ ] Environment variables added in Vercel
- [ ] SUPABASE_URL is correct
- [ ] SUPABASE_ANON_KEY is correct
- [ ] JWT_SECRET is at least 32 characters
- [ ] Redeployed after adding env vars
- [ ] Checked Vercel function logs
- [ ] Tested /health endpoint
- [ ] Tested /api/auth/signup endpoint

---

## 💡 PRO TIPS

**1. Test Locally First:**
```bash
# Set env vars in config.env
# Test locally
npm start

# If works locally, deploy to Vercel
```

**2. Use Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy with env vars
vercel --prod
```

**3. Check Vercel Build Logs:**
- Look for build errors
- Check if all dependencies installed
- Verify no syntax errors

---

## 🔗 HELPFUL LINKS

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Env Vars Guide:** https://vercel.com/docs/environment-variables
- **JWT Generator:** https://www.grc.com/passwords.htm

---

**🎉 After following these steps, your signup should work perfectly on Vercel!**
