const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'projectId is required'],
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'senderId is required'],
    },
    message: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true,
      maxlength: [2000, 'Message must be at most 2000 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);
