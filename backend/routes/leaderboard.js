const express = require('express');
const authMiddleware = require('../middleware/auth');
const { checkLeaderboardAccess } = require('../middleware/tierGating');
const { asyncHandler } = require('../middleware/errorHandler');
const { db } = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();

// GET /api/leaderboard - Get top 100 users
router.get('/',
  authMiddleware,
  checkLeaderboardAccess,
  asyncHandler(async (req, res) => {
    const access = req.leaderboardAccess; // 'full' or 'limited'
    
    // Get top 100 from leaderboard
    const { rows: leaderboard } = await db.query(
      `SELECT 
        rank,
        user_id,
        glow_score,
        total_scans,
        current_streak,
        profile_photo_url,
        username,
        updated_at
      FROM leaderboard
      ORDER BY rank ASC
      LIMIT 100`
    );

    // Format based on access level
    const formattedLeaderboard = leaderboard.map(entry => {
      if (access === 'limited') {
        // Free users: Only profile photo and rank
        return {
          rank: entry.rank,
          profile_photo_url: entry.profile_photo_url || '/default-avatar.png',
          username: entry.username ? entry.username.substring(0, 1) + '***' : 'User',
        };
      } else {
        // Premium users: Full details
        return {
          rank: entry.rank,
          user_id: entry.user_id,
          username: entry.username,
          glow_score: entry.glow_score,
          total_scans: entry.total_scans,
          current_streak: entry.current_streak,
          profile_photo_url: entry.profile_photo_url || '/default-avatar.png',
        };
      }
    });

    // Get current user's rank
    const { rows: userRank } = await db.query(
      `SELECT rank FROM leaderboard WHERE user_id = $1`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        leaderboard: formattedLeaderboard,
        userRank: userRank[0]?.rank || null,
        accessLevel: access,
        total: leaderboard.length,
        message: access === 'limited' 
          ? 'Upgrade to Premium to see full leaderboard details!'
          : null,
      },
    });
  })
);

// GET /api/leaderboard/user/:userId - Get specific user's rank
router.get('/user/:userId',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const { rows } = await db.query(
      `SELECT 
        rank,
        glow_score,
        total_scans,
        current_streak,
        profile_photo_url,
        username
      FROM leaderboard
      WHERE user_id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'User not found in leaderboard',
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  })
);

// POST /api/leaderboard/update - Manually trigger leaderboard update (admin only)
router.post('/update',
  authMiddleware,
  asyncHandler(async (req, res) => {
    // Update leaderboard
    await db.query('SELECT update_leaderboard()');

    logger.info('Leaderboard manually updated', { userId: req.user.id });

    res.json({
      success: true,
      message: 'Leaderboard updated successfully',
    });
  })
);

// PUT /api/leaderboard/visibility - Toggle leaderboard visibility
router.put('/visibility',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { visible } = req.body;

    await db.updateUser(req.user.id, {
      leaderboard_visible: visible,
    });

    logger.info('Leaderboard visibility updated', {
      userId: req.user.id,
      visible,
    });

    res.json({
      success: true,
      message: `Leaderboard visibility ${visible ? 'enabled' : 'disabled'}`,
      data: { visible },
    });
  })
);

module.exports = router;
