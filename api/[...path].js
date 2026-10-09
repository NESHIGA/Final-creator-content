const app = require('../backend/src/app');
const env = require('../backend/src/config/env');
const { connectDB } = require('../backend/src/config/db');

let connectionPromise;

module.exports = async function handler(req, res) {
  if (!env.mongoUri) {
    return res.status(503).json({ success: false, message: 'Database is not configured.' });
  }

  try {
    if (!connectionPromise) connectionPromise = connectDB(env.mongoUri);
    await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    console.error('Database connection failed:', error.message);
    return res.status(503).json({ success: false, message: 'Database connection is unavailable.' });
  }

  return app(req, res);
};