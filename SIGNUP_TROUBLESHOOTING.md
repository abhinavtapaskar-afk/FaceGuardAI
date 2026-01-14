# 🔧 SIGNUP TROUBLESHOOTING GUIDE

## ✅ FIXES APPLIED

### **1. API Response Handling** ✅
**File:** `frontend/src/services/api.js`

**Issue:** API was not properly handling the nested response structure
**Fix:** Updated to correctly extract data from backend response

### **2. Better Error Handling** ✅
**File:** `frontend/src/pages/SignupPage.jsx`

**Added:**
- Console logging for debugging
- Better error messages
- Loading state management
- Debug info panel (development only)

---

## 🐛 COMMON ISSUES & SOLUTIONS

### **Issue 1: Button Does Nothing**

**Symptoms:**
- Click "Create Account" button
- Nothing happens
- No error message

**Causes & Solutions:**

**A) Backend Not Running**
```bash
# Check if backend is running
curl http://localhost:3000/health

# If not running, start it:
cd backend
npm start
```

**B) Wrong API URL**
```bash
# Check frontend .env file
cat frontend/.env

# Should have:
VITE_API_URL=http://localhost:3000/api

# If missing, create it:
echo "VITE_API_URL=http://localhost:3000/api" > frontend/.env

# Restart frontend:
npm run dev
```

**C) CORS Issues**
```javascript
// Check backend app.js has CORS enabled:
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

---

### **Issue 2: "User Already Exists" Error**

**Solution:**
```sql
-- Check if email exists in database
SELECT * FROM users WHERE email = 'your@email.com';

-- If exists and you want to delete:
DELETE FROM users WHERE email = 'your@email.com';

-- Or use a different email
```

---

### **Issue 3: Validation Errors**

**Check:**
- [ ] Name is at least 2 characters
- [ ] Email is valid format
- [ ] Password is at least 6 characters
- [ ] Passwords match
- [ ] Consent checkbox is checked

---

### **Issue 4: Network Errors**

**Check Browser Console:**
```
F12 → Console Tab
Look for errors like:
- "Failed to fetch"
- "Network error"
- "CORS error"
- "404 Not Found"
```

**Solutions:**
```bash
# 1. Check backend is running
curl http://localhost:3000/health

# 2. Check frontend can reach backend
curl http://localhost:3000/api/auth/signup -X POST

# 3. Check firewall/antivirus not blocking
```

---

## 🧪 TESTING STEPS

### **Step 1: Check Backend**
```bash
# Terminal 1: Start backend
cd backend
npm start

# Should see:
# Server running on port 3000
# Database connected
```

### **Step 2: Check Frontend**
```bash
# Terminal 2: Start frontend
cd frontend
npm run dev

# Should see:
# Local: http://localhost:5173
```

### **Step 3: Test Signup**
1. Open http://localhost:5173/signup
2. Open browser console (F12)
3. Fill in form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm: test123
   - Check consent box
4. Click "Create Account"
5. Watch console for logs

**Expected Console Output:**
```
Signup form submitted
Starting signup process...
Fetching user IP...
User IP: xxx.xxx.xxx.xxx
Sending signup request with data: {...}
Signup response: { success: true, data: {...} }
Navigating to dashboard...
```

---

## 🔍 DEBUGGING CHECKLIST

### **Backend Checks**
- [ ] Backend server is running (port 3000)
- [ ] Database is connected (Supabase)
- [ ] `/api/auth/signup` route exists
- [ ] CORS is enabled
- [ ] Environment variables are set

### **Frontend Checks**
- [ ] Frontend is running (port 5173)
- [ ] `VITE_API_URL` is set correctly
- [ ] Browser console shows no errors
- [ ] Network tab shows API request
- [ ] Form validation passes

### **Database Checks**
- [ ] Supabase is accessible
- [ ] `users` table exists
- [ ] Table has correct columns
- [ ] No duplicate email constraint violation

---

## 📊 DEBUGGING WITH CONSOLE

**Open Browser Console (F12) and check:**

### **1. Form Submission**
```javascript
// Should see:
"Signup form submitted"
"Starting signup process..."
```

### **2. API Request**
```javascript
// Should see:
"Sending signup request with data: {
  name: 'Test User',
  email: 'test@example.com',
  password: '***hidden***',
  consent_accepted: true,
  ...
}"
```

### **3. API Response**
```javascript
// Success:
"Signup response: {
  success: true,
  data: {
    user: {...},
    token: '...'
  }
}"

