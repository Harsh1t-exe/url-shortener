const { customAlphabet } = require('nanoid');
const config = require('../config');

/**
 * Generates a unique short code for URL
 * Uses nanoid for cryptographically secure random generation
 */
const generateShortCode = customAlphabet(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  config.shortCodeLength
);

/**
 * Validates if a URL is properly formatted
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets client IP address from request
 * @param {Object} req - Express request object
 * @returns {string} IP address
 */
function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.connection.remoteAddress ||
    'unknown'
  );
}

/**
 * Constructs the full short URL
 * @param {string} shortCode - The short code
 * @returns {string} Full short URL
 */
function buildShortUrl(shortCode) {
  return `${config.baseUrl}/${shortCode}`;
}

module.exports = {
  generateShortCode,
  isValidUrl,
  getClientIp,
  buildShortUrl,
};
