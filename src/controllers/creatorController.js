const Creator = require('../models/Creator');
const Portfolio = require('../models/Portfolio');
const { HttpError, asyncHandler } = require('../middleware/error');
const { pick } = require('../middleware/validate');

const CREATABLE_FIELDS = [
  'name', 'email', 'avatar', 'bio', 'location', 'specialization', 'contentTypes',
  'skills', 'tools', 'styles', 'style', 'industries', 'platforms', 'experience',
  'startingPrice', 'budgetMin', 'budgetMax', 'deliveryDays', 'turnaroundDays',
  'commercialReady', 'commercialExperience', 'creativeDNA', 'workflow', 'availability',
];

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parsePagination(query, { defaultLimit = 12, maxLimit = 50 } = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}

const list = asyncHandler(async (req, res) => {
  const { search, tool, contentType, availability, minPrice, maxPrice, sort } = req.query;
  const { style, platform, budget, maxDays } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  const filter = {};
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: rx }, { bio: rx }, { location: rx }];
  }
  if (tool) filter['tools.name'] = tool;
  if (contentType) filter.contentTypes = contentType;
  if (availability) filter['availability.status'] = availability;
  if (minPrice || maxPrice) {
    filter.startingPrice = {};
    if (minPrice) filter.startingPrice.$gte = Number(minPrice);
    if (maxPrice) filter.startingPrice.$lte = Number(maxPrice);
  }

  const and = [];
  if (style) {
    const rx = new RegExp(`^${escapeRegex(style)}$`, 'i');
    and.push({ $or: [{ style: rx }, { styles: rx }] });
  }
  if (platform) {
    and.push({ platforms: new RegExp(`^${escapeRegex(platform)}$`, 'i') });
  }
  if (budget) {
    const b = Number(budget);
    and.push({ budgetMin: { $lte: b } });
    and.push({ $or: [{ budgetMax: 0 }, { budgetMax: null }, { budgetMax: { $gte: b } }] });
  }
  if (maxDays) {
    const d = Number(maxDays);
    and.push({
      $or: [
        { turnaroundDays: { $gt: 0, $lte: d } },
        { $and: [{ turnaroundDays: { $in: [0, null] } }, { deliveryDays: { $lte: d } }] },
      ],
    });
  }
  if (and.length) filter.$and = and;

  const sortMap = {
    trustScore: { trustScore: -1, rating: -1 },
    rating: { rating: -1, trustScore: -1 },
    'price-asc': { startingPrice: 1 },
    'price-desc': { startingPrice: -1 },
    newest: { createdAt: -1 },
  };

  const [items, total] = await Promise.all([
    Creator.find(filter)
      .populate('portfolio')
      .sort(sortMap[sort] || sortMap.trustScore)
      .skip(skip)
      .limit(limit),
    Creator.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    creators: items,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const getOne = asyncHandler(async (req, res) => {
  const creator = await Creator.findById(req.params.id).populate('portfolio');
  if (!creator) throw new HttpError(404, 'Creator not found');
  res.status(200).json({ success: true, creator, data: creator });
});

const create = asyncHandler(async (req, res) => {
  const existing = await Creator.findOne({ user: req.user.id });
  if (existing) throw new HttpError(409, 'You already have a creator profile');

  const body = pick(req.body, CREATABLE_FIELDS);
  if (!body.email) body.email = req.user.email;
  if (!body.name) body.name = req.user.name;

  const creator = await Creator.create({ ...body, user: req.user.id });

  res.status(201).json({
    success: true,
    message: 'Creator profile created successfully',
    data: creator,
  });
});

async function loadOwnedCreator(req) {
  const creator = await Creator.findById(req.params.id);
  if (!creator) throw new HttpError(404, 'Creator not found');
  const isOwner = creator.user && String(creator.user) === req.user.id;
  if (!isOwner && req.user.role !== 'admin') {
    throw new HttpError(403, 'You can only manage your own creator profile');
  }
  return creator;
}

const update = asyncHandler(async (req, res) => {
  const creator = await loadOwnedCreator(req);
  Object.assign(creator, pick(req.body, CREATABLE_FIELDS));
  await creator.save();
  res.status(200).json({
    success: true,
    message: 'Creator profile updated successfully',
    data: creator,
  });
});

const remove = asyncHandler(async (req, res) => {
  const creator = await loadOwnedCreator(req);
  await Promise.all([
    Portfolio.deleteMany({ creatorId: creator._id }),
    creator.deleteOne(),
  ]);
  res.status(200).json({
    success: true,
    message: 'Creator profile deleted successfully',
  });
});

module.exports = { list, getOne, create, update, remove };
