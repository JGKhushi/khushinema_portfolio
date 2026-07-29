import type { Overview } from './types';
import { fallbackOverview } from '../data/fallback';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  /** Failure envelope: { success: false, error: { message, details } }. */
  error?: { message?: string; details?: { field: string; message: string }[] };
}

/** Error carrying the HTTP status, or `offline` when the request never landed. */
export interface RequestError extends Error {
  status?: number;
  /** True only when the network call itself failed (server unreachable). */
  offline?: boolean;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
  } catch {
    // fetch only rejects when the request never reached a server.
    const err: RequestError = new Error('Could not reach the server');
    err.offline = true;
    throw err;
  }

  const body = (await res.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (!res.ok || body.success === false) {
    // Prefer the first field-level issue — it says exactly what to fix.
    const detail = body?.error?.details?.[0];
    const err: RequestError = new Error(
      detail
        ? `${detail.field}: ${detail.message}`
        : body?.error?.message || `Request failed with ${res.status}`,
    );
    err.status = res.status;
    throw err;
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
    // `no-store` so a just-published edit is never masked by a cached copy.
    const data = await request<Overview>('/overview', {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);
    if (!data?.profile) throw new Error('Malformed overview payload');
    return { data, live: true };
  } catch (error) {
    // The bundled snapshot is a last resort for when the API is unreachable.
    // It is frozen at build time, so it can show content that has since been
    // deleted — say so loudly rather than letting it look like live data.
    if (import.meta.env.DEV) {
      console.warn(
        '[portfolio] Live API unavailable — rendering the bundled snapshot from ' +
          'src/data/fallback.ts. Content edited in /admin will NOT appear until the ' +
          'API is reachable again.',
        error,
      );
    }
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
