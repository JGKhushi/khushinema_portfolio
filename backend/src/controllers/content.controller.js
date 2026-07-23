import Experience from '../models/Experience.js';
import SkillGroup from '../models/SkillGroup.js';
import Education from '../models/Education.js';
import Achievement from '../models/Achievement.js';
import createCrudController from './createCrudController.js';

export const experienceController = createCrudController({
  model: Experience,
  resourceName: 'Experience',
  defaultSort: { order: 1 },
});

export const skillController = createCrudController({
  model: SkillGroup,
  resourceName: 'Skill group',
  defaultSort: { order: 1 },
});

export const educationController = createCrudController({
  model: Education,
  resourceName: 'Education entry',
  defaultSort: { order: 1 },
});

export const achievementController = createCrudController({
  model: Achievement,
  resourceName: 'Achievement',
  defaultSort: { order: 1 },
  buildFilter: ({ type }) => (type ? { type } : {}),
});
