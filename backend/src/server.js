const env = require('./config/env');
const { connectDB, disconnectDB } = require('./config/db');
const app = require('./app');

let server = null;

async function start() {
  if (env.mongoUri) {
    try {
      await connectDB(env.mongoUri);
    } catch (err) {
      console.error(`Failed to connect to MongoDB: ${err.message}`);
      console.error('Check MONGODB_URI in backend/.env (see backend/.env.example).');
      process.exit(1);
    }
  } else {
    console.warn('MONGODB_URI not set - starting without a database connection.');
  }

  server = app.listen(env.port, () => {
    console.log(`CreatorOS AI API listening on http://localhost:${env.port}`);
    console.log(`Health check: http://localhost:${env.port}/api/health`);
    console.log(`Environment: ${env.nodeEnv}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${env.port} is already in use. Change PORT in backend/.env.`);
      process.exit(1);
    }
    console.error('Server error:', err.message);
    process.exit(1);
  });
}

async function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      if (env.mongoUri) await disconnectDB().catch(() => {});
      process.exit(0);
    });
  } else {
    if (env.mongoUri) await disconnectDB().catch(() => {});
    process.exit(0);
  }
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err && err.message ? err.message : err);
  shutdown('unhandledRejection');
});

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
