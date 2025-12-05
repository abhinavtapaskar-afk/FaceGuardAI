# 🧪 FaceGuard AI - Testing Guide

Complete guide to test all features of FaceGuard AI

---

## 🚀 Prerequisites

1. Server running on `http://localhost:3000`
2. Postman or Thunder Client installed
3. Test selfie image ready (front-facing, good lighting)

---

## 📝 Test Scenarios

### ✅ Test 1: Health Check

**Purpose:** Verify server is running

**Request:**
```
GET http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "FaceGuard AI Server is running",
  "timestamp": "2024-12-05T..."
}
```

**Status Code:** 200

---

### ✅ Test 2: User Signup

**Purpose:** Create new user account

**Request:**
```
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securepass123",
  "name": "John Doe"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john.doe@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Status Code:** 201

**Save the token for next tests!**

---

### ✅ Test 3: User Login

**Purpose:** Login with existing account

**Request:**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securepass123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john.doe@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Status Code:** 200

---

### ✅ Test 4: Invalid Login

**Purpose:** Test error handling

**Request:**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "wrongpassword"
}
```

**Expected Response:**
```json
{
  "error": true,
  "message": "Invalid email or password"
}
```

**Status Code:** 401

---

### ✅ Test 5: Get User Profile

**Purpose:** Fetch authenticated user's profile

**Request:**
```
GET http://localhost:3000/api/user/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "created_at": "2024-12-05T...",
      "updated_at": "2024-12-05T..."
    }
  }
}
```

**Status Code:** 200

---

### ✅ Test 6: Skin Scan (Main Feature!)

**Purpose:** Upload selfie and get AI analysis

**Request:**
```
POST http://localhost:3000/api/scan
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

Body:
- photo: [Select your selfie image file]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Skin analysis completed",
  "data": {
    "scanId": "uuid-here",
    "skinType": "Combination",
    "issues": [
      {
        "category": "Acne & Blemishes",
        "severity": "Moderate",
        "details": "Visible whiteheads and blackheads in T-zone"
      },
      {
        "category": "Texture",
        "severity": "Mild",
        "details": "Slightly enlarged pores on nose and cheeks"
      }
    ],
    "confidence": 85,
    "recommendations": {
      "products": [
        {
          "type": "Acne Treatment Serum",
          "product": "2% Salicylic acid serum",
          "activeIngredients": ["Salicylic acid", "Niacinamide"],
          "purpose": "Unclogs pores, reduces acne",
          "when": "Night",
          "frequency": "Start 2-3x per week",
          "expectedResults": "4-8 weeks"
        }
      ],
      "routine": {
        "morning": [
          {
            "step": 1,
            "type": "Cleanser",
            "product": "Balanced gel cleanser",
            "when": "Morning"
          }
        ],
        "night": [...]
      },
      "diet": [
        "Drink 8-10 glasses of water daily",
        "Reduce dairy intake",
        "Include omega-3 foods"
      ],
      "lifestyle": [
        "💤 Sleep 7-8 hours nightly",
        "☀️ Wear sunscreen daily",
        "💧 Stay hydrated"
      ],
      "safetyWarnings": [
        "⚠️ CRITICAL: Do NOT use Retinol and AHA/BHA on same night",
        "✅ Always patch test new products"
      ]
    },
    "imageUrl": "/uploads/scan-1234567890.jpg"
  }
}
```

**Status Code:** 200

**This is the core feature - test thoroughly!**

---

### ✅ Test 7: Get Scan History

**Purpose:** Retrieve all past scans

**Request:**
```
GET http://localhost:3000/api/scan?limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "scans": [
      {
        "id": "uuid-1",
        "user_id": "user-uuid",
        "skin_type": "Combination",
        "issues": [...],
        "created_at": "2024-12-05T..."
      }
    ],
    "count": 1
  }
}
```

**Status Code:** 200

---

### ✅ Test 8: Get Specific Scan

**Purpose:** Get details of a single scan

**Request:**
```
GET http://localhost:3000/api/scan/SCAN_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "scan": {
      "id": "scan-uuid",
      "skin_type": "Combination",
      "issues": [...],
      "created_at": "..."
    },
    "recommendations": {
      "products": [...],
      "routine": {...},
      "diet": [...],
      "lifestyle": [...]
    }
  }
}
```

**Status Code:** 200

