"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import type { Admin } from "@/lib/session";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/audit-log", label: "Audit Log" },
];

export function AdminSidebar({ admin, onLogout }: { admin: Admin; onLogout: () => void }) {
  const pathname = usePathname();

  async function logout() {
    await apiFetch("/api/admin/auth/logout", { method: "POST" });
    onLogout();
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-navy-950 text-cream-100">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
        <Image src="/logo.png" alt="CutMax" width={120} height={50} className="h-8 w-auto" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${active ? "bg-cream-300 text-navy-900" : "text-cream-100/80 hover:bg-white/10"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4 text-sm">
        <p className="font-medium">{admin.name}</p>
        <p className="text-xs text-cream-100/60">{admin.email}</p>
        <button
          onClick={logout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 py-2 text-xs font-semibold text-cream-100 transition-colors hover:bg-white/15"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}
