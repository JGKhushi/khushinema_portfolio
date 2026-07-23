import mongoose from 'mongoose';
import toJSONPlugin from './plugins/toJSON.js';

const workstreamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    summary: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    companyUrl: { type: String, trim: true },
    location: { type: String, trim: true },
    type: {
      type: String,
      enum: ['internship', 'full-time', 'freelance', 'contract'],
      default: 'internship',
    },
    startDate: { type: String, required: true, trim: true },
    endDate: { type: String, trim: true, default: 'Present' },
    current: { type: Boolean, default: false },
    summary: { type: String, trim: true },
    workstreams: { type: [workstreamSchema], default: [] },
    achievements: { type: [String], default: [] },
    stack: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

experienceSchema.plugin(toJSONPlugin);

export const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
