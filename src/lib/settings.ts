import { API_BASE } from "@/lib/api-client";
import type { PublicSettings } from "@/lib/types";

const EMPTY_SETTINGS: PublicSettings = { whatsapp: "", gst_percent: 18, low_stock: 10 };

// Cheapest call that returns the public settings object — there's no
// dedicated settings endpoint yet, so this piggybacks on the products list
// with per_page=1. Next.js dedupes identical fetch() calls within a render
// pass, so pages that also fetch the full product list (e.g. the homepage)
// don't pay for this twice.
export async function getPublicSettings(): Promise<PublicSettings> {
  try {
    const res = await fetch(`${API_BASE}/api/public/products?per_page=1`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return EMPTY_SETTINGS;
    const data = await res.json();
    return data.settings ?? EMPTY_SETTINGS;
  } catch {
    return EMPTY_SETTINGS;
  }
}
