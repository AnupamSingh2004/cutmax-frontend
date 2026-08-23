import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

/** Server Component fetch helper — forwards the incoming request's cookies to the backend so auth-gated GETs work during SSR. */
export async function serverApiFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...init?.headers, Accept: "application/json", Cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json() as Promise<T>;
}
