// Load environment variables
// In Vercel, env vars are automatically available, no need for config.env
if (process.env.VERCEL !== '1' && !process.env.VERCEL_ENV) {
  require('dotenv').config({ path: './config.env' });
}
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

// Validate environment variables (FAIL FAST if missing)
// Skip validation in Vercel build phase, validate at runtime
try {
  if (process.env.VERCEL !== '1' && !process.env.VERCEL_ENV) {
    require('./backend/config/validateEnv')();
  }
} catch (error) {
  // In Vercel, log but don't exit (env vars might be set in dashboard)
  if (process.env.VERCEL === '1' || process.env.VERCEL_ENV) {
    console.warn('Environment validation warning:', error.message);
  } else {
    console.error(error.message);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure required directories exist
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Security middleware (APPLY FIRST - Critical for production)
app.use(securityHeaders);
app.use(sanitizeData);
app.use(preventXSS);
app.use(preventHPP);
app.use(sanitizeRequest);
app.use(logSecurityEvents);

// CORS with proper configuration (from security.js)
app.use(cors(corsOptions));

// Body parsing with size limits
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

// Apply general rate limiter to all API routes
app.use('/api', generalLimiter);

// Import routes
const authRoutes = require('./backend/routes/auth');
const scanRoutes = require('./backend/routes/scan');
const userRoutes = require('./backend/routes/user');
const progressRoutes = require('./backend/routes/progress');

// API Routes with specific rate limiters
// Note: authLimiter already limits auth routes, createAccountLimiter is applied in auth.js
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/scan', scanLimiter, scanRoutes);
app.use('/api/user', userRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FaceGuard AI Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'FaceGuard AI API',
    version: '1.0.0',
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

// Start server (only if not in Vercel/serverless environment)
if (process.env.VERCEL !== '1' && !process.env.VERCEL_ENV) {
  app.listen(PORT, () => {
    logger.info(`🚀 FaceGuard AI Server running on port ${PORT}`);
    logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🚀 FaceGuard AI Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  });
}

// Export for Vercel serverless
module.exports = app;
