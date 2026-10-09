const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true,
    },
    day: { type: String, default: 'Day 0' },
    completed: { type: Boolean, default: false },
  },
  { _id: true }
);

const deliverableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Deliverable name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'delivered', 'approved'],
      default: 'pending',
    },
    fileUrl: { type: String, default: '' },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'brandId is required'],
      index: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Creator',
      required: [true, 'creatorId is required'],
      index: true,
    },
    briefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brief',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [140, 'Project name must be at most 140 characters'],
    },
    description: { type: String, default: '' },
    idea: { type: String, default: '' },
    platform: { type: String, default: '' },
    contentType: { type: String, default: '' },
    style: { type: String, default: '' },
    creatorName: { type: String, default: '' },
    matchScore: { type: Number, min: 0, max: 100, default: null },
    status: {
      type: String,
      enum: [
        'Pending',
        'In Progress',
        'Review',
        'Completed',
        'draft',
        'brief-approved',
        'concept',
        'generation',
        'review',
        'revision',
        'final-delivery',
        'completed',
      ],
      default: 'Pending',
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    deadline: { type: Number, min: 0, max: 365, default: 0 },
    budget: { type: Number, min: 0, default: 0 },
    milestones: { type: [milestoneSchema], default: [] },
    deliverables: { type: [deliverableSchema], default: [] },
    revisionCount: { type: Number, min: 0, default: 0 },
    aiHealth: { type: mongoose.Schema.Types.Mixed, default: {} },
    deadlineRisk: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    aiPrediction: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

projectSchema.virtual('title').get(function () {
  return this.name;
});
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);
