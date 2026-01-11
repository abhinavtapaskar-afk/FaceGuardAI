# 🚀 Quick Start Guide - Step by Step

## Step-by-Step Instructions

### Step 1: Open Terminal/Command Prompt

**Option A: In VS Code (Easiest)**
1. Press `Ctrl + ~` (or `Ctrl + backtick`) to open terminal
2. OR go to: `Terminal` → `New Terminal`

**Option B: Windows Command Prompt**
1. Press `Windows + R`
2. Type `cmd` and press Enter
3. Navigate to your project:
   ```bash
   cd C:\Users\pc\Documents\GitHub\FaceGuardAI
   ```

**Option C: PowerShell**
1. Press `Windows + X`
2. Select "Windows PowerShell"
3. Navigate to your project:
   ```powershell
   cd C:\Users\pc\Documents\GitHub\FaceGuardAI
   ```

---

### Step 2: Install Dependencies

In the terminal, type:

```bash
npm install
```

**What this does:**
- Downloads and installs all required packages
- Creates `node_modules` folder
- Takes 1-2 minutes

**Expected Output:**
```
added 150 packages, and audited 151 packages in 2m
```

**If you see errors:**
- Make sure you're in the `FaceGuardAI` folder
- Check you have Node.js installed: `node --version` (should show v18+)

---

### Step 3: Start the Server

After `npm install` completes, type:

```bash
npm run dev
```

**Expected Output:**
```
⚠️  WARNING: Some environment variables are missing:
   - OPENAI_API_KEY
   - SUPABASE_URL
   - SUPABASE_ANON_KEY

📝 Running in TEST/MOCK mode - API calls will be mocked.

🔧 MOCK MODE: Using mock skin analyzer (no OpenAI API key required)
🔧 MOCK MODE: Using mock database (no Supabase required)
✅ Environment variables validated successfully
🚀 FaceGuard AI Server running on port 3000
📍 Environment: development
🔗 Health check: http://localhost:3000/health
```

**✅ Success!** Your server is now running!

---

### Step 4: Test It

**Keep the server running** (don't close the terminal), then:

**Option A: Open in Browser**
1. Open browser
2. Go to: `http://localhost:3000/health`
3. You should see: `{"status":"ok",...}`

**Option B: Test with curl (in a NEW terminal)**
```bash
curl http://localhost:3000/health
```

**Option C: Test Signup**
```bash
curl -X POST http://localhost:3000/api/auth/signup -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"Test123!@#\",\"name\":\"Test User\",\"consent_accepted\":true}"
```

---

## 📋 Complete Command Sequence

Copy and paste these commands one by one:

```bash
# 1. Navigate to project (if not already there)
cd C:\Users\pc\Documents\GitHub\FaceGuardAI

# 2. Install dependencies
npm install

# 3. Start server
npm run dev
```

---

## 🎯 Visual Guide

```
1. Open Terminal
   ↓
2. Type: npm install
   ↓
   [Wait 1-2 minutes]
   ↓
3. Type: npm run dev
   ↓
   [Server starts]
   ↓
4. Open browser: http://localhost:3000/health
   ↓
   ✅ Success!
```

---

## 🐛 Troubleshooting

### "npm is not recognized"
→ Install Node.js: https://nodejs.org/ (download LTS version)

### "Cannot find module"
→ Make sure you're in the `FaceGuardAI` folder
→ Run `npm install` again

### "Port 3000 already in use"
→ Change `PORT=3001` in `config.env`
→ Or close the program using port 3000

### "Missing required environment variables"
→ Check `config.env` file exists
→ Make sure `JWT_SECRET` is set

---

## ✅ Success Checklist

- [ ] Terminal opened
- [ ] `npm install` completed successfully
- [ ] `npm run dev` started server
- [ ] Server shows "running on port 3000"
- [ ] Health check works in browser

---

**That's it! Just 3 commands and you're running! 🚀**

