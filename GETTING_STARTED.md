# URL Shortener - Getting Started

Welcome to your scalable URL shortener project! This file provides everything you need to understand and run the project.

## 📦 What's Included

Your project includes:

### Core Application
- **Express.js Server** with clean architecture
- **MongoDB Integration** with connection pooling
- **RESTful API** endpoints for URL management
- **Input Validation** using Joi schemas
- **Error Handling** with meaningful error messages
- **Rate Limiting** to prevent abuse
- **Security Features** with Helmet.js and CORS

### Development-Ready
- **npm scripts** for development and production
- **Environment configuration** via .env
- **Docker support** for containerized deployment
- **Example tests** to guide your testing
- **Comprehensive documentation** in multiple files

### Production Features
- **Database indexing** for fast queries
- **Connection pooling** for scalability
- **Asynchronous operations** for non-blocking responses
- **Graceful shutdown** handling
- **Health check endpoint** for monitoring

## 🎯 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

### 3. Start MongoDB
```bash
# Using Docker (easiest)
docker run -d -p 27017:27017 mongo:6

# Or use Docker Compose for full stack
docker-compose up
```

### 4. Run the Server
```bash
npm run dev
```

### 5. Test It!
```bash
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://github.com"}'
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [INSTALLATION.md](./INSTALLATION.md) | Detailed installation guide |
| [QUICKSTART.md](./QUICKSTART.md) | 5-minute quick start |
| [README.md](./README.md) | Complete API documentation |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture |

## 🏗️ Architecture Overview

```
Clean Layered Architecture:

HTTP Request
    ↓
Routes → Validation Middleware
    ↓
Controllers (Handle HTTP)
    ↓
Services (Business Logic)
    ↓
Models (Data Schema)
    ↓
MongoDB (Persistence)
```

### Responsibilities:

**Controllers** (`src/controllers/`)
- Handle HTTP requests/responses
- Call services for business logic
- Format responses

**Services** (`src/services/`)
- Implement business logic
- Validate data
- Interact with database
- Handle errors

**Models** (`src/models/`)
- Define data schema
- Provide factory functions

**Middleware** (`src/middleware/`)
- Validate input
- Handle errors
- Apply rate limiting
- Security headers

**Utils** (`src/utils/`)
- Helper functions
- Validation schemas
- Error handling

## 🚀 Main Features

### 1. Create Short URLs
```bash
POST /api/urls
{
  "originalUrl": "https://very-long-url.com/path",
  "customAlias": "mycode",        # Optional
  "expiresAt": "2026-12-31T00:00Z" # Optional
}
```

### 2. Redirect to Original
```bash
GET /:shortCode
# Returns 301 redirect to original URL
# Automatically tracks clicks
```

### 3. Get Statistics
```bash
GET /api/urls/:shortCode/stats
# Returns click count, creation date, etc.
```

### 4. Delete URLs
```bash
DELETE /api/urls/:shortCode
```

### 5. Health Checks
```bash
GET /health
# Verify server is running
```

## 💼 Scalability Features

✅ **Database Indexing**
- O(1) lookup by short code
- Automatic TTL cleanup for expired URLs
- Deduplication via URL indexing

✅ **Connection Pooling**
- Configurable pool size (up to 100+ connections)
- Reuse connections across requests
- Reduced latency and resource usage

✅ **Asynchronous Operations**
- Click counting doesn't block responses
- Non-blocking error tracking
- Improved response times

✅ **Rate Limiting**
- Per-IP request throttling
- Configurable limits
- Prevent abuse and DoS

✅ **Stateless Design**
- Run multiple instances behind load balancer
- Shared MongoDB for consistency
- Easy horizontal scaling

## 🔒 Security Features

- **Helmet.js**: Sets secure HTTP headers
- **CORS**: Configurable cross-origin requests
- **Input Validation**: All inputs validated with Joi
- **Rate Limiting**: Prevents brute force attacks
- **URL Validation**: Only valid URLs accepted
- **MongoDB Injection Prevention**: Parameterized queries

## 📝 Code Quality

- **Clean Code**: Well-organized, easy to understand
- **Comments**: JSDoc comments throughout
- **Error Handling**: Comprehensive error responses
- **Validation**: Input validated at every step
- **Best Practices**: Node.js and Express conventions

## 🐳 Docker & Deployment

### Single Container
```bash
docker build -t url-shortener .
docker run -p 3000:3000 --env-file .env url-shortener
```

### Full Stack with Compose
```bash
docker-compose up
# Starts MongoDB, Redis, and App
```

### Environment Variables
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/url-shortener
BASE_URL=http://localhost:3000
SHORT_CODE_LENGTH=6
```

## 🧪 Testing

Example test file is in `tests/example.test.js`

Run tests with:
```bash
npm test
```

## 📊 Project Statistics

- **3 Main Services**: URL creation, lookup, deletion
- **5 Controllers**: All endpoint handlers
- **3 Middleware**: Validation, error handling, rate limiting
- **100% Documented**: Every file and function explained
- **Production Ready**: Security, scalability, error handling

## 🎓 Learning Path

1. Start with [QUICKSTART.md](./QUICKSTART.md) (5 minutes)
2. Read [INSTALLATION.md](./INSTALLATION.md) for detailed setup
3. Review [ARCHITECTURE.md](./ARCHITECTURE.md) to understand design
4. Read [README.md](./README.md) for complete API docs
5. Explore source code starting with `src/index.js`

## 🔧 File Organization

```
url-shortener/
├── src/                    # Source code
│   ├── index.js           # Entry point
│   ├── config/            # Configuration
│   ├── controllers/       # HTTP handlers
│   ├── services/          # Business logic
│   ├── models/            # Data schemas
│   ├── middleware/        # Middleware
│   ├── routes/            # API routes
│   └── utils/             # Utilities
├── tests/                 # Test files
├── .vscode/              # VS Code settings
├── package.json          # Dependencies
├── .env.example          # Environment template
├── Dockerfile            # Docker image
├── docker-compose.yml    # Full stack
├── README.md            # Full docs
├── QUICKSTART.md        # Quick guide
├── ARCHITECTURE.md      # Architecture
└── INSTALLATION.md      # Setup guide
```

## ⚡ Next Steps

1. **Install & Run**
   ```bash
   npm install
   cp .env.example .env
   npm run dev
   ```

2. **Test the API**
   - Post to `/api/urls`
   - Access the short code
   - Check `/health` endpoint

3. **Explore Code**
   - Read `src/index.js` (main entry point)
   - Check `src/routes/urlRoutes.js` (endpoints)
   - Review `src/services/urlService.js` (logic)

4. **Customize**
   - Change rate limits in `.env`
   - Modify validation in `src/utils/validation.js`
   - Add new endpoints in `src/routes/urlRoutes.js`

5. **Deploy**
   - Use Docker for containerization
   - Deploy to cloud provider
   - Set up MongoDB Atlas for production

## 🤝 Support

- **Issues**: Check error messages in terminal
- **Logs**: Review server output for debugging
- **Docs**: Refer to README.md and ARCHITECTURE.md
- **Code**: Read JSDoc comments in source files

## ✨ Highlights

✅ **Clean, Readable Code**
- Clear naming conventions
- Organized file structure
- Well-documented functions

✅ **Production Ready**
- Error handling
- Health checks
- Graceful shutdown

✅ **Scalable Design**
- Connection pooling
- Optimized queries
- Stateless architecture

✅ **Secure**
- Input validation
- Rate limiting
- Security headers

---

**You're all set!** Follow the [QUICKSTART.md](./QUICKSTART.md) to get running in 5 minutes. 🚀
