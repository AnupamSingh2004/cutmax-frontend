"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { MegaMenu } from "@/components/storefront/MegaMenu";
import { useCartStore } from "@/lib/cart-store";
import { useCustomerSession } from "@/lib/session";

const WHATSAPP_NUMBER = "918856828894";
const PHONE1 = "+91 8856828894";
const PHONE2 = "+91 9699192248";
const EMAIL = "officecutmax@gmail.com";
const ADDRESS = "Gat No. 714, Opp. Gupta Weigh Bridge, Kudalwadi, Chikhali, Pune - 411062";

export function Nav() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const { customer } = useCustomerSession();

  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/products?q=${encodeURIComponent(query)}`);
  }

  return (
    <>
      {/* ── Top contact bar ── */}
      <div className="hidden bg-navy-950 py-2 text-xs text-cream-100/80 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {ADDRESS}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {EMAIL}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {PHONE1}
            </span>
            <span className="text-cream-100/40">|</span>
            <span className="flex items-center gap-1.5">{PHONE2}</span>
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image src="/logo.png" alt="CutMax Technologies" width={160} height={50} className="h-10 w-auto" priority />
          </Link>

          {/* All Categories + Search — unified container */}
          <div className="relative hidden flex-1 items-center md:flex" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex shrink-0 items-center gap-2 rounded-l-md bg-navy-900 px-5 py-2.5 text-sm font-semibold text-cream-100 hover:bg-navy-800"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              All Categories
              <svg className={`h-3 w-3 transition-transform ${menuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <form onSubmit={onSearch} className="flex flex-1 items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, categories, SKU..."
                className="w-full border-y border-l border-border bg-white px-4 py-2.5 text-sm focus:outline-none"
              />
              <button type="submit" className="flex shrink-0 items-center justify-center rounded-r-md border border-l-0 border-border bg-navy-900 px-4 py-2.5 text-cream-100 hover:bg-navy-800">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </form>
            {menuOpen && (
              <MegaMenu
                onNavigate={() => { setMenuOpen(false); setQuery(""); }}
                onClose={() => setMenuOpen(false)}
              />
            )}
          </div>

          {/* Right actions */}
          <nav className="ml-auto flex items-center gap-2 text-sm font-medium text-navy-900 sm:gap-3">
            <Link
              href={customer ? "/account/my-enquiries" : "/account/login"}
              className="hidden items-center gap-1.5 rounded-md border border-border px-3 py-2 hover:bg-bg-soft sm:flex"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              {customer ? "My Enquiries" : "Sign In"}
              {!customer && (
                <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-900 text-[10px] font-bold text-cream-100">0</span>
              )}
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 rounded-md border border-border px-3 py-2 hover:bg-bg-soft"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
              Cart
              <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-900 text-[10px] font-bold text-cream-100">
                {count}
              </span>
            </button>

            <Link
              href="/admin"
              className="hidden rounded-md border border-navy-900 bg-navy-900 px-4 py-2 text-sm font-semibold text-cream-100 hover:bg-navy-800 sm:block"
            >
              Admin Login
            </Link>

            <button className="md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </nav>
        </div>

        {/* ── Secondary nav bar — thicker, more prominent ── */}
        <div className="hidden bg-navy-900 md:block">
          <div className="mx-auto flex max-w-7xl items-center px-4">
            {/* ALL CATEGORIES button — left edge */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex shrink-0 items-center gap-2 bg-navy-800 px-5 py-2.5 text-sm font-bold tracking-wide text-cream-100 hover:bg-navy-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              ALL CATEGORIES
            </button>

            {/* Nav links */}
            <div className="flex items-center gap-0.5 pl-2 text-[13px] font-bold uppercase tracking-wide text-cream-100">
              <Link href="/" className="rounded px-4 py-2.5 hover:bg-white/10">HOME</Link>
              <Link href="/products" className="rounded px-4 py-2.5 hover:bg-white/10">PRODUCTS</Link>
              <Link href="/about" className="rounded px-4 py-2.5 hover:bg-white/10">ABOUT US</Link>
              <Link href="/contact" className="rounded px-4 py-2.5 hover:bg-white/10">CONTACT US</Link>
              <span className="rounded px-4 py-2.5 text-cream-100/50 cursor-default">DOWNLOAD CATALOGUE</span>
            </div>

            {/* WhatsApp button — right edge */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20CutMax%2C%20I%27m%20interested%20in%20your%20products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex shrink-0 items-center gap-2 rounded bg-green-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-600"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M8 12a1 1 0 001 1h1a1 1 0 001-1V9a1 1 0 00-1-1H9a1 1 0 00-1 1v3z"/></svg>
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className="border-t border-border bg-white px-4 py-4 md:hidden">
            {/* Mobile: All Categories + Search */}
            <div className="mb-3 flex">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex shrink-0 items-center gap-2 rounded-l-md bg-navy-900 px-4 py-2.5 text-sm font-semibold text-cream-100"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                All
              </button>
              <form onSubmit={onSearch} className="flex flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products, categories, SKU..."
                  className="w-full border border-l-0 border-border px-4 py-2.5 text-sm focus:outline-none"
                />
                <button type="submit" className="flex shrink-0 items-center justify-center rounded-r-md border border-l-0 border-border bg-navy-900 px-3 text-cream-100">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </form>
            </div>
            {menuOpen && (
              <div className="mb-3">
                <MegaMenu onNavigate={() => { setMenuOpen(false); setMobileOpen(false); }} onClose={() => setMenuOpen(false)} />
              </div>
            )}
            <div className="flex flex-col gap-1 text-sm font-medium text-navy-900">
              <Link href="/" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 hover:bg-bg-soft">Home</Link>
              <Link href="/products" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 hover:bg-bg-soft">Products</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 hover:bg-bg-soft">About Us</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 hover:bg-bg-soft">Contact Us</Link>
              <Link href={customer ? "/account/my-enquiries" : "/account/login"} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 hover:bg-bg-soft">
                {customer ? "My Enquiries" : "Sign In"}
              </Link>
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 hover:bg-bg-soft">Admin Login</Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20CutMax%2C%20I%27m%20interested%20in%20your%20products.`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-2.5 text-sm font-semibold text-white"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
