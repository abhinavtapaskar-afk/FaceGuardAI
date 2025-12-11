const { db } = require('../config/database');
const { AppError } = require('./errorHandler');
const logger = require('../utils/logger');

// Tier limits configuration
const TIER_LIMITS = {
  free: {
    scansPerWeek: 1,
    scansPerDay: 0, // Not applicable for free
    canAccessPDF: false,
    canAccessFullLeaderboard: false,
    canAccessFullProgress: false,
    canAccessPremiumShareCard: false,
    shareCardType: 'free',
  },
  premium: {
    scansPerWeek: Infinity,
    scansPerDay: 1,
    canAccessPDF: true,
    canAccessFullLeaderboard: true,
    canAccessFullProgress: true,
    canAccessPremiumShareCard: true,
    shareCardType: 'premium',
  },
};

// Get user tier
const getUserTier = (user) => {
  return user.is_premium ? 'premium' : 'free';
};

// Check if user can scan
const checkScanLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await db.getUserById(userId);
    const tier = getUserTier(user);
    const limits = TIER_LIMITS[tier];

    // Reset counters if needed
    await resetCountersIfNeeded(userId, user);

    // Get updated user data
    const updatedUser = await db.getUserById(userId);

    // Check limits based on tier
    if (tier === 'free') {
      // Free users: 1 scan per week
      if (updatedUser.scan_count_this_week >= limits.scansPerWeek) {
        return res.status(403).json({
          error: true,
          message: 'Weekly scan limit reached. Upgrade to Premium for daily scans!',
          limit: {
            tier: 'free',
            scansPerWeek: limits.scansPerWeek,
            scansUsed: updatedUser.scan_count_this_week,
            nextResetDate: updatedUser.week_reset_date,
            upgradeRequired: true,
          },
        });
      }
    } else if (tier === 'premium') {
      // Premium users: 1 scan per day
      if (updatedUser.scan_count_this_day >= limits.scansPerDay) {
        return res.status(403).json({
          error: true,
          message: 'Daily scan limit reached. Come back tomorrow!',
          limit: {
            tier: 'premium',
            scansPerDay: limits.scansPerDay,
            scansUsed: updatedUser.scan_count_this_day,
            nextResetDate: updatedUser.day_reset_date,
          },
        });
      }
    }

    // Attach tier info to request
    req.userTier = tier;
    req.tierLimits = limits;
    next();
  } catch (error) {
    logger.error('Scan limit check error:', error);
    next(error);
  }
};

// Reset counters if needed
const resetCountersIfNeeded = async (userId, user) => {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  let needsUpdate = false;
  const updates = {};

  // Reset weekly counter if needed
  if (user.week_reset_date < weekAgo) {
    updates.scan_count_this_week = 0;
    updates.week_reset_date = today;
    needsUpdate = true;
  }

  // Reset daily counter if needed
  if (user.day_reset_date < today) {
    updates.scan_count_this_day = 0;
    updates.day_reset_date = today;
    needsUpdate = true;
  }

  if (needsUpdate) {
    await db.updateUser(userId, updates);
  }
};

// Increment scan count after successful scan
const incrementScanCount = async (userId, tier) => {
  const updates = {
    last_scan_date: new Date().toISOString().split('T')[0],
  };

  if (tier === 'free') {
    updates.scan_count_this_week = db.raw('scan_count_this_week + 1');
  } else if (tier === 'premium') {
    updates.scan_count_this_day = db.raw('scan_count_this_day + 1');
  }

  await db.updateUser(userId, updates);
  
  // Update streak
  await db.query('SELECT update_user_streak($1)', [userId]);
};

// Check if user can access PDF reports
const requirePremiumForPDF = (req, res, next) => {
  const tier = getUserTier(req.user);
  
  if (!TIER_LIMITS[tier].canAccessPDF) {
    return res.status(403).json({
      error: true,
      message: 'PDF reports are only available for Premium users',
      feature: 'pdf_report',
      upgradeRequired: true,
    });
  }
  
  next();
};

// Check if user can access full leaderboard
const checkLeaderboardAccess = (req, res, next) => {
  const tier = getUserTier(req.user);
  req.leaderboardAccess = TIER_LIMITS[tier].canAccessFullLeaderboard ? 'full' : 'limited';
  next();
};

// Check if user can access full progress graphs
const checkProgressAccess = (req, res, next) => {
  const tier = getUserTier(req.user);
  req.progressAccess = TIER_LIMITS[tier].canAccessFullProgress ? 'full' : 'basic';
  next();
};

// Get share card type based on tier
const getShareCardType = (req, res, next) => {
  const tier = getUserTier(req.user);
  req.shareCardType = TIER_LIMITS[tier].shareCardType;
  next();
};

// Get user limits info
const getUserLimits = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db.getUserById(userId);
    const tier = getUserTier(user);
    const limits = TIER_LIMITS[tier];

    // Reset counters if needed
    await resetCountersIfNeeded(userId, user);
    const updatedUser = await db.getUserById(userId);

    const limitsInfo = {
      tier,
      isPremium: tier === 'premium',
      scans: {
        limit: tier === 'free' ? limits.scansPerWeek : limits.scansPerDay,
        used: tier === 'free' ? updatedUser.scan_count_this_week : updatedUser.scan_count_this_day,
        remaining: tier === 'free' 
          ? Math.max(0, limits.scansPerWeek - updatedUser.scan_count_this_week)
          : Math.max(0, limits.scansPerDay - updatedUser.scan_count_this_day),
        resetDate: tier === 'free' ? updatedUser.week_reset_date : updatedUser.day_reset_date,
        resetPeriod: tier === 'free' ? 'weekly' : 'daily',
      },
      features: {
        pdfReports: limits.canAccessPDF,
        fullLeaderboard: limits.canAccessFullLeaderboard,
        fullProgress: limits.canAccessFullProgress,
        premiumShareCard: limits.canAccessPremiumShareCard,
        streakTracking: tier === 'premium',
      },
      streak: {
        current: updatedUser.current_streak || 0,
        longest: updatedUser.longest_streak || 0,
        lastUpdate: updatedUser.last_streak_update,
      },
      leaderboard: {
        rank: updatedUser.leaderboard_rank || null,
        visible: updatedUser.leaderboard_visible,
      },
    };

    res.json({
      success: true,
      data: limitsInfo,
    });
  } catch (error) {
    logger.error('Get user limits error:', error);
    res.status(500).json({
      error: true,
      message: 'Error fetching user limits',
    });
  }
};

module.exports = {
  checkScanLimit,
  incrementScanCount,
  requirePremiumForPDF,
  checkLeaderboardAccess,
  checkProgressAccess,
  getShareCardType,
  getUserLimits,
  getUserTier,
  TIER_LIMITS,
};
