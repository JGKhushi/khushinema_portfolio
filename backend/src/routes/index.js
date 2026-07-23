import { Router } from 'express';
import mongoose from 'mongoose';

import createCrudRouter from './createCrudRouter.js';
import validate from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { contactLimiter, authLimiter } from '../middleware/rateLimiters.js';

import projectController from '../controllers/project.controller.js';
import {
  experienceController,
  skillController,
  educationController,
  achievementController,
} from '../controllers/content.controller.js';
import { getProfile, updateProfile, getOverview } from '../controllers/profile.controller.js';
import {
  submitMessage,
  listMessages,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/contact.controller.js';
import { login, logout, me } from '../controllers/auth.controller.js';

import {
  projectBody,
  projectListQuery,
  experienceBody,
  skillGroupBody,
  educationBody,
  achievementBody,
  profileBody,
} from '../validators/content.validators.js';
import {
  contactBody,
  messageListQuery,
  messageStatusBody,
  loginBody,
} from '../validators/contact.validators.js';
import { idParam, slugParam } from '../validators/common.validators.js';

const router = Router();

/* ---------------------------------------------------------------- health -- */
router.get('/health', (_req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    success: true,
    data: {
      status: 'ok',
      uptime: Math.round(process.uptime()),
      database: states[mongoose.connection.readyState] ?? 'unknown',
      timestamp: new Date().toISOString(),
    },
  });
});

/* ------------------------------------------------------------------ auth -- */
const authRouter = Router();
authRouter.post('/login', authLimiter, validate({ body: loginBody }), login);
authRouter.post('/logout', logout);
authRouter.get('/me', requireAuth, me);
router.use('/auth', authRouter);

/* --------------------------------------------------------------- profile -- */
router.get('/profile', getProfile);
router.patch(
  '/profile',
  requireAuth,
  requireRole('admin'),
  validate({ body: profileBody.partial() }),
  updateProfile,
);

/** Single hydration endpoint for the public site. */
router.get('/overview', getOverview);

/* -------------------------------------------------------------- projects -- */
const projectRouter = createCrudRouter({
  controller: projectController,
  bodySchema: projectBody,
  listQuery: projectListQuery,
});
// Registered before the generic router so `/filters` is not read as an `:id`.
router.get('/projects/filters', projectController.getFilters);
router.get('/projects/slug/:slug', validate({ params: slugParam }), projectController.getBySlug);
router.use('/projects', projectRouter);

/* ------------------------------------------------------ other collections -- */
router.use(
  '/experience',
  createCrudRouter({ controller: experienceController, bodySchema: experienceBody }),
);
router.use('/skills', createCrudRouter({ controller: skillController, bodySchema: skillGroupBody }));
router.use(
  '/education',
  createCrudRouter({ controller: educationController, bodySchema: educationBody }),
);
router.use(
  '/achievements',
  createCrudRouter({ controller: achievementController, bodySchema: achievementBody }),
);

/* --------------------------------------------------------------- contact -- */
const contactRouter = Router();
contactRouter.post('/', contactLimiter, validate({ body: contactBody }), submitMessage);
contactRouter.get(
  '/messages',
  requireAuth,
  requireRole('admin'),
  validate({ query: messageListQuery }),
  listMessages,
);
contactRouter.patch(
  '/messages/:id',
  requireAuth,
  requireRole('admin'),
  validate({ params: idParam, body: messageStatusBody }),
  updateMessageStatus,
);
contactRouter.delete(
  '/messages/:id',
  requireAuth,
  requireRole('admin'),
  validate({ params: idParam }),
  deleteMessage,
);
router.use('/contact', contactRouter);

export default router;
