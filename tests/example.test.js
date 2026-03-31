// Example test cases for URL Shortener
// Run with: npm test

const app = require('../src/index');

describe('URL Shortener API', () => {
  // Test database connection
  test('should connect to MongoDB', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Test URL creation
  describe('POST /api/urls', () => {
    test('should create a short URL', async () => {
      const response = await request(app)
        .post('/api/urls')
        .send({
          originalUrl: 'https://example.com/very/long/url'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('shortCode');
      expect(response.body.data).toHaveProperty('shortUrl');
    });

    test('should reject invalid URLs', async () => {
      const response = await request(app)
        .post('/api/urls')
        .send({
          originalUrl: 'not-a-valid-url'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should create with custom alias', async () => {
      const response = await request(app)
        .post('/api/urls')
        .send({
          originalUrl: 'https://example.com',
          customAlias: 'mycustom'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.shortCode).toBe('mycustom');
    });
  });

  // Test URL redirect
  describe('GET /:shortCode', () => {
    test('should redirect to original URL', async () => {
      // First create a URL
      const create = await request(app)
        .post('/api/urls')
        .send({
          originalUrl: 'https://example.com'
        });

      const shortCode = create.body.data.shortCode;

      // Then redirect
      const response = await request(app)
        .get(`/${shortCode}`);

      expect(response.status).toBe(301);
      expect(response.redirect).toBe(true);
    });

    test('should return 404 for non-existent URL', async () => {
      const response = await request(app).get('/nonexistent');
      expect(response.status).toBe(404);
    });
  });

  // Test statistics
  describe('GET /api/urls/:shortCode/stats', () => {
    test('should return URL statistics', async () => {
      // Create a URL
      const create = await request(app)
        .post('/api/urls')
        .send({
          originalUrl: 'https://example.com'
        });

      const shortCode = create.body.data.shortCode;

      // Access the URL to increment clicks
      await request(app).get(`/${shortCode}`);

      // Get stats
      const response = await request(app)
        .get(`/api/urls/${shortCode}/stats`);

      expect(response.status).toBe(200);
      expect(response.body.data.clickCount).toBeGreaterThanOrEqual(1);
    });
  });

  // Test deletion
  describe('DELETE /api/urls/:shortCode', () => {
    test('should delete a URL', async () => {
      // Create a URL
      const create = await request(app)
        .post('/api/urls')
        .send({
          originalUrl: 'https://example.com'
        });

      const shortCode = create.body.data.shortCode;

      // Delete it
      const response = await request(app)
        .delete(`/api/urls/${shortCode}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Should not exist anymore
      const check = await request(app)
        .get(`/api/urls/${shortCode}/stats`);
      expect(check.status).toBe(404);
    });
  });

  // Test rate limiting
  describe('Rate Limiting', () => {
    test('should rate limit after max requests', async () => {
      // Send multiple requests
      const requests = [];
      for (let i = 0; i < 101; i++) {
        requests.push(
          request(app).post('/api/urls').send({
            originalUrl: 'https://example.com'
          })
        );
      }

      const responses = await Promise.all(requests);
      
      // Last request should be rate limited
      const lastResponse = responses[responses.length - 1];
      expect(lastResponse.status).toBe(429);
    });
  });
});