// Error:
"Signup error: Error: User already exists"
```

---

## 🌐 NETWORK TAB DEBUGGING

**Open Network Tab (F12 → Network):**

1. **Check Request:**
   - URL: `http://localhost:3000/api/auth/signup`
   - Method: POST
   - Status: 201 (success) or 400/500 (error)

2. **Check Request Payload:**
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "test123",
     "consent_accepted": true,
     "consent_timestamp": "2024-01-01T00:00:00.000Z",
     "consent_ip_address": "xxx.xxx.xxx.xxx"
   }
   ```

3. **Check Response:**
   ```json
   {
     "success": true,
     "message": "User created successfully",
     "data": {
       "user": {
         "id": "...",
         "email": "test@example.com",
         "name": "Test User"
       },
       "token": "eyJhbGc..."
     }
   }
   ```

---

## 🚨 COMMON ERROR MESSAGES

### **"Please fill in all fields"**
- One or more fields are empty
- Fill in all required fields

### **"Password must be at least 6 characters"**
- Password is too short
- Use at least 6 characters

### **"Passwords do not match"**
- Password and Confirm Password don't match
- Re-type passwords carefully

### **"Please agree to the Privacy Policy and Terms of Use"**
- Consent checkbox not checked
- Check the consent box

### **"User already exists with this email"**
- Email is already registered
- Use a different email or login instead

### **"Signup failed. Please try again."**
- Generic error
- Check browser console for details
- Check backend logs

---

## 🔧 QUICK FIXES

### **Fix 1: Clear Browser Cache**
```
Ctrl + Shift + Delete
Clear cache and cookies
Reload page
```

### **Fix 2: Restart Everything**
```bash
# Stop backend (Ctrl+C)
# Stop frontend (Ctrl+C)

# Start backend
cd backend
npm start

# Start frontend (new terminal)
cd frontend
npm run dev
```

### **Fix 3: Check Environment Variables**
```bash
# Backend: config.env
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
JWT_SECRET=...

# Frontend: .env
VITE_API_URL=http://localhost:3000/api
```

### **Fix 4: Reinstall Dependencies**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 STILL NOT WORKING?

### **Collect This Information:**

1. **Browser Console Errors:**
   - F12 → Console
   - Copy all red errors

2. **Network Tab:**
   - F12 → Network
   - Find `/auth/signup` request
   - Copy request and response

3. **Backend Logs:**
   - Check terminal where backend is running
   - Copy any error messages

4. **Environment:**
   - OS: Windows/Mac/Linux
   - Browser: Chrome/Firefox/Safari
   - Node version: `node --version`

---

## ✅ SUCCESS INDICATORS

**You'll know signup works when:**
- ✅ Console shows "Signup response: { success: true }"
- ✅ Toast notification: "Account created successfully! 🎉"
- ✅ Redirected to /dashboard
- ✅ User appears in database
- ✅ Token stored in localStorage

---

## 🎯 FINAL CHECKLIST

Before asking for help, verify:
- [ ] Backend is running
- [ ] Frontend is running
- [ ] Database is connected
- [ ] Environment variables are set
- [ ] CORS is enabled
- [ ] All form fields are filled
- [ ] Consent checkbox is checked
- [ ] Browser console checked
- [ ] Network tab checked
- [ ] No duplicate email

---

**🔧 If you've checked everything and it still doesn't work, share the console logs and network tab details!**
