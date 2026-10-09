const app = require('./app');
const env = require('./config/env');
const { connectDB } = require('./config/db');

let connectionPromise;

module.exports = async function handler(req, res) {
  if (/\/health(?:\/|$|\?)/.test(req.url || '')) return app(req, res);

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