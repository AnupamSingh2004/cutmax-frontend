import Link from "next/link";
import Image from "next/image";
import { TAXONOMY } from "@/lib/taxonomy";
import { API_BASE } from "@/lib/api-client";
import type { Product } from "@/lib/types";
import { PageHeading } from "@/components/ui/PageHeading";

const WHATSAPP_NUMBER = "918856828894";

interface ProductsResponse {
  products: Product[];
  total: number;
}

async function getProducts(): Promise<ProductsResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/public/products?per_page=500&sort=newest`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { products: [], total: 0 };
    const data = await res.json();
    return { products: data.products ?? [], total: 0 };
  } catch {
    return { products: [], total: 0 };
  }
}

function countByCategory(products: Product[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of products) {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  }
  return counts;
}

export default async function HomePage() {
  const { products, total } = await getProducts();
  const categoryCounts = countByCategory(products);

  return (
    <div>
      {/* ════════ Hero Section ════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 75% 25%, rgba(232,226,214,.18), transparent 45%), linear-gradient(120deg, var(--color-navy-950), var(--color-navy-700))",
        }}
      >
        {/* Soft pulsing ring, top-right */}
        <div className="hero-pulse-ring" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:py-16 lg:grid-cols-2 lg:py-20">
          {/* Left — Copy */}
          <div className="text-cream-100">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-cream-300"></span>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cream-300">
                B2B Industrial Catalogue
              </span>
            </div>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Industrial Products.
              <br />
              Reliable Supply.
              <br />
              <span className="text-cream-300">Easy Enquiry.</span>
            </h1>
            <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-cream-100/65 sm:text-base">
              Browse the complete Cutmax catalogue, build an enquiry cart, review
              GST and send the requirement directly to our WhatsApp sales team.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-md border-2 border-cream-300 bg-transparent px-6 py-3 text-sm font-semibold text-cream-300 transition-colors hover:bg-cream-300 hover:text-navy-900"
              >
                Browse Catalogue
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-cream-200"
              >
                Request a Quote
              </Link>
            </div>
          </div>

          {/* Right — Precision tooling video panel */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card-sm bg-navy-800">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src="/videos/products-hero.mp4" type="video/mp4" />
              </video>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(4,5,7,.08), rgba(4,5,7,.68)), linear-gradient(90deg, rgba(232,226,214,.2), transparent 46%)",
                }}
              />
              <div className="absolute bottom-0 left-0 p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cream-300/70">Cutmax Technologies</p>
                <p className="mt-1 text-base font-bold uppercase tracking-wider text-cream-100">Precision CNC Tooling</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-cream-100/50">Engineered for Performance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ Why Cutmax — Built for industrial procurement ════════ */}
      <section className="bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <PageHeading eyebrow="Why Cutmax" title="Built for industrial procurement" className="mb-10" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: "Complete catalogue",
                desc: `${total || "200+"} precision cutting-tool records — End Mills, Carbide Inserts, Tool Holders, Milling Cutters and Spares from your live inventory.`,
              },
              {
                title: "Enquiry-first checkout",
                desc: "Select products, calculate GST, then continue to WhatsApp.",
              },
              {
                title: "Bulk Excel import",
                desc: "Upload many products at once, including image URLs.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-card-sm border border-border bg-white p-6 shadow-card">
                <h3 className="mb-2 text-lg font-bold text-navy-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ Shop by Category ════════ */}
      <section className="bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:pb-20">
          <div className="mb-8 flex items-end justify-between">
            <PageHeading eyebrow="Shop by Category" title="Browse the catalogue" />
            <Link
              href="/products"
              className="hidden rounded-md bg-navy-900 px-5 py-2.5 text-sm font-semibold text-cream-100 hover:bg-navy-800 sm:block"
            >
              View all products
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {TAXONOMY.map((category) => {
              const count = categoryCounts[category.name] ?? 0;
              return (
                <Link
                  key={category.name}
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group flex flex-col overflow-hidden rounded-card-sm border border-border bg-white shadow-card transition-all hover:shadow-card-hover hover:border-navy-200"
                >
                  {category.image && (
                    <div className="relative aspect-[4/3] bg-bg-soft">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 280px"
                        className="object-contain p-4 transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-navy-900 group-hover:text-navy-700">{category.name}</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-muted">
                        {count > 0 ? `${count} Products` : `${category.subCategories.length} sub-categories`}
                      </span>
                      <span className="text-xs font-medium text-navy-700 group-hover:underline">Browse →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-md bg-navy-900 px-5 py-2.5 text-sm font-semibold text-cream-100 hover:bg-navy-800 sm:hidden"
          >
            View all products
          </Link>
        </div>
      </section>

      {/* ════════ Latest Products ════════ */}
      {products.length > 0 && (
        <section className="bg-cream-100">
          <div className="mx-auto max-w-7xl px-4 pb-14 sm:pb-20">
            <div className="mb-8 flex items-end justify-between">
              <PageHeading eyebrow="Latest Products" title="Recently added" />
              <Link href="/products" className="hidden rounded-md bg-navy-900 px-5 py-2.5 text-sm font-semibold text-cream-100 hover:bg-navy-800 sm:block">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.slice(0, 8).map((p) => (
                <Link
                  key={p.sku}
                  href={`/products/${p.sku}`}
                  className="rounded-card-sm border border-border bg-white p-4 shadow-card transition-all hover:shadow-card-hover hover:border-navy-200"
                >
                  <p className="truncate font-semibold text-navy-900">{p.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{p.subCategory}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="font-bold text-navy-900">₹{p.price.toFixed(2)}</p>
                    <span className="text-[10px] uppercase tracking-wide text-muted">{p.unit}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ CTA Banner ════════ */}
      <section className="bg-navy-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-12 text-center text-cream-100 sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-xl font-bold">Need a custom quote?</h2>
            <p className="mt-1 text-sm text-cream-100/70">Talk to our team for bulk orders and special configurations.</p>
          </div>
          <div className="flex gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20CutMax%2C%20I%20need%20a%20custom%20quote.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              WhatsApp Us
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-cream-100/30 px-6 py-3 text-sm font-semibold text-cream-100 hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
