import Link from "next/link";
import Image from "next/image";
import { TAXONOMY } from "@/lib/taxonomy";
import { API_BASE } from "@/lib/api-client";
import { productImageSrc } from "@/lib/product-image";
import type { Product, PublicSettings } from "@/lib/types";
import { PageHeading } from "@/components/ui/PageHeading";

const DEFAULT_WHATSAPP_NUMBER = "918856828894";
const DEFAULT_HERO_TITLE = "Precision cutting tools, sourced without friction.";
const DEFAULT_HERO_SUBTITLE =
  "Cutmax Technologies supplies end mills, carbide inserts, tool holders and adapters for CNC machine shops across India. Browse live inventory, add what you need, and send the requirement straight to our sales team.";

interface ProductsResponse {
  products: Product[];
  total: number;
  settings: PublicSettings;
}

async function getProducts(): Promise<ProductsResponse> {
  const empty: ProductsResponse = { products: [], total: 0, settings: { whatsapp: "", gst_percent: 18, low_stock: 10 } };
  try {
    const res = await fetch(`${API_BASE}/api/public/products?per_page=500&sort=newest`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return empty;
    const data = await res.json();
    return { products: data.products ?? [], total: data.total ?? 0, settings: data.settings ?? empty.settings };
  } catch {
    return empty;
  }
}

function countByCategory(products: Product[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of products) {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  }
  return counts;
}

const STEPS = [
  { number: "01", title: "Browse the catalogue", desc: "Search live SKUs by category, brand or specification." },
  { number: "02", title: "Build your enquiry bag", desc: "Add line items and review quantities and GST-inclusive pricing." },
  { number: "03", title: "Send on WhatsApp", desc: "Your enquiry goes straight to the Cutmax sales team." },
  { number: "04", title: "Confirm with invoice", desc: "Get a GST-ready quote and confirm your order." },
];

export default async function HomePage() {
  const { products, total, settings } = await getProducts();
  const categoryCounts = countByCategory(products);
  const skuCount = total || products.length;
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* ════════ Hero ════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(155deg,#1B2C56 0%,#2C4488 55%,#37569E 100%)" }}
      >
        <div className="hero-pulse-ring" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-14 sm:py-16 lg:grid-cols-2 lg:py-[88px]">
          <div>
            <div className="mb-5 flex items-center gap-2.5">
              <span className="h-[2px] w-7 bg-red-600" />
              <span className="text-[13px] font-bold tracking-[0.14em] text-orange-500">B2B INDUSTRIAL CATALOGUE</span>
            </div>
            <h1 className="font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-[2.6rem] lg:text-[3.375rem]">
              {settings.hero_title || DEFAULT_HERO_TITLE}
            </h1>
            <p className="mt-5 max-w-lg text-[17.5px] leading-relaxed text-white/68">
              {settings.hero_subtitle || DEFAULT_HERO_SUBTITLE}
            </p>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <Link href="/products" className="rounded-[3px] bg-white px-7 py-[15px] text-[15px] font-bold text-navy-900 transition-colors hover:bg-border">
                Browse Catalogue
              </Link>
              <Link href="/contact" className="rounded-[3px] border-[1.5px] border-white/40 px-7 py-[15px] text-[15px] font-bold text-white transition-colors hover:border-white/70 hover:bg-white/10">
                Request a Quote
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-10 border-t border-white/14 pt-7">
              <div>
                <div className="font-display text-[28px] font-bold text-white">{skuCount}+</div>
                <div className="mt-1 text-[13px] text-white/55">SKUs in live inventory</div>
              </div>
              <div>
                <div className="font-display text-[28px] font-bold text-white">{TAXONOMY.length}</div>
                <div className="mt-1 text-[13px] text-white/55">Product categories</div>
              </div>
              <div>
                <div className="font-display text-[28px] font-bold text-white">GST-ready</div>
                <div className="mt-1 text-[13px] text-white/55">Invoicing on every quote</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -right-6 -top-6 h-full w-full rounded-[4px] border-[1.5px] border-red-600/30" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[4px]" style={{ boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5)" }}>
              <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata">
                <source
                  src={settings.hero_video_url || "https://464.objects.excloud.dev/public/cutmax-images/videos/products-hero.mp4"}
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(4,5,7,.08), rgba(4,5,7,.68))" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ════════ Why Cutmax ════════ */}
      <section className="bg-bg-soft">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-24">
          <PageHeading eyebrow="Why Cutmax" title="Built for industrial procurement, not retail browsing." className="mb-14 max-w-xl" />
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-3">
            {[
              { title: "Complete live catalogue", desc: `${skuCount || "200+"} precision cutting-tool records across End Mills, Carbide Inserts, Tool Holders and more, tracked from live stock.` },
              { title: "Enquiry-first workflow", desc: "Add what you need to an enquiry bag, review GST-inclusive pricing, and send it straight to our sales team on WhatsApp." },
              { title: "Built for bulk buyers", desc: "Multi-line requirements, repeat orders and distributor accounts, backed by GST-registered invoicing on every quote." },
            ].map((f) => (
              <div key={f.title} className="rounded-[4px] border-t-[3px] border-red-600 bg-surface p-9 pt-8">
                <h3 className="font-display mb-3 text-[19px] font-bold text-heading">{f.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted-soft">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ Product Range ════════ */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-24">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <PageHeading eyebrow="Product Range" title="Browse the catalogue by category" />
            <Link href="/products" className="hidden rounded-[3px] bg-navy-900 px-6 py-3.5 text-[14.5px] font-bold text-white transition-colors hover:bg-navy-700 sm:block">
              View all products →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TAXONOMY.map((cat) => {
              const count = categoryCounts[cat.name] ?? 0;
              return (
                <Link
                  key={cat.name}
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="block rounded-[4px] bg-bg-soft p-7 transition-colors hover:bg-border"
                >
                  <div className="mb-2.5 flex items-baseline justify-between gap-3">
                    <span className="font-display text-[17px] font-bold text-heading">{cat.name}</span>
                    <span className="whitespace-nowrap text-xs font-bold text-red-600">{count > 0 ? `${count} SKUs` : "Enquire"}</span>
                  </div>
                  <div className="mb-4 text-[13.5px] leading-relaxed text-muted-soft">{cat.subCategories.join(" · ")}</div>
                  <div className="text-[13.5px] font-bold text-heading">Browse category →</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ Featured products ════════ */}
      {featured.length > 0 && (
        <section className="bg-bg-soft">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:py-24">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="h-[2px] w-7 bg-red-600" />
              <span className="text-[13px] font-bold tracking-[0.14em] text-red-600">IN STOCK NOW</span>
            </div>
            <h2 className="font-display mb-12 text-[1.75rem] font-bold text-heading sm:text-[2.375rem]">Featured from the catalogue</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => {
                const low = p.stock <= settings.low_stock;
                return (
                  <Link key={p.sku} href={`/products/${p.sku}`} className="block overflow-hidden rounded-[4px] bg-surface transition-transform hover:-translate-y-1">
                    <div className="relative aspect-square bg-bg-soft">
                      <Image src={productImageSrc(p)} alt={p.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-contain p-4" />
                      <div className="absolute left-3 top-3 rounded-[3px] bg-navy-900 px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-white">
                        {p.brand}
                      </div>
                      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-[3px] bg-white/92 px-2.5 py-1 text-[10.5px] font-bold" style={{ color: low ? "var(--color-orange-600)" : "var(--color-stock-in)" }}>
                        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: low ? "var(--color-orange-600)" : "var(--color-stock-in)" }} />
                        {low ? "LOW STOCK" : "IN STOCK"}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="mb-1.5 text-[11px] font-bold tracking-wide text-red-600">{p.subCategory}</div>
                      <div className="font-display mb-1 truncate text-[15.5px] font-semibold text-heading">{p.name}</div>
                      <div className="mb-3.5 text-[12.5px] text-muted">SKU {p.sku}</div>
                      <div className="flex items-center justify-between gap-2.5">
                        <span className="font-display text-lg font-bold text-heading">₹{p.price.toFixed(2)}</span>
                        <span className="rounded-[3px] bg-navy-900 px-3.5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-navy-700">View</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ════════ 4-step process ════════ */}
      <section className="bg-navy-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-16 sm:grid-cols-4 sm:py-[88px]">
          {STEPS.map((step) => (
            <div key={step.number}>
              <div className="font-display mb-4 text-[32px] font-bold text-orange-500">{step.number}</div>
              <div className="font-display mb-2.5 text-[17px] font-semibold text-white">{step.title}</div>
              <div className="text-sm leading-relaxed text-white/60">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ WhatsApp CTA banner ════════ */}
      <section className="flex flex-wrap items-center justify-between gap-8 bg-red-600 px-4 py-12 sm:px-12">
        <div>
          <h3 className="font-display mb-2 text-[28px] font-bold text-white">Have a bulk requirement?</h3>
          <p className="text-[15.5px] text-white/92">Send your specification straight to our sales team on WhatsApp and get a GST-ready quote back.</p>
        </div>
        <a
          href={`https://wa.me/${settings.whatsapp || DEFAULT_WHATSAPP_NUMBER}?text=Hi%20Cutmax%20Technologies%2C%20I%20have%20a%20bulk%20requirement.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-[3px] bg-navy-900 px-8 py-4 text-[15.5px] font-bold text-white transition-colors hover:bg-navy-700"
        >
          <svg className="h-[19px] w-[19px]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.07-1.32A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.6 0-3.1-.43-4.4-1.18l-.32-.19-3.13.82.84-3.05-.2-.32A7.93 7.93 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.4-5.6c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.38.1-.5.12-.12.28-.32.4-.48.14-.16.18-.28.28-.46.1-.18.02-.34-.06-.46-.08-.12-.5-1.2-.68-1.64-.18-.42-.36-.36-.5-.36-.12 0-.28-.02-.44-.02-.16 0-.4.06-.6.28-.2.22-.78.76-.78 1.84 0 1.08.78 2.14.88 2.28.1.14 1.5 2.28 3.66 3.12 1.82.7 2.2.56 2.6.52.4-.04 1.3-.52 1.48-1.02.18-.5.18-.94.12-1.02-.06-.1-.22-.16-.46-.28z" /></svg>
          Message on WhatsApp
        </a>
      </section>
    </div>
  );
}
