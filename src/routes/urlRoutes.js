const express = require('express');
const { validateBody } = require('../middleware/validation');
const { createUrlSchema } = require('../utils/validation');
const {
  createShortenedUrl,
  redirectToOriginal,
  getUrlStatistics,
  deleteShortenedUrl,
  healthCheck,
} = require('../controllers/urlController');

const router = express.Router();

// Health check
router.get('/health', healthCheck);

// API Routes
router.post('/api/urls', validateBody(createUrlSchema), createShortenedUrl);
router.get('/api/urls/:shortCode/stats', getUrlStatistics);
router.delete('/api/urls/:shortCode', deleteShortenedUrl);

// Redirect route (should be last to avoid conflicts)
// Exclude root path "/" to prevent it from being treated as a shortCode
router.get('/:shortCode', (req, res, next) => {
  if (req.params.shortCode === '' || req.params.shortCode === '/') {
    return next();  // Skip to next middleware (static files)
  }
  redirectToOriginal(req, res, next);
});

module.exports = router;
