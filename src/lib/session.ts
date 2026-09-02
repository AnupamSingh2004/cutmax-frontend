"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useCustomerSession() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{ authenticated: boolean; customer: Customer | null }>("/api/public/auth/me");
      setCustomer(res.authenticated ? res.customer : null);
    } catch {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { customer, loading, refresh };
}

export function useAdminSession() {
  const [admin, setAdmin] = useState<Admin | null | undefined>(undefined); // undefined = not yet checked
  const [loading, setLoading] = useState(true);

  // Only the very first check should show a full-page loading state. The
  // admin layout re-validates the session on every route change (to pick up
  // a cookie set by a just-completed login), and re-showing a full loading
  // screen for that would blank out the sidebar and page on every click,
  // looking like a hard page reload. Subsequent checks update `admin`
  // silently in the background instead.
  const refresh = async () => {
    try {
      const res = await apiFetch<{ admin: Admin }>("/api/admin/auth/me");
      setAdmin(res.admin);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { admin, loading, refresh };
}
