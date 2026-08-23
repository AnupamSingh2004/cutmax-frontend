"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";
import type { PriceTier } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

const EMPTY_FORM = { label: "", minQty: "10", discountPercent: "5" };

export default function AdminPriceTiersPage() {
  const [tiers, setTiers] = useState<PriceTier[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  function load() {
    apiFetch<{ tiers: PriceTier[] }>("/api/admin/price-tiers").then((res) => setTiers(res.tiers));
  }

  useEffect(load, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch("/api/admin/price-tiers", {
        method: "POST",
        body: { label: form.label, minQty: Number(form.minQty), discountPercent: Number(form.discountPercent) },
      });
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create tier");
    }
  }

  async function toggleActive(tier: PriceTier) {
    await apiFetch(`/api/admin/price-tiers/${tier.id}`, { method: "PUT", body: { active: !tier.active } });
    load();
  }

  async function remove(tier: PriceTier) {
    if (!confirm(`Delete tier "${tier.label}"?`)) return;
    await apiFetch(`/api/admin/price-tiers/${tier.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-navy-900">Price Tiers</h1>

      <div className="overflow-hidden rounded-card-lg border border-border bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-bg-soft text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Label</th>
              <th className="px-4 py-3">Min Qty</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tiers.map((tier) => (
              <tr key={tier.id}>
                <td className="px-4 py-2 font-medium text-navy-900">{tier.label}</td>
                <td className="px-4 py-2">{tier.minQty}+</td>
                <td className="px-4 py-2">{tier.discountPercent}%</td>
                <td className="px-4 py-2">{tier.active ? <Badge tone="success">Active</Badge> : <Badge tone="neutral">Inactive</Badge>}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => toggleActive(tier)}>
                      {tier.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => remove(tier)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={create} className="flex max-w-xl flex-col gap-3 rounded-card-lg border border-border bg-white p-6 shadow-card">
        <h2 className="font-semibold text-navy-900">New Tier</h2>
        <Input label="Label" required value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Min Quantity"
            type="number"
            required
            value={form.minQty}
            onChange={(e) => setForm((f) => ({ ...f, minQty: e.target.value }))}
          />
          <Input
            label="Discount %"
            type="number"
            required
            value={form.discountPercent}
            onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value }))}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit">Add Tier</Button>
      </form>
    </div>
  );
}
