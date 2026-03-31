/**
 * URL Model
 * Represents the structure of a shortened URL document
 */

const urlSchema = {
  shortCode: String,        // Unique identifier for the shortened URL
  originalUrl: String,      // The original long URL
  clickCount: Number,       // Number of times the short URL was accessed
  createdAt: Date,          // Timestamp of creation
  expiresAt: Date,          // Optional expiration date
  metadata: {
    userAgent: String,      // User agent of creator
    ipAddress: String,      // IP address of creator
    customAlias: String,    // Optional custom alias
  },
};

/**
 * Creates a URL document
 */
function createUrlDocument(data) {
  return {
    shortCode: data.shortCode,
    originalUrl: data.originalUrl,
    clickCount: 0,
    createdAt: new Date(),
    expiresAt: data.expiresAt || null,
    metadata: {
      userAgent: data.userAgent || null,
      ipAddress: data.ipAddress || null,
      customAlias: data.customAlias || null,
    },
  };
}

module.exports = {
  urlSchema,
  createUrlDocument,
};
