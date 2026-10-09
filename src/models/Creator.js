const mongoose = require('mongoose');

const creativeDNASchema = new mongoose.Schema(
  {
    categoryScores: {
      lux: { type: Number, min: 0, max: 100, default: 0 },
      food: { type: Number, min: 0, max: 100, default: 0 },
      shoe: { type: Number, min: 0, max: 100, default: 0 },
      tech: { type: Number, min: 0, max: 100, default: 0 },
      anim: { type: Number, min: 0, max: 100, default: 0 },
    },
    keywords: { type: [String], default: [] },
    strengths: { type: [String], default: [] },
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['available', 'limited', 'booked'],
      default: 'available',
    },
    message: { type: String, default: 'Open for new projects' },
    nextOpenDate: { type: Date, default: null },
  },
  { _id: false }
);

const toolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tool name is required'],
      trim: true,
    },
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const creatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Creator name is required'],
      trim: true,
      maxlength: [100, 'Name must be at most 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Creator email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '', trim: true, maxlength: [600, 'Bio must be at most 600 characters'] },
    location: { type: String, default: '', trim: true },
    specialization: { type: [String], default: [] },
    contentTypes: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    tools: { type: [toolSchema], default: [] },
    styles: { type: [String], default: [] },
    style: { type: String, default: '', trim: true },
    industries: { type: [String], default: [] },
    platforms: { type: [String], default: [] },
    experience: { type: Number, min: 0, max: 50, default: 1 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, min: 0, default: 0 },
    projectsCompleted: { type: Number, min: 0, default: 0 },
    trustScore: { type: Number, min: 0, max: 100, default: 50 },
    startingPrice: { type: Number, min: 0, required: [true, 'startingPrice is required'] },
    budgetMin: { type: Number, min: 0, default: 0 },
    budgetMax: { type: Number, min: 0, default: 0 },
    deliveryDays: { type: Number, min: 1, max: 90, default: 5 },
    turnaroundDays: { type: Number, min: 0, max: 365, default: 0 },
    commercialReady: { type: Boolean, default: false },
    commercialExperience: { type: String, default: '', trim: true, maxlength: [600, 'commercialExperience must be at most 600 characters'] },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified'],
      default: 'unverified',
    },
    creativeDNA: { type: creativeDNASchema, default: () => ({}) },
    workflow: { type: [String], default: [] },
    availability: { type: availabilitySchema, default: () => ({}) },
    portfolio: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Portfolio',
      default: [],
    },
    verification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Verification',
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

creatorSchema.index({ name: 'text', bio: 'text', location: 'text' });
creatorSchema.index({ 'tools.name': 1 });
creatorSchema.index({ contentTypes: 1 });
creatorSchema.index({ trustScore: -1 });

module.exports = mongoose.models.Creator || mongoose.model('Creator', creatorSchema);
