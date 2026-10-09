const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const env = require('./config/env');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const briefRoutes = require('./routes/briefRoutes');
const matchRoutes = require('./routes/matchRoutes');
const projectRoutes = require('./routes/projectRoutes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

app.use(helmet());

const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  env.clientUrl,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/briefs', briefRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/projects', projectRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
