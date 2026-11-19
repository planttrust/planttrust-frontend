/**
 * The one way the frontend talks to the backend. For browser code (client components and event
 * handlers): requests go to /api/... on the frontend's own address, and the Next.js proxy in
 * next.config.ts forwards them to Express. The browser attaches the httpOnly login cookie itself.
 */

/** The backend's standard error format (see planttrust-backend src/shared/errors.ts). */
interface ApiErrorBody {
  error?: { code?: string; message?: string; details?: unknown };
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, signal }: RequestOptions = {},
): Promise<T> {
  const isForm = body instanceof FormData;
  const headers: Record<string, string> = {};
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';

  let res: Response;
  try {
    res = await fetch(path, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      credentials: 'same-origin',
      signal,
    });
  } catch (err) {
    throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the server. Is the backend running?', err);
  }

  const data: unknown = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const e = (data as ApiErrorBody | null)?.error;
    throw new ApiError(
      res.status,
      e?.code ?? 'HTTP_ERROR',
      e?.message ?? `Request failed (${res.status})`,
      e?.details,
    );
  }
  return data as T;
}

/**
 * Uses mock data while a backend route doesn't exist yet (404), or everywhere when
 * NEXT_PUBLIC_USE_MOCKS=true. Real errors (401, 500, server down) are never hidden.
 */
export async function withMockFallback<T>(call: () => Promise<T>, mock: T): Promise<T> {
  if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') return mock;
  try {
    return await call();
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      console.warn('Using mock data: backend route not found yet.');
      return mock;
    }
    throw err;
  }
}
