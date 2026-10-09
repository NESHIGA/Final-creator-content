const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Creator',
      required: [true, 'creatorId is required'],
      unique: true,
      index: true,
    },
    portfolioVerified: { type: Boolean, default: false },
    toolVerified: { type: Boolean, default: false },
    workflowVerified: { type: Boolean, default: false },
    commercialRightsVerified: { type: Boolean, default: false },
    clientReviewsVerified: { type: Boolean, default: false },
    portfolioAuthenticityScore: { type: Number, min: 0, max: 100, default: 0 },
    toolExpertiseScore: { type: Number, min: 0, max: 100, default: 0 },
    workflowVerificationScore: { type: Number, min: 0, max: 100, default: 0 },
    commercialRightsScore: { type: Number, min: 0, max: 100, default: 0 },
    clientReviewsScore: { type: Number, min: 0, max: 100, default: 0 },
    overallTrustScore: { type: Number, min: 0, max: 100, default: 0 },
    evidence: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Verification || mongoose.model('Verification', verificationSchema);
