"use client";

import Image from "next/image";
import { useState, useCallback, useMemo, useEffect } from "react";
import type { Product, PriceBreak } from "@/lib/types";
import { productImageSrc } from "@/lib/product-image";
import { Button } from "@/components/ui/Button";
import { stockBadge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useCartStore } from "@/lib/cart-store";
import { useSettings } from "@/lib/settings-context";
import { DEFAULT_PLACEHOLDER_IMAGE } from "@/lib/taxonomy";

const DEFAULT_WHATSAPP_NUMBER = "918856828894";

export function ProductDetailView({ product, priceBreaks, related }: { product: Product; priceBreaks: PriceBreak[]; related: Product[] }) {
  const settings = useSettings();
  const WHATSAPP_NUMBER = settings.whatsapp || DEFAULT_WHATSAPP_NUMBER;
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const [imgSrc, setImgSrc] = useState(productImageSrc(product));
  const onImgError = useCallback(() => { setImgSrc(DEFAULT_PLACEHOLDER_IMAGE); }, []);
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in ${product.name} (SKU: ${product.sku}). Please share CAD/STEP files and pricing.`);

  // Navigating here from a scrolled-down position on the products list (or
  // another product page) otherwise lands mid-page instead of at the top --
  // the loading.tsx fallback is short enough that the browser doesn't treat
  // this as a fresh page for scroll-restoration purposes.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.sku]);

  const sortedBreaks = useMemo(() => [...priceBreaks].sort((a, b) => a.minQty - b.minQty), [priceBreaks]);
  const unitPrice = useMemo(() => {
    let price = product.price;
    for (const b of sortedBreaks) {
      if (qty >= b.minQty) price = b.unitPrice;
    }
    return price;
  }, [sortedBreaks, qty, product.price]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-card-sm border border-border bg-surface">
          <Image src={imgSrc} alt={product.name} fill sizes="500px" className="object-contain p-10" priority onError={onImgError} />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-muted">
            <span className="rounded-full bg-navy-900 px-2 py-0.5 font-semibold text-white">{product.brand}</span>
            {stockBadge(product.stock, product.lowStockThreshold ?? settings.low_stock)}
          </div>
          <h1 className="text-2xl font-bold text-heading">{product.name}</h1>
          <p className="mt-1 text-sm text-muted">
            SKU: {product.sku} · {product.category} / {product.subCategory}
          </p>
          <p className="mt-4 text-3xl font-bold text-heading">
            ₹{unitPrice.toFixed(2)}
            {unitPrice !== product.price && <span className="ml-2 text-base font-normal text-muted line-through">₹{product.price.toFixed(2)}</span>}
          </p>
          {product.description && (
            <div className="mt-5">
              <h2 className="mb-1.5 text-sm font-semibold text-heading">Description</h2>
              <p className="text-sm leading-relaxed text-muted">{product.description}</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.min(product.stock, Math.max(1, Number(e.target.value) || 1)))}
              className="w-20 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading"
            />
            <Button
              disabled={product.stock <= 0}
              onClick={() =>
                addItem(
                  { sku: product.sku, name: product.name, category: product.category, unitPrice, imageUrl: product.imageUrl },
                  qty,
                )
              }
            >
              Add to Bag
            </Button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-heading hover:bg-bg-soft"
            >
              Request CAD/STEP
            </a>
          </div>

          {sortedBreaks.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-2 text-sm font-semibold text-heading">Volume Pricing</h2>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-bg-soft text-left text-xs uppercase tracking-wide text-muted">
                    <tr>
                      <th className="px-4 py-2">Quantity</th>
                      <th className="px-4 py-2">Price / unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className={qty < sortedBreaks[0]!.minQty ? "bg-red-600/10" : ""}>
                      <td className="px-4 py-2">1 – {sortedBreaks[0]!.minQty - 1}</td>
                      <td className="px-4 py-2 font-semibold text-heading">₹{product.price.toFixed(2)}</td>
                    </tr>
                    {sortedBreaks.map((b, i) => {
                      const next = sortedBreaks[i + 1];
                      const active = qty >= b.minQty && (!next || qty < next.minQty);
                      return (
                        <tr key={b.id} className={active ? "bg-red-600/10" : ""}>
                          <td className="px-4 py-2">{b.minQty}{next ? ` – ${next.minQty - 1}` : "+"}</td>
                          <td className="px-4 py-2 font-semibold text-heading">₹{b.unitPrice.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-heading">Specifications</h2>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  {[
                    { label: "Part Number / SKU", value: product.sku },
                    { label: "Category", value: product.category },
                    { label: "Sub-Category", value: product.subCategory },
                    { label: "Brand", value: product.brand },
                    ...(product.material ? [{ label: "Material", value: product.material }] : []),
                    { label: "Unit", value: product.unit },
                    { label: "Stock", value: `${product.stock} ${product.unit}` },
                    ...(product.specifications ?? []),
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="w-1/3 bg-bg-soft px-4 py-2.5 font-semibold text-heading">{row.label}</td>
                      <td className="px-4 py-2.5 text-muted-soft">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-heading">Related Products</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} lowStockLimit={settings.low_stock} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
