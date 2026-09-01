"use client";

import Link from "next/link";
import { TAXONOMY } from "@/lib/taxonomy";

export function MegaMenu({ onNavigate, onClose }: { onNavigate: () => void; onClose: () => void }) {
  return (
    <>
      {/* Backdrop for click-outside */}
      <button aria-label="Close menu" className="fixed inset-0 z-30 cursor-default" onClick={onClose} />
      <div className="absolute left-0 top-full z-40 mt-0 grid w-[680px] grid-cols-2 gap-0 border border-border bg-surface shadow-card-hover">
        {TAXONOMY.map((category) => (
          <div key={category.name} className="border-b border-r border-border p-4 last:border-r-0 [&:nth-last-child(-n+2)]:border-b-0">
            <Link
              href={`/products?category=${encodeURIComponent(category.name)}`}
              onClick={onNavigate}
              className="mb-2 block text-sm font-bold text-heading hover:text-navy-700"
            >
              {category.name}
            </Link>
            <ul className="flex flex-col gap-1">
              {category.subCategories.map((sub) => (
                <li key={sub}>
                  <Link
                    href={`/products?category=${encodeURIComponent(category.name)}&sub=${encodeURIComponent(sub)}`}
                    onClick={onNavigate}
                    className="text-xs text-muted hover:text-heading hover:underline"
                  >
                    {sub}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
