"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { Product } from "@/lib/types";
import { productImageSrc } from "@/lib/product-image";
import { useCartStore } from "@/lib/cart-store";
import { DEFAULT_PLACEHOLDER_IMAGE } from "@/lib/taxonomy";

export function ProductCard({ product, lowStockLimit }: { product: Product; lowStockLimit: number }) {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const setQty = useCartStore((s) => s.setQty);
  const [imgSrc, setImgSrc] = useState(productImageSrc(product));
  const onImgError = useCallback(() => setImgSrc(DEFAULT_PLACEHOLDER_IMAGE), []);

  const inCart = items.find((i) => i.sku === product.sku);
  const qty = inCart?.qty ?? 0;
  const low = product.stock > 0 && product.stock <= lowStockLimit;
  const outOfStock = product.stock <= 0;

  return (
    <div className="overflow-hidden rounded-[4px] bg-white transition-all hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)" }}>
      <Link href={`/products/${product.sku}`} className="relative block aspect-square bg-bg-soft">
        <Image src={imgSrc} alt={product.name} fill sizes="(max-width: 640px) 50vw, 230px" className="object-contain p-4" onError={onImgError} />
        <div className="absolute left-2.5 top-2.5 rounded-[3px] bg-navy-900 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">{product.brand}</div>
        {!outOfStock && (
          <div
            className="absolute right-2.5 top-2.5 flex items-center gap-1.5 rounded-[3px] bg-white/92 px-2.5 py-1 text-[10px] font-bold"
            style={{ color: low ? "var(--color-orange-600)" : "var(--color-stock-in)" }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: low ? "var(--color-orange-600)" : "var(--color-stock-in)" }} />
            {low ? "LOW STOCK" : "IN STOCK"}
          </div>
        )}
      </Link>
      <div className="p-4">
        <div className="mb-1.5 truncate text-[10.5px] font-bold tracking-wide text-red-600">{product.subCategory}</div>
        <Link href={`/products/${product.sku}`} className="font-display mb-0.5 block truncate text-[14.5px] font-semibold text-navy-900 hover:underline">
          {product.name}
        </Link>
        <div className="mb-3 text-xs text-muted">
          SKU {product.sku} · {product.stock} {product.unit} available
        </div>
        <div className="mb-3 font-display text-[17px] font-bold text-navy-900">₹{product.price.toFixed(2)}</div>

        {outOfStock ? (
          <span className="block w-full rounded-[3px] bg-bg-soft py-2.5 text-center text-[13.5px] font-bold text-muted">Out of stock</span>
        ) : qty > 0 ? (
          <div className="flex items-center justify-between rounded-[3px] bg-bg-soft p-1.5">
            <button
              onClick={() => setQty(product.sku, qty - 1)}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-[3px] bg-white text-base font-bold text-navy-900 transition-colors hover:bg-border"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="text-sm font-bold text-navy-900">{qty} in bag</span>
            <button
              onClick={() => setQty(product.sku, qty + 1)}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-[3px] bg-white text-base font-bold text-navy-900 transition-colors hover:bg-border"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => addItem({ sku: product.sku, name: product.name, category: product.category, unitPrice: product.price, imageUrl: product.imageUrl })}
            className="w-full rounded-[3px] bg-navy-900 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-navy-700"
          >
            + Add to Enquiry
          </button>
        )}
      </div>
    </div>
  );
}
