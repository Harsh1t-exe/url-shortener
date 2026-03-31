const Joi = require('joi');

/**
 * Validation schema for creating a short URL
 */
const createUrlSchema = Joi.object({
  originalUrl: Joi.string().uri().required().messages({
    'string.uri': 'Please provide a valid URL',
    'any.required': 'Original URL is required',
  }),
  customAlias: Joi.string().alphanum().min(3).max(20).optional().messages({
    'string.alphanum': 'Custom alias must be alphanumeric',
    'string.min': 'Custom alias must be at least 3 characters',
  }),
  expiresAt: Joi.date().iso().optional().messages({
    'date.iso': 'Expiration date must be in ISO format',
  }),
});

/**
 * Validates request body against schema
 * @param {Object} data - Data to validate
 * @param {Object} schema - Joi schema
 * @returns {Object} {value, error}
 */
function validateRequest(data, schema) {
  return schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

module.exports = {
  createUrlSchema,
  validateRequest,
};
