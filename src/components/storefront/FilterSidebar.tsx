"use client";

import { TAXONOMY } from "@/lib/taxonomy";

export interface Filters {
  category?: string;
  sub?: string;
  brand?: string;
  material?: string;
  sort: string;
}

function navBtnClass(active: boolean) {
  return `flex items-center justify-between rounded-[4px] px-4 py-3 text-left text-[15px] transition-colors ${
    active ? "bg-navy-900 font-bold text-white" : "font-medium text-heading hover:bg-bg-soft"
  }`;
}

export function FilterSidebar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
}) {
  return (
    <aside className="w-full border-border bg-surface sm:border-r">
      <div className="flex flex-col gap-2 p-6 sm:sticky sm:top-[110px] sm:max-h-[calc(100vh-110px)] sm:overflow-y-auto">
        <div className="mb-3 text-sm font-bold tracking-[0.08em] text-muted">CATEGORIES</div>
        <button onClick={() => onChange({ category: undefined, sub: undefined })} className={navBtnClass(!filters.category)}>
          All Products
        </button>
        {TAXONOMY.map((c) => (
          <button key={c.name} onClick={() => onChange({ category: c.name, sub: undefined })} className={navBtnClass(filters.category === c.name)}>
            {c.name}
          </button>
        ))}
      </div>
    </aside>
  );
}
