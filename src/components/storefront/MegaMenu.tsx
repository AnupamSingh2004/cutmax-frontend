"use client";

import Link from "next/link";
import { TAXONOMY } from "@/lib/taxonomy";

export function MegaMenu({ onNavigate, onClose }: { onNavigate: () => void; onClose: () => void }) {
  return (
    <>
      <button aria-label="Close menu" className="fixed inset-0 z-30 cursor-default" onClick={onClose} />
      <div className="absolute left-0 top-full z-40 mt-2 grid w-[640px] grid-cols-2 gap-4 rounded-card-lg border border-border bg-white p-6 shadow-card-hover">
        {TAXONOMY.map((category) => (
          <div key={category.name}>
            <Link
              href={`/products?category=${encodeURIComponent(category.name)}`}
              onClick={onNavigate}
              className="mb-2 block text-sm font-bold text-navy-900 hover:underline"
            >
              {category.name}
            </Link>
            <ul className="flex flex-col gap-1">
              {category.subCategories.map((sub) => (
                <li key={sub}>
                  <Link
                    href={`/products?category=${encodeURIComponent(category.name)}&sub=${encodeURIComponent(sub)}`}
                    onClick={onNavigate}
                    className="text-sm text-muted hover:text-navy-900 hover:underline"
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
