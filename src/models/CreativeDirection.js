const mongoose = require('mongoose');

const conceptSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    visualStyle: { type: String, default: '' },
    mood: { type: String, default: '' },
    colorPalette: { type: [String], default: [] },
    cameraDirection: { type: String, default: '' },
    aiTools: { type: [String], default: [] },
    promptDirection: { type: String, default: '' },
  },
  { _id: false }
);

const creativeDirectionSchema = new mongoose.Schema(
  {
    briefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brief',
      required: [true, 'briefId is required'],
      index: true,
    },
    inputIdea: {
      type: String,
      required: [true, 'inputIdea is required'],
      trim: true,
      maxlength: [2000, 'inputIdea must be at most 2000 characters'],
    },
    concepts: {
      type: [conceptSchema],
      default: [],
      validate: {
        validator: (v) => v.length === 0 || v.length === 3,
        message: 'concepts must contain exactly 3 concepts',
      },
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

module.exports =
  mongoose.models.CreativeDirection ||
  mongoose.model('CreativeDirection', creativeDirectionSchema);
