const { validateRequest } = require('../utils/validation');
const { AppError } = require('../utils/errors');

/**
 * Middleware to validate request body
 * @param {Object} schema - Joi validation schema
 */
function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = validateRequest(req.body, schema);

    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(messages, 400));
    }

    req.body = value;
    next();
  };
}

module.exports = { validateBody };
