import type { Overview } from './types';
import { fallbackOverview } from '../data/fallback';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const body = (await res.json()) as ApiEnvelope<T> & { message?: string };
  if (!res.ok || body.success === false) {
    throw new Error(body?.message || `Request failed with ${res.status}`);
  }
  return body.data;
}

/**
 * Load the whole site in one request. Falls back to the bundled snapshot so
 * the page always renders — the live API is an enhancement, not a dependency.
 */
export async function fetchOverview(signal?: AbortSignal): Promise<{ data: Overview; live: boolean }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    signal?.addEventListener('abort', () => controller.abort());
    const data = await request<Overview>('/overview', { signal: controller.signal });
    clearTimeout(timeout);
    if (!data?.profile) throw new Error('Malformed overview payload');
    return { data, live: true };
  } catch {
    return { data: fallbackOverview, live: false };
  }
}

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  await request<unknown>('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
