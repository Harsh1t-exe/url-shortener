require('dotenv').config();

// Determine the base URL based on environment
const getBaseUrl = () => {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  
  // In production (Render), use the node environment detect
  if (process.env.NODE_ENV === 'production') {
    // Render provides RENDER_EXTERNAL_URL
    if (process.env.RENDER_EXTERNAL_URL) {
      return process.env.RENDER_EXTERNAL_URL;
    }
    // Or construct from hostname
    return `https://${process.env.HOSTNAME || 'url-shortener.onrender.com'}`;
  }
  
  // Development
  return `http://localhost:${process.env.PORT || 3000}`;
};

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener',
    poolSize: parseInt(process.env.MONGODB_CONNECTION_POOL_SIZE || '10'),
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  baseUrl: getBaseUrl(),
  shortCodeLength: parseInt(process.env.SHORT_CODE_LENGTH || '6'),
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
};

module.exports = config;
