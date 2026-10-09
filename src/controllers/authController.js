const jwt = require('jsonwebtoken');

const env = require('../config/env');
const User = require('../models/User');
const { HttpError, asyncHandler } = require('../middleware/error');

function signToken(user) {
  if (!env.jwtSecret) {
    throw new HttpError(500, 'JWT_SECRET is not configured on the server');
  }
  return jwt.sign({ id: user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: '7d',
  });
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, company, specialization } = req.body;

  if (role && !['brand', 'creator'].includes(role)) {
    throw new HttpError(400, 'Validation failed', [
      { field: 'role', message: "role must be 'brand' or 'creator'" },
    ]);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new HttpError(409, 'An account with this email already exists');

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: role || 'brand',
    company: company || '',
    specialization: specialization || '',
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token: signToken(user),
    user,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email: (email || '').trim().toLowerCase() }).select('+password');
  if (!user) throw new HttpError(401, 'Invalid email or password');

  const match = await user.comparePassword(password);
  if (!match) throw new HttpError(401, 'Invalid email or password');

  if (role && role !== user.role) {
    throw new HttpError(
      403,
      `This account is registered as a ${user.role} account. Please select ${user.role === 'brand' ? 'Brand' : 'Creator'} to log in.`
    );
  }

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token: signToken(user),
    user,
  });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = { register, login, me };
