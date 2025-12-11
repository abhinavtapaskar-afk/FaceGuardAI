-- ═══════════════════════════════════════════════════════════
-- FACEGUARD AI - TIER FEATURES MIGRATION
-- Adds scan limits, streaks, leaderboard, and share features
-- ═══════════════════════════════════════════════════════════

-- Add tier tracking columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_scan_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS scan_count_this_week INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS scan_count_this_day INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS week_reset_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS day_reset_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_streak_update DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS leaderboard_rank INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS leaderboard_visible BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  glow_score INTEGER NOT NULL,
  total_scans INTEGER NOT NULL,
  current_streak INTEGER NOT NULL,
  profile_photo_url TEXT,
  username VARCHAR(100),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Create share cards table
CREATE TABLE IF NOT EXISTS share_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  card_type VARCHAR(50) NOT NULL, -- 'free' or 'premium'
  card_url TEXT,
  share_count INTEGER DEFAULT 0,
  platform VARCHAR(50), -- 'instagram', 'snapchat', 'whatsapp', 'download'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create product clicks tracking table
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  product_id UUID NOT NULL REFERENCES affiliate_products(id) ON DELETE CASCADE,
  scan_id UUID REFERENCES scans(id) ON DELETE SET NULL,
  platform VARCHAR(50), -- 'amazon' or 'flipkart'
  clicked_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Create PDF reports table
CREATE TABLE IF NOT EXISTS pdf_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  report_url TEXT,
  generated_at TIMESTAMP DEFAULT NOW(),
  downloaded_at TIMESTAMP,
  download_count INTEGER DEFAULT 0
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_last_scan_date ON users(last_scan_date);
CREATE INDEX IF NOT EXISTS idx_users_current_streak ON users(current_streak);
CREATE INDEX IF NOT EXISTS idx_users_glow_score ON users(glow_score);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard(rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_share_cards_user_id ON share_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_share_cards_scan_id ON share_cards(scan_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user_id ON affiliate_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product_id ON affiliate_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_pdf_reports_user_id ON pdf_reports(user_id);

-- Function to update leaderboard
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS void AS $$
BEGIN
  -- Clear existing leaderboard
  TRUNCATE leaderboard;
  
  -- Insert top 100 users by glow score
  INSERT INTO leaderboard (user_id, rank, glow_score, total_scans, current_streak, profile_photo_url, username)
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY glow_score DESC, total_scans DESC) as rank,
    glow_score,
    total_scans,
    current_streak,
    profile_photo_url,
    name
  FROM users
  WHERE glow_score > 0
  ORDER BY glow_score DESC, total_scans DESC
  LIMIT 100;
  
  -- Update user ranks
  UPDATE users u
  SET leaderboard_rank = l.rank
  FROM leaderboard l
  WHERE u.id = l.user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check and update streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_last_scan_date DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
BEGIN
  SELECT last_scan_date, current_streak, longest_streak
  INTO v_last_scan_date, v_current_streak, v_longest_streak
  FROM users
  WHERE id = p_user_id;
  
  -- If last scan was yesterday, increment streak
  IF v_last_scan_date = CURRENT_DATE - INTERVAL '1 day' THEN
    v_current_streak := v_current_streak + 1;
  -- If last scan was today, keep streak
  ELSIF v_last_scan_date = CURRENT_DATE THEN
    -- Do nothing
    RETURN;
  -- If last scan was more than 1 day ago, reset streak
  ELSE
    v_current_streak := 1;
  END IF;
  
  -- Update longest streak if current is higher
  IF v_current_streak > v_longest_streak THEN
    v_longest_streak := v_current_streak;
  END IF;
  
  -- Update user
  UPDATE users
  SET 
    current_streak = v_current_streak,
    longest_streak = v_longest_streak,
    last_streak_update = CURRENT_DATE
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to reset weekly scan counts
CREATE OR REPLACE FUNCTION reset_weekly_scan_counts()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET 
    scan_count_this_week = 0,
    week_reset_date = CURRENT_DATE
  WHERE week_reset_date < CURRENT_DATE - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Function to reset daily scan counts
CREATE OR REPLACE FUNCTION reset_daily_scan_counts()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET 
    scan_count_this_day = 0,
    day_reset_date = CURRENT_DATE
  WHERE day_reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update leaderboard after scan
CREATE OR REPLACE FUNCTION trigger_update_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_leaderboard();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_scan_update_leaderboard
AFTER INSERT OR UPDATE ON scans
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_update_leaderboard();

-- Grant permissions
GRANT ALL ON leaderboard TO anon, authenticated;
GRANT ALL ON share_cards TO anon, authenticated;
GRANT ALL ON affiliate_clicks TO anon, authenticated;
GRANT ALL ON pdf_reports TO anon, authenticated;

-- Initial leaderboard population
SELECT update_leaderboard();

-- Migration complete
COMMENT ON TABLE leaderboard IS 'Top 100 users ranked by glow score';
COMMENT ON TABLE share_cards IS 'Generated share cards for social media';
COMMENT ON TABLE affiliate_clicks IS 'Tracks affiliate product clicks for commission';
COMMENT ON TABLE pdf_reports IS 'Premium PDF reports for users';
