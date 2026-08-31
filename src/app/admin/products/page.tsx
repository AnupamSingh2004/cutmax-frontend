"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiError, uploadsUrl } from "@/lib/api-client";
import type { Product } from "@/lib/types";
import { CATEGORY_NAMES, subCategoriesFor } from "@/lib/taxonomy";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  per_page: number;
}

const EMPTY_FORM = {
  sku: "",
  name: "",
  category: CATEGORY_NAMES[0]!,
  subCategory: subCategoriesFor(CATEGORY_NAMES[0]!)[0] ?? "",
  brand: "CUT-STOCK",
  description: "",
  price: "0",
  stock: "0",
  unit: "NOS",
  material: "",
};

const MATERIAL_OPTIONS = ["", "Carbide", "HSS"];

export default function AdminProductsPage() {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [edits, setEdits] = useState<Record<string, { price: string; stock: string; material: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), per_page: "50", active: "all" });
    if (q) params.set("q", q);
    apiFetch<ProductsResponse>(`/api/admin/products?${params.toString()}`).then(setData);
  }, [page, q]);

  useEffect(load, [load]);

  function editValue(p: Product) {
    return edits[p.id] ?? { price: String(p.price), stock: String(p.stock), material: p.material ?? "" };
  }

  function setEdit(id: string, field: "price" | "stock" | "material", value: string) {
    setEdits((e) => ({ ...e, [id]: { ...editValue({ id } as Product), ...e[id], [field]: value } }));
  }

  async function saveRow(p: Product) {
    const edit = editValue(p);
    setSavingId(p.id);
    try {
      await apiFetch(`/api/admin/products/${p.id}`, {
        method: "PUT",
        body: { price: Number(edit.price), stock: Number(edit.stock), material: edit.material },
      });
      load();
    } finally {
      setSavingId(null);
    }
  }

  async function toggleActive(p: Product) {
    await apiFetch(`/api/admin/products/${p.id}`, { method: p.active ? "DELETE" : "PUT", body: p.active ? undefined : { active: true } });
    load();
  }

  async function uploadImage(p: Product, file: File) {
    const fd = new FormData();
    fd.set("sku", p.sku);
    fd.set("image", file);
    await apiFetch(`/api/admin/uploads`, { method: "POST", body: fd });
    load();
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      await apiFetch("/api/admin/products", {
        method: "POST",
        body: { ...form, price: Number(form.price), stock: Number(form.stock) },
      });
      setCreateOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to create product");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">Products</h1>
        <div className="flex gap-3">
          <Link href="/admin/products/import">
            <Button variant="secondary">Bulk Import</Button>
          </Link>
          <Button onClick={() => setCreateOpen(true)}>New Product</Button>
        </div>
      </div>

      <Input placeholder="Search by name or SKU…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />

      <div className="overflow-x-auto rounded-card-lg border border-border bg-white shadow-card">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-bg-soft text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">SKU / Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Material</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data?.products.map((p) => {
              const edit = editValue(p);
              const dirty = edit.price !== String(p.price) || edit.stock !== String(p.stock) || edit.material !== (p.material ?? "");
              return (
                <tr key={p.id}>
                  <td className="px-4 py-2">
                    <label className="relative block h-12 w-12 cursor-pointer overflow-hidden rounded-lg border border-border bg-bg-soft">
                      {p.imageUrl && (
                        <Image src={uploadsUrl(p.imageUrl)} alt={p.name} fill sizes="48px" className="object-cover" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && uploadImage(p, e.target.files[0])}
                      />
                    </label>
                  </td>
                  <td className="px-4 py-2">
                    <p className="font-medium text-navy-900">{p.sku}</p>
                    <p className="text-xs text-muted">{p.name}</p>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted">
                    {p.category}
                    <br />
                    {p.subCategory}
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={edit.price}
                      onChange={(e) => setEdit(p.id, "price", e.target.value)}
                      className="w-24 rounded-lg border border-border px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={edit.stock}
                      onChange={(e) => setEdit(p.id, "stock", e.target.value)}
                      className="w-20 rounded-lg border border-border px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={edit.material}
                      onChange={(e) => setEdit(p.id, "material", e.target.value)}
                      className="rounded-lg border border-border px-2 py-1"
                    >
                      {MATERIAL_OPTIONS.map((m) => (
                        <option key={m} value={m}>{m || "—"}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">{p.active ? <Badge tone="success">Active</Badge> : <Badge tone="danger">Inactive</Badge>}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      {dirty && (
                        <Button size="sm" disabled={savingId === p.id} onClick={() => saveRow(p)}>
                          Save
                        </Button>
                      )}
                      <Button size="sm" variant="secondary" onClick={() => toggleActive(p)}>
                        {p.active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted">
            Page {data.page} of {Math.max(1, Math.ceil(data.total / data.per_page))}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= Math.ceil(data.total / data.per_page)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Product">
        <form onSubmit={createProduct} className="flex flex-col gap-3">
          <Input label="SKU" required value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} />
          <Input label="Name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value, subCategory: subCategoriesFor(e.target.value)[0] ?? "" }))}
          >
            {CATEGORY_NAMES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select label="Sub-category" value={form.subCategory} onChange={(e) => setForm((f) => ({ ...f, subCategory: e.target.value }))}>
            {subCategoriesFor(form.category).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price" type="number" required value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            <Input label="Stock" type="number" required value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
          </div>
          <Select label="Material" value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}>
            {MATERIAL_OPTIONS.map((m) => (
              <option key={m} value={m}>{m || "Not set"}</option>
            ))}
          </Select>
          <Input label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <Button type="submit">Create Product</Button>
        </form>
      </Modal>
    </div>
  );
}
