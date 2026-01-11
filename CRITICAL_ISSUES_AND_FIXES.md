# 🚨 Critical Issues Found in FaceGuard AI

## ⚠️ CRITICAL SECURITY ISSUES

### 1. **Security Middleware Not Applied** 🔴 CRITICAL
**Issue:** Security middleware (`securityHeaders`, `sanitizeData`, `preventXSS`) is defined but NOT used in `app.js`

**Risk:** No XSS protection, no SQL injection prevention, no security headers

**Fix Required:** Add security middleware to `app.js`

---

### 2. **Rate Limiters Not Applied** 🔴 CRITICAL
**Issue:** Rate limiters are defined but NOT applied to routes

**Risk:** Vulnerable to DDoS attacks, brute force attacks, API abuse

**Fix Required:** Apply rate limiters to routes in `app.js`

---

### 3. **CORS Configuration Insecure** 🟠 HIGH
**Issue:** Using wildcard `'*'` for CORS in production

**Risk:** Allows any origin to access your API

**Fix Required:** Use proper CORS configuration from `security.js`

---

### 4. **Password Validation Mismatch** 🟠 HIGH
**Issue:** `auth.js` still uses old 6-character minimum, but `validation.js` requires 8+ chars

**Risk:** Inconsistent validation, users can bypass strong password requirements

**Fix Required:** Use validation middleware in auth routes

---

### 5. **Environment Variables Not Validated** 🟠 HIGH
**Issue:** No validation that required env vars exist on startup

**Risk:** App crashes at runtime instead of failing fast on startup

**Fix Required:** Add env var validation on startup

---

### 6. **Error Handler Not Applied** 🟡 MEDIUM
**Issue:** Error handler middleware exists but not properly integrated

**Risk:** Errors not properly logged/formatted

**Fix Required:** Use error handler from `errorHandler.js`

---

### 7. **Validation Middleware Not Used** 🟡 MEDIUM
**Issue:** Validation middleware exists but not applied to auth routes

**Risk:** Inconsistent validation, potential security issues

**Fix Required:** Apply validation middleware to routes

---

### 8. **Unused Dependencies** 🟡 MEDIUM
**Issue:** `express-mongo-sanitize` still in package.json (we use PostgreSQL)

**Risk:** Unnecessary dependency, confusion

**Fix Required:** Remove from package.json

---

### 9. **No Request Logging** 🟡 MEDIUM
**Issue:** Morgan is installed but not used

**Risk:** No HTTP request logging for debugging/monitoring

**Fix Required:** Add Morgan middleware

---

### 10. **JWT Token Expiration Too Long** 🟡 MEDIUM
**Issue:** JWT tokens expire in 7 days (too long)

**Risk:** Compromised tokens remain valid for too long

**Fix Required:** Reduce to 24 hours, add refresh token mechanism

---

## 📋 FIXES REQUIRED

### Fix 1: Update `app.js` - Add Security Middleware

```javascript
require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

// Import security middleware
const { 
  securityHeaders, 
  sanitizeData, 
  preventXSS, 
  preventHPP,
  corsOptions,
  sanitizeRequest,
  logSecurityEvents
} = require('./backend/middleware/security');

// Import rate limiters
const { 
  generalLimiter, 
  authLimiter, 
  scanLimiter,
  createAccountLimiter 
} = require('./backend/middleware/rateLimiter');

// Import error handler
const { errorHandler, notFound } = require('./backend/middleware/errorHandler');
const logger = require('./backend/utils/logger');

// Validate environment variables
require('./backend/config/validateEnv');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure required directories exist
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Security middleware (APPLY FIRST)
app.use(securityHeaders);
app.use(sanitizeData);
app.use(preventXSS);
app.use(preventHPP);
app.use(sanitizeRequest);
app.use(logSecurityEvents);

// CORS with proper configuration
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static(UPLOAD_DIR));

// Apply general rate limiter to all routes
app.use('/api', generalLimiter);

// Import routes
const authRoutes = require('./backend/routes/auth');
const scanRoutes = require('./backend/routes/scan');
const userRoutes = require('./backend/routes/user');
const progressRoutes = require('./backend/routes/progress');

// API Routes with specific rate limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/auth/signup', createAccountLimiter, authRoutes);
app.use('/api/scan', scanLimiter, scanRoutes);
app.use('/api/user', userRoutes);
app.use('/api/progress', progressRoutes);

// Health check (no rate limit)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FaceGuard AI Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'FaceGuard AI API',
    version: '2.0.0',
    status: 'active',
    endpoints: {
      auth: '/api/auth',
      scan: '/api/scan',
      user: '/api/user',
      progress: '/api/progress'
    }
  });
});

// 404 handler (before error handler)
app.use(notFound);

// Error handling middleware (MUST BE LAST)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 FaceGuard AI Server running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
```

---

### Fix 2: Create `backend/config/validateEnv.js`

