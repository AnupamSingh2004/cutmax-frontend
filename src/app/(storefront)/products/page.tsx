"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import type { Product, PublicSettings } from "@/lib/types";
import { ProductCard } from "@/components/storefront/ProductCard";
import { FilterSidebar, type Filters } from "@/components/storefront/FilterSidebar";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  per_page: number;
  brands: string[];
  materials: string[];
  settings: PublicSettings;
}

const PER_PAGE = 24;
const WHATSAPP_NUMBER = "918856828894";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name: A–Z" },
  { value: "name_desc", label: "Name: Z–A" },
  { value: "price", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "stock_desc", label: "Stock: High to Low" },
];

function ProductsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: Filters = {
    category: searchParams.get("category") ?? undefined,
    sub: searchParams.get("sub") ?? undefined,
    brand: searchParams.get("brand") ?? undefined,
    material: searchParams.get("material") ?? undefined,
    sort: searchParams.get("sort") ?? "newest",
  };
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const [inStockOnly, setInStockOnly] = useState(false);

  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), per_page: String(PER_PAGE), sort: filters.sort });
    if (filters.category) params.set("category", filters.category);
    if (filters.sub) params.set("sub", filters.sub);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.material) params.set("material", filters.material);
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
            materials: Array.isArray(res.materials) ? res.materials : [],
            settings: res.settings ?? { whatsapp: "", gst_percent: 18, low_stock: 10 },
          });
        }
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [filters.category, filters.sub, filters.brand, filters.material, filters.sort, q, page]);

  function updateFilters(next: Partial<Filters>) {
    const params = new URLSearchParams(searchParams.toString());
    const merged = { ...filters, ...next };
    for (const key of ["category", "sub", "brand", "material", "sort"] as const) {
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
  const visibleProducts = inStockOnly ? (data?.products ?? []).filter((p) => p.stock > 0) : data?.products ?? [];

  return (
    <div>
      <div className="bg-navy-900 px-4 py-9 sm:px-12">
        <div className="mb-2.5 flex items-center gap-2.5">
          <span className="h-[2px] w-6 bg-red-600" />
          <span className="text-[12.5px] font-bold tracking-[0.14em] text-orange-500">PRODUCT CATALOGUE</span>
        </div>
        <h1 className="font-display text-[1.65rem] font-extrabold text-white sm:text-[2.125rem]">
          {q ? `Results for "${q}"` : data ? `${data.total} SKUs, organized for procurement.` : "Loading catalogue…"}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
        <FilterSidebar filters={filters} onChange={updateFilters} />

        <main className="min-w-0 px-4 py-9 sm:px-8 lg:px-12">
          <div className="sticky top-[110px] z-10 mb-5 flex flex-wrap items-center gap-4 rounded-[4px] bg-surface p-4" style={{ boxShadow: "0 2px 8px rgba(18,32,63,0.06)" }}>
            <div className="whitespace-nowrap text-[14.5px] font-semibold text-heading">
              {data ? `${visibleProducts.length} of ${data.total} results` : "Loading…"}
            </div>
            <button
              onClick={() => setInStockOnly((v) => !v)}
              className="whitespace-nowrap rounded-[3px] border px-3.5 py-2.5 text-[13.5px] font-semibold transition-colors"
              style={inStockOnly ? { background: "var(--color-navy-900)", color: "#fff", borderColor: "var(--color-navy-900)" } : { background: "var(--color-surface)", color: "var(--color-heading)", borderColor: "var(--color-border)" }}
            >
              In stock only
            </button>

            {(data?.brands.length ?? 0) > 0 && (
              <select
                value={filters.brand ?? ""}
                onChange={(e) => updateFilters({ brand: e.target.value || undefined })}
                className="rounded-[3px] border border-border bg-surface px-3 py-2.5 text-[13.5px] font-semibold text-heading"
              >
                <option value="">All Brands</option>
                {data!.brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            )}

            {(data?.materials.length ?? 0) > 0 && (
              <select
                value={filters.material ?? ""}
                onChange={(e) => updateFilters({ material: e.target.value || undefined })}
                className="rounded-[3px] border border-border bg-surface px-3 py-2.5 text-[13.5px] font-semibold text-heading"
              >
                <option value="">All Materials</option>
                {data!.materials.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            )}

            <div className="ml-auto flex items-center gap-2.5">
              <label className="whitespace-nowrap text-[13.5px] text-muted-soft">Sort by:</label>
              <select
                value={filters.sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="rounded-[3px] border border-border bg-surface px-3 py-2.5 text-[13.5px] font-semibold text-heading"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="rounded-[4px] bg-surface px-10 py-14 text-center">
              <div className="font-display mb-2.5 text-[19px] font-bold text-heading">No matches found</div>
              <p className="mx-auto mb-6 max-w-md text-[14.5px] leading-relaxed text-muted-soft">
                Try a different search term or filter, or send us your specification directly.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-[3px] bg-red-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
              >
                Enquire on WhatsApp
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} lowStockLimit={data!.settings.low_stock} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
            </>
          )}
        </main>
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
