const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

const router = express.Router();

// Generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      consent_accepted, 
      consent_timestamp, 
      consent_ip_address 
    } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        error: true,
        message: 'Please provide email, password, and name'
      });
    }

    // Consent validation (REQUIRED)
    if (!consent_accepted) {
      return res.status(400).json({
        error: true,
        message: 'You must agree to the Privacy Policy and Terms of Use'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid email format'
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        error: true,
        message: 'Password must be at least 6 characters'
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

    const user = await db.createUser(userData);

    // Generate token
    const token = generateToken(user.id, user.email);

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
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: true,
      message: 'Error creating user'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Please provide email and password'
      });
    }

    // Get user
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        error: true,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await db.updateUserLastLogin(user.id);

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          glow_score: user.glow_score || 0,
          streak_count: user.streak_count || 0,
          total_scans: user.total_scans || 0,
          is_premium: user.is_premium || false,
          created_at: user.created_at
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: true,
      message: 'Error logging in'
    });
  }
});

module.exports = router;
