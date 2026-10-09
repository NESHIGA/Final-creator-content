const Brief = require('../models/Brief');
const Creator = require('../models/Creator');
const Project = require('../models/Project');
const matchService = require('../services/matchService');
const { HttpError, asyncHandler } = require('../middleware/error');
const { pick } = require('../middleware/validate');

const EDITABLE_FIELDS = [
  'name', 'description', 'status', 'progress', 'deadline', 'budget',
  'milestones', 'deliverables', 'revisionCount', 'deadlineRisk',
];

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function loadOwnedProject(req) {
  const project = await Project.findById(req.params.id);
  if (!project) throw new HttpError(404, 'Project not found');
  if (req.user.role === 'admin') return project;

  if (String(project.brandId) === req.user.id) return project;

  const profile = await Creator.findOne({ user: req.user.id });
  if (profile && String(project.creatorId) === String(profile._id)) return project;

  throw new HttpError(403, 'You do not have access to this project');
}

const list = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  let filter = {};
  if (req.user.role === 'brand') {
    filter.brandId = req.user.id;
  } else if (req.user.role === 'creator') {
    const profile = await Creator.findOne({ user: req.user.id });
    filter = profile ? { creatorId: profile._id } : { _id: null };
  }
  if (status) filter.status = status;
  if (search) filter.name = new RegExp(escapeRegex(search), 'i');

  const [items, total] = await Promise.all([
    Project.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('creatorId', 'name avatar startingPrice deliveryDays trustScore'),
    Project.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const getOne = asyncHandler(async (req, res) => {
  const project = await loadOwnedProject(req);
  await project.populate([
    { path: 'brandId', select: 'name email company avatar' },
    { path: 'creatorId', select: 'name avatar startingPrice deliveryDays trustScore' },
    { path: 'briefId', select: 'idea industry contentType status' },
  ]);
  res.status(200).json({ success: true, data: project, project });
});

const create = asyncHandler(async (req, res) => {
  const { creatorId, briefId } = req.body;

  const creator = await Creator.findById(creatorId);
  if (!creator) throw new HttpError(404, 'Creator not found');

  let brief = null;
  if (briefId) {
    brief = await Brief.findById(briefId);
    if (!brief) throw new HttpError(404, 'Brief not found');
    if (String(brief.userId) !== req.user.id && req.user.role !== 'admin') {
      throw new HttpError(403, 'You can only link your own briefs to a project');
    }
  }

  const data = pick(req.body, EDITABLE_FIELDS);
  if (brief) {
    if (data.budget === undefined && brief.budget) data.budget = brief.budget;
    if (data.deadline === undefined && brief.deadline) data.deadline = brief.deadline;
  }

  let matchScore = null;
  const bodyScore = Number(req.body.matchScore);
  if (req.body.matchScore !== undefined && Number.isFinite(bodyScore) && bodyScore >= 0 && bodyScore <= 100) {
    matchScore = Math.round(bodyScore);
  } else if (brief) {
    try {
      matchScore = matchService.scoreBrief(brief, creator).matchScore;
    } catch (err) {
      matchScore = null;
    }
  }

  const name =
    String(data.name || '').trim() ||
    (brief && brief.idea ? String(brief.idea).slice(0, 140) : `Project with ${creator.name || 'creator'}`);
  delete data.name;

  const project = await Project.create({
    ...data,
    name,
    brandId: req.user.id,
    creatorId: creator._id,
    briefId: briefId || null,
    creatorName: creator.name || '',
    idea: brief ? String(brief.idea || '') : '',
    platform: brief ? brief.platform || '' : '',
    contentType: brief ? brief.contentType || '' : '',
    style: brief ? brief.style || '' : '',
    matchScore,
  });

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    project,
    data: project,
  });
});

const update = asyncHandler(async (req, res) => {
  const project = await loadOwnedProject(req);
  Object.assign(project, pick(req.body, EDITABLE_FIELDS));
  await project.save();
  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    project,
    data: project,
  });
});

const remove = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new HttpError(404, 'Project not found');

  const isAdmin = req.user.role === 'admin';
  if (String(project.brandId) !== req.user.id && !isAdmin) {
    throw new HttpError(403, 'Only the brand that owns this project can delete it');
  }

  await project.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
  });
});

module.exports = { list, getOne, create, update, remove };
