import type { Product } from "@/lib/types";
import { DEFAULT_PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE_BY_SUBCATEGORY } from "@/lib/taxonomy";

export function productImageSrc(product: Pick<Product, "imageUrl" | "subCategory">): string {
  if (product.imageUrl) return product.imageUrl; // backend already returns an absolute URL
  return PLACEHOLDER_IMAGE_BY_SUBCATEGORY[product.subCategory] ?? DEFAULT_PLACEHOLDER_IMAGE;
}
