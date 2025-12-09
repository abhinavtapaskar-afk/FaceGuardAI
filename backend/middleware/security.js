const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      scriptSrc: ["'self'", 'https://checkout.razorpay.com'],
      connectSrc: ["'self'", 'https://api.openai.com', process.env.SUPABASE_URL],
      frameSrc: ["'self'", 'https://api.razorpay.com'],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

// Sanitize data to prevent NoSQL injection
const sanitizeData = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized potentially malicious input: ${key}`);
  },
});

// Prevent XSS attacks
const preventXSS = xss();

// Prevent HTTP Parameter Pollution
const preventHPP = hpp({
  whitelist: ['sort', 'filter', 'page', 'limit'], // Allow these params to appear multiple times
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Request sanitization middleware
const sanitizeRequest = (req, res, next) => {
  // Remove any potentially dangerous characters from request body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Remove null bytes
        req.body[key] = req.body[key].replace(/\0/g, '');
        
        // Trim whitespace
        req.body[key] = req.body[key].trim();
      }
    });
  }

  // Remove dangerous characters from query params
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].replace(/\0/g, '').trim();
      }
    });
  }

  next();
};

// Security logging middleware
const logSecurityEvents = (req, res, next) => {
  // Log suspicious activity
  const suspiciousPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // SQL injection
    /(<script|<iframe|javascript:|onerror=|onload=)/i, // XSS
    /(\.\.\/|\.\.\\)/i, // Path traversal
    /(\$where|\$ne|\$gt|\$lt)/i, // NoSQL injection
  ];

  const checkString = JSON.stringify(req.body) + JSON.stringify(req.query);
  
  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(checkString)) {
      console.warn('Suspicious request detected:', {
        ip: req.ip,
        path: req.path,
        method: req.method,
        pattern: pattern.toString(),
        timestamp: new Date().toISOString(),
      });
    }
  });

  next();
};

module.exports = {
  securityHeaders,
  sanitizeData,
  preventXSS,
  preventHPP,
  corsOptions,
  sanitizeRequest,
  logSecurityEvents,
};
