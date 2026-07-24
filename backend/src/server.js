import env from './config/env.js';
import createApp from './app.js';
import { connectWithRetry, disconnectDB } from './config/db.js';
import logger from './utils/logger.js';

async function bootstrap() {
  // Start listening immediately. Data routes return a clean 503 until the DB is
  // up (see requireDB), so a slow or cold database never blocks the whole boot.
  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.success(`API listening on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });

  server.on('error', (error) => {
    if (error?.code === 'EADDRINUSE') {
      logger.error(`Port ${env.PORT} is already in use — is another instance running?`);
      process.exit(1);
    }
    logger.error('HTTP server error', error?.message ?? error);
  });

  // Connect in the background with exponential backoff; never throws.
  connectWithRetry().then((ok) => {
    if (!ok) logger.warn('Started without a database connection — degraded mode (503 on data routes)');
  });

  let shuttingDown = false;
  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.warn(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      try {
        await disconnectDB();
      } catch (error) {
        logger.error('Error during DB disconnect', error?.message ?? error);
      }
      process.exit(0);
    });
    // Do not let a hung connection hold the process open forever.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  ['SIGINT', 'SIGTERM'].forEach((signal) => process.on(signal, () => shutdown(signal)));

  // A stray rejected promise gets logged and investigated — but it must NOT
  // take the whole API down. asyncHandler already routes route-level rejections
  // to the error middleware; this is the safety net for everything else.
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection (server kept alive)', reason?.stack ?? reason);
  });

  // An uncaught exception leaves the process in an undefined state: log it, let
  // in-flight responses flush, then exit so the process manager restarts a
  // clean instance.
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception — restarting', error?.stack ?? error);
    server.close(() => process.exit(1));
    setTimeout(() => process.exit(1), 3_000).unref();
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});
