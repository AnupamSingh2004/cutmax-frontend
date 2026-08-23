import Link from "next/link";
import { TAXONOMY } from "@/lib/taxonomy";
import { API_BASE } from "@/lib/api-client";
import type { Product } from "@/lib/types";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/api/public/products?per_page=8&sort=newest`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-700 py-24 text-cream-100">
        <div className="relative mx-auto max-w-7xl px-4">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cream-300">CutMax Technologies</p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Precision Cutting Tools for Modern Manufacturing
          </h1>
          <p className="mt-4 max-w-xl text-cream-100/80">
            Carbide inserts, end mills, tool holders and more — built for CNC performance.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/products" className="rounded-full bg-cream-300 px-6 py-3 font-semibold text-navy-900 hover:bg-cream-400">
              Browse Products
            </Link>
            <Link href="/contact" className="rounded-full border border-cream-100/40 px-6 py-3 font-semibold hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-6 text-2xl font-bold text-navy-900">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {TAXONOMY.map((category) => (
            <Link
              key={category.name}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="flex flex-col justify-between rounded-card-lg border border-border bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <span className="font-semibold text-navy-900">{category.name}</span>
              <span className="mt-2 text-xs text-muted">{category.subCategories.length} sub-categories</span>
            </Link>
          ))}
        </div>
      </section>

      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <h2 className="mb-6 text-2xl font-bold text-navy-900">Latest Products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 8).map((p) => (
              <Link
                key={p.sku}
                href={`/products/${p.sku}`}
                className="rounded-card-lg border border-border bg-white p-4 shadow-card hover:shadow-card-hover"
              >
                <p className="truncate font-semibold text-navy-900">{p.name}</p>
                <p className="text-xs text-muted">{p.subCategory}</p>
                <p className="mt-2 font-bold text-navy-900">₹{p.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-cream-100 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
          {[
            { title: "Precision Engineered", body: "Carbide-grade tooling built for tight tolerances and long tool life." },
            { title: "B2B Pricing Tiers", body: "Volume discounts automatically applied as your order quantity grows." },
            { title: "Fast Quote Turnaround", body: "Submit an enquiry and get a quote over WhatsApp within hours." },
          ].map((f) => (
            <div key={f.title}>
              <h3 className="mb-2 font-semibold text-navy-900">{f.title}</h3>
              <p className="text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
