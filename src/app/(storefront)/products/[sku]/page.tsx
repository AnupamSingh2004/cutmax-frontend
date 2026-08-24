import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { API_BASE } from "@/lib/api-client";
import { productImageSrc } from "@/lib/product-image";
import { ProductDetailView } from "@/components/storefront/ProductDetailView";
import type { Product, PriceTier } from "@/lib/types";

interface ProductDetailResponse {
  product: Product;
  tiers: PriceTier[];
  related: Product[];
}

async function getProduct(sku: string): Promise<ProductDetailResponse | null> {
  const res = await fetch(`${API_BASE}/api/public/products/${encodeURIComponent(sku)}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ sku: string }> }): Promise<Metadata> {
  const { sku } = await params;
  const data = await getProduct(sku);
  if (!data) return { title: "Product not found — CutMax Technologies" };

  const { product } = data;
  const title = `${product.name} (${product.sku}) — ${product.subCategory} | CutMax Technologies`;
  const description = product.description || `${product.name} — ${product.category} / ${product.subCategory}. ₹${product.price.toFixed(2)} per ${product.unit}.`;
  const image = productImageSrc(product);

  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: image }], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const data = await getProduct(sku);
  if (!data) notFound();

  return <ProductDetailView product={data.product} tiers={data.tiers} related={data.related} />;
}
