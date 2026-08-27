import type { MetadataRoute } from "next";
import { API_BASE } from "@/lib/api-client";
import type { Product } from "@/lib/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

async function getAllProductSkus(): Promise<string[]> {
  try {
    // Public catalogue is small enough (a few hundred SKUs) to fit the API's max
    // per_page in one call; if the catalogue grows past 200 this should paginate.
    const res = await fetch(`${API_BASE}/api/public/products?per_page=200`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products as Product[]).map((p) => p.sku);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const skus = await getAllProductSkus();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const productRoutes: MetadataRoute.Sitemap = skus.map((sku) => ({
    url: `${siteUrl}/products/${encodeURIComponent(sku)}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
