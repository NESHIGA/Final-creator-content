const Brief = require('../models/Brief');
const Creator = require('../models/Creator');
const { HttpError, asyncHandler } = require('../middleware/error');
const { matchBrief } = require('../services/matchService');

async function computeMatches(briefId) {
  let brief;
  try {
    brief = await Brief.findById(briefId);
  } catch (err) {
    if (err.name === 'CastError') throw new HttpError(400, `Invalid value for '_id'`, [{ field: 'briefId', message: 'Invalid format' }]);
    throw err;
  }
  if (!brief) throw new HttpError(404, 'Brief not found');
  const creators = await Creator.find({}).populate('portfolio');
  return matchBrief(brief, creators);
}

const create = asyncHandler(async (req, res) => {
  const matches = await computeMatches(req.body.briefId);
  res.status(200).json({ success: true, matches });
});

const getOne = asyncHandler(async (req, res) => {
  const matches = await computeMatches(req.params.briefId);
  res.status(200).json({ success: true, matches });
});

module.exports = { create, getOne };
