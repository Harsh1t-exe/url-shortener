const { getDB } = require('../config/database');
const { createUrlDocument } = require('../models/url');
const { generateShortCode, isValidUrl } = require('../utils/helpers');
const { AppError } = require('../utils/errors');

/**
 * URL Service - Contains all business logic for URL shortening
 */

/**
 * Creates a shortened URL
 * @param {string} originalUrl - The URL to shorten
 * @param {Object} options - Additional options
 * @returns {Object} Created URL document with shortCode
 */
async function createShortUrl(originalUrl, options = {}) {
  // Validate URL format
  if (!isValidUrl(originalUrl)) {
    throw new AppError('Invalid URL format', 400);
  }

  // Check if URL already shortened (to reduce duplicates)
  const existingUrl = await findUrlByOriginal(originalUrl);
  if (existingUrl) {
    return existingUrl;
  }

  // Generate unique short code
  let shortCode = options.customAlias || generateShortCode();
  
  // If custom alias provided, check if it's available
  if (options.customAlias) {
    const existing = await findUrlByShortCode(shortCode);
    if (existing) {
      throw new AppError('Custom alias already in use', 409);
    }
  } else {
    // Ensure generated code is unique
    let attempts = 0;
    while ((await findUrlByShortCode(shortCode)) && attempts < 5) {
      shortCode = generateShortCode();
      attempts++;
    }
    if (attempts >= 5) {
      throw new AppError('Failed to generate unique short code', 500);
    }
  }

  // Create document
  const urlDocument = createUrlDocument({
    shortCode,
    originalUrl,
    userAgent: options.userAgent,
    ipAddress: options.ipAddress,
    customAlias: options.customAlias,
    expiresAt: options.expiresAt,
  });

  // Save to database
  const db = getDB();
  const urlsCollection = db.collection('urls');
  const result = await urlsCollection.insertOne(urlDocument);

  return {
    ...urlDocument,
    _id: result.insertedId,
  };
}

/**
 * Finds URL by short code and increments click count
 * @param {string} shortCode - The short code
 * @returns {Object|null} URL document or null
 */
async function getUrlByShortCode(shortCode) {
  const db = getDB();
  const urlsCollection = db.collection('urls');

  const url = await urlsCollection.findOne({ shortCode });

  if (!url) {
    return null;
  }

  // Check expiration
  if (url.expiresAt && new Date() > new Date(url.expiresAt)) {
    await urlsCollection.deleteOne({ shortCode });
    return null;
  }

  // Increment click count (asynchronously, don't wait)
  urlsCollection.updateOne(
    { shortCode },
    { $inc: { clickCount: 1 } }
  ).catch(err => console.error('Failed to update click count:', err));

  return url;
}

/**
 * Finds URL by short code (internal helper)
 */
async function findUrlByShortCode(shortCode) {
  const db = getDB();
  const urlsCollection = db.collection('urls');
  return urlsCollection.findOne({ shortCode });
}

/**
 * Finds URL by original URL (internal helper)
 */
async function findUrlByOriginal(originalUrl) {
  const db = getDB();
  const urlsCollection = db.collection('urls');
  return urlsCollection.findOne({ originalUrl });
}

/**
 * Gets statistics for a shortened URL
 * @param {string} shortCode - The short code
 * @returns {Object} Statistics
 */
async function getUrlStats(shortCode) {
  const db = getDB();
  const urlsCollection = db.collection('urls');

  const url = await urlsCollection.findOne({ shortCode });

  if (!url) {
    throw new AppError('URL not found', 404);
  }

  return {
    shortCode: url.shortCode,
    originalUrl: url.originalUrl,
    clickCount: url.clickCount,
    createdAt: url.createdAt,
    expiresAt: url.expiresAt,
  };
}

/**
 * Deletes a shortened URL
 * @param {string} shortCode - The short code
 */
async function deleteUrl(shortCode) {
  const db = getDB();
  const urlsCollection = db.collection('urls');

  const result = await urlsCollection.deleteOne({ shortCode });

  if (result.deletedCount === 0) {
    throw new AppError('URL not found', 404);
  }

  return { deleted: true };
}

module.exports = {
  createShortUrl,
  getUrlByShortCode,
  getUrlStats,
  deleteUrl,
};
