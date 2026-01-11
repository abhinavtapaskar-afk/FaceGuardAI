const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

// Check if we should use mock mode
const useMockMode = process.env.MOCK_MODE === 'true' || 
                    !process.env.SUPABASE_URL || 
                    process.env.SUPABASE_URL === 'your_supabase_url_here' ||
                    !process.env.SUPABASE_ANON_KEY ||
                    process.env.SUPABASE_ANON_KEY === 'your_supabase_anon_key_here';

let supabase;
let db;

if (useMockMode) {
  console.log('🔧 MOCK MODE: Using mock database (no Supabase required)');
  const mockDb = require('./mockDatabase');
  db = mockDb.db;
  // Create a dummy supabase object for compatibility
  supabase = {
    from: () => ({
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
      rpc: () => Promise.resolve({ error: null })
    })
  };
} else {
  // Use real Supabase
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Database helper functions
  db = {
    // Users
    async createUser(email, passwordHash, name, additionalData = {}) {
      const { data, error } = await supabase
        .from('users')
        .insert([{ 
          email, 
          password_hash: passwordHash, 
          name,
          ...additionalData
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getUserByEmail(email) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async getUserById(userId) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },

    // Scans with transaction support
    async createScan(userId, scanData) {
      const { data, error } = await supabase
        .from('scans')
        .insert([{
          user_id: userId,
          skin_type: scanData.skinType,
          issues: scanData.issues,
          analysis: scanData.analysis,
          image_url: scanData.imageUrl
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    // Atomic scan + recommendations creation (prevents orphan records)
    async createScanWithRecommendations(userId, scanData, recommendations) {
      let scan = null;
      let recommendation = null;
      
      try {
        scan = await this.createScan(userId, scanData);
        logger.info('Scan created successfully', { scanId: scan.id, userId });
        
        recommendation = await this.saveRecommendations(scan.id, recommendations);
        logger.info('Recommendations created successfully', { scanId: scan.id, recommendationId: recommendation.id });
        
        return { scan, recommendation };
      } catch (error) {
        if (scan && !recommendation) {
          try {
            const { error: deleteError } = await supabase
              .from('scans')
              .delete()
              .eq('id', scan.id);
            
            if (deleteError) throw deleteError;
            
            logger.info('Rolled back orphan scan', { scanId: scan.id, userId });
          } catch (rollbackError) {
            logger.error('CRITICAL: Rollback failed', { scanId: scan.id, userId, error: rollbackError.message });
          }
        }
        throw error;
      }
    },

    async getUserScans(userId, limit = 10) {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },

    async getScanById(scanId) {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('id', scanId)
        .single();
      
      if (error) throw error;
      return data;
    },

    // Recommendations
    async saveRecommendations(scanId, recommendations) {
      const scanCheck = await this.getScanById(scanId);
      if (!scanCheck) {
        throw new Error(`Cannot create recommendations: Scan ${scanId} does not exist`);
      }
      
      const { data, error } = await supabase
        .from('recommendations')
        .insert([{
          scan_id: scanId,
          products: recommendations.products,
          diet: recommendations.diet,
          lifestyle: recommendations.lifestyle,
          routine: recommendations.routine,
          safety_warnings: recommendations.safetyWarnings,
          medical_disclaimer: recommendations.medicalDisclaimer
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getRecommendationsByScanId(scanId) {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('scan_id', scanId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    // Weekly Progress
    async saveWeeklyProgress(userId, progressData) {
      const { data, error } = await supabase
        .from('weekly_progress')
        .insert([{
          user_id: userId,
          scan_id: progressData.scanId,
          acne_severity: progressData.acneSeverity,
          oiliness_level: progressData.oilinessLevel,
          redness: progressData.redness,
          dark_spots: progressData.darkSpots,
          texture: progressData.texture,
          notes: progressData.notes
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getWeeklyProgress(userId, weeks = 4) {
      const { data, error } = await supabase
        .from('weekly_progress')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(weeks);
      
      if (error) throw error;
      return data;
    },

    // User management
    async updateUser(userId, updates) {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async updateUserPremiumStatus(userId, premiumData) {
      return await this.updateUser(userId, premiumData);
    },

    async updateUserLastLogin(userId) {
      return await this.updateUser(userId, {
        last_login: new Date().toISOString()
      });
    },

    // Payment transactions
    async createPaymentTransaction(transactionData) {
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert([transactionData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async updatePaymentTransaction(orderId, updates) {
      const { data, error } = await supabase
        .from('payment_transactions')
        .update(updates)
        .eq('razorpay_order_id', orderId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  };
}

module.exports = { supabase, db };
