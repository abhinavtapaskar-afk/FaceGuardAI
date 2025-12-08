-- ═══════════════════════════════════════════════════════════
-- FACEGUARD AI - DATABASE MIGRATION V2
-- Backwards Compatible - Safe to run on existing database
-- ═══════════════════════════════════════════════════════════

-- Add new columns to users table (all nullable for backwards compatibility)
ALTER TABLE users ADD COLUMN IF NOT EXISTS consent_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS consent_ip_address INET;
ALTER TABLE users ADD COLUMN IF NOT EXISTS affiliate_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS razorpay_customer_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS razorpay_subscription_id VARCHAR(255);

-- Add affiliate products table
CREATE TABLE IF NOT EXISTS affiliate_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- cleanser, serum, moisturizer, sunscreen, etc.
  brand VARCHAR(100),
  price DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'INR',
  
  -- Affiliate Links
  amazon_url TEXT,
  amazon_affiliate_tag VARCHAR(100),
  flipkart_url TEXT,
  flipkart_affiliate_id VARCHAR(100),
  
  -- Product Details
  image_url TEXT,
  active_ingredients JSONB,
  skin_types JSONB, -- Array of suitable skin types
  concerns JSONB, -- Array of skin concerns it addresses
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 0, -- For sorting
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add product recommendations table (links scans to products)
CREATE TABLE IF NOT EXISTS scan_product_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES affiliate_products(id) ON DELETE CASCADE,
  recommendation_reason TEXT,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(scan_id, product_id)
);

-- Add feature flags table
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flag_name VARCHAR(100) UNIQUE NOT NULL,
  is_enabled BOOLEAN DEFAULT FALSE,
  rollout_percentage INTEGER DEFAULT 0, -- 0-100
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default feature flags
INSERT INTO feature_flags (flag_name, is_enabled, rollout_percentage, description) VALUES
('affiliate_enabled', FALSE, 0, 'Enable affiliate product recommendations'),
('razorpay_enabled', FALSE, 0, 'Enable Razorpay subscription payments'),
('pdf_reports_enabled', TRUE, 100, 'Enable PDF report generation'),
('leaderboard_enabled', FALSE, 0, 'Enable global leaderboard'),
('share_cards_enabled', FALSE, 0, 'Enable social share cards')
ON CONFLICT (flag_name) DO NOTHING;

-- Add payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Razorpay Details
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  
  -- Transaction Details
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50), -- created, authorized, captured, failed, refunded
  
  -- Plan Details
  plan_type VARCHAR(50), -- monthly, yearly
  plan_duration_days INTEGER,
  
  -- Metadata
  payment_method VARCHAR(50),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_products_category ON affiliate_products(category);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_active ON affiliate_products(is_active);
CREATE INDEX IF NOT EXISTS idx_scan_product_recommendations_scan_id ON scan_product_recommendations(scan_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_users_consent ON users(consent_accepted);

-- Update trigger for affiliate_products
CREATE OR REPLACE FUNCTION update_affiliate_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_affiliate_products_updated_at
BEFORE UPDATE ON affiliate_products
FOR EACH ROW
EXECUTE FUNCTION update_affiliate_products_updated_at();

-- Update trigger for feature_flags
CREATE TRIGGER update_feature_flags_updated_at
BEFORE UPDATE ON feature_flags
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Update trigger for payment_transactions
CREATE TRIGGER update_payment_transactions_updated_at
BEFORE UPDATE ON payment_transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON affiliate_products TO anon, authenticated;
GRANT ALL ON scan_product_recommendations TO anon, authenticated;
GRANT ALL ON feature_flags TO anon, authenticated;
GRANT ALL ON payment_transactions TO anon, authenticated;

-- Migration complete
COMMENT ON TABLE affiliate_products IS 'V2: Affiliate product catalog for recommendations';
COMMENT ON TABLE scan_product_recommendations IS 'V2: Links scans to recommended products';
COMMENT ON TABLE feature_flags IS 'V2: Feature flag system for gradual rollout';
COMMENT ON TABLE payment_transactions IS 'V2: Razorpay payment transaction history';
