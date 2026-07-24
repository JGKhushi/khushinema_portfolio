import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';

mongoose.set('strictQuery', true);
// Fail a query fast (5s) instead of buffering forever when the DB is down.
mongoose.set('bufferTimeoutMS', 5_000);

let isConnected = false;
let listenersBound = false;

/** True only when Mongoose reports an active, usable connection. */
export function isDBConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

function bindListeners() {
  if (listenersBound) return;
  listenersBound = true;

  mongoose.connection.on('connected', () => {
    isConnected = true;
    logger.success(`MongoDB connected → ${mongoose.connection.name}`);
  });
  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    logger.success('MongoDB reconnected');
  });
  mongoose.connection.on('error', (error) => {
    // While we're still in the connect-retry loop, connectWithRetry already
    // reports each failure — don't log it twice. Only surface errors that hit
    // an established connection.
    if (isConnected) logger.error('MongoDB connection error', error?.message ?? error);
  });
  mongoose.connection.on('disconnected', () => {
    if (isConnected) logger.warn('MongoDB disconnected — will retry automatically');
    isConnected = false;
  });
}

export async function connectDB() {
  if (isConnected) return mongoose.connection;
  bindListeners();

  await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,
    maxPoolSize: 20,
    autoIndex: !env.isProd,
  });

  return mongoose.connection;
}

/**
 * Connect with exponential backoff, capped at 30s, and never give up — if the
 * database comes back an hour later the API recovers on its own. Resolves once
 * connected; never rejects, so the server can boot and serve (503 on data
 * routes) while the database is still coming up.
 *
 * @param {{ baseDelayMs?: number, maxDelayMs?: number, quietAfter?: number }} [opts]
 */
export async function connectWithRetry({
  baseDelayMs = 1_000,
  maxDelayMs = 30_000,
  quietAfter = 5,
} = {}) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      await connectDB();
      return true;
    } catch (error) {
      const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      // Log the first few loudly, then back off to avoid flooding the log while
      // the database stays down.
      if (attempt <= quietAfter || attempt % 10 === 0) {
        logger.warn(
          `MongoDB unreachable (attempt ${attempt}): ${error?.message ?? error}. Retrying in ${Math.round(
            delay / 1000,
          )}s…`,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export async function disconnectDB() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}

export default connectDB;
