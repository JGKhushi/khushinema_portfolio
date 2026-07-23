import mongoose from 'mongoose';
import { ZodError } from 'zod';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

export const notFound = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Translates the error zoo (Zod, Mongoose, JWT, duplicate keys) into one
 * consistent `{ success: false, error }` envelope.
 */
const normalise = (error) => {
  if (error instanceof ApiError) return error;

  if (error instanceof ZodError) {
    return ApiError.badRequest(
      'Validation failed',
      error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })),
    );
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return ApiError.badRequest(
      'Validation failed',
      Object.values(error.errors).map((err) => ({ field: err.path, message: err.message })),
    );
  }

  if (error instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(`Invalid value for "${error.path}"`);
  }

  if (error?.code === 11000) {
    const field = Object.keys(error.keyValue ?? {})[0] ?? 'field';
    return ApiError.conflict(`A record with that ${field} already exists`);
  }

  if (error?.name === 'JsonWebTokenError') return ApiError.unauthorized('Invalid token');
  if (error?.name === 'TokenExpiredError') return ApiError.unauthorized('Session expired');

  return ApiError.internal(error?.message ?? 'Something went wrong');
};

// eslint-disable-next-line no-unused-vars -- Express identifies error middleware by arity.
export const errorHandler = (error, req, res, next) => {
  const normalised = normalise(error);

  if (normalised.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl}`, error?.stack ?? error);
  }

  res.status(normalised.statusCode).json({
    success: false,
    error: {
      message: normalised.message,
      ...(normalised.details ? { details: normalised.details } : {}),
      ...(env.isProd ? {} : { stack: error?.stack }),
    },
  });
};

export default errorHandler;
