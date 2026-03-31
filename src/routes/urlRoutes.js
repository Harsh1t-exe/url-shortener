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
// Don't match "/" - let static files handle that
router.get('/:shortCode', (req, res, next) => {
  // Skip if empty (/) - let express.static handle root
  if (!req.params.shortCode) {
    return next();
  }
  redirectToOriginal(req, res, next);
});

module.exports = router;
