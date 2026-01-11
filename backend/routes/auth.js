const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { validateSignup, validateLogin } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();

// Generate JWT token (reduced expiration for security)
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } // Changed from 7d to 24h for better security
  );
};

// POST /api/auth/signup (with account creation rate limiter)
router.post('/signup', createAccountLimiter, validateSignup, asyncHandler(async (req, res) => {
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

  const user = await db.createUser(userData.email, userData.password_hash, userData.name, {
    consent_accepted: userData.consent_accepted,
    consent_timestamp: userData.consent_timestamp,
    consent_ip_address: userData.consent_ip_address
  });

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
