const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [140, 'Title must be at most 140 characters'],
    },
    message: { type: String, default: '' },
    type: {
      type: String,
      enum: ['info', 'brief', 'project', 'message', 'quality', 'system'],
      default: 'info',
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
