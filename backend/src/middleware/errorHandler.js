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

  // Malformed JSON body → body-parser throws a SyntaxError tagged with `type`.
  if (error?.type === 'entity.parse.failed' || (error instanceof SyntaxError && 'body' in error)) {
    return ApiError.badRequest('Request body is not valid JSON');
  }

  // Body larger than the configured limit.
  if (error?.type === 'entity.too.large' || error?.status === 413) {
    return ApiError.tooLarge('Request body is too large (limit 1 MB)');
  }

  // Origin blocked by our CORS policy — a client problem, not a server fault.
  if (typeof error?.message === 'string' && error.message.startsWith('Origin not allowed by CORS')) {
    return ApiError.forbidden('This origin is not allowed to call the API');
  }

  // Request exceeded the server timeout guard.
  if (error?.code === 'ETIMEDOUT' || error?.name === 'RequestTimeoutError') {
    return new ApiError(503, 'The request took too long to process');
  }

  // Database unreachable / not yet connected.
  if (
    error instanceof mongoose.Error.MongooseServerSelectionError ||
    error?.name === 'MongoNotConnectedError' ||
    error?.name === 'MongoNetworkError'
  ) {
    return ApiError.unavailable('The database is temporarily unavailable — please retry shortly');
  }

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

  // Only genuine faults deserve a stack trace. Operational errors we raised on
  // purpose (503 while the DB is down, 4xx from validation) log as one concise
  // line — otherwise an unreachable database floods the log with fake crashes.
  if (normalised.statusCode >= 500) {
    if (normalised.isOperational) {
      logger.warn(`${req.method} ${req.originalUrl} → ${normalised.statusCode} ${normalised.message}`);
    } else {
      logger.error(`${req.method} ${req.originalUrl}`, error?.stack ?? error);
    }
  }

  res.status(normalised.statusCode).json({
    success: false,
    error: {
      message: normalised.message,
      ...(normalised.details ? { details: normalised.details } : {}),
      // Stack only for unexpected faults, and never in production.
      ...(env.isProd || normalised.isOperational ? {} : { stack: error?.stack }),
    },
  });
};

export default errorHandler;
