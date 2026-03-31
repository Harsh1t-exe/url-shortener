const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const config = require('./config');
const { connectDB, closeDB } = require('./config/database');
const { rateLimit } = require('./middleware/rateLimit');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Security middleware
app.use(helmet());
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (UI)
app.use(express.static('public'));

// Explicitly serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});

// Rate limiting
app.use(rateLimit(config.rateLimit));

// ============================================
// ROUTES
// ============================================

app.use('/', urlRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

async function startServer() {
  try {
    // Connect to database
    await connectDB();

    // Start server
    const server = app.listen(config.port, () => {
      console.log(`✓ Server running on http://localhost:${config.port}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received: closing gracefully');
      server.close(async () => {
        await closeDB();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received: closing gracefully');
      server.close(async () => {
        await closeDB();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
