const { createErrorResponse } = require('../utils/errors');

/**
 * Global error handling middleware
 * Must be last middleware in the chain
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const response = createErrorResponse(err, statusCode);

  res.status(statusCode).json(response);
}

/**
 * 404 Not Found middleware
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Resource not found',
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
