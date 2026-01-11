const { db, supabase } = require('../config/database');
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

// Get user tier with premium_until date validation
const getUserTier = (user) => {
  // Check both is_premium flag AND premium_until date to prevent subscription bypass
  const isPremiumFlag = user.is_premium === true;
  const hasValidPremiumDate = user.premium_expires_at && new Date(user.premium_expires_at) > new Date();
  
  // User is premium only if BOTH conditions are true
  if (isPremiumFlag && hasValidPremiumDate) {
    return 'premium';
  }
  
  // If premium flag is true but date expired, log for investigation
  if (isPremiumFlag && !hasValidPremiumDate) {
    logger.warn('Premium user with expired subscription detected', {
      userId: user.id,
      premiumExpiresAt: user.premium_expires_at,
      currentDate: new Date().toISOString()
    });
  }
  
  return 'free';
};

// Check if user can scan
const checkScanLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await db.getUserById(userId);
    
    // Validate premium status with date check
    const tier = getUserTier(user);
    const limits = TIER_LIMITS[tier];
    
    // Additional security: If user claims premium but date expired, force free tier
    if (user.is_premium && user.premium_expires_at && new Date(user.premium_expires_at) <= new Date()) {
      // Premium expired - update user to free tier
      logger.info('Auto-downgrading expired premium user', { userId });
      await db.updateUser(userId, { is_premium: false });
      // Re-fetch user to get updated tier
      const updatedUser = await db.getUserById(userId);
      const updatedTier = getUserTier(updatedUser);
      req.userTier = updatedTier;
      req.tierLimits = TIER_LIMITS[updatedTier];
    }

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
  // Fetch current user to get current counts
  const user = await db.getUserById(userId);
  
  const updates = {
    last_scan_date: new Date().toISOString().split('T')[0],
  };

  // Increment appropriate counter
  if (tier === 'free') {
    updates.scan_count_this_week = (user.scan_count_this_week || 0) + 1;
  } else if (tier === 'premium') {
    updates.scan_count_this_day = (user.scan_count_this_day || 0) + 1;
  }

  await db.updateUser(userId, updates);
  
  // Update streak using Supabase RPC (if function exists) or manual logic
  try {
    // Try RPC function first
    const { error } = await supabase.rpc('update_user_streak', { user_id: userId });
    if (error) {
      // Fallback: Manual streak update if RPC doesn't exist
      logger.warn('RPC update_user_streak not available, using manual update', { error: error.message });
      await updateStreakManually(userId);
    }
  } catch (error) {
    logger.warn('Streak update failed, using manual fallback', { error: error.message });
    await updateStreakManually(userId);
  }
};

// Manual streak update fallback
const updateStreakManually = async (userId) => {
  const user = await db.getUserById(userId);
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  let currentStreak = user.current_streak || 0;
  let longestStreak = user.longest_streak || 0;
  
  // If last scan was yesterday or today, increment streak
  if (user.last_scan_date === yesterday || user.last_scan_date === today) {
    currentStreak += 1;
  } else {
    // Reset streak
    currentStreak = 1;
  }
  
  // Update longest streak if needed
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }
  
  await db.updateUser(userId, {
    current_streak: currentStreak,
    longest_streak: longestStreak,
    last_streak_update: today
  });
};

// Check if user can access PDF reports
const requirePremiumForPDF = async (req, res, next) => {
  try {
    // Re-fetch user to ensure premium_until date is current
    const user = await db.getUserById(req.user.id);
    const tier = getUserTier(user);
    
    if (!TIER_LIMITS[tier].canAccessPDF) {
      return res.status(403).json({
        error: true,
        message: 'PDF reports are only available for Premium users',
        feature: 'pdf_report',
        upgradeRequired: true,
      });
    }
    
    next();
  } catch (error) {
    logger.error('Premium check error:', error);
    res.status(500).json({
      error: true,
      message: 'Error verifying premium status'
    });
  }
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
