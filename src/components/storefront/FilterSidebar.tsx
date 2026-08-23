"use client";

import { TAXONOMY, subCategoriesFor } from "@/lib/taxonomy";

export interface Filters {
  category?: string;
  sub?: string;
  brand?: string;
  sort: string;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
  { value: "price", label: "Price (low to high)" },
  { value: "price_desc", label: "Price (high to low)" },
  { value: "stock_desc", label: "Stock (high to low)" },
];

export function FilterSidebar({
  filters,
  brands,
  onChange,
}: {
  filters: Filters;
  brands: string[];
  onChange: (next: Partial<Filters>) => void;
}) {
  const subOptions = filters.category ? subCategoriesFor(filters.category) : [];

  return (
    <aside className="flex w-full flex-col gap-6 sm:w-64 sm:shrink-0">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-navy-900">Category</h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onChange({ category: undefined, sub: undefined })}
            className={`rounded-lg px-2 py-1.5 text-left text-sm ${!filters.category ? "bg-cream-200 font-semibold text-navy-900" : "text-muted hover:bg-bg-soft"}`}
          >
            All Categories
          </button>
          {TAXONOMY.map((c) => (
            <button
              key={c.name}
              onClick={() => onChange({ category: c.name, sub: undefined })}
              className={`rounded-lg px-2 py-1.5 text-left text-sm ${filters.category === c.name ? "bg-cream-200 font-semibold text-navy-900" : "text-muted hover:bg-bg-soft"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {subOptions.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-navy-900">Sub-category</h3>
          <div className="flex flex-col gap-1">
            {subOptions.map((sub) => (
              <button
                key={sub}
                onClick={() => onChange({ sub: filters.sub === sub ? undefined : sub })}
                className={`rounded-lg px-2 py-1.5 text-left text-sm ${filters.sub === sub ? "bg-cream-200 font-semibold text-navy-900" : "text-muted hover:bg-bg-soft"}`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {brands.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-navy-900">Brand</h3>
          <div className="flex flex-col gap-1">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => onChange({ brand: filters.brand === b ? undefined : b })}
                className={`rounded-lg px-2 py-1.5 text-left text-sm ${filters.brand === b ? "bg-cream-200 font-semibold text-navy-900" : "text-muted hover:bg-bg-soft"}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-sm font-semibold text-navy-900">Sort by</h3>
        <select
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value })}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
