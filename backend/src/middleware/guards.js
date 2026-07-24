import ApiError from '../utils/ApiError.js';
import { isDBConnected } from '../config/db.js';

/**
 * Short-circuits data routes with a fast, clear 503 when the database is not
 * connected — instead of letting each query hang until it times out. Health
 * and the API root stay reachable so monitoring still works while the DB is down.
 */
export const requireDB = (req, _res, next) => {
  if (isDBConnected()) return next();
  return next(ApiError.unavailable('The database is temporarily unavailable — please retry shortly'));
};

/**
 * Caps how long a single request may run. If the handler has not responded in
 * `ms`, the client gets a clean 503 rather than a socket that hangs open.
 *
 * @param {number} ms
 */
export const requestTimeout =
  (ms = 20_000) =>
  (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        next(new ApiError(503, 'The request took too long to process'));
      }
    }, ms);
    // Clear the timer once the response finishes, however it finishes.
    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));
    next();
  };

export default requireDB;
