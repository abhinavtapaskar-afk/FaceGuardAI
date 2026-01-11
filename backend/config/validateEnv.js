const logger = require('../utils/logger');

// Required environment variables
const REQUIRED_ENV_VARS = [
  'OPENAI_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'JWT_SECRET',
  'NODE_ENV'
];

// Validate all required environment variables
function validateEnv() {
  const missing = [];
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  const testMode = process.env.TEST_MODE === 'true' || process.env.ALLOW_MISSING_KEYS === 'true';
  const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
  
  // In Vercel, JWT_SECRET is the only critical one
  const criticalVars = isVercel ? ['JWT_SECRET'] : REQUIRED_ENV_VARS;
  
  criticalVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  // In development/test mode, allow missing API keys but warn
  if (missing.length > 0) {
    if (testMode || isDevelopment) {
      console.warn('\n⚠️  WARNING: Some environment variables are missing:');
      missing.forEach(varName => {
        console.warn(`   - ${varName}`);
      });
      console.warn('\n📝 Running in TEST/MOCK mode - API calls will be mocked.');
      console.warn('   Set TEST_MODE=true in config.env to suppress this warning.\n');
      
      // Set flag for mock mode
      process.env.MOCK_MODE = 'true';
    } else if (isVercel) {
      // Vercel production - only JWT_SECRET is critical
      if (missing.includes('JWT_SECRET')) {
        logger.error('Missing JWT_SECRET in Vercel environment');
        console.error('\n❌ CRITICAL ERROR: JWT_SECRET is required in Vercel environment variables.\n');
        throw new Error('JWT_SECRET is required. Please add it in Vercel dashboard → Settings → Environment Variables.');
      }
    } else {
      // Production mode - fail fast
      logger.error('Missing required environment variables:', missing);
      console.error('\n❌ CRITICAL ERROR: Missing required environment variables:');
      missing.forEach(varName => {
        console.error(`   - ${varName}`);
      });
      console.error('\nPlease check your config.env file.\n');
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your config.env file.'
      );
    }
  }
  
  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    logger.warn('JWT_SECRET is too short. Use at least 32 characters for production.');
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️  WARNING: JWT_SECRET is too short for production. Use at least 32 characters.');
    }
  }
  
  // Validate NODE_ENV
  const validEnvs = ['development', 'production', 'test'];
  if (process.env.NODE_ENV && !validEnvs.includes(process.env.NODE_ENV)) {
    logger.warn(`NODE_ENV should be one of: ${validEnvs.join(', ')}`);
  }
  
  // Validate Supabase URL format
  if (process.env.SUPABASE_URL && !process.env.SUPABASE_URL.startsWith('https://')) {
    logger.warn('SUPABASE_URL should start with https://');
  }
  
  // Validate OpenAI API key format
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    logger.warn('OPENAI_API_KEY format may be incorrect (should start with sk-)');
  }
  
  logger.info('✅ Environment variables validated successfully');
}

module.exports = validateEnv;

