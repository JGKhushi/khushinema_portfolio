import { ZodError } from 'zod';
import ApiError from '../utils/ApiError.js';

/**
 * Validates and *replaces* the named request segments with their parsed output,
 * so controllers only ever see coerced, trusted values.
 *
 * @param {{ body?: import('zod').ZodTypeAny, query?: import('zod').ZodTypeAny, params?: import('zod').ZodTypeAny }} schemas
 */
export const validate = (schemas) => (req, _res, next) => {
  try {
    for (const segment of ['params', 'query', 'body']) {
      const schema = schemas[segment];
      if (!schema) continue;
      const parsed = schema.parse(req[segment]);
      if (segment === 'query') {
        // req.query is a getter in Express 5-style setups; keep it assignable.
        Object.defineProperty(req, 'validatedQuery', { value: parsed, writable: true });
        req.query = parsed;
      } else {
        req[segment] = parsed;
      }
    }
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      return next(
        ApiError.badRequest(
          'Validation failed',
          error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })),
        ),
      );
    }
    return next(error);
  }
};

export default validate;
