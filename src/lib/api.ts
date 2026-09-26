import type { ApiResponse } from "./types";

// Backend API base URL — configured in next.config.ts
const API_BASE = process.env.BACKEND_API_URL || "http://localhost:3000/api/v1";

// ============================================================================
// Server-side fetch (used in Server Components / Route Handlers)
// Passes the access token from httpOnly cookies to the backend
// ============================================================================

export async function serverFetch<T>(
  path: string,
  accessToken: string | undefined,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({
    success: false,
    error: "Invalid JSON response",
  }));

  if (!res.ok) {
    return {
      success: false,
      error: data.error || data.message || `HTTP ${res.status}`,
      message: data.message,
    } as ApiResponse<T>;
  }

  return data as ApiResponse<T>;
}

// ============================================================================
// Client-side fetch (used in Client Components)
// Calls Next.js /api/* route handlers which proxy to the backend with
// the access token from httpOnly cookies
// ============================================================================

export async function clientFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  // Route handlers live at /api/bff/[...path]
  const url = `/api/bff${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({
    success: false,
    error: "Invalid JSON response",
  }));

  return data as ApiResponse<T>;
}

// Convenience wrappers
export const api = {
  get: <T>(path: string, accessToken?: string) =>
    accessToken
      ? serverFetch<T>(path, accessToken, { method: "GET" })
      : clientFetch<T>(path, { method: "GET" }),

  post: <T>(path: string, body?: unknown, accessToken?: string) =>
    accessToken
      ? serverFetch<T>(path, accessToken, {
          method: "POST",
          body: body ? JSON.stringify(body) : undefined,
        })
      : clientFetch<T>(path, {
          method: "POST",
          body: body ? JSON.stringify(body) : undefined,
        }),

  put: <T>(path: string, body?: unknown, accessToken?: string) =>
    accessToken
      ? serverFetch<T>(path, accessToken, {
          method: "PUT",
          body: body ? JSON.stringify(body) : undefined,
        })
      : clientFetch<T>(path, {
          method: "PUT",
          body: body ? JSON.stringify(body) : undefined,
        }),

  delete: <T>(path: string, accessToken?: string) =>
    accessToken
      ? serverFetch<T>(path, accessToken, { method: "DELETE" })
      : clientFetch<T>(path, { method: "DELETE" }),
};

export { API_BASE };
