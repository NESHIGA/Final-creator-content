const mongoose = require('mongoose');

const revisionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'projectId is required'],
      index: true,
    },
    originalFeedback: {
      type: String,
      required: [true, 'originalFeedback is required'],
      trim: true,
      maxlength: [2000, 'Feedback must be at most 2000 characters'],
    },
    creativeDirection: { type: String, default: '' },
    colorInstructions: { type: String, default: '' },
    lightingInstructions: { type: String, default: '' },
    compositionInstructions: { type: String, default: '' },
    generatedInstructions: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

module.exports = mongoose.models.Revision || mongoose.model('Revision', revisionSchema);
