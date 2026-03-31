# URL Shortener - Scalable Node.js Service

A production-ready URL shortening service built with Node.js, Express, and MongoDB. Designed for scalability, performance, and clean code architecture.

## 🚀 Features

- **URL Shortening**: Create short, memorable links from long URLs
- **Custom Aliases**: Optional custom short codes for branded URLs
- **Click Tracking**: Monitor access statistics for each shortened URL
- **Auto-Expiration**: Optional expiration dates for links
- **Rate Limiting**: Built-in protection against abuse
- **Clean Architecture**: Separation of concerns with controllers, services, and models
- **Validation**: Input validation using Joi schemas
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Scalable Design**: Connection pooling, indexing, and optimized queries

## 🏗️ Project Structure

```
src/
├── config/              # Configuration files
│   ├── index.js         # Environment configuration
│   └── database.js       # Database connection
├── controllers/         # HTTP request handlers
│   └── urlController.js # URL operations
├── services/           # Business logic
│   └── urlService.js   # URL service logic
├── models/            # Data models
│   └── url.js         # URL document schema
├── middleware/        # Express middleware
│   ├── validation.js   # Request validation
│   ├── errorHandler.js # Error handling
│   └── rateLimit.js    # Rate limiting
├── routes/           # API routes
│   └── urlRoutes.js   # URL endpoints
├── utils/           # Utility functions
│   ├── helpers.js    # Helper functions
│   ├── validation.js # Joi schemas
│   └── errors.js     # Error handling
└── index.js         # Application entry point
```

## 📋 Prerequisites

- Node.js 14+
- MongoDB 4.0+ (local or cloud)
- npm or yarn

## 🔧 Installation

1. **Clone and setup**
   ```bash
   cd url-shortener
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your settings:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/url-shortener
   BASE_URL=http://localhost:3000
   SHORT_CODE_LENGTH=6
   ```

3. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Create Short URL
```
POST /api/urls

Body:
{
  "originalUrl": "https://www.example.com/very/long/url",
  "customAlias": "myshortcode",  // optional
  "expiresAt": "2026-12-31T23:59:59Z"  // optional
}

Response:
{
  "success": true,
  "statusCode": 201,
  "data": {
    "shortCode": "abc123",
    "shortUrl": "http://localhost:3000/abc123",
    "originalUrl": "https://www.example.com/very/long/url",
    "createdAt": "2026-03-31T10:00:00Z"
  }
}
```

### Redirect to Original URL
```
GET /:shortCode

Redirects to the original URL with 301 status code
Increments click count automatically
```

### Get URL Statistics
```
GET /api/urls/:shortCode/stats

Response:
{
  "success": true,
  "statusCode": 200,
  "data": {
    "shortCode": "abc123",
    "originalUrl": "https://www.example.com/very/long/url",
    "clickCount": 42,
    "createdAt": "2026-03-31T10:00:00Z",
    "expiresAt": null
  }
}
```

### Delete Short URL
```
DELETE /api/urls/:shortCode

Response:
{
  "success": true,
  "statusCode": 200,
  "message": "URL deleted successfully"
}
```

### Health Check
```
GET /health

Response:
{
  "success": true,
  "statusCode": 200,
  "message": "Server is healthy",
  "timestamp": "2026-03-31T10:00:00Z"
}
```

## 🎯 Example Usage

```bash
# Create a short URL
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://github.com/user/repo"}'

# Get statistics
curl http://localhost:3000/api/urls/abc123/stats

# Access the short URL
curl -L http://localhost:3000/abc123

# Delete a short URL
curl -X DELETE http://localhost:3000/api/urls/abc123
```

## 🔒 Security Features

- **Helmet.js**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Joi schemas validate all inputs
- **Rate Limiting**: Prevents abuse with request throttling
- **Unique Indexes**: MongoDB indexes prevent duplicate short codes
- **URL Validation**: Only valid URLs are accepted

## 📈 Scalability Features

- **Connection Pooling**: MongoDB connection pool (configurable size)
- **Database Indexing**: Optimized queries for short code and expiration lookups
- **Async Click Counting**: Click updates don't block responses
- **TTL Indexes**: Automatic deletion of expired URLs
- **Stateless Design**: Can be horizontally scaled
- **Rate Limiting**: Per-client throttling

## 🚀 Production Deployment

### Docker Support (Recommended)

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t url-shortener .
docker run -p 3000:3000 --env-file .env url-shortener
```

### Environment recommendations

- Use MongoDB Atlas or managed database service
- Enable Redis for distributed rate limiting
- Use environment variables for all configuration
- Set up health check monitoring
- Configure auto-scaling policies

## 🧪 Testing

Create `tests/url.test.js`:
```bash
npm test
```

## 📝 Code Quality

- **Clean Architecture**: Clear separation of concerns
- **Error Handling**: Comprehensive error management
- **Validation**: Input validation at every step
- **Documentation**: JSDoc comments throughout
- **Scalability**: Designed to handle millions of URLs

## 🔄 Performance Optimization

1. **Indexed Queries**: Short code lookups are O(1)
2. **Connection Pooling**: Reuse database connections
3. **Async Operations**: Non-blocking click updates
4. **TTL Cleanup**: Automatic removal of expired URLs
5. **Rate Limiting**: Prevents resource exhaustion

## 📚 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | Database connection | mongodb://localhost:27017/url-shortener |
| MONGODB_CONNECTION_POOL_SIZE | Pool size | 10 |
| BASE_URL | Base URL for short links | http://localhost:3000 |
| SHORT_CODE_LENGTH | Length of short codes | 6 |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 Live Demo

https://url-shortener-xkip.onrender.com
