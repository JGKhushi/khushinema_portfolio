import mongoose from 'mongoose';
import toJSONPlugin from './plugins/toJSON.js';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: { type: Number, min: 0, max: 100, default: 70 },
    note: { type: String, trim: true },
  },
  { _id: false },
);

const skillGroupSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, unique: true, trim: true },
    icon: { type: String, trim: true, default: 'code' },
    accent: { type: String, trim: true, default: '#6366f1' },
    description: { type: String, trim: true },
    skills: { type: [skillSchema], default: [] },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

skillGroupSchema.plugin(toJSONPlugin);

export const SkillGroup = mongoose.model('SkillGroup', skillGroupSchema);
export default SkillGroup;
