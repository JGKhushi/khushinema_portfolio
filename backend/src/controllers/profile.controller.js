import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import SkillGroup from '../models/SkillGroup.js';
import Education from '../models/Education.js';
import Achievement from '../models/Achievement.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getProfile = asyncHandler(async (_req, res) => {
  const profile = await Profile.getSingleton();
  if (!profile) throw ApiError.notFound('Profile has not been seeded yet');
  sendSuccess(res, profile);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOneAndUpdate({ key: 'primary' }, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });
  sendSuccess(res, profile);
});

/**
 * One request that hydrates the entire site. The landing page needs every
 * collection at once; six round-trips would just be six chances to jank.
 */
export const getOverview = asyncHandler(async (_req, res) => {
  const [profile, projects, experience, skills, education, achievements] = await Promise.all([
    Profile.getSingleton(),
    Project.find({ published: true }).sort({ featured: -1, order: 1, createdAt: -1 }),
    Experience.find({ published: true }).sort({ order: 1 }),
    SkillGroup.find({ published: true }).sort({ order: 1 }),
    Education.find({ published: true }).sort({ order: 1 }),
    Achievement.find({ published: true }).sort({ order: 1 }),
  ]);

  if (!profile) throw ApiError.notFound('Portfolio content has not been seeded yet');

  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  sendSuccess(res, { profile, projects, experience, skills, education, achievements });
});
