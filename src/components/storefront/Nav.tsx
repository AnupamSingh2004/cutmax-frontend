"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { MegaMenu } from "@/components/storefront/MegaMenu";
import { useCartStore } from "@/lib/cart-store";
import { useCustomerSession } from "@/lib/session";

export function Nav() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const { customer } = useCustomerSession();

  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/products?q=${encodeURIComponent(query)}`);
  }

  return (
    <>
      <div className="hidden bg-navy-950 py-2 text-xs text-cream-100 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-6 px-4">
          <span>sales@cutmaxtech.com</span>
          <span>+91 99999 99999</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image src="/logo.png" alt="CutMax Technologies" width={140} height={60} className="h-10 w-auto" priority />
          </Link>

          <div className="relative hidden md:block">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-cream-100 hover:bg-navy-800"
            >
              All Categories
            </button>
            {menuOpen && <MegaMenu onNavigate={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)} />}
          </div>

          <form onSubmit={onSearch} className="hidden flex-1 items-center gap-2 md:flex">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, SKUs..."
              className="w-full rounded-full border border-border px-4 py-2 text-sm focus:border-navy-700 focus:outline-none"
            />
          </form>

          <nav className="ml-auto flex items-center gap-4 text-sm font-medium text-navy-900">
            <Link href={customer ? "/account/my-enquiries" : "/account/login"} className="hidden sm:inline hover:underline">
              {customer ? "My Enquiries" : "Sign in"}
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative rounded-full border border-border p-2 hover:bg-bg-soft">
              🛒
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cream-300 text-xs font-bold text-navy-900">
                  {count}
                </span>
              )}
            </button>
            <button className="md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
              ☰
            </button>
          </nav>
        </div>

        <div className="hidden border-t border-border bg-navy-900 md:block">
          <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-2 text-sm font-medium text-cream-100">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <Link href="/products" className="hover:text-white">
              Products
            </Link>
            <Link href="/about" className="hover:text-white">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact Us
            </Link>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-white px-4 py-3 md:hidden">
            <form onSubmit={onSearch} className="mb-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-full border border-border px-4 py-2 text-sm"
              />
            </form>
            <div className="flex flex-col gap-2 text-sm font-medium text-navy-900">
              <Link href="/products" onClick={() => setMobileOpen(false)}>
                Products
              </Link>
              <Link href="/about" onClick={() => setMobileOpen(false)}>
                About Us
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                Contact Us
              </Link>
              <Link href={customer ? "/account/my-enquiries" : "/account/login"} onClick={() => setMobileOpen(false)}>
                {customer ? "My Enquiries" : "Sign in"}
              </Link>
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
