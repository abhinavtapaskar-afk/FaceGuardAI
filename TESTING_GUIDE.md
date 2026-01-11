# 🧪 FaceGuard AI - Testing Guide

## ✅ Pre-Testing Checklist

Before testing, ensure you have:

1. ✅ **Environment Variables Set Up**
   - Copy `config.env` and fill in all required values
   - Required variables:
     - `OPENAI_API_KEY` - Your OpenAI API key
     - `SUPABASE_URL` - Your Supabase project URL
     - `SUPABASE_ANON_KEY` - Your Supabase anon key
     - `JWT_SECRET` - A random secret (at least 32 characters)
     - `NODE_ENV` - Set to `development` for testing

2. ✅ **Dependencies Installed**
   ```bash
   npm install
   ```

3. ✅ **Database Setup**
   - Run database migrations in Supabase SQL Editor
   - Ensure tables are created: `users`, `scans`, `recommendations`, `weekly_progress`

---

## 🚀 Quick Start Testing

### Step 1: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

**Expected Output:**
```
✅ Environment variables validated successfully
🚀 FaceGuard AI Server running on port 3000
📍 Environment: development
🔗 Health check: http://localhost:3000/health
```

**If you see errors:**
- ❌ Missing environment variables → Check `config.env` file
- ❌ Port already in use → Change `PORT` in `config.env`
- ❌ Database connection error → Check Supabase credentials

---

### Step 2: Test Health Check

Open browser or use curl:
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "FaceGuard AI Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### Step 3: Test API Root

```bash
curl http://localhost:3000/
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

---

## 🔐 Testing Authentication

### Test 1: User Signup

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

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "test@example.com",
      "name": "Test User",
      "consent_accepted": true
    },
    "token": "jwt-token-here"
  }
}
```

**Common Errors:**
- `Password must be at least 8 characters` → Use password with 8+ chars, number, special char
- `You must agree to the Privacy Policy` → Set `consent_accepted: true`
- `User already exists` → Use different email or delete existing user

---

### Test 2: User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "test@example.com",
      "name": "Test User",
      "glow_score": 0,
      "streak_count": 0,
      "total_scans": 0,
      "is_premium": false
    },
    "token": "jwt-token-here"
  }
}
```

**Save the token** for authenticated requests:
```bash
export TOKEN="your-jwt-token-here"
```

---

### Test 3: Test Rate Limiting

Try making 6 signup requests quickly:
```bash
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"email":"test'$i'@example.com","password":"Test123!@#","name":"Test","consent_accepted":true}'
  echo ""
done
```

**Expected:** First 5 succeed, 6th returns rate limit error (429)

---

## 📸 Testing Skin Scan

### Test 4: Upload and Analyze Skin

**Note:** You need a real image file for this test.

```bash
curl -X POST http://localhost:3000/api/scan \
  -H "Authorization: Bearer $TOKEN" \
  -F "photo=@/path/to/your/image.jpg"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Skin analysis completed",
  "data": {
    "scanId": "uuid-here",
    "skinType": "Oily",
    "issues": [...],
    "confidence": 85,
    "recommendations": {...},
    "imageUrl": "/uploads/scan-xxx.jpg"
  }
}
```

**Common Errors:**
- `No token provided` → Include Authorization header
- `Token expired` → Login again to get new token
- `No photo uploaded` → Include image file in request
- `File size exceeds limit` → Use image < 10MB

---

## 🔍 Testing Security Features

### Test 5: Test XSS Protection

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "<script>alert(1)</script>@test.com",
    "password": "Test123!@#",
    "name": "<img src=x onerror=alert(1)>",
    "consent_accepted": true
  }'
```

**Expected:** XSS attempts are sanitized, request may fail validation

---

### Test 6: Test SQL Injection Protection

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com\"; DROP TABLE users; --",
    "password": "Test123!@#"
  }'
```

**Expected:** SQL injection patterns are sanitized, request fails safely

---

### Test 7: Test CORS

```bash
curl -X OPTIONS http://localhost:3000/api/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**Expected:** CORS headers present, allows your frontend origin

---

## 📊 Testing User Endpoints

### Test 8: Get User Profile

```bash
curl http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** Returns user profile data

---

### Test 9: Get Scan History

```bash
curl http://localhost:3000/api/scan \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** Returns list of user's scans

---

## 🐛 Troubleshooting

### Server Won't Start

**Error: Missing required environment variables**
- ✅ Check `config.env` file exists
- ✅ Verify all required variables are set
- ✅ Check file path is correct

**Error: Port already in use**
```bash
# Change PORT in config.env or kill process
lsof -ti:3000 | xargs kill -9  # Mac/Linux
```

**Error: Cannot connect to database**
- ✅ Check Supabase URL and key
- ✅ Verify Supabase project is active
- ✅ Check internet connection

---

### Authentication Issues

**Error: Invalid token**
- ✅ Token may be expired (24h expiration)
- ✅ Login again to get new token
- ✅ Check JWT_SECRET matches

**Error: Password validation failed**
- ✅ Password must be 8+ characters
- ✅ Must contain at least one number
- ✅ Must contain at least one special character

---

### Rate Limiting Issues

**Error: Too many requests**
- ✅ Wait for rate limit window to reset
- ✅ Check rate limit configuration in `rateLimiter.js`
- ✅ Use different IP for testing

---

## ✅ Testing Checklist

- [ ] Server starts without errors
- [ ] Health check endpoint works
- [ ] User signup works
- [ ] User login works
- [ ] JWT token is valid
- [ ] Rate limiting works
- [ ] XSS protection works
- [ ] SQL injection protection works
- [ ] CORS headers present
- [ ] File upload works
- [ ] Skin analysis works
- [ ] Error handling works
- [ ] Logging works

---

## 🎯 Next Steps

After basic testing:

1. **Test with Frontend**
   - Connect your React frontend
   - Test full user flow
   - Verify CORS works

2. **Load Testing**
   - Use tools like Apache Bench or k6
   - Test rate limiting under load
   - Monitor server performance

3. **Security Testing**
   - Run security audit tools
   - Test all endpoints
   - Verify all protections work

---

## 📝 Notes

- **Development Mode:** More verbose logging, stack traces in errors
- **Production Mode:** Minimal logging, no stack traces
- **Rate Limits:** Reset after time window expires
- **Tokens:** Expire after 24 hours

---

**Happy Testing! 🚀**

