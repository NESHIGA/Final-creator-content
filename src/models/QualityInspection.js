const mongoose = require('mongoose');

const qualityInspectionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'projectId is required'],
      index: true,
    },
    resolution: { type: Boolean, default: false },
    aspectRatio: { type: Boolean, default: false },
    logoPlacement: { type: Boolean, default: false },
    grammar: { type: Boolean, default: false },
    visualQuality: { type: Boolean, default: false },
    brandGuidelines: { type: Boolean, default: false },
    commercialSafety: { type: Boolean, default: false },
    qualityScore: { type: Number, min: 0, max: 100, default: 0 },
    issues: { type: [String], default: [] },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

module.exports =
  mongoose.models.QualityInspection ||
  mongoose.model('QualityInspection', qualityInspectionSchema);