---

### ✅ Test 9: Save Weekly Progress

**Purpose:** Track skin improvement

**Request:**
```
POST http://localhost:3000/api/progress
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "scanId": "your-scan-uuid",
  "acneSeverity": 3,
  "oilinessLevel": 4,
  "redness": 2,
  "darkSpots": 3,
  "texture": 2,
  "notes": "Skin is improving, less breakouts this week"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Progress saved",
  "data": {
    "progress": {
      "id": "progress-uuid",
      "user_id": "user-uuid",
      "scan_id": "scan-uuid",
      "acne_severity": 3,
      "oiliness_level": 4,
      "created_at": "..."
    }
  }
}
```

**Status Code:** 200

---

### ✅ Test 10: Get Progress History

**Purpose:** View weekly progress over time

**Request:**
```
GET http://localhost:3000/api/progress?weeks=4
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "progress": [
      {
        "id": "uuid-1",
        "acne_severity": 3,
        "oiliness_level": 4,
        "created_at": "2024-12-05T..."
      },
      {
        "id": "uuid-2",
        "acne_severity": 2,
        "oiliness_level": 3,
        "created_at": "2024-11-28T..."
      }
    ],
    "count": 2
  }
}
```

**Status Code:** 200

---

## 🔒 Security Tests

### Test 11: Access Without Token

**Request:**
```
GET http://localhost:3000/api/user/profile
(No Authorization header)
```

**Expected Response:**
```json
{
  "error": true,
  "message": "No token provided. Authorization denied."
}
```

**Status Code:** 401

---

### Test 12: Invalid Token

**Request:**
```
GET http://localhost:3000/api/user/profile
Authorization: Bearer invalid-token-here
```

**Expected Response:**
```json
{
  "error": true,
  "message": "Invalid token. Authorization denied."
}
```

**Status Code:** 401

---

## 📊 Postman Collection

### Import This Collection

Create a new Postman collection with these requests:

1. **Health Check** - GET `/health`
2. **Signup** - POST `/api/auth/signup`
3. **Login** - POST `/api/auth/login`
4. **Get Profile** - GET `/api/user/profile`
5. **Scan Face** - POST `/api/scan`
6. **Get Scans** - GET `/api/scan`
7. **Get Scan Details** - GET `/api/scan/:scanId`
8. **Save Progress** - POST `/api/progress`
9. **Get Progress** - GET `/api/progress`

### Environment Variables

Set these in Postman:
- `base_url`: `http://localhost:3000`
- `token`: (Set after login)

---

## 🎯 Test Checklist

- [ ] Server starts without errors
- [ ] Health check returns 200
- [ ] Can create new user
- [ ] Can login with correct credentials
- [ ] Login fails with wrong password
- [ ] Can access profile with token
- [ ] Cannot access profile without token
- [ ] Can upload and analyze selfie
- [ ] AI returns skin type and issues
- [ ] Recommendations are generated
- [ ] Can view scan history
- [ ] Can get specific scan details
- [ ] Can save weekly progress
- [ ] Can view progress history
- [ ] File upload validates image types
- [ ] Large files are rejected

---

## 🐛 Common Issues & Solutions

### "Module not found"
```bash
npm install
```

### "Database connection failed"
- Check Supabase credentials in `config.env`
- Verify schema was run in Supabase

### "OpenAI API error"
- Check API key is correct
- Verify you have credits
- Check internet connection

### "File too large"
- Max size is 10MB
- Compress image before upload

### "Invalid file type"
- Only JPEG, PNG, JPG allowed
- Check file extension

---

## 📈 Performance Testing

### Test with Multiple Users

1. Create 5-10 test accounts
2. Upload scans from each
3. Monitor response times
4. Check database performance

### Expected Response Times

- Health check: < 50ms
- Signup/Login: < 200ms
- Profile fetch: < 100ms
- Skin scan: 3-5 seconds (AI processing)
- Get scans: < 200ms
- Save progress: < 200ms

---

## ✅ Production Testing

Before deploying:

1. Test all endpoints locally
2. Test with real selfies
3. Verify AI accuracy
4. Check error handling
5. Test security measures
6. Monitor OpenAI costs
7. Check database queries
8. Test file uploads
9. Verify CORS settings
10. Test on mobile network

---

**All tests passing? You're ready to deploy! 🚀**
