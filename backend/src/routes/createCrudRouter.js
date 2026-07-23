import { Router } from 'express';
import validate from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { idParam, paginationQuery } from '../validators/common.validators.js';

/**
 * Reads are public; writes require an authenticated admin. Mounting them on one
 * router keeps that boundary visible in a single place per resource.
 */
export function createCrudRouter({ controller, bodySchema, listQuery = paginationQuery }) {
  const router = Router();

  router.get('/', validate({ query: listQuery }), controller.list);
  router.get('/:id', validate({ params: idParam }), controller.getById);

  router.use(requireAuth, requireRole('admin', 'editor'));

  router.post('/', validate({ body: bodySchema }), controller.create);
  router.patch(
    '/:id',
    validate({ params: idParam, body: bodySchema.partial() }),
    controller.update,
  );
  router.delete('/:id', validate({ params: idParam }), controller.remove);

  return router;
}

export default createCrudRouter;
