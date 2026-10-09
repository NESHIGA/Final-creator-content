const Brief = require('../models/Brief');
const { HttpError, asyncHandler } = require('../middleware/error');
const { pick } = require('../middleware/validate');

const EDITABLE_FIELDS = [
  'idea', 'budget', 'deadline', 'platform', 'tone', 'contentType', 'style',
  'aspectRatio', 'commercialUse', 'targetAudience', 'industry', 'status',
  'briefCompleteness',
];

// Accepts the public snake_case API field names alongside the model's
// camelCase names (budget_inr -> budget, deadline_days -> deadline, ...).
const FIELD_ALIASES = {
  budget_inr: 'budget',
  deadline_days: 'deadline',
  content_type: 'contentType',
  aspect_ratio: 'aspectRatio',
  commercial_use: 'commercialUse',
};

function normalizeBody(body) {
  const out = { ...body };
  Object.entries(FIELD_ALIASES).forEach(([from, to]) => {
    if (Object.prototype.hasOwnProperty.call(out, from) && !Object.prototype.hasOwnProperty.call(out, to)) {
      out[to] = out[from];
    }
  });
  return out;
}

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function loadOwnedBrief(req) {
  const brief = await Brief.findById(req.params.id);
  if (!brief) throw new HttpError(404, 'Brief not found');
  const isOwner = String(brief.userId) === req.user.id;
  if (!isOwner && req.user.role !== 'admin') {
    throw new HttpError(403, 'You can only access your own briefs');
  }
  return brief;
}

const list = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.user.role !== 'admin') filter.userId = req.user.id;
  if (status) filter.status = status;
  if (search) filter.idea = new RegExp(escapeRegex(search), 'i');

  const [items, total] = await Promise.all([
    Brief.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Brief.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const getOne = asyncHandler(async (req, res) => {
  const brief = await loadOwnedBrief(req);
  res.status(200).json({ success: true, data: brief, brief });
});

const create = asyncHandler(async (req, res) => {
  const brief = await Brief.create({
    ...pick(normalizeBody(req.body), EDITABLE_FIELDS),
    userId: req.user.id,
  });
  res.status(201).json({
    success: true,
    message: 'Brief created successfully',
    data: brief,
    brief,
  });
});

const update = asyncHandler(async (req, res) => {
  const brief = await loadOwnedBrief(req);
  Object.assign(brief, pick(normalizeBody(req.body), EDITABLE_FIELDS));
  await brief.save();
  res.status(200).json({
    success: true,
    message: 'Brief updated successfully',
    data: brief,
    brief,
  });
});

const remove = asyncHandler(async (req, res) => {
  const brief = await loadOwnedBrief(req);
  await brief.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Brief deleted successfully',
  });
});

module.exports = { list, getOne, create, update, remove };
