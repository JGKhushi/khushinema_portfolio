import mongoose from 'mongoose';
import toJSONPlugin from './plugins/toJSON.js';

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    detail: { type: String, required: true, trim: true },
    metric: { type: String, trim: true },
    type: {
      type: String,
      enum: ['hackathon', 'leadership', 'coding', 'award'],
      default: 'award',
      index: true,
    },
    period: { type: String, trim: true },
    url: { type: String, trim: true },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

achievementSchema.plugin(toJSONPlugin);

export const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
