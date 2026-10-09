const mongoose = require('mongoose');

const briefSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true,
    },
    idea: {
      type: String,
      required: [true, 'Idea is required'],
      trim: true,
      minlength: [10, 'Idea must be at least 10 characters'],
      maxlength: [2000, 'Idea must be at most 2000 characters'],
    },
    budget: { type: Number, min: 0, default: 0 },
    deadline: { type: Number, min: 0, max: 365, default: 0 },
    platform: { type: String, default: '' },
    tone: { type: String, default: '' },
    contentType: { type: String, default: '' },
    style: { type: String, default: '' },
    aspectRatio: { type: String, default: '' },
    commercialUse: { type: String, default: '' },
    targetAudience: { type: String, default: '' },
    industry: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'ready', 'matched', 'active', 'completed', 'archived'],
      default: 'draft',
    },
    briefCompleteness: { type: Number, min: 0, max: 100, default: 0 },
    aiAnalysis: { type: mongoose.Schema.Types.Mixed, default: {} },
    recommendations: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Brief || mongoose.model('Brief', briefSchema);
