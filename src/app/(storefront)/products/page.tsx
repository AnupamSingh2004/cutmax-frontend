"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import type { Product, PublicSettings } from "@/lib/types";
import { ProductCard } from "@/components/storefront/ProductCard";
import { FilterSidebar, type Filters } from "@/components/storefront/FilterSidebar";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { PageHeading } from "@/components/ui/PageHeading";

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  per_page: number;
  brands: string[];
  settings: PublicSettings;
}

const PER_PAGE = 24;

function ProductsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: Filters = {
    category: searchParams.get("category") ?? undefined,
    sub: searchParams.get("sub") ?? undefined,
    brand: searchParams.get("brand") ?? undefined,
    sort: searchParams.get("sort") ?? "newest",
  };
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), per_page: String(PER_PAGE), sort: filters.sort });
    if (filters.category) params.set("category", filters.category);
    if (filters.sub) params.set("sub", filters.sub);
    if (filters.brand) params.set("brand", filters.brand);
    if (q) params.set("q", q);

    apiFetch<ProductsResponse>(`/api/public/products?${params.toString()}`)
      .then((res) => {
        if (res && typeof res === "object") {
          setData({
            products: Array.isArray(res.products) ? res.products : [],
            total: res.total ?? 0,
            page: res.page ?? 1,
            per_page: res.per_page ?? PER_PAGE,
            brands: Array.isArray(res.brands) ? res.brands : [],
            settings: res.settings ?? { whatsapp: "", gst_percent: 18, low_stock: 10 },
          });
        }
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [filters.category, filters.sub, filters.brand, filters.sort, q, page]);

  function updateFilters(next: Partial<Filters>) {
    const params = new URLSearchParams(searchParams.toString());
    const merged = { ...filters, ...next };
    for (const key of ["category", "sub", "brand", "sort"] as const) {
      if (merged[key]) params.set(key, merged[key]!);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`/products?${params.toString()}`);
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.per_page)) : 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <PageHeading
        level="h1"
        eyebrow="Catalogue"
        title={q ? `Search results for "${q}"` : "All Products"}
        className="mb-6"
      />
      <div className="flex flex-col gap-8 sm:flex-row">
        <FilterSidebar filters={filters} brands={data?.brands ?? []} onChange={updateFilters} />

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : !data || !data.products || data.products.length === 0 ? (
            <p className="text-muted">No products found. Try adjusting your filters.</p>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted">{data.total} products found</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {data.products.map((p) => (
                  <ProductCard key={p.id} product={p} lowStockLimit={data.settings.low_stock} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageInner />
    </Suspense>
  );
}
