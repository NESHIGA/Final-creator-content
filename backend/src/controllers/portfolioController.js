const Creator = require('../models/Creator');
const Portfolio = require('../models/Portfolio');
const { HttpError, asyncHandler } = require('../middleware/error');
const { pick } = require('../middleware/validate');

const CREATABLE_FIELDS = [
  'title', 'description', 'image', 'contentType', 'industry', 'category',
  'tools', 'prompt', 'workflow', 'resolution', 'aspectRatio',
  'commercialRights', 'completionTime', 'tags', 'code',
];

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function loadOwnedPortfolio(req) {
  const item = await Portfolio.findById(req.params.id);
  if (!item) throw new HttpError(404, 'Portfolio item not found');
  const creator = await Creator.findById(item.creatorId);
  if (!creator) throw new HttpError(404, 'Creator profile no longer exists');
  const isOwner = creator.user && String(creator.user) === req.user.id;
  if (!isOwner && req.user.role !== 'admin') {
    throw new HttpError(403, 'You can only manage your own portfolio items');
  }
  return { item, creator };
}

const list = asyncHandler(async (req, res) => {
  const { creatorId, contentType, category, industry, search, sort } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(60, Math.max(1, parseInt(req.query.limit, 10) || 24));
  const skip = (page - 1) * limit;

  const filter = {};
  if (creatorId) filter.creatorId = creatorId;
  if (contentType) filter.contentType = contentType;
  if (category) filter.category = category;
  if (industry) filter.industry = industry;
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: rx }, { description: rx }];
  }

  const sortMap = {
    newest: { createdAt: -1 },
    title: { title: 1 },
  };

  const [items, total] = await Promise.all([
    Portfolio.find(filter)
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(limit),
    Portfolio.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const getOne = asyncHandler(async (req, res) => {
  const item = await Portfolio.findById(req.params.id);
  if (!item) throw new HttpError(404, 'Portfolio item not found');
  res.status(200).json({ success: true, data: item });
});

const create = asyncHandler(async (req, res) => {
  const profile = await Creator.findOne({ user: req.user.id });
  if (!profile) {
    throw new HttpError(404, 'Creator profile not found. Create your profile before adding portfolio items.');
  }

  const item = await Portfolio.create({
    ...pick(req.body, CREATABLE_FIELDS),
    creatorId: profile._id,
  });

  profile.portfolio.push(item._id);
  await profile.save();

  res.status(201).json({
    success: true,
    message: 'Portfolio item added successfully',
    data: item,
  });
});

const update = asyncHandler(async (req, res) => {
  const { item } = await loadOwnedPortfolio(req);
  Object.assign(item, pick(req.body, CREATABLE_FIELDS));
  await item.save();
  res.status(200).json({
    success: true,
    message: 'Portfolio item updated successfully',
    data: item,
  });
});

const remove = asyncHandler(async (req, res) => {
  const { item, creator } = await loadOwnedPortfolio(req);
  creator.portfolio.pull(item._id);
  await Promise.all([item.deleteOne(), creator.save()]);
  res.status(200).json({
    success: true,
    message: 'Portfolio item deleted successfully',
  });
});

module.exports = { list, getOne, create, update, remove };