```javascript
const logger = require('../utils/logger');

// Required environment variables
const REQUIRED_ENV_VARS = [
  'OPENAI_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'JWT_SECRET',
  'NODE_ENV'
];

// Validate all required environment variables
function validateEnv() {
  const missing = [];
  
  REQUIRED_ENV_VARS.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    logger.error('Missing required environment variables:', missing);
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your config.env file.'
    );
  }
  
  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET.length < 32) {
    logger.warn('JWT_SECRET is too short. Use at least 32 characters for production.');
  }
  
  // Validate NODE_ENV
  const validEnvs = ['development', 'production', 'test'];
  if (!validEnvs.includes(process.env.NODE_ENV)) {
    logger.warn(`NODE_ENV should be one of: ${validEnvs.join(', ')}`);
  }
  
  logger.info('Environment variables validated successfully');
}

module.exports = validateEnv;
```

---

### Fix 3: Update `backend/routes/auth.js` - Use Validation Middleware

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { validateSignup, validateLogin } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();

// Generate JWT token (reduced expiration)
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } // Changed from 7d to 24h
  };
};

// POST /api/auth/signup
router.post('/signup', validateSignup, asyncHandler(async (req, res) => {
  const { 
    email, 
    password, 
    name, 
    consent_accepted, 
    consent_timestamp, 
    consent_ip_address 
  } = req.body;

  // Consent validation (REQUIRED)
  if (!consent_accepted) {
    return res.status(400).json({
      error: true,
      message: 'You must agree to the Privacy Policy and Terms of Use'
    });
  }

  // Check if user exists
  const existingUser = await db.getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      error: true,
      message: 'User already exists with this email'
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user with consent data
  const userData = {
    email,
    password_hash: passwordHash,
    name,
    consent_accepted: true,
    consent_timestamp: consent_timestamp || new Date().toISOString(),
    consent_ip_address: consent_ip_address || req.ip || req.connection.remoteAddress,
  };

  const user = await db.createUser(userData.email, userData.password_hash, userData.name, userData);

  // Generate token
  const token = generateToken(user.id, user.email);

  logger.logAuth('signup', user.id, true);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        consent_accepted: user.consent_accepted
      },
      token
    }
  });
}));

// POST /api/auth/login
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Get user
  const user = await db.getUserByEmail(email);
  if (!user) {
    logger.logAuth('login', null, false, { email, reason: 'user_not_found' });
    return res.status(401).json({
      error: true,
      message: 'Invalid email or password'
    });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    logger.logAuth('login', user.id, false, { email, reason: 'invalid_password' });
    return res.status(401).json({
      error: true,
      message: 'Invalid email or password'
    });
  }

  // Update last login
  await db.updateUserLastLogin(user.id);

  // Generate token
  const token = generateToken(user.id, user.email);

  logger.logAuth('login', user.id, true);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        glow_score: user.glow_score || 0,
        streak_count: user.current_streak || 0,
        total_scans: user.total_scans || 0,
        is_premium: user.is_premium || false,
        created_at: user.created_at
      },
      token
    }
  });
}));

module.exports = router;
```

---

### Fix 4: Update `backend/config/database.js` - Fix createUser signature

The `createUser` function needs to accept consent data:

```javascript
async createUser(email, passwordHash, name, additionalData = {}) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ 
      email, 
      password_hash: passwordHash, 
      name,
      ...additionalData
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
},
```

---

### Fix 5: Update `package.json` - Remove unused dependency

```json
{
  "dependencies": {
    // ... other dependencies ...
    // REMOVE THIS LINE:
    // "express-mongo-sanitize": "^2.2.0",
  }
}
```

---

## 🎯 Priority Order

1. **IMMEDIATE (Deploy Today):**
   - Fix 1: Add security middleware to app.js
   - Fix 2: Add environment variable validation
   - Fix 3: Apply rate limiters
   - Fix 4: Use validation middleware in auth routes

2. **HIGH PRIORITY (This Week):**
   - Fix 5: Remove unused dependencies
   - Update JWT expiration
   - Add request logging

3. **MEDIUM PRIORITY (Next Sprint):**
   - Add refresh token mechanism
   - Implement request ID tracking
   - Add API versioning

---

## ✅ Testing Checklist

After applying fixes:

- [ ] Test signup with validation middleware
- [ ] Test login with validation middleware
- [ ] Verify rate limiters work
- [ ] Check security headers in response
- [ ] Test CORS with frontend
- [ ] Verify environment variable validation on startup
- [ ] Test error handling
- [ ] Check request logging

---

## 📊 Impact

**Before Fixes:**
- ❌ No XSS protection
- ❌ No rate limiting
- ❌ Insecure CORS
- ❌ Weak password validation
- ❌ No env var validation

**After Fixes:**
- ✅ Full security middleware applied
- ✅ Rate limiting on all routes
- ✅ Secure CORS configuration
- ✅ Strong password validation
- ✅ Environment validation on startup
- ✅ Proper error handling
- ✅ Request logging

---

**Status:** 🔴 CRITICAL FIXES REQUIRED BEFORE PRODUCTION DEPLOYMENT

