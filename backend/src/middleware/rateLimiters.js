import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

const handler = (_req, res) => {
  res.status(429).json({
    success: false,
    error: { message: 'Too many requests — please slow down and try again shortly.' },
  });
};

export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

/** Contact form: strict, because it writes to the database. */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

/** Login: strict, because it is the only credential surface. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler,
});
