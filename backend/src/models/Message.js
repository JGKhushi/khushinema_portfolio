import mongoose from 'mongoose';
import toJSONPlugin from './plugins/toJSON.js';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    company: { type: String, trim: true, maxlength: 160 },
    subject: { type: String, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
      index: true,
    },
    meta: {
      ip: { type: String, private: true },
      userAgent: { type: String, private: true },
      referrer: { type: String },
    },
  },
  { timestamps: true },
);

messageSchema.index({ createdAt: -1 });

messageSchema.plugin(toJSONPlugin);

export const Message = mongoose.model('Message', messageSchema);
export default Message;
