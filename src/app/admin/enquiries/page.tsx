"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import type { Enquiry, EnquiryStatus } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";

interface EnquiriesResponse {
  enquiries: Enquiry[];
  total: number;
  page: number;
  per_page: number;
}

const STATUS_TONE: Record<EnquiryStatus, "success" | "warning" | "danger" | "neutral"> = {
  NEW: "neutral",
  CONTACTED: "warning",
  QUOTED: "warning",
  WON: "success",
  LOST: "danger",
  ARCHIVED: "neutral",
};

export default function AdminEnquiriesPage() {
  const [data, setData] = useState<EnquiriesResponse | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), per_page: "20" });
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    apiFetch<EnquiriesResponse>(`/api/admin/enquiries?${params.toString()}`).then(setData);
  }, [q, status, page]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.per_page)) : 1;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-navy-900">Enquiries</h1>

      <div className="flex gap-3">
        <Input placeholder="Search reference, name, phone…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="flex-1" />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-48">
          <option value="">All statuses</option>
          {(["NEW", "CONTACTED", "QUOTED", "WON", "LOST", "ARCHIVED"] as const).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-hidden rounded-card-lg border border-border bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-bg-soft text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data?.enquiries?.map((enq) => (
              <tr key={enq.id} className="cursor-pointer hover:bg-bg-soft">
                <td className="px-4 py-2">
                  <Link href={`/admin/enquiries/${enq.id}`} className="font-medium text-navy-900 hover:underline">
                    {enq.reference}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  {enq.customerName}
                  <br />
                  <span className="text-xs text-muted">{enq.phone}</span>
                </td>
                <td className="px-4 py-2">₹{enq.grandTotal.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <Badge tone={STATUS_TONE[enq.status]}>{enq.status}</Badge>
                </td>
                <td className="px-4 py-2 text-xs text-muted">{new Date(enq.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
