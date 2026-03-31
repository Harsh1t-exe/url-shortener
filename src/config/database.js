const { MongoClient } = require('mongodb');
const config = require('./index');

let db;
let client;

/**
 * Connects to MongoDB with connection pooling
 * @returns {Object} Database instance
 */
async function connectDB() {
  try {
    client = new MongoClient(config.mongodb.uri, {
      maxPoolSize: config.mongodb.poolSize,
      minPoolSize: 2,
    });

    await client.connect();
    db = client.db();

    // Create indexes for performance
    const urlsCollection = db.collection('urls');
    await urlsCollection.createIndex({ shortCode: 1 }, { unique: true });
    await urlsCollection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

    console.log('✓ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

/**
 * Gets the database instance
 * @returns {Object} Database instance
 */
function getDB() {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
}

/**
 * Closes database connection
 */
async function closeDB() {
  if (client) {
    await client.close();
    console.log('✓ Disconnected from MongoDB');
  }
}

module.exports = {
  connectDB,
  getDB,
  closeDB,
};
