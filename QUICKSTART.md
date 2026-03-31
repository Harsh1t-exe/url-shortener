# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/url-shortener
BASE_URL=http://localhost:3000
```

### 3. Start MongoDB

**Using Docker (Recommended):**
```bash
docker run -d -p 27017:27017 --name url-shortener-db mongo:6
```

**Or locally:**
```bash
mongod
```

### 4. Run the Server
```bash
npm run dev
```

You should see:
```
✓ Connected to MongoDB
✓ Server running on http://localhost:3000
```

## Testing the API

### Create a Short URL

```bash
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d {
    "originalUrl": "https://www.github.com/nodejs/node"
  }
```

Response:
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "shortCode": "aBc123",
    "shortUrl": "http://localhost:3000/aBc123",
    "originalUrl": "https://www.github.com/nodejs/node",
    "createdAt": "2026-03-31T10:00:00.000Z"
  }
}
```

### Use the Short URL

```bash
curl -L http://localhost:3000/aBc123
```

This redirects to the original URL.

### Check Statistics

```bash
curl http://localhost:3000/api/urls/aBc123/stats
```

Response:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "shortCode": "aBc123",
    "originalUrl": "https://www.github.com/nodejs/node",
    "clickCount": 1,
    "createdAt": "2026-03-31T10:00:00.000Z",
    "expiresAt": null
  }
}
```

### Create with Custom Alias

```bash
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d {
    "originalUrl": "https://example.com",
    "customAlias": "mysite"
  }
```

Then access: `http://localhost:3000/mysite`

### Create with Expiration

```bash
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d {
    "originalUrl": "https://example.com",
    "expiresAt": "2026-12-31T23:59:59Z"
  }
```

### Delete a URL

```bash
curl -X DELETE http://localhost:3000/api/urls/aBc123
```

## Using Docker Compose (Full Stack)

```bash
docker-compose up
```

This starts:
- MongoDB (port 27017)
- Redis (port 6379)
- Express server (port 3000)

Access: http://localhost:3000/health

## File Structure Overview

```
src/
├── index.js              # Application entry point
├── config/               # Configuration
├── controllers/          # HTTP handlers
├── services/             # Business logic
├── models/               # Data schemas
├── middleware/           # Express middleware
├── routes/               # API routes
└── utils/                # Utilities
```

## Code Flow Example

When you POST to `/api/urls`:

1. **Request arrives** → Express routes to `urlRoutes.js`
2. **Validation** → `validateBody` middleware checks Joi schema
3. **Controller** → `createShortenedUrl` extracts request data
4. **Service** → `createShortUrl` contains business logic
5. **Database** → Saves to MongoDB
6. **Response** → Returns created URL with short code

## Troubleshooting

### "Connection error to MongoDB"
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

### "Port already in use"
- Change `PORT` in `.env`
- Or kill existing process on that port

### "Custom alias already in use"
- Custom aliases must be unique
- Try a different alias

## Next Steps

1. [Read the full README.md](./README.md)
2. [Understand the architecture](./ARCHITECTURE.md)
3. Customize rate limiting in `.env`
4. Add authentication (optional)
5. Deploy to production

## Performance Tips

- Use MongoDB Atlas for production
- Enable Redis for distributed caching
- Monitor with APM tools
- Set reasonable rate limits
- Use load balancer for horizontal scaling

## Getting Help

- Check logs in terminal
- Review error responses
- Verify `.env` configuration
- Check network connectivity to MongoDB
