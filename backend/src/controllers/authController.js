const jwt = require('jsonwebtoken');

const env = require('../config/env');
const User = require('../models/User');
const Creator = require('../models/Creator');
const { HttpError, asyncHandler } = require('../middleware/error');

function listValues(value) {
  const values = Array.isArray(value) ? value : String(value || '').split(',');
  return values.map((item) => String(item).trim()).filter(Boolean);
}

function signToken(user) {
  if (!env.jwtSecret) {
    throw new HttpError(500, 'JWT_SECRET is not configured on the server');
  }
  return jwt.sign({ id: user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: '7d',
  });
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, company, specialization, creatorProfile } = req.body;

  if (!env.jwtSecret) throw new HttpError(503, 'Authentication is not configured on the server');

  if (role && !['brand', 'creator'].includes(role)) {
    throw new HttpError(400, 'Validation failed', [
      { field: 'role', message: "role must be 'brand' or 'creator'" },
    ]);
  }

  const priceInput = creatorProfile && creatorProfile.startingPrice;
  const startingPrice = Number(priceInput);
  if (role === 'creator' && (!creatorProfile || priceInput === undefined || priceInput === null || String(priceInput).trim() === '' || !Number.isFinite(startingPrice) || startingPrice < 0)) {
    throw new HttpError(400, 'A valid starting price is required for creator accounts', [
      { field: 'creatorProfile.startingPrice', message: 'Enter a price of 0 or more' },
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

  let creator = null;
  if (role === 'creator') {
    try {
      creator = await Creator.create({
        user: user._id,
        name: user.name,
        email: normalizedEmail,
        bio: creatorProfile.bio || '',
        location: creatorProfile.location || '',
        specialization: listValues(creatorProfile.specialization),
        contentTypes: listValues(creatorProfile.contentTypes),
        tools: listValues(creatorProfile.tools).map((tool) => ({ name: tool })),
        startingPrice,
      });
    } catch (error) {
      await user.deleteOne().catch(() => {});
      throw error;
    }
  }

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token: signToken(user),
    user,
    ...(creator ? { creator } : {}),
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
