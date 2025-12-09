const rateLimit = require('express-rate-limit');

// General API rate limiter (100 requests per 15 minutes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: true,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: true,
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Strict rate limiter for authentication endpoints (5 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/signup requests per windowMs
  skipSuccessfulRequests: false,
  message: {
    error: true,
    message: 'Too many authentication attempts, please try again after 15 minutes.'
  },
  handler: (req, res) => {
    res.status(429).json({
      error: true,
      message: 'Too many authentication attempts. Please try again after 15 minutes.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Scan upload rate limiter (5 scans per hour)
const scanLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 scan uploads per hour
  skipSuccessfulRequests: false,
  message: {
    error: true,
    message: 'Upload limit reached. You can upload 5 scans per hour.'
  },
  handler: (req, res) => {
    res.status(429).json({
      error: true,
      message: 'Upload limit reached. You can upload 5 scans per hour. Please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Password reset rate limiter (3 requests per hour)
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  skipSuccessfulRequests: true,
  message: {
    error: true,
    message: 'Too many password reset attempts. Please try again after 1 hour.'
  },
  handler: (req, res) => {
    res.status(429).json({
      error: true,
      message: 'Too many password reset attempts. Please try again after 1 hour.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Email verification rate limiter (3 requests per hour)
const emailVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  skipSuccessfulRequests: true,
  message: {
    error: true,
    message: 'Too many verification email requests. Please try again after 1 hour.'
  },
  handler: (req, res) => {
    res.status(429).json({
      error: true,
      message: 'Too many verification email requests. Please try again after 1 hour.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Create account limiter (prevent spam account creation)
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Max 3 accounts per IP per hour
  skipSuccessfulRequests: false,
  message: {
    error: true,
    message: 'Too many accounts created from this IP. Please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      error: true,
      message: 'Account creation limit reached. Please try again after 1 hour.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  scanLimiter,
  passwordResetLimiter,
  emailVerificationLimiter,
  createAccountLimiter,
};
