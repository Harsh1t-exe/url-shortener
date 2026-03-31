/**
 * Simple rate limiter middleware
 * Store request counts in memory (for production use Redis)
 */

const requestCounts = new Map();

function rateLimit(options = {}) {
  const { windowMs = 900000, maxRequests = 100 } = options;

  return (req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now = Date.now();

    if (!requestCounts.has(clientIp)) {
      requestCounts.set(clientIp, []);
    }

    let requests = requestCounts.get(clientIp);
    requests = requests.filter(timestamp => now - timestamp < windowMs);

    if (requests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((requests[0] + windowMs - now) / 1000),
      });
    }

    requests.push(now);
    requestCounts.set(clientIp, requests);
    next();
  };
}

module.exports = { rateLimit };
