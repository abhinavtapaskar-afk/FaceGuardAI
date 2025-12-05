const express = require('express');
const authMiddleware = require('../middleware/auth');
const { db } = require('../config/database');

const router = express.Router();

// POST /api/progress - Save weekly progress
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { scanId, acneSeverity, oilinessLevel, redness, darkSpots, texture, notes } = req.body;

    const progressData = {
      scanId,
      acneSeverity: acneSeverity || 0,
      oilinessLevel: oilinessLevel || 0,
      redness: redness || 0,
      darkSpots: darkSpots || 0,
      texture: texture || 0,
      notes: notes || ''
    };

    const progress = await db.saveWeeklyProgress(req.user.id, progressData);

    res.json({
      success: true,
      message: 'Progress saved',
      data: { progress }
    });
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({
      error: true,
      message: 'Error saving progress'
    });
  }
});

// GET /api/progress - Get weekly progress history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const weeks = parseInt(req.query.weeks) || 4;
    const progressHistory = await db.getWeeklyProgress(req.user.id, weeks);

    res.json({
      success: true,
      data: {
        progress: progressHistory,
        count: progressHistory.length
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      error: true,
      message: 'Error fetching progress'
    });
  }
});

module.exports = router;
