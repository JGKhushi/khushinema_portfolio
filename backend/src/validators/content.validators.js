import { z } from 'zod';
import { paginationQuery, booleanish } from './common.validators.js';

const url = z.string().url().or(z.literal('')).optional();

export const projectListQuery = paginationQuery.extend({
  category: z.enum(['full-stack', 'backend', 'frontend', 'ai', 'data', 'automation']).optional(),
  stack: z.union([z.string(), z.array(z.string())]).optional(),
  featured: booleanish.optional(),
  q: z.string().max(120).optional(),
});

export const projectBody = z.object({
  title: z.string().min(2).max(120),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  tagline: z.string().min(2).max(200),
  description: z.string().min(10),
  problem: z.string().optional(),
  solution: z.string().optional(),
  role: z.string().optional(),
  category: z.enum(['full-stack', 'backend', 'frontend', 'ai', 'data', 'automation']).optional(),
  stack: z.array(z.string()).default([]),
  highlights: z
    .array(z.object({ text: z.string().min(2), metric: z.string().optional() }))
    .default([]),
  coverImage: url,
  accent: z.string().optional(),
  links: z.object({ github: url, live: url, caseStudy: url }).partial().optional(),
  year: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['shipped', 'in-progress', 'archived']).optional(),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

export const experienceBody = z.object({
  role: z.string().min(2),
  company: z.string().min(1),
  companyUrl: url,
  location: z.string().optional(),
  type: z.enum(['internship', 'full-time', 'freelance', 'contract']).optional(),
  startDate: z.string().min(3),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  summary: z.string().optional(),
  workstreams: z
    .array(z.object({ name: z.string(), url: url, summary: z.string() }))
    .default([]),
  achievements: z.array(z.string()).default([]),
  stack: z.array(z.string()).default([]),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

export const skillGroupBody = z.object({
  category: z.string().min(2),
  icon: z.string().optional(),
  accent: z.string().optional(),
  description: z.string().optional(),
  skills: z
    .array(
      z.object({
        name: z.string().min(1),
        level: z.number().min(0).max(100).optional(),
        note: z.string().optional(),
      }),
    )
    .default([]),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

export const educationBody = z.object({
  degree: z.string().min(2),
  institution: z.string().min(2),
  location: z.string().optional(),
  score: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  coursework: z.array(z.string()).default([]),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

export const achievementBody = z.object({
  title: z.string().min(2),
  detail: z.string().min(2),
  metric: z.string().optional(),
  type: z.enum(['hackathon', 'leadership', 'coding', 'award']).optional(),
  period: z.string().optional(),
  url: url,
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

export const profileBody = z.object({
  name: z.string().min(2),
  headline: z.string().min(2),
  roles: z.array(z.string()).default([]),
  location: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  summary: z.string().min(10),
  about: z.array(z.string()).default([]),
  availability: z
    .object({
      status: z.enum(['open', 'selective', 'closed']).optional(),
      message: z.string().optional(),
    })
    .optional(),
  resumeUrl: url,
  socials: z
    .array(
      z.object({
        label: z.string(),
        handle: z.string().optional(),
        url: z.string().url(),
        icon: z.string().optional(),
        order: z.number().int().optional(),
      }),
    )
    .default([]),
  stats: z
    .array(
      z.object({ label: z.string(), value: z.string(), caption: z.string().optional() }),
    )
    .default([]),
  currentFocus: z.array(z.string()).default([]),
});

/** PATCH semantics: every field optional, but still type-checked. */
export const partial = (schema) => schema.partial();
