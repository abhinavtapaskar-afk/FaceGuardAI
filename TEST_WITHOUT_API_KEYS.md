# 🧪 Testing FaceGuard AI Without API Keys

## ✅ You Can Now Test Without API Keys!

The application now supports **MOCK MODE** - you can test everything without OpenAI or Supabase API keys!

---

## 🚀 Quick Start (No API Keys Required)

### Step 1: Update `config.env`

Add this line to enable mock mode:

```env
# Enable Mock Mode (no API keys needed)
TEST_MODE=true
MOCK_MODE=true

# You can leave these as placeholders or empty
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# But you still need JWT_SECRET (for authentication)
JWT_SECRET=test-secret-key-for-development-only-min-32-chars
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**Important:** `JWT_SECRET` is still required (at least 32 characters). Use any random string for testing.

---

### Step 2: Install Dependencies

```bash
npm install
```

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
```

---

## 🧪 What Works in Mock Mode

### ✅ Fully Functional:
- ✅ User signup
- ✅ User login  
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Security middleware
- ✅ Validation
- ✅ Error handling
- ✅ Skin scan upload (returns mock analysis)
- ✅ Recommendations generation
- ✅ All API endpoints

### 🔧 Mocked (No Real API Calls):
- 🔧 Skin analysis (returns realistic mock data)
- 🔧 Database (stores in memory - data lost on restart)

---

## 📝 Testing Examples

### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "FaceGuard AI Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

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

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "user-1",
      "email": "test@example.com",
      "name": "Test User",
      "consent_accepted": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token:**
```bash
export TOKEN="your-token-here"
```

---

### Test 3: User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

---

### Test 4: Skin Scan (Mock Analysis)

```bash
curl -X POST http://localhost:3000/api/scan \
  -H "Authorization: Bearer $TOKEN" \
  -F "photo=@/path/to/any/image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Skin analysis completed",
  "data": {
    "scanId": "scan-1",
    "skinType": "Combination",
    "issues": [
      {
        "category": "Acne & Blemishes",
        "severity": "Mild",
        "details": "Few blackheads and whiteheads detected on T-zone"
      },
      {
        "category": "Pigmentation",
        "severity": "Moderate",
        "details": "Some dark spots and uneven skin tone visible"
      }
    ],
    "confidence": 78,
    "recommendations": {
      "products": [...],
      "routine": {...},
      "diet": [...],
      "lifestyle": [...]
    }
  }
}
```

**Note:** The analysis is mocked, but recommendations are real and based on the mock analysis!

---

## 🔍 Mock Data Details

### Mock Skin Analysis Returns:
- **Skin Type:** Combination
- **Issues:** 
  - Acne & Blemishes (Mild)
  - Pigmentation (Moderate)
  - Texture (Mild)
- **Confidence:** 78%

### Mock Database:
- Stores data in memory
- Data persists during server session
- Data is lost when server restarts
- Perfect for testing!

---

## ⚠️ Important Notes

1. **Mock Mode is for Development Only**
   - Don't use in production
   - Data is not persisted
   - No real AI analysis

2. **JWT_SECRET Still Required**
   - Needed for authentication
   - Use any 32+ character string for testing
   - Example: `test-secret-key-for-development-only-min-32-chars`

3. **File Uploads Still Work**
   - Images are saved to `uploads/` folder
   - But analysis is mocked

4. **All Security Features Work**
   - Rate limiting ✅
   - XSS protection ✅
   - SQL injection protection ✅
   - Validation ✅

---

## 🎯 What You Can Test

- ✅ **Authentication Flow**
  - Signup → Login → Use token
  
- ✅ **API Endpoints**
  - All endpoints work normally
  
- ✅ **Security Features**
  - Rate limiting
  - Input validation
  - Error handling
  
- ✅ **Skin Scan Flow**
  - Upload image → Get mock analysis → Get recommendations
  
- ✅ **Frontend Integration**
  - Connect your React frontend
  - Test full user flow

---

## 🚀 Switching to Real APIs

When you're ready to use real APIs:

1. **Get API Keys:**
   - OpenAI: https://platform.openai.com/api-keys
   - Supabase: https://supabase.com/dashboard

2. **Update `config.env`:**
   ```env
   TEST_MODE=false
   MOCK_MODE=false
   OPENAI_API_KEY=sk-your-real-key
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-real-key
   ```

3. **Restart Server:**
   ```bash
   npm run dev
   ```

---

## 🐛 Troubleshooting

### Server won't start
- ✅ Check `JWT_SECRET` is set (32+ characters)
- ✅ Check `NODE_ENV` is set to `development`

### Mock mode not working
- ✅ Set `TEST_MODE=true` in `config.env`
- ✅ Or leave API keys as placeholders

### Authentication errors
- ✅ Make sure `JWT_SECRET` is set
- ✅ Token expires after 24 hours

---

## ✅ Testing Checklist

- [ ] Server starts in mock mode
- [ ] Health check works
- [ ] User signup works
- [ ] User login works
- [ ] JWT token works
- [ ] Skin scan returns mock analysis
- [ ] Recommendations are generated
- [ ] Rate limiting works
- [ ] Security middleware works

---

**Happy Testing! 🎉**

You can now test everything without spending money on API keys!

