import mongoose from 'mongoose';
import toJSONPlugin from './plugins/toJSON.js';

const socialSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    handle: { type: String, trim: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String, trim: true, default: 'link' },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    caption: { type: String, trim: true },
  },
  { _id: false },
);

/**
 * Singleton document (`key: 'primary'`) describing the person behind the site.
 */
const profileSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'primary', unique: true, immutable: true },
    name: { type: String, required: true, trim: true },
    headline: { type: String, required: true, trim: true },
    roles: { type: [String], default: [] },
    location: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    summary: { type: String, required: true, trim: true },
    about: { type: [String], default: [] },
    availability: {
      status: { type: String, enum: ['open', 'selective', 'closed'], default: 'open' },
      message: { type: String, trim: true },
    },
    resumeUrl: { type: String, trim: true },
    socials: { type: [socialSchema], default: [] },
    stats: { type: [statSchema], default: [] },
    currentFocus: { type: [String], default: [] },
  },
  { timestamps: true },
);

profileSchema.plugin(toJSONPlugin);

profileSchema.statics.getSingleton = function getSingleton() {
  return this.findOne({ key: 'primary' }).exec();
};

export const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
