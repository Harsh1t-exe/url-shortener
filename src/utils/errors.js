/**
 * Custom error handling class
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Creates a standardized error response
 */
function createErrorResponse(error, statusCode = 500) {
  return {
    success: false,
    statusCode,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };
}

module.exports = {
  AppError,
  createErrorResponse,
};
