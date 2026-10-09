const mongoose = require('mongoose');

async function connectDB(uri) {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.');
  });

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });

  console.log(
    `MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`
  );
  return mongoose.connection;
}

async function disconnectDB() {
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
}

module.exports = { connectDB, disconnectDB };
