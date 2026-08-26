"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import type { Product, PriceTier } from "@/lib/types";
import { productImageSrc } from "@/lib/product-image";
import { Button } from "@/components/ui/Button";
import { stockBadge } from "@/components/ui/Badge";
import { PriceTierTable } from "@/components/storefront/PriceTierTable";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useCartStore } from "@/lib/cart-store";
import { DEFAULT_PLACEHOLDER_IMAGE } from "@/lib/taxonomy";

export function ProductDetailView({ product, tiers, related }: { product: Product; tiers: PriceTier[]; related: Product[] }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const [imgSrc, setImgSrc] = useState(productImageSrc(product));
  const onImgError = useCallback(() => { setImgSrc(DEFAULT_PLACEHOLDER_IMAGE); }, []);
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in ${product.name} (SKU: ${product.sku}). Please share CAD/STEP files and pricing.`);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-card-sm border border-border bg-white">
          <Image src={imgSrc} alt={product.name} fill sizes="500px" className="object-contain p-10" priority onError={onImgError} />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-muted">
            <span className="rounded-full bg-cream-200 px-2 py-0.5 font-semibold text-navy-800">{product.brand}</span>
            {stockBadge(product.stock, 10)}
          </div>
          <h1 className="text-2xl font-bold text-navy-900">{product.name}</h1>
          <p className="mt-1 text-sm text-muted">
            SKU: {product.sku} · {product.category} / {product.subCategory}
          </p>
          <p className="mt-4 text-3xl font-bold text-navy-900">₹{product.price.toFixed(2)}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-20 rounded-lg border border-border px-3 py-2 text-sm"
            />
            <Button
              disabled={product.stock <= 0}
              onClick={() =>
                addItem(
                  { sku: product.sku, name: product.name, category: product.category, unitPrice: product.price, imageUrl: product.imageUrl },
                  qty,
                )
              }
            >
              Add to Bag
            </Button>
            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-navy-900 hover:bg-bg-soft"
            >
              Request CAD/STEP
            </a>
          </div>

          {tiers.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-2 text-sm font-semibold text-navy-900">Volume Pricing</h2>
              <PriceTierTable tiers={tiers} basePrice={product.price} />
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-navy-900">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} lowStockLimit={10} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
