const jwt = require('jsonwebtoken');

const env = require('../config/env');
const User = require('../models/User');
const { HttpError, asyncHandler } = require('./error');

const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'Authentication required. Please log in.');
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (err) {
    throw new HttpError(401, err.name === 'TokenExpiredError' ? 'Session expired. Please log in again.' : 'Invalid or expired token');
  }

  const user = await User.findById(payload.id);
  if (!user) throw new HttpError(401, 'Account no longer exists. Please log in again.');

  req.user = user;
  next();
});

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(new HttpError(401, 'Authentication required. Please log in.'));
  if (!roles.includes(req.user.role)) {
    return next(new HttpError(403, 'You do not have permission to perform this action'));
  }
  next();
};

module.exports = { requireAuth, requireRole };
