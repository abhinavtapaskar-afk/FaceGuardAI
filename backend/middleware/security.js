const helmet = require('helmet');
// Removed express-mongo-sanitize - we use Supabase/PostgreSQL, not MongoDB
const xss = require('xss-clean');
const hpp = require('hpp');

// Extract Supabase domain from URL for CSP
const getSupabaseDomain = () => {
  if (!process.env.SUPABASE_URL) return '';
  try {
    const url = new URL(process.env.SUPABASE_URL);
    return `${url.protocol}//${url.host}`;
  } catch {
    return '';
  }
};

const supabaseDomain = getSupabaseDomain();

// Security headers middleware with hardened CSP
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      scriptSrc: ["'self'", 'https://checkout.razorpay.com'],
      // Hardened: Only allow OpenAI and Supabase domains
      connectSrc: [
        "'self'",
        'https://api.openai.com',
        'https://*.openai.com', // Allow OpenAI subdomains
        supabaseDomain, // Only our Supabase instance
        'https://*.supabase.co', // Supabase CDN if needed
      ].filter(Boolean), // Remove empty strings
      frameSrc: ["'self'", 'https://api.razorpay.com'],
      // Block all other external connections
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

// PostgreSQL injection prevention (replaces mongoSanitize)
// Since we use Supabase/PostgreSQL, we sanitize SQL injection patterns
const sanitizeData = (req, res, next) => {
  // Remove SQL injection patterns
  const sqlInjectionPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/gi, // SQL comment patterns
    /(\%3B)|(;)/gi, // SQL statement separator
    /(\%2F)|(\/)/gi, // Path traversal attempts
    /(\%5C)|(\\)/gi, // Escape sequences
  ];

  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove SQL injection patterns
        sqlInjectionPatterns.forEach(pattern => {
          if (pattern.test(obj[key])) {
            console.warn(`Sanitized potentially malicious SQL input: ${key}`);
            obj[key] = obj[key].replace(pattern, '');
          }
        });
        // Trim whitespace
        obj[key] = obj[key].trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

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
