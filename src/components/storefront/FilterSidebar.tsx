"use client";

import { TAXONOMY } from "@/lib/taxonomy";

export interface Filters {
  category?: string;
  sub?: string;
  brand?: string;
  sort: string;
}

function navBtnClass(active: boolean) {
  return `flex items-center justify-between rounded-[3px] px-3 py-2.5 text-left text-sm transition-colors ${
    active ? "bg-navy-900 font-bold text-white" : "font-medium text-navy-900 hover:bg-bg-soft"
  }`;
}

export function FilterSidebar({
  filters,
  brands,
  onChange,
}: {
  filters: Filters;
  brands: string[];
  onChange: (next: Partial<Filters>) => void;
}) {
  return (
    <aside className="flex w-full flex-col gap-1.5 rounded-[4px] bg-white p-5 sm:sticky sm:top-20 sm:w-[260px] sm:max-w-[280px] sm:shrink-0 sm:self-start">
      <div className="mb-2 text-xs font-bold tracking-[0.08em] text-muted">CATEGORIES</div>
      <button onClick={() => onChange({ category: undefined, sub: undefined })} className={navBtnClass(!filters.category)}>
        All Products
      </button>
      {TAXONOMY.map((c) => (
        <button key={c.name} onClick={() => onChange({ category: c.name, sub: undefined })} className={navBtnClass(filters.category === c.name)}>
          {c.name}
        </button>
      ))}

      {brands.length > 0 && (
        <>
          <div className="mb-2 mt-4 border-t border-border pt-3.5 text-xs font-bold tracking-[0.08em] text-muted">BRANDS</div>
          <button onClick={() => onChange({ brand: undefined })} className={navBtnClass(!filters.brand)}>
            All Brands
          </button>
          {brands.map((b) => (
            <button key={b} onClick={() => onChange({ brand: filters.brand === b ? undefined : b })} className={navBtnClass(filters.brand === b)}>
              {b}
            </button>
          ))}
        </>
      )}
    </aside>
  );
}
