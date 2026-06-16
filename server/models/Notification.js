import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['announcement', 'event', 'project', 'prayer', 'urgent', 'general'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  expiresAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetAudience: {
    type: String,
    enum: ['all', 'members', 'admin'],
    default: 'all'
  },
  imageUrl: { type: String },
  actionLink: { type: String },
  actionText: { type: String },
  viewCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
