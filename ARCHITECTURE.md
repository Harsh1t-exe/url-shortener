# URL Shortener - Architecture & Design

## System Design

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser/API)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP/REST
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Server                        │
├─────────────────────────────────────────────────────────────┤
│  Middleware Layer:                                          │
│  - Helmet (Security)                                        │
│  - CORS                                                      │
│  - Rate Limiting                                            │
│  - Request Validation                                       │
│  - Error Handling                                           │
├─────────────────────────────────────────────────────────────┤
│  Router Layer:                                              │
│  - POST /api/urls (Create)                                 │
│  - GET /:shortCode (Redirect)                              │
│  - GET /api/urls/:shortCode/stats                          │
│  - DELETE /api/urls/:shortCode                             │
├─────────────────────────────────────────────────────────────┤
│  Controller Layer:                                          │
│  - urlController.js (Request handlers)                     │
├─────────────────────────────────────────────────────────────┤
│  Service Layer:                                             │
│  - urlService.js (Business logic)                          │
├─────────────────────────────────────────────────────────────┤
│  Utility Layer:                                             │
│  - helpers.js (URL generation, validation)                 │
│  - errors.js (Error handling)                              │
└──────────────┬──────────────────────────┬──────────────────┘
               │                          │
               │ Database Queries         │ Cache Lookups
               ▼                          ▼
        ┌─────────────────┐      ┌──────────────────┐
        │    MongoDB      │      │     Redis        │
        │                 │      │ (Optional Cache) │
        │  Indexes:       │      │                  │
        │  - shortCode    │      │  Quick lookups   │
        │  - expiresAt    │      │  Rate limiting   │
        │  - Original URL │      └──────────────────┘
        └─────────────────┘
```

## Data Model

### URL Document Structure

```javascript
{
  _id: ObjectId,
  shortCode: "abc123",           // Unique, indexed
  originalUrl: "https://...",    // Indexed for deduplication
  clickCount: 42,
  createdAt: Date,
  expiresAt: Date|null,          // Optional, TTL index
  metadata: {
    userAgent: String,
    ipAddress: String,
    customAlias: String|null
  }
}
```

## Request Flow

### 1. Create Short URL

```
POST /api/urls
│
├─ Validation Middleware
│  └─ Validate URL format using Joi
│
├─ URL Controller
│  └─ Extract request data
│
├─ URL Service
│  ├─ Validate URL format
│  ├─ Check for existing shortened URL
│  ├─ Generate/validate short code
│  ├─ Insert into MongoDB
│  └─ Return created document
│
└─ Response (201 Created)
```

### 2. Redirect Flow

```
GET /:shortCode
│
├─ URL Controller
│  └─ Extract short code
│
├─ URL Service
│  ├─ Query MongoDB by shortCode
│  ├─ Check expiration
│  ├─ Increment clickCount (async)
│  └─ Return original URL
│
└─ HTTP 301 Redirect
```

## Scalability Features

### 1. Database Indexing

```
db.urls.createIndex({ shortCode: 1 }, { unique: true })
db.urls.createIndex({ originalUrl: 1 })
db.urls.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 })
```

Benefits:
- O(1) lookup by short code
- Automatic deletion of expired URLs
- Reduced memory overhead

### 2. Connection Pooling

```javascript
maxPoolSize: 10        // Configurable
minPoolSize: 2         // Always maintain connections
```

Allows concurrent requests to share connections.

### 3. Asynchronous Operations

Click counting is non-blocking:
```javascript
urlsCollection.updateOne(...).catch(err => console.error(err))
```

User gets response immediately while update happens in background.

### 4. Rate Limiting

Per-client throttling prevents abuse:
```
100 requests per 15 minutes per IP
Configurable via environment variables
```

### 5. Horizontal Scaling

- Stateless server design
- All state in database
- Can run multiple instances behind load balancer
- Shared MongoDB for consistency

## Performance Characteristics

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| Create URL | O(1) | If unique short code generated, else retry |
| Lookup URL | O(1) | Indexed by shortCode |
| Get Stats | O(1) | Indexed lookup |
| Delete URL | O(1) | Indexed delete |
| Rate Limit Check | O(n) | n = requests in window (typically small) |

## Security Considerations

1. **Input Validation**: All inputs validated with Joi
2. **URL Validation**: Only valid URLs accepted
3. **Rate Limiting**: Prevents brute force attacks
4. **MongoDB Injection Prevention**: Using parameterized queries
5. **Security Headers**: Helmet.js sets HTTP headers
6. **CORS**: Configurable cross-origin access
7. **Error Messages**: Don't leak sensitive information

## Future Enhancements

1. **Redis Caching**: Cache frequently accessed URLs
2. **Authentication**: Add user authentication/authorization
3. **Analytics**: Detailed analytics dashboard
4. **Custom Domains**: Support branded short URLs
5. **API Keys**: Rate limiting per API key
6. **Database Replication**: MongoDB replica set for HA
7. **Queue System**: Bull/RabbitMQ for async tasks
8. **Monitoring**: Prometheus metrics, ELK stack

## Load Testing

Example with curl+parallel:

```bash
# Generate 1000 short URLs
for i in {1..1000}; do
  curl -X POST http://localhost:3000/api/urls \
    -H "Content-Type: application/json" \
    -d "{\"originalUrl\":\"https://example.com/$i\"}" &
done
wait
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection tested
- [ ] Rate limiting values tuned
- [ ] Security headers configured
- [ ] CORS policy set appropriately
- [ ] Logging configured
- [ ] Health checks working
- [ ] Database backups scheduled
- [ ] Error monitoring set up
- [ ] Performance monitoring enabled
