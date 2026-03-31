const {
  createShortUrl,
  getUrlByShortCode,
  getUrlStats,
  deleteUrl,
} = require('../services/urlService');
const { buildShortUrl, getClientIp } = require('../utils/helpers');
const { AppError } = require('../utils/errors');

/**
 * URL Controller - Handles HTTP requests/responses
 */

/**
 * POST /api/urls - Create a shortened URL
 */
async function createShortenedUrl(req, res, next) {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;

    const url = await createShortUrl(originalUrl, {
      customAlias,
      expiresAt,
      userAgent: req.headers['user-agent'],
      ipAddress: getClientIp(req),
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      data: {
        shortCode: url.shortCode,
        shortUrl: buildShortUrl(url.shortCode),
        originalUrl: url.originalUrl,
        createdAt: url.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /:shortCode - Redirect to original URL
 */
async function redirectToOriginal(req, res, next) {
  try {
    const { shortCode } = req.params;

    const url = await getUrlByShortCode(shortCode);

    if (!url) {
      return next(new AppError('Short URL not found or has expired', 404));
    }

    res.redirect(301, url.originalUrl);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/urls/:shortCode/stats - Get statistics for a shortened URL
 */
async function getUrlStatistics(req, res, next) {
  try {
    const { shortCode } = req.params;

    const stats = await getUrlStats(shortCode);

    res.json({
      success: true,
      statusCode: 200,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/urls/:shortCode - Delete a shortened URL
 */
async function deleteShortenedUrl(req, res, next) {
  try {
    const { shortCode } = req.params;

    await deleteUrl(shortCode);

    res.json({
      success: true,
      statusCode: 200,
      message: 'URL deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/health - Health check endpoint
 */
function healthCheck(req, res) {
  res.json({
    success: true,
    statusCode: 200,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  createShortenedUrl,
  redirectToOriginal,
  getUrlStatistics,
  deleteShortenedUrl,
  healthCheck,
};
