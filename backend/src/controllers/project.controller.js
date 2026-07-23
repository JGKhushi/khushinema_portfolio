import Project from '../models/Project.js';
import createCrudController from './createCrudController.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';

const base = createCrudController({
  model: Project,
  resourceName: 'Project',
  defaultSort: { featured: -1, order: 1, createdAt: -1 },
  buildFilter: ({ category, stack, featured, q }) => ({
    ...(category ? { category } : {}),
    ...(stack ? { stack: { $in: [].concat(stack) } } : {}),
    ...(featured !== undefined ? { featured } : {}),
    ...(q ? { $text: { $search: q } } : {}),
  }),
});

/** Public detail route keys on slug, not ObjectId — friendlier URLs. */
const getBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { slug: req.params.slug, published: true },
    { $inc: { views: 1 } },
    { new: true },
  );
  if (!project) throw ApiError.notFound('Project not found');
  sendSuccess(res, project);
});

const getFilters = asyncHandler(async (_req, res) => {
  const [categories, stack] = await Promise.all([
    Project.distinct('category', { published: true }),
    Project.distinct('stack', { published: true }),
  ]);
  sendSuccess(res, { categories: categories.sort(), stack: stack.sort() });
});

export const projectController = { ...base, getBySlug, getFilters };
export default projectController;
