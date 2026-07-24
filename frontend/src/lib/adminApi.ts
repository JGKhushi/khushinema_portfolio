// Authenticated API layer for the admin dashboard. Uses a Bearer token stored
// in localStorage (the backend also sets an httpOnly cookie, but a Bearer token
// keeps the SPA in control and works across any host).

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1';
const TOKEN_KEY = 'kn_admin_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export interface FieldIssue {
  field: string;
  message: string;
}

export interface ApiError extends Error {
  status?: number;
  /** Field-level validation issues returned by the API. */
  details?: FieldIssue[];
}

interface Envelope<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  /** Failure envelope: { success: false, error: { message, details } }. */
  error?: { message?: string; details?: FieldIssue[] };
}

async function call<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ data: T; meta?: Record<string, unknown> }> {
  const token = tokenStore.get();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
    credentials: 'include',
  });

  if (res.status === 204) return { data: undefined as T };

  const body = (await res.json().catch(() => ({}))) as Envelope<T>;
  if (!res.ok || body.success === false) {
    // The failure envelope nests everything under `error` — read the real
    // message and the field-level issues so the UI can show what to fix.
    const err: ApiError = new Error(body?.error?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.details = body?.error?.details;
    throw err;
  }
  return { data: body.data, meta: body.meta };
}

/* ------------------------------------------------------------------ auth -- */
export interface AdminUser {
  id: string;
  name?: string;
  email: string;
  role: string;
  lastLoginAt?: string;
}

export async function apiLogin(email: string, password: string): Promise<AdminUser> {
  const { data } = await call<{ token: string; user: AdminUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  tokenStore.set(data.token);
  return data.user;
}

export async function apiMe(): Promise<AdminUser> {
  const { data } = await call<AdminUser>('/auth/me');
  return data;
}

export async function apiLogout(): Promise<void> {
  try {
    await call('/auth/logout', { method: 'POST' });
  } finally {
    tokenStore.clear();
  }
}

/* -------------------------------------------------------------- messages -- */
export interface Message {
  id: string;
  name: string;
  email: string;
  company?: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface MessageMeta {
  total: number;
  unread: number;
  page: number;
  limit: number;
  pages: number;
}

export async function fetchMessages(status?: string): Promise<{ items: Message[]; meta: MessageMeta }> {
  const q = status && status !== 'all' ? `?status=${status}&limit=100` : '?limit=100';
  const { data, meta } = await call<Message[]>(`/contact/messages${q}`);
  return { items: data, meta: (meta as unknown as MessageMeta) ?? { total: data.length, unread: 0, page: 1, limit: 100, pages: 1 } };
}

export async function setMessageStatus(id: string, status: Message['status']): Promise<Message> {
  const { data } = await call<Message>(`/contact/messages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return data;
}

export async function deleteMessage(id: string): Promise<void> {
  await call(`/contact/messages/${id}`, { method: 'DELETE' });
}

/* --------------------------------------------------------------- content -- */
export type Collection =
  | 'projects'
  | 'experience'
  | 'skills'
  | 'education'
  | 'achievements';

export async function fetchCollection(name: Collection): Promise<Record<string, unknown>[]> {
  const { data } = await call<Record<string, unknown>[]>(`/${name}?limit=100`);
  return data;
}

export async function updateItem(
  name: Collection,
  id: string,
  patch: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data } = await call<Record<string, unknown>>(`/${name}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return data;
}

export async function createItem(
  name: Collection,
  body: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data } = await call<Record<string, unknown>>(`/${name}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return data;
}

export async function removeItem(name: Collection, id: string): Promise<void> {
  await call(`/${name}/${id}`, { method: 'DELETE' });
}

/* --------------------------------------------------------------- profile -- */
export async function fetchProfile(): Promise<Record<string, unknown>> {
  const { data } = await call<Record<string, unknown>>('/profile');
  return data;
}

export async function updateProfile(patch: Record<string, unknown>): Promise<Record<string, unknown>> {
  const { data } = await call<Record<string, unknown>>('/profile', {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return data;
}
