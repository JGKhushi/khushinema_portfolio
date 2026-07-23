import { z } from 'zod';

export const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Must be a valid MongoDB ObjectId');

export const idParam = z.object({ id: objectId });

export const slugParam = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, 'Must be a lowercase slug'),
});

export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const booleanish = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');
