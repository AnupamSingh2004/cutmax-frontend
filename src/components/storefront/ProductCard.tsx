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
  const [qtyInput, setQtyInput] = useState("1");
  const onImgError = useCallback(() => setImgSrc(DEFAULT_PLACEHOLDER_IMAGE), []);

  const inCart = items.find((i) => i.sku === product.sku);
  const qty = inCart?.qty ?? 0;
  const low = product.stock > 0 && product.stock <= lowStockLimit;
  const outOfStock = product.stock <= 0;

  function clamp(n: number) {
    return Math.min(product.stock, Math.max(1, n));
  }

  function handleAdd() {
    const n = clamp(Math.floor(Number(qtyInput)) || 1);
    addItem({ sku: product.sku, name: product.name, category: product.category, unitPrice: product.price, imageUrl: product.imageUrl }, n);
    setQtyInput("1");
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[4px] bg-white transition-all hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)" }}>
      <Link href={`/products/${product.sku}`} className="relative block aspect-square shrink-0 bg-bg-soft">
        <Image src={imgSrc} alt={product.name} fill sizes="(max-width: 640px) 50vw, 320px" className="object-contain p-6" onError={onImgError} />
        <div className="absolute left-3 top-3 rounded-[3px] bg-navy-900 px-3 py-1.5 text-[11px] font-bold tracking-wide text-white">{product.brand}</div>
        {!outOfStock && (
          <div
            className="absolute right-3 top-3 flex items-center gap-1.5 rounded-[3px] bg-white/92 px-3 py-1.5 text-[11px] font-bold"
            style={{ color: low ? "var(--color-orange-600)" : "var(--color-stock-in)" }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: low ? "var(--color-orange-600)" : "var(--color-stock-in)" }} />
            {low ? "LOW STOCK" : "IN STOCK"}
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 truncate text-[11.5px] font-bold tracking-wide text-red-600">{product.subCategory}</div>
        <Link href={`/products/${product.sku}`} className="font-display mb-1 block truncate text-[17px] font-semibold text-navy-900 hover:underline">
          {product.name}
        </Link>
        <div className="mb-4 text-[13px] text-muted">
          SKU {product.sku} · {product.stock} {product.unit} available
        </div>

        <div className="mt-auto">
          <div className="mb-4 font-display text-[20px] font-bold text-navy-900">₹{product.price.toFixed(2)}</div>

          {outOfStock ? (
            <span className="block w-full rounded-[3px] bg-bg-soft py-3 text-center text-sm font-bold text-muted">Out of stock</span>
          ) : qty > 0 ? (
            <div>
              <div className="flex items-center justify-between rounded-[3px] bg-bg-soft p-2">
                <button
                  onClick={() => setQty(product.sku, qty - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-white text-lg font-bold text-navy-900 transition-colors hover:bg-border"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="text-sm font-bold text-navy-900">{qty} in bag</span>
                <button
                  onClick={() => setQty(product.sku, clamp(qty + 1))}
                  disabled={qty >= product.stock}
                  className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-white text-lg font-bold text-navy-900 transition-colors hover:bg-border disabled:opacity-30 disabled:hover:bg-white"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {qty >= product.stock && <p className="mt-1.5 text-center text-[11.5px] text-muted">Max available in stock</p>}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={qtyInput}
                  onChange={(e) => setQtyInput(e.target.value)}
                  onBlur={(e) => {
                    const n = Math.floor(Number(e.target.value));
                    setQtyInput(String(Number.isFinite(n) && n > 0 ? clamp(n) : 1));
                  }}
                  onClick={(e) => e.preventDefault()}
                  className="w-16 shrink-0 rounded-[3px] border border-border px-2 py-3 text-center text-sm font-bold text-navy-900 outline-none focus:border-navy-700"
                  aria-label="Quantity"
                />
                <button
                  onClick={handleAdd}
                  className="flex-1 rounded-[3px] bg-navy-900 py-3 text-sm font-bold text-white transition-colors hover:bg-navy-700"
                >
                  + Add to Enquiry
                </button>
              </div>
              <p className="mt-1.5 text-center text-[11.5px] text-muted">{product.stock} {product.unit} max</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
