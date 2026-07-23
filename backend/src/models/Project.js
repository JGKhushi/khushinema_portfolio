import mongoose from 'mongoose';
import toJSONPlugin from './plugins/toJSON.js';

const highlightSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    metric: { type: String, trim: true },
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    tagline: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    problem: { type: String, trim: true },
    solution: { type: String, trim: true },
    role: { type: String, trim: true },
    category: {
      type: String,
      enum: ['full-stack', 'backend', 'frontend', 'ai', 'data', 'automation'],
      default: 'full-stack',
      index: true,
    },
    stack: { type: [String], default: [], index: true },
    highlights: { type: [highlightSchema], default: [] },
    coverImage: { type: String, trim: true },
    accent: { type: String, trim: true, default: '#6366f1' },
    links: {
      github: { type: String, trim: true },
      live: { type: String, trim: true },
      caseStudy: { type: String, trim: true },
    },
    year: { type: String, trim: true },
    featured: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ['shipped', 'in-progress', 'archived'], default: 'shipped' },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true, index: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

projectSchema.index({ featured: -1, order: 1, createdAt: -1 });
projectSchema.index({ title: 'text', tagline: 'text', description: 'text', stack: 'text' });

projectSchema.plugin(toJSONPlugin);

export const Project = mongoose.model('Project', projectSchema);
export default Project;
