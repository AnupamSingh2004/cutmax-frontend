const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_MARKER_HEADER = "x-requested-with";
const CSRF_MARKER_VALUE = "cutmax";

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// The backend's CSRF cookie lives on the backend's origin (NEXT_PUBLIC_API_URL), which is
// cross-origin from this app — document.cookie here can never read it. So instead of reading
// the cookie back, we cache the token value the backend handed us in the JSON response body.
// The browser still auto-attaches the matching cookie to requests against the backend
// (credentials: "include"), so echoing this cached value as a header reproduces the
// double-submit check correctly even across origins.
let cachedCsrfToken: string | null = null;

async function ensureCsrfToken(): Promise<string | null> {
  if (cachedCsrfToken) return cachedCsrfToken;
  const res = await fetch(`${API_BASE}/api/public/csrf`, { credentials: "include" });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  cachedCsrfToken = data?.csrfToken ?? null;
  return cachedCsrfToken;
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/** Browser-side fetch wrapper: same-credentials, JSON body, CSRF header injection for mutations. */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  let body: BodyInit | undefined;
  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.body);
  }

  if (MUTATING.has(method)) {
    headers.set(CSRF_MARKER_HEADER, CSRF_MARKER_VALUE);
    const csrfToken = await ensureCsrfToken();
    if (csrfToken) headers.set(CSRF_HEADER_NAME, csrfToken);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    method,
    headers,
    body,
    credentials: "include",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError(data?.error ?? res.statusText, res.status, data?.details);
  }

  return data as T;
}

export function uploadsUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

export { API_BASE };
