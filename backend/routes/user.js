const express = require('express');
const authMiddleware = require('../middleware/auth');
const { db } = require('../config/database');

const router = express.Router();

// GET /api/user/profile - Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    // Remove sensitive data
    delete user.password_hash;

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: true,
      message: 'Error fetching profile'
    });
  }
});

module.exports = router;
