const mongoose = require('mongoose');

const brandMemorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      unique: true,
      index: true,
    },
    brandColors: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.every((c) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)),
        message: 'brandColors must be hex colors like #7C3AED',
      },
    },
    fonts: { type: [String], default: [] },
    logoPosition: { type: String, default: '' },
    visualStyle: { type: [String], default: [] },
    toneOfVoice: { type: String, default: '' },
    targetAudience: { type: String, default: '' },
    preferredTools: { type: [String], default: [] },
    contentRules: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.BrandMemory || mongoose.model('BrandMemory', brandMemorySchema);
