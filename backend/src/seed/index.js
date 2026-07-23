import env from '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import logger from '../utils/logger.js';

import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import SkillGroup from '../models/SkillGroup.js';
import Education from '../models/Education.js';
import Achievement from '../models/Achievement.js';
import User from '../models/User.js';

import * as content from './data.js';

const FRESH = process.argv.includes('--fresh');

async function seed() {
  await connectDB();

  if (FRESH) {
    logger.warn('--fresh: clearing existing content collections (messages are preserved)');
    await Promise.all([
      Profile.deleteMany({}),
      Project.deleteMany({}),
      Experience.deleteMany({}),
      SkillGroup.deleteMany({}),
      Education.deleteMany({}),
      Achievement.deleteMany({}),
    ]);
  }

  await Profile.findOneAndUpdate({ key: 'primary' }, content.profile, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
  logger.info('Profile seeded');

  // Upsert by natural key so re-running the seed edits rather than duplicates.
  const upsertAll = async (model, items, keyOf) => {
    await Promise.all(
      items.map((item) => model.findOneAndUpdate(keyOf(item), item, { upsert: true, new: true })),
    );
    logger.info(`${model.modelName}: ${items.length} records seeded`);
  };

  await upsertAll(Project, content.projects, (p) => ({ slug: p.slug }));
  await upsertAll(Experience, content.experience, (e) => ({
    company: e.company,
    role: e.role,
  }));
  await upsertAll(SkillGroup, content.skills, (s) => ({ category: s.category }));
  await upsertAll(Education, content.education, (e) => ({
    degree: e.degree,
    institution: e.institution,
  }));
  await upsertAll(Achievement, content.achievements, (a) => ({ title: a.title }));

  const existingAdmin = await User.findOne({ email: env.ADMIN_EMAIL });
  if (existingAdmin) {
    logger.info(`Admin already exists → ${env.ADMIN_EMAIL}`);
  } else {
    await User.create({
      name: content.profile.name,
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
      role: 'admin',
    });
    logger.success(`Admin created → ${env.ADMIN_EMAIL}`);
  }

  logger.success('Seed complete');
  await disconnectDB();
  process.exit(0);
}

seed().catch(async (error) => {
  logger.error('Seed failed', error);
  await disconnectDB();
  process.exit(1);
});
