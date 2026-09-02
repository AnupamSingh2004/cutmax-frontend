"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { MegaMenu } from "@/components/storefront/MegaMenu";
import { ThemeSwitcher } from "@/components/storefront/ThemeSwitcher";
import { useCartStore } from "@/lib/cart-store";
import { useCustomerSession } from "@/lib/session";
import { useSettings } from "@/lib/settings-context";
import { TAXONOMY } from "@/lib/taxonomy";

// Fallbacks if the admin hasn't filled these in under Settings yet — keeps
// the header from ever going blank, and matches what was previously hardcoded.
const DEFAULT_WHATSAPP_NUMBER = "918856828894";
const DEFAULT_PHONE = "+91 8856828894";
const EMAIL = "officecutmax@gmail.com";
const DEFAULT_ADDRESS = "Gat No. 714, Opp. Gupta Weigh Bridge, Kudalwadi, Chikhali, Pune - 411062";

export function Nav() {
  const router = useRouter();
  const settings = useSettings();
  const WHATSAPP_NUMBER = settings.whatsapp || DEFAULT_WHATSAPP_NUMBER;
  const PHONE1 = settings.company_phone || DEFAULT_PHONE;
  const ADDRESS = settings.company_address || DEFAULT_ADDRESS;
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const { customer } = useCustomerSession();

  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDrawerShown, setMobileDrawerShown] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [query, setQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mega menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Full-page mobile drawer: lock body scroll while open, and drive the
  // slide-in transform via a frame after mount so it actually animates in
  // rather than popping in at its final position.
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      const id = requestAnimationFrame(() => setMobileDrawerShown(true));
      return () => cancelAnimationFrame(id);
    }
    document.body.style.overflow = "";
    setMobileDrawerShown(false);
    setMobileCategoriesOpen(false);
  }, [mobileOpen]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/products?q=${encodeURIComponent(query)}`);
  }

  return (
    <>
      {/* ── Top contact bar ── */}
      <div className="hidden bg-navy-950 py-2.5 text-[13px] text-white/72 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-5">
            <span>{ADDRESS}</span>
          </div>
          <div className="flex items-center gap-5">
            <span>{EMAIL}</span>
            <span>{PHONE1}</span>
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image src="/logo.png" alt="CutMax Technologies" width={160} height={50} className="h-9 w-auto" priority />
            <div className="hidden sm:block">
              <div className="font-display text-[19px] font-extrabold leading-none tracking-tight text-heading">CUTMAX</div>
              <div className="mt-0.5 text-[10px] tracking-[0.13em] text-muted">TECHNOLOGIES</div>
            </div>
          </Link>

          {/* All Categories + Search — unified container */}
          <div className="relative hidden flex-1 items-center md:flex" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex shrink-0 items-center gap-2 rounded-l-[3px] border border-r border-border bg-border px-3.5 py-3 text-[13px] font-semibold text-heading hover:bg-border"
            >
              All Categories
              <svg className={`h-3 w-3 transition-transform ${menuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <form onSubmit={onSearch} className="flex flex-1 items-center border-y border-border bg-bg-soft">
              <svg className="ml-3 h-4 w-4 shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search end mills, categories, SKU…"
                className="w-full bg-transparent px-3 py-3 text-sm focus:outline-none"
              />
            </form>
            <button type="submit" onClick={onSearch} className="flex shrink-0 items-center rounded-r-[3px] bg-navy-900 px-5 py-3 text-[13.5px] font-bold text-white transition-colors hover:bg-navy-700">
              Search
            </button>
            {menuOpen && (
              <MegaMenu
                onNavigate={() => { setMenuOpen(false); setQuery(""); }}
                onClose={() => setMenuOpen(false)}
              />
            )}
          </div>

          {/* Right actions */}
          <nav className="ml-auto flex items-center gap-1.5 text-sm font-medium text-heading sm:gap-2.5">
            <div className="hidden sm:block">
              <ThemeSwitcher />
            </div>

            <Link
              href={customer ? "/account/my-enquiries" : "/account/login"}
              className="hidden items-center gap-1.5 rounded-[3px] border border-border bg-bg-soft px-3.5 py-2.5 text-[13.5px] font-semibold hover:bg-border sm:flex"
            >
              {customer ? "My Enquiries" : "Sign In"}
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              aria-label="Enquiry bag"
              className="relative flex items-center gap-1.5 rounded-[3px] border border-border bg-bg-soft px-2.5 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-border sm:px-3.5"
            >
              <svg className="h-[17px] w-[17px] shrink-0" viewBox="0 0 24 24" fill="none"><path d="M4 6h16l-1.5 10h-13z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><circle cx="9" cy="20" r="1.4" fill="currentColor" /><circle cx="17" cy="20" r="1.4" fill="currentColor" /></svg>
              <span className="hidden sm:inline">Enquiry Bag</span>
              <span className="rounded-[3px] bg-red-600 px-1.5 py-0.5 text-[11px] font-extrabold text-white">{count}</span>
            </button>

            <Link
              href="/contact"
              className="hidden rounded-[3px] bg-red-600 px-4.5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-red-700 sm:block"
            >
              Request a Quote
            </Link>

            <button className="flex h-9 w-9 shrink-0 items-center justify-center md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </nav>
        </div>

        {/* ── Persistent mobile search bar — always visible, not gated behind the hamburger ── */}
        <div className="border-t border-border bg-bg-soft px-4 py-2.5 md:hidden">
          <form onSubmit={onSearch} className="flex items-center rounded-[3px] border border-border bg-surface">
            <svg className="ml-3 h-4 w-4 shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search end mills, categories, SKU…"
              className="w-full bg-transparent px-3 py-2.5 text-sm text-heading focus:outline-none"
            />
            <button type="submit" aria-label="Search" className="flex shrink-0 items-center rounded-r-[2px] bg-navy-900 px-4 py-2.5 text-[13px] font-bold text-white">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
            </button>
          </form>
        </div>

        {/* ── Secondary nav bar — dark navy strip ── */}
        <div className="hidden bg-navy-900 md:block">
          <div className="mx-auto flex max-w-7xl items-center gap-8 px-4 py-3.5 text-sm font-semibold text-white/75">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/products" className="hover:text-white">Products</Link>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>

            {/* WhatsApp link — right edge */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20CutMax%2C%20I%27m%20interested%20in%20your%20products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex shrink-0 items-center gap-1.5 font-bold text-green-500 transition-colors hover:text-green-600"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.07-1.32A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.6 0-3.1-.43-4.4-1.18l-.32-.19-3.13.82.84-3.05-.2-.32A7.93 7.93 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.4-5.6c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.38.1-.5.12-.12.28-.32.4-.48.14-.16.18-.28.28-.46.1-.18.02-.34-.06-.46-.08-.12-.5-1.2-.68-1.64-.18-.42-.36-.36-.5-.36-.12 0-.28-.02-.44-.02-.16 0-.4.06-.6.28-.2.22-.78.76-.78 1.84 0 1.08.78 2.14.88 2.28.1.14 1.5 2.28 3.66 3.12 1.82.7 2.2.56 2.6.52.4-.04 1.3-.52 1.48-1.02.18-.5.18-.94.12-1.02-.06-.1-.22-.16-.46-.28z"/></svg>
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* ── Mobile drawer — full-page slide-over, not a small dropdown ── */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              aria-label="Close menu overlay"
              className={`absolute inset-0 bg-navy-950/60 transition-opacity duration-300 ${mobileDrawerShown ? "opacity-100" : "opacity-0"}`}
              onClick={() => setMobileOpen(false)}
            />
            <div
              className={`absolute inset-y-0 right-0 flex h-full w-full max-w-full flex-col bg-surface transition-transform duration-300 ${mobileDrawerShown ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                  <Image src="/logo.png" alt="CutMax Technologies" width={160} height={50} className="h-8 w-auto" />
                  <span className="font-display text-[17px] font-extrabold tracking-tight text-heading">CUTMAX</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-bg-soft"
                >
                  <svg className="h-6 w-6 text-heading" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                {/* Categories accordion */}
                <button
                  onClick={() => setMobileCategoriesOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-md bg-navy-900 px-4 py-3 text-sm font-semibold text-white"
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    Categories
                  </span>
                  <svg className={`h-3.5 w-3.5 transition-transform ${mobileCategoriesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>

                {mobileCategoriesOpen && (
                  <div className="mt-2 flex flex-col gap-1 rounded-md border border-border bg-bg-soft p-2">
                    <Link
                      href="/products"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-md px-3 py-2 text-sm font-semibold text-heading hover:bg-surface"
                    >
                      All Products
                    </Link>
                    {TAXONOMY.map((c) => (
                      <div key={c.name}>
                        <Link
                          href={`/products?category=${encodeURIComponent(c.name)}`}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-md px-3 py-2 text-sm font-bold text-heading hover:bg-surface"
                        >
                          {c.name}
                        </Link>
                        <div className="flex flex-col gap-0.5 pl-3">
                          {c.subCategories.map((sub) => (
                            <Link
                              key={sub}
                              href={`/products?category=${encodeURIComponent(c.name)}&sub=${encodeURIComponent(sub)}`}
                              onClick={() => setMobileOpen(false)}
                              className="rounded-md px-3 py-1.5 text-[13px] text-muted-soft hover:bg-surface hover:text-heading"
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="my-4 flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                  <span className="text-sm font-medium text-heading">Theme</span>
                  <ThemeSwitcher />
                </div>

                <div className="flex flex-col gap-1 text-sm font-medium text-heading">
                  <Link href="/" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 hover:bg-bg-soft">Home</Link>
                  <Link href="/products" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 hover:bg-bg-soft">Products</Link>
                  <Link href="/about" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 hover:bg-bg-soft">About Us</Link>
                  <Link href="/contact" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 hover:bg-bg-soft">Contact Us</Link>
                  <Link href={customer ? "/account/my-enquiries" : "/account/login"} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 hover:bg-bg-soft">
                    {customer ? "My Enquiries" : "Sign In"}
                  </Link>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-md bg-red-600 px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Request a Quote
                  </Link>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20CutMax%2C%20I%27m%20interested%20in%20your%20products.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
