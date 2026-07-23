import { z } from 'zod';
import { paginationQuery } from './common.validators.js';

export const contactBody = z.object({
  name: z.string().trim().min(2, 'Please tell me your name').max(120),
  email: z.string().trim().email('That email address looks off'),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  subject: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'A little more detail, please').max(5000),
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional().or(z.literal('')),
});

export const messageListQuery = paginationQuery.extend({
  status: z.enum(['new', 'read', 'replied', 'archived']).optional(),
});

export const messageStatusBody = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']),
});

export const loginBody = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});
