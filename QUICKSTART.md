# ⚡ Quick Start Guide - FaceGuard AI

Get FaceGuard AI running locally in 5 minutes!

## 🎯 Prerequisites

- Node.js 18+ installed
- Git installed
- Text editor (VS Code recommended)

---

## 📥 Step 1: Clone & Install (1 min)

```bash
# Clone repository
git clone https://github.com/abhinavtapaskar-afk/FaceGuardAI.git
cd FaceGuardAI

# Install dependencies
npm install
```

---

## 🔑 Step 2: Get API Keys (3 mins)

### OpenAI API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **Create new secret key**
3. Copy the key (starts with `sk-`)
4. Add $5-10 credits to your account

### Supabase Setup

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to **SQL Editor** → **New Query**
4. Copy contents of `backend/database/schema.sql`
5. Paste and click **Run**
6. Go to **Settings** → **API**
7. Copy **Project URL** and **anon public** key

---

## ⚙️ Step 3: Configure Environment (1 min)

Edit `config.env`:

```env
PORT=3000
NODE_ENV=development

# Add your OpenAI key here
OPENAI_API_KEY=sk-your-key-here

# Add your Supabase credentials here
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Generate a random secret (or use this for testing)
JWT_SECRET=my-super-secret-jwt-key-for-development

FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp
```

**Generate secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Step 4: Run the Server

```bash
npm run dev
```

You should see:
```
🚀 FaceGuard AI Server running on port 3000
📍 Environment: development
🔗 Health check: http://localhost:3000/health
```

---

## ✅ Step 5: Test It!

### Test 1: Health Check

Open browser: [http://localhost:3000/health](http://localhost:3000/health)

Expected:
```json
{
  "status": "ok",
  "message": "FaceGuard AI Server is running"
}
```

### Test 2: Create Account

Using cURL:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

Or use **Postman/Thunder Client**:
- Method: POST
- URL: `http://localhost:3000/api/auth/signup`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "test123",
  "name": "Test User"
}
```

Copy the `token` from response!

### Test 3: Analyze Skin

```bash
curl -X POST http://localhost:3000/api/scan \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "photo=@/path/to/your/selfie.jpg"
```

Or in Postman:
- Method: POST
- URL: `http://localhost:3000/api/scan`
- Headers: `Authorization: Bearer YOUR_TOKEN`
- Body: form-data
  - Key: `photo`
  - Type: File
  - Value: Select your selfie image

---

## 🎨 Using Postman (Recommended)

### Import Collection

1. Open Postman
2. Create new collection "FaceGuard AI"
3. Add these requests:

**1. Signup**
- POST `http://localhost:3000/api/auth/signup`
- Body → raw → JSON:
```json
{
  "email": "your@email.com",
  "password": "yourpassword",
  "name": "Your Name"
}
```

**2. Login**
- POST `http://localhost:3000/api/auth/login`
- Body → raw → JSON:
```json
{
  "email": "your@email.com",
  "password": "yourpassword"
}
```

**3. Scan Face**
- POST `http://localhost:3000/api/scan`
- Headers: `Authorization: Bearer <token-from-login>`
- Body → form-data:
  - Key: `photo`, Type: File, Value: your selfie

**4. Get Scans**
- GET `http://localhost:3000/api/scan`
- Headers: `Authorization: Bearer <token>`

**5. Get Profile**
- GET `http://localhost:3000/api/user/profile`
- Headers: `Authorization: Bearer <token>`

---

## 📁 Project Structure

```
FaceGuardAI/
├── ai_engine/              # AI logic
│   ├── skinAnalyzer.js     # OpenAI Vision
│   └── recommendationEngine.js
├── backend/
│   ├── config/
│   │   └── database.js     # Supabase
│   ├── middleware/
│   │   └── auth.js         # JWT auth
│   ├── routes/
│   │   ├── auth.js         # Login/Signup
│   │   ├── scan.js         # Skin analysis
│   │   ├── user.js         # Profile
│   │   └── progress.js     # Tracking
│   └── database/
│       └── schema.sql      # DB schema
├── uploads/                # Uploaded images
├── app.js                  # Main server
├── package.json
└── config.env              # Your secrets
```

---

## 🐛 Common Issues

### "Cannot find module"
```bash
npm install
```

### "Database connection failed"
- Check Supabase URL and key in `config.env`
- Verify you ran the schema SQL

### "OpenAI API error"
- Check API key is correct
- Verify you have credits
- Ensure key starts with `sk-`

### "Port already in use"
Change PORT in `config.env`:
```env
PORT=3001
```

---

## 🎯 What's Next?

1. **Test all endpoints** with Postman
2. **Upload real selfies** and see AI analysis
3. **Check Supabase** to see saved data
4. **Build frontend** (React guide coming soon)
5. **Deploy to production** (see DEPLOYMENT.md)

---

## 📚 Learn More

- [Full README](README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Master Requirements](master_requirements.md)
- [Architecture](architecture.md)

---

## 🆘 Need Help?

- Check server logs in terminal
- Review Supabase logs
- Open GitHub issue
- Check OpenAI usage dashboard

---

**You're all set! Start building! 🚀**
