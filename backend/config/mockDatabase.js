// Mock database for testing without Supabase
// Stores data in memory (data lost on restart)

const mockData = {
  users: [],
  scans: [],
  recommendations: [],
  weeklyProgress: []
};

let userIdCounter = 1;
let scanIdCounter = 1;

// Mock Supabase-like database
const mockDb = {
  // Users
  async createUser(email, passwordHash, name, additionalData = {}) {
    const user = {
      id: `user-${userIdCounter++}`,
      email,
      password_hash: passwordHash,
      name,
      ...additionalData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_premium: false,
      glow_score: 0,
      current_streak: 0,
      longest_streak: 0,
      total_scans: 0
    };
    mockData.users.push(user);
    return user;
  },

  async getUserByEmail(email) {
    return mockData.users.find(u => u.email === email) || null;
  },

  async getUserById(userId) {
    return mockData.users.find(u => u.id === userId) || null;
  },

  // Scans
  async createScan(userId, scanData) {
    const scan = {
      id: `scan-${scanIdCounter++}`,
      user_id: userId,
      skin_type: scanData.skinType,
      issues: scanData.issues,
      analysis: scanData.analysis,
      image_url: scanData.imageUrl,
      created_at: new Date().toISOString()
    };
    mockData.scans.push(scan);
    return scan;
  },

  async getUserScans(userId, limit = 10) {
    return mockData.scans
      .filter(s => s.user_id === userId)
      .slice(0, limit);
  },

  async getScanById(scanId) {
    return mockData.scans.find(s => s.id === scanId) || null;
  },

  // Recommendations
  async saveRecommendations(scanId, recommendations) {
    const rec = {
      id: `rec-${Date.now()}`,
      scan_id: scanId,
      products: recommendations.products,
      diet: recommendations.diet,
      lifestyle: recommendations.lifestyle,
      routine: recommendations.routine,
      safety_warnings: recommendations.safetyWarnings,
      medical_disclaimer: recommendations.medicalDisclaimer,
      created_at: new Date().toISOString()
    };
    mockData.recommendations.push(rec);
    return rec;
  },

  async getRecommendationsByScanId(scanId) {
    return mockData.recommendations.find(r => r.scan_id === scanId) || null;
  },

  // Weekly Progress
  async saveWeeklyProgress(userId, progressData) {
    const progress = {
      id: `progress-${Date.now()}`,
      user_id: userId,
      scan_id: progressData.scanId,
      acne_severity: progressData.acneSeverity,
      oiliness_level: progressData.oilinessLevel,
      redness: progressData.redness,
      dark_spots: progressData.darkSpots,
      texture: progressData.texture,
      notes: progressData.notes,
      created_at: new Date().toISOString()
    };
    mockData.weeklyProgress.push(progress);
    return progress;
  },

  async getWeeklyProgress(userId, weeks = 4) {
    return mockData.weeklyProgress
      .filter(p => p.user_id === userId)
      .slice(0, weeks);
  },

  // User management
  async updateUser(userId, updates) {
    const user = mockData.users.find(u => u.id === userId);
    if (user) {
      Object.assign(user, updates, { updated_at: new Date().toISOString() });
      return user;
    }
    throw new Error('User not found');
  },

  async updateUserPremiumStatus(userId, premiumData) {
    return this.updateUser(userId, premiumData);
  },

  async updateUserLastLogin(userId) {
    return this.updateUser(userId, {
      last_login: new Date().toISOString()
    });
  },

  // Payment transactions
  async createPaymentTransaction(transactionData) {
    const transaction = {
      id: `txn-${Date.now()}`,
      ...transactionData,
      created_at: new Date().toISOString()
    };
    // Store in mock data if needed
    return transaction;
  },

  async updatePaymentTransaction(orderId, updates) {
    // Mock implementation
    return { id: orderId, ...updates };
  },

  // Atomic scan + recommendations
  async createScanWithRecommendations(userId, scanData, recommendations) {
    let scan = null;
    let recommendation = null;
    
    try {
      scan = await this.createScan(userId, scanData);
      recommendation = await this.saveRecommendations(scan.id, recommendations);
      return { scan, recommendation };
    } catch (error) {
      if (scan) {
        // Remove scan if recommendations failed
        const index = mockData.scans.findIndex(s => s.id === scan.id);
        if (index > -1) {
          mockData.scans.splice(index, 1);
        }
      }
      throw error;
    }
  }
};

module.exports = { db: mockDb, mockData };


