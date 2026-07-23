import mongoose from 'mongoose';
import toJSONPlugin from './plugins/toJSON.js';

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    score: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    coursework: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

educationSchema.plugin(toJSONPlugin);

export const Education = mongoose.model('Education', educationSchema);
export default Education;
