"use client";

import { use, useEffect, useState } from "react";
import { API_BASE, apiFetch } from "@/lib/api-client";
import type { Enquiry, EnquiryStatus } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const STATUS_TONE: Record<EnquiryStatus, "success" | "warning" | "danger" | "neutral"> = {
  NEW: "neutral",
  CONTACTED: "warning",
  QUOTED: "warning",
  WON: "success",
  LOST: "danger",
  ARCHIVED: "neutral",
};

export default function AdminEnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);

  function load() {
    apiFetch<{ enquiry: Enquiry }>(`/api/admin/enquiries/${id}`).then((res) => setEnquiry(res.enquiry));
  }

  useEffect(load, [id]);

  async function updateStatus(status: EnquiryStatus) {
    await apiFetch(`/api/admin/enquiries/${id}`, { method: "PUT", body: { status } });
    load();
  }

  if (!enquiry) return <p className="text-muted">Loading…</p>;

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{enquiry.reference}</h1>
          <p className="text-sm text-muted">{new Date(enquiry.createdAt).toLocaleString("en-IN")}</p>
        </div>
        <Badge tone={STATUS_TONE[enquiry.status]}>{enquiry.status}</Badge>
      </div>

      <div className="rounded-card-lg border border-border bg-white p-6 shadow-card">
        <h2 className="mb-3 font-semibold text-navy-900">Customer</h2>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted">
          <p>Name: {enquiry.customerName}</p>
          <p>Company: {enquiry.company ?? "-"}</p>
          <p>Phone: {enquiry.phone}</p>
          <p>Email: {enquiry.email ?? "-"}</p>
          <p>GSTIN: {enquiry.gstin ?? "-"}</p>
          <p>Shipping: {enquiry.shippingMethod ?? "-"}</p>
        </div>
      </div>

      <div className="rounded-card-lg border border-border bg-white p-6 shadow-card">
        <h2 className="mb-3 font-semibold text-navy-900">Items</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-muted">
            <tr>
              <th className="py-1">SKU</th>
              <th className="py-1">Name</th>
              <th className="py-1">Qty</th>
              <th className="py-1">Unit Price</th>
              <th className="py-1">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {enquiry.items.map((item, i) => (
              <tr key={i}>
                <td className="py-2">{item.sku}</td>
                <td className="py-2">{item.name}</td>
                <td className="py-2">{item.qty}</td>
                <td className="py-2">₹{item.unitPrice.toFixed(2)}</td>
                <td className="py-2">₹{item.lineTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex flex-col items-end gap-1 text-sm">
          <p>Subtotal: ₹{enquiry.subtotal.toFixed(2)}</p>
          <p>GST ({enquiry.gstRate}%): ₹{enquiry.gstAmount.toFixed(2)}</p>
          <p className="text-base font-bold text-navy-900">Grand Total: ₹{enquiry.grandTotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-card-lg border border-border bg-white p-6 shadow-card">
        <Select value={enquiry.status} onChange={(e) => updateStatus(e.target.value as EnquiryStatus)} className="w-48">
          {(["NEW", "CONTACTED", "QUOTED", "WON", "LOST", "ARCHIVED"] as const).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <a href={`${API_BASE}/api/admin/enquiries/${id}/pdf`} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary">View Quote PDF</Button>
        </a>
        <a href={`${API_BASE}/api/admin/enquiries/${id}/pdf?download=1`}>
          <Button variant="secondary">Download PDF</Button>
        </a>
      </div>
    </div>
  );
}
