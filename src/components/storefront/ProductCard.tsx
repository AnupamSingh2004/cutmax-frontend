"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { productImageSrc } from "@/lib/product-image";
import { stockBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";

export function ProductCard({ product, lowStockLimit }: { product: Product; lowStockLimit: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  return (
    <div className="group flex flex-col overflow-hidden rounded-card-lg border border-border bg-white shadow-card transition-shadow hover:shadow-card-hover">
      <Link href={`/products/${product.sku}`} className="relative block aspect-square bg-bg-soft">
        <Image
          src={productImageSrc(product)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 280px"
          className="object-contain p-6 transition-transform group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="rounded-full bg-cream-200 px-2 py-0.5 font-semibold text-navy-800">{product.brand}</span>
          {stockBadge(product.stock, lowStockLimit)}
        </div>
        <Link href={`/products/${product.sku}`} className="font-semibold text-navy-900 hover:underline">
          {product.name}
        </Link>
        <p className="text-xs text-muted">
          {product.category} · {product.subCategory}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-navy-900">₹{product.price.toFixed(2)}</span>
          <Button
            size="sm"
            variant={added ? "secondary" : "primary"}
            disabled={product.stock <= 0}
            onClick={() => {
              addItem({ sku: product.sku, name: product.name, category: product.category, unitPrice: product.price, imageUrl: product.imageUrl });
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
          >
            {product.stock <= 0 ? "Enquire" : added ? "Added ✓" : "Add to bag"}
          </Button>
        </div>
      </div>
    </div>
  );
}
