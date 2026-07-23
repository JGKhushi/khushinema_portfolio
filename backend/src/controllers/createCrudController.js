import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse.js';

/**
 * The content collections (projects, experience, skills, …) differ only in
 * model, sort order and filter shape — so they share one controller factory
 * rather than five copies of the same five handlers.
 *
 * @param {object} options
 * @param {import('mongoose').Model} options.model
 * @param {string} options.resourceName        Used in 404 messages.
 * @param {object} [options.defaultSort]
 * @param {(query: object) => object} [options.buildFilter]  Public list filters.
 */
export function createCrudController({
  model,
  resourceName,
  defaultSort = { order: 1, createdAt: -1 },
  buildFilter = () => ({}),
}) {
  const findOr404 = async (id) => {
    const doc = await model.findById(id);
    if (!doc) throw ApiError.notFound(`${resourceName} not found`);
    return doc;
  };

  return {
    list: asyncHandler(async (req, res) => {
      const { page = 1, limit = 50, sort, ...rest } = req.query ?? {};
      const filter = { published: true, ...buildFilter(rest) };
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        model.find(filter).sort(sort ?? defaultSort).skip(skip).limit(limit),
        model.countDocuments(filter),
      ]);

      sendSuccess(res, items, {
        meta: { total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) },
      });
    }),

    listAll: asyncHandler(async (_req, res) => {
      const items = await model.find({}).sort(defaultSort);
      sendSuccess(res, items);
    }),

    getById: asyncHandler(async (req, res) => {
      sendSuccess(res, await findOr404(req.params.id));
    }),

    create: asyncHandler(async (req, res) => {
      sendCreated(res, await model.create(req.body));
    }),

    update: asyncHandler(async (req, res) => {
      const doc = await findOr404(req.params.id);
      doc.set(req.body);
      await doc.save();
      sendSuccess(res, doc);
    }),

    remove: asyncHandler(async (req, res) => {
      await findOr404(req.params.id);
      await model.findByIdAndDelete(req.params.id);
      sendNoContent(res);
    }),
  };
}

export default createCrudController;
