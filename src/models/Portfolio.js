const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Creator',
      required: [true, 'creatorId is required'],
      index: true,
    },
    code: { type: String, default: '' },
    title: {
      type: String,
      required: [true, 'Portfolio title is required'],
      trim: true,
      maxlength: [120, 'Title must be at most 120 characters'],
    },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    contentType: {
      type: String,
      default: '',
      enum: {
        values: ['', 'AI Video', 'AI Image', 'Animation', '3D', 'Motion Graphics', 'Voice', 'AI Animation', 'Social Reel', 'Image / Graphics'],
        message: 'contentType must be a supported AI content type',
      },
    },
    industry: { type: String, default: '' },
    category: {
      type: String,
      enum: ['', 'lux', 'food', 'shoe', 'tech', 'anim'],
      default: '',
    },
    tools: { type: [String], default: [] },
    prompt: { type: String, default: '' },
    workflow: { type: [String], default: [] },
    resolution: { type: String, default: '' },
    aspectRatio: { type: String, default: '' },
    commercialRights: { type: Boolean, default: false },
    completionTime: { type: String, default: '' },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  }
);

module.exports = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);
