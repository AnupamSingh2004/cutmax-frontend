"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminSession } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, loading, refresh } = useAdminSession();

  const isLoginPage = pathname === "/admin/login";

  // The layout persists across /admin/login -> /admin client-side navigations (Next.js
  // doesn't remount a shared layout on sibling route changes), so the session must be
  // re-checked explicitly on every path change to pick up a cookie set by a just-completed login.
  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (loading) return;
    if (!admin && !isLoginPage) router.replace("/admin/login");
    if (admin && isLoginPage) router.replace("/admin");
  }, [admin, loading, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (loading || !admin) {
    return <div className="flex min-h-screen items-center justify-center text-muted">Loading…</div>;
  }

  return (
    <div className="flex min-h-screen bg-bg-soft">
      <AdminSidebar admin={admin} onLogout={() => { void refresh(); router.replace("/admin/login"); }} />
      <main className="flex-1 overflow-x-auto p-8">{children}</main>
    </div>
  );
}
