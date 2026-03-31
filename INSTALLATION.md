# 🚀 URL Shortener Installation & First Run

Your scalable URL shortener project is ready! Here's how to get started.

## Step 1: Install Dependencies

```bash
npm install
```

This installs:
- **express**: Web framework
- **mongodb**: Database driver
- **joi**: Validation library
- **nanoid**: Short code generation
- **helmet**: Security headers
- **cors**: Cross-origin support
- **dotenv**: Environment configuration
- **nodemon**: Development auto-reload (dev)

## Step 2: Set Up Environment

Copy the example configuration:
```bash
cp .env.example .env
```

The `.env` file contains:
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: Database connection string
- `BASE_URL`: Full base URL for short links
- `SHORT_CODE_LENGTH`: Length of generated codes
- Rate limiting configuration

## Step 3: Start MongoDB

**Option A: Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name url-shortener-db mongo:6
```

**Option B: Docker Compose (Full Stack)**
```bash
docker-compose up
```

**Option C: Local MongoDB**
Make sure `mongod` is running on your system.

## Step 4: Start the Server

```bash
npm run dev
```

Expected output:
```
✓ Connected to MongoDB
✓ Server running on http://localhost:3000
✓ Environment: development
```

## Step 5: Test the API

### Create a short URL:
```bash
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://github.com/nodejs/node"}'
```

Response:
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "shortCode": "xY7z2",
    "shortUrl": "http://localhost:3000/xY7z2",
    "originalUrl": "https://github.com/nodejs/node",
    "createdAt": "2026-03-31T14:00:00.000Z"
  }
}
```

### Access the short URL:
```bash
curl -L http://localhost:3000/xY7z2
```

### Get statistics:
```bash
curl http://localhost:3000/api/urls/xY7z2/stats
```

### Health check:
```bash
curl http://localhost:3000/health
```

## Project Structure

```
url-shortener/
├── src/
│   ├── index.js                 # Main application entry
│   ├── config/
│   │   ├── index.js            # Environment config
│   │   └── database.js         # MongoDB connection
│   ├── controllers/
│   │   └── urlController.js    # HTTP request handlers
│   ├── services/
│   │   └── urlService.js       # Business logic
│   ├── models/
│   │   └── url.js              # Data schema
│   ├── middleware/
│   │   ├── validation.js       # Request validation
│   │   ├── errorHandler.js     # Error handling
│   │   └── rateLimit.js        # Rate limiting
│   ├── routes/
│   │   └── urlRoutes.js        # API routes
│   └── utils/
│       ├── helpers.js          # Helper functions
│       ├── validation.js       # Joi schemas
│       └── errors.js           # Error handling
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── Dockerfile                   # Docker image
├── docker-compose.yml           # Full stack setup
├── README.md                    # Full documentation
├── QUICKSTART.md                # Quick start guide
├── ARCHITECTURE.md              # Architecture details
└── tests/
    └── example.test.js          # Test examples
```

## Key Features

### ✅ Clean Architecture
- Controllers handle HTTP requests
- Services contain business logic
- Models define data structures
- Clear separation of concerns

### ✅ Scalability
- MongoDB connection pooling
- Indexed queries for fast lookups
- Async operations don't block responses
- Stateless design for horizontal scaling
- TTL indexes for auto-cleanup

### ✅ Security
- Helmet.js security headers
- Input validation with Joi
- Rate limiting per IP
- CORS configuration
- URL format validation

### ✅ Production Ready
- Error handling
- Health check endpoint
- Configurable via environment
- Graceful shutdown
- Comprehensive documentation

## Common Commands

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# Run tests
npm test

# Using Docker Compose
docker-compose up          # Start all services
docker-compose down        # Stop all services
docker-compose logs -f     # View logs
```

## API Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/urls` | Create short URL |
| GET | `/:shortCode` | Redirect to original |
| GET | `/api/urls/:shortCode/stats` | Get statistics |
| DELETE | `/api/urls/:shortCode` | Delete shortenedURL |
| GET | `/health` | Health check |

## Next Steps

1. **Read Documentation**
   - [Full README](./README.md)
   - [Architecture Guide](./ARCHITECTURE.md)
   - [Quick Start](./QUICKSTART.md)

2. **Customize**
   - Adjust rate limits in `.env`
   - Configure MongoDB connection
   - Set base URL for production

3. **Test Performance**
   - Use sample data creation script
   - Test with load testing tools
   - Monitor MongoDB performance

4. **Deploy**
   - Use Docker for containerization
   - Deploy to cloud (AWS, GCP, Azure, Heroku)
   - Set up MongoDB Atlas
   - Configure load balancing

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running: `docker run -d -p 27017:27017 mongo:6`
- Check `MONGODB_URI` in `.env`

**Port Already in Use**
- Change `PORT` in `.env` to another port (e.g., 3001)

**Dependencies Installation Issues**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

## Support & Questions

Refer to the documentation files:
- README.md - Full feature documentation
- ARCHITECTURE.md - Technical architecture
- QUICKSTART.md - 5-minute setup guide

## License

ISC

---

**Happy URL shortening!** 🎉
