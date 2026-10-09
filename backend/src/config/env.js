const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const vercelUrls = [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
  .filter(Boolean)
  .map((url) => `https://${url.replace(/^https?:\/\//, '')}`);

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: (process.env.MONGODB_URI || '').trim(),
  jwtSecret: (process.env.JWT_SECRET || '').trim(),
  clientUrl: process.env.CLIENT_URL || vercelUrls[0] || 'http://localhost:5500',
  vercelUrls,
};

if (!env.mongoUri) {
  console.warn('[env] MONGODB_URI is empty - the server will start without a database connection.');
}
if (!env.jwtSecret) {
  console.warn('[env] JWT_SECRET is empty - set it in backend/.env before enabling authentication.');
}

module.exports = env;
