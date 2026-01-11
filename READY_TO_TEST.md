# ✅ Ready to Test Checklist

## 📋 Your Current Configuration

✅ **JWT_SECRET**: Set (32 characters - minimum required)  
✅ **TEST_MODE**: Enabled (mock mode active)  
✅ **NODE_ENV**: development  
✅ **PORT**: 3000  
✅ **API Keys**: Placeholders (will use mocks)

---

## 🚀 Pre-Test Steps

### Step 1: Install Dependencies (REQUIRED)

```bash
cd FaceGuardAI
npm install
```

**This will install all required packages.**

---

### Step 2: Verify Configuration

Your `config.env` looks good! ✅

- ✅ JWT_SECRET is set (32 chars)
- ✅ TEST_MODE=true (enables mock mode)
- ✅ API keys are placeholders (will use mocks)

---

### Step 3: Start the Server

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

---

## 🧪 Quick Test

### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

**Expected:**
```json
{
  "status": "ok",
  "message": "FaceGuard AI Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Test 2: User Signup

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "name": "Test User",
    "consent_accepted": true
  }'
```

**Expected:** Success response with user and token

---

## ✅ You're Ready If:

- [x] `JWT_SECRET` is set (✅ You have it)
- [x] `TEST_MODE=true` (✅ You have it)
- [ ] Dependencies installed (`npm install` - **DO THIS FIRST**)
- [ ] Server starts without errors
- [ ] Health check works

---

## 🐛 If You Get Errors

### "Cannot find module"
→ Run `npm install`

### "Port 3000 already in use"
→ Change `PORT=3001` in `config.env` or kill the process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### "Missing required environment variables"
→ Check `config.env` file exists and has `JWT_SECRET`

---

## 🎯 Next Steps After Server Starts

1. ✅ Test health endpoint
2. ✅ Test user signup
3. ✅ Test user login
4. ✅ Test skin scan (with any image)
5. ✅ Test all endpoints

---

**You're almost ready! Just run `npm install` first, then start the server! 🚀**

