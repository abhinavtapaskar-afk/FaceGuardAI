const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Database helper functions
const db = {
  // Users
  async createUser(email, passwordHash, name) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password_hash: passwordHash, name }])
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

  // Scans
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
    const { data, error } = await supabase
      .from('recommendations')
      .insert([{
        scan_id: scanId,
        products: recommendations.products,
        diet: recommendations.diet,
        lifestyle: recommendations.lifestyle,
        routine: recommendations.routine
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
  }
};

module.exports = { supabase, db };
