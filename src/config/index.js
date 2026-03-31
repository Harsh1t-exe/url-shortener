require('dotenv').config();

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
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  shortCodeLength: parseInt(process.env.SHORT_CODE_LENGTH || '6'),
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
};

module.exports = config;
