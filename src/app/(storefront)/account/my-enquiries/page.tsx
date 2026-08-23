"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";
import { useCustomerSession } from "@/lib/session";
import type { Enquiry } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const STATUS_TONE: Record<Enquiry["status"], "success" | "warning" | "danger" | "neutral"> = {
  NEW: "neutral",
  CONTACTED: "warning",
  QUOTED: "warning",
  WON: "success",
  LOST: "danger",
  ARCHIVED: "neutral",
};

export default function MyEnquiriesPage() {
  const { customer, loading: sessionLoading, refresh } = useCustomerSession();
  const [enquiries, setEnquiries] = useState<Enquiry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionLoading) return;
    if (!customer) return;
    apiFetch<{ enquiries: Enquiry[] }>("/api/public/auth/my-enquiries")
      .then((res) => setEnquiries(res.enquiries))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load enquiries"));
  }, [customer, sessionLoading]);

  async function logout() {
    await apiFetch("/api/public/auth/logout", { method: "POST" });
    await refresh();
  }

  if (sessionLoading) return <div className="mx-auto max-w-4xl px-4 py-16 text-muted">Loading…</div>;

  if (!customer) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy-900">Sign in to view your enquiries</h1>
        <Link href="/account/login">
          <Button className="mt-6">Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">My Enquiries</h1>
          <p className="text-sm text-muted">Signed in as {customer.email}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!enquiries ? (
        <p className="text-muted">Loading enquiries…</p>
      ) : enquiries.length === 0 ? (
        <p className="text-muted">You haven&apos;t submitted any enquiries yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {enquiries.map((enq) => (
            <div key={enq.id} className="rounded-card-lg border border-border bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-navy-900">{enq.reference}</p>
                  <p className="text-xs text-muted">{new Date(enq.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <Badge tone={STATUS_TONE[enq.status]}>{enq.status}</Badge>
              </div>
              <ul className="mt-3 flex flex-col gap-1 text-sm text-muted">
                {enq.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.qty} — ₹{item.lineTotal.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-semibold text-navy-900">Total: ₹{enq.grandTotal.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
