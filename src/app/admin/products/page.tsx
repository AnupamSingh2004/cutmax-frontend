"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { apiFetch, ApiError, uploadsUrl } from "@/lib/api-client";
import type { Product, PriceBreak } from "@/lib/types";
import { CATEGORY_NAMES, subCategoriesFor } from "@/lib/taxonomy";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  per_page: number;
}

interface ProductDetailResponse {
  product: Product;
  priceBreaks: PriceBreak[];
}

const DEFAULT_TIER_QTYS = [10, 50, 100, 500];

function defaultBreakRows(): BreakRow[] {
  return DEFAULT_TIER_QTYS.map((q) => ({ minQty: String(q), unitPrice: "" }));
}

type SpecRow = { label: string; value: string };

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
  lowStockThreshold: "",
};

type FormState = typeof EMPTY_FORM;

/** Live preview URL for a just-picked (not yet uploaded) file. */
function useObjectUrl(file: File | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return url;
}

const MATERIAL_OPTIONS = ["", "Carbide", "HSS"];

type BreakRow = { minQty: string; unitPrice: string };

function PriceBreaksEditor({ rows, onChange }: { rows: BreakRow[]; onChange: (rows: BreakRow[]) => void }) {
  function update(i: number, field: keyof BreakRow, value: string) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }
  function remove(i: number) {
    onChange(rows.filter((_, idx) => idx !== i));
  }
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-900">Volume pricing (optional)</label>
      <p className="mb-2 text-xs text-muted">
        The usual bulk quantities are pre-filled — just add a per-unit price next to the ones you want to offer.
        Leave a price blank to skip that tier; leave all of them blank to keep one price at any quantity.
      </p>
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              placeholder="Min qty"
              value={row.minQty}
              onChange={(e) => update(i, "minQty", e.target.value)}
              className="w-24 rounded-lg border border-border px-2 py-1.5 text-sm"
            />
            <span className="text-xs text-muted">units → ₹</span>
            <input
              type="number"
              min={0.01}
              step="0.01"
              placeholder="Unit price"
              value={row.unitPrice}
              onChange={(e) => update(i, "unitPrice", e.target.value)}
              className="w-28 rounded-lg border border-border px-2 py-1.5 text-sm"
            />
            <span className="text-xs text-muted">each</span>
            <button type="button" onClick={() => remove(i)} className="ml-auto text-xs font-semibold text-red-600 hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...rows, { minQty: "", unitPrice: "" }])}
        className="mt-2 text-xs font-semibold text-navy-700 hover:underline"
      >
        + Add price break
      </button>
    </div>
  );
}

function SpecificationsEditor({ rows, onChange }: { rows: SpecRow[]; onChange: (rows: SpecRow[]) => void }) {
  function update(i: number, field: keyof SpecRow, value: string) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }
  function remove(i: number) {
    onChange(rows.filter((_, idx) => idx !== i));
  }
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-900">Specifications (optional)</label>
      <p className="mb-2 text-xs text-muted">Extra spec-sheet rows shown on the product page, e.g. Coating, Flute Count, Shank Diameter.</p>
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              placeholder="Label (e.g. Coating)"
              value={row.label}
              onChange={(e) => update(i, "label", e.target.value)}
              className="w-40 rounded-lg border border-border px-2 py-1.5 text-sm"
            />
            <input
              placeholder="Value (e.g. TiAlN)"
              value={row.value}
              onChange={(e) => update(i, "value", e.target.value)}
              className="flex-1 rounded-lg border border-border px-2 py-1.5 text-sm"
            />
            <button type="button" onClick={() => remove(i)} className="text-xs font-semibold text-red-600 hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...rows, { label: "", value: "" }])}
        className="mt-2 text-xs font-semibold text-navy-700 hover:underline"
      >
        + Add specification
      </button>
    </div>
  );
}

/** Shared field set for both the create form and the full edit modal. */
function ProductFormFields({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  return (
    <>
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
      <Input label="Brand" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Price" type="number" required value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
        <Input label="Stock" type="number" required value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Unit" value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} />
        <Select label="Material" value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}>
          {MATERIAL_OPTIONS.map((m) => (
            <option key={m} value={m}>{m || "Not set"}</option>
          ))}
        </Select>
      </div>
      <Input label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
      <Input
        label="Low Stock Threshold (optional)"
        type="number"
        min={0}
        placeholder="Uses the site-wide default if left blank"
        value={form.lowStockThreshold}
        onChange={(e) => setForm((f) => ({ ...f, lowStockThreshold: e.target.value }))}
      />
    </>
  );
}

export default function AdminProductsPage() {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [edits, setEdits] = useState<Record<string, { price: string; stock: string; material: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formImage, setFormImage] = useState<File | null>(null);
  const formImagePreview = useObjectUrl(formImage);
  const [formBreaks, setFormBreaks] = useState<BreakRow[]>(defaultBreakRows());
  const [formSpecs, setFormSpecs] = useState<SpecRow[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);
  const [editImage, setEditImage] = useState<File | null>(null);
  const editImagePreview = useObjectUrl(editImage);
  const [editBreaks, setEditBreaks] = useState<BreakRow[]>([]);
  const [editSpecs, setEditSpecs] = useState<SpecRow[]>([]);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [materialFilter, setMaterialFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkActivating, setBulkActivating] = useState(false);
  const [selectingAllMatching, setSelectingAllMatching] = useState(false);

  function toggleSelected(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    const ids = data?.products?.map((p) => p.id) ?? [];
    setSelected((s) => (ids.every((id) => s.has(id)) && ids.length > 0 ? new Set() : new Set(ids)));
  }

  // Selects every product matching the current search/filters, not just the
  // ones on this page -- for bulk-activating or bulk-deleting a whole
  // imported batch (e.g. everything from one stock sheet) at once.
  async function selectAllMatching() {
    if (!data) return;
    setSelectingAllMatching(true);
    try {
      const params = new URLSearchParams({ page: "1", per_page: String(data.total), active: statusFilter });
      if (q) params.set("q", q);
      if (categoryFilter) params.set("category", categoryFilter);
      if (materialFilter) params.set("material", materialFilter);
      const res = await apiFetch<ProductsResponse>(`/api/admin/products?${params.toString()}`);
      setSelected(new Set(res.products.map((p) => p.id)));
    } finally {
      setSelectingAllMatching(false);
    }
  }

  const load = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), per_page: "50", active: statusFilter });
    if (q) params.set("q", q);
    if (categoryFilter) params.set("category", categoryFilter);
    if (materialFilter) params.set("material", materialFilter);
    apiFetch<ProductsResponse>(`/api/admin/products?${params.toString()}`).then(setData);
  }, [page, q, categoryFilter, materialFilter, statusFilter]);

  useEffect(load, [load]);
  useEffect(() => setSelected(new Set()), [page, q, categoryFilter, materialFilter, statusFilter]);

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
    try {
      await apiFetch(`/api/admin/products/${p.id}`, { method: p.active ? "DELETE" : "PUT", body: p.active ? undefined : { active: true } });
      load();
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Failed to update product");
    }
  }

  async function deleteProduct(p: Product) {
    if (!window.confirm(`Permanently delete "${p.name}" (${p.sku})? This cannot be undone — its image will also be removed. Use Deactivate instead if you just want to hide it.`)) return;
    await apiFetch(`/api/admin/products/${p.id}?permanent=true`, { method: "DELETE" });
    load();
  }

  async function activateSelected() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (!window.confirm(`Activate ${ids.length} selected product${ids.length > 1 ? "s" : ""}? Any without a price and an image will be skipped.`)) return;
    setBulkActivating(true);
    try {
      const res = await apiFetch<{ activated: number; skipped: { sku: string; reason: string }[] }>(
        "/api/admin/products/bulk-activate",
        { method: "POST", body: { ids } },
      );
      setSelected(new Set());
      load();
      if (res.skipped.length > 0) {
        window.alert(
          `Activated ${res.activated}. Skipped ${res.skipped.length}:\n` +
            res.skipped.map((s) => `${s.sku}: ${s.reason}`).join("\n"),
        );
      }
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Failed to activate selected products");
    } finally {
      setBulkActivating(false);
    }
  }

  async function deleteSelected() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (!window.confirm(`Permanently delete ${ids.length} selected product${ids.length > 1 ? "s" : ""}? This cannot be undone — their images will also be removed.`)) return;
    if (!window.confirm("This is your last chance to back out. Delete them now?")) return;
    setBulkDeleting(true);
    try {
      await apiFetch<{ deleted: number; requested: number }>("/api/admin/products/bulk-delete", { method: "POST", body: { ids } });
      setSelected(new Set());
      load();
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Failed to delete selected products");
    } finally {
      setBulkDeleting(false);
    }
  }

  async function uploadImage(p: Product, file: File) {
    const fd = new FormData();
    fd.set("sku", p.sku);
    fd.set("image", file);
    await apiFetch(`/api/admin/uploads`, { method: "POST", body: fd });
    load();
  }

  async function removeEditProductImage() {
    if (!editProduct) return;
    if (!window.confirm("Remove this product's image? It will also deactivate the product until a new image is uploaded.")) return;
    await apiFetch(`/api/admin/products/${editProduct.id}`, { method: "PUT", body: { removeImage: true } });
    setEditProduct((p) => (p ? { ...p, imageUrl: null } : p));
    setEditImage(null);
    load();
  }

  // De-dupes by minQty (last one wins), drops rows with no qty, and — the
  // one hard rule — never saves a price break at ₹0 or less, since that
  // would silently make bulk orders free instead of just "not set".
  function validBreaks(rows: BreakRow[]) {
    const byQty = new Map<number, number>();
    for (const r of rows) {
      const minQty = Math.floor(Number(r.minQty));
      const unitPrice = Number(r.unitPrice);
      if (!Number.isFinite(minQty) || minQty <= 0) continue;
      if (!Number.isFinite(unitPrice) || unitPrice <= 0) continue;
      byQty.set(minQty, unitPrice);
    }
    return Array.from(byQty.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([minQty, unitPrice]) => ({ minQty, unitPrice }));
  }

  function validSpecs(rows: SpecRow[]) {
    return rows
      .map((r) => ({ label: r.label.trim(), value: r.value.trim() }))
      .filter((r) => r.label !== "" && r.value !== "");
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.sku.trim() || !form.name.trim()) {
      setFormError("SKU and name are required.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setFormError("Price must be greater than zero.");
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      setFormError("Stock can't be negative.");
      return;
    }

    setCreating(true);
    try {
      const res = await apiFetch<{ product: { id: string; sku: string } }>("/api/admin/products", {
        method: "POST",
        body: {
          ...form,
          price,
          stock,
          specifications: validSpecs(formSpecs),
          lowStockThreshold: form.lowStockThreshold.trim() === "" ? null : Number(form.lowStockThreshold),
        },
      });

      // New products always start Inactive (see backend) so a half-finished
      // one can't go live with no photo. If a photo was provided right here,
      // there's nothing left blocking it, so activate it immediately instead
      // of making the admin do a separate Activate click for no reason.
      if (formImage) {
        const fd = new FormData();
        fd.set("sku", res.product.sku);
        fd.set("image", formImage);
        await apiFetch(`/api/admin/uploads`, { method: "POST", body: fd });
        await apiFetch(`/api/admin/products/${res.product.id}`, { method: "PUT", body: { active: true } });
      }

      const breaks = validBreaks(formBreaks);
      if (breaks.length > 0) {
        await apiFetch(`/api/admin/products/${res.product.id}/price-breaks`, { method: "PUT", body: { breaks } });
      }

      setCreateOpen(false);
      setForm(EMPTY_FORM);
      setFormImage(null);
      setFormBreaks(defaultBreakRows());
      setFormSpecs([]);
      load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to create product");
    } finally {
      setCreating(false);
    }
  }

  async function openEdit(p: Product) {
    setEditProduct(p);
    setEditError(null);
    setEditImage(null);
    setEditForm({
      sku: p.sku,
      name: p.name,
      category: p.category,
      subCategory: p.subCategory,
      brand: p.brand,
      description: p.description,
      price: String(p.price),
      stock: String(p.stock),
      unit: p.unit,
      material: p.material ?? "",
      lowStockThreshold: p.lowStockThreshold != null ? String(p.lowStockThreshold) : "",
    });
    setEditSpecs([]);
    setEditBreaks(defaultBreakRows());

    const res = await apiFetch<ProductDetailResponse>(`/api/admin/products?id=${p.id}`);
    const specs: SpecRow[] = Array.isArray(res.product.specifications) ? res.product.specifications : [];
    setEditSpecs(specs);
    if (res.priceBreaks && res.priceBreaks.length > 0) {
      setEditBreaks(res.priceBreaks.map((b) => ({ minQty: String(b.minQty), unitPrice: String(b.unitPrice) })));
    }
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editProduct) return;
    setEditError(null);

    const price = Number(editForm.price);
    const stock = Number(editForm.stock);
    if (!editForm.sku.trim() || !editForm.name.trim()) {
      setEditError("SKU and name are required.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setEditError("Price must be greater than zero.");
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      setEditError("Stock can't be negative.");
      return;
    }

    setEditSaving(true);
    try {
      await apiFetch(`/api/admin/products/${editProduct.id}`, {
        method: "PUT",
        body: {
          ...editForm,
          price,
          stock,
          specifications: validSpecs(editSpecs),
          lowStockThreshold: editForm.lowStockThreshold.trim() === "" ? null : Number(editForm.lowStockThreshold),
        },
      });

      if (editImage) {
        const fd = new FormData();
        fd.set("sku", editForm.sku);
        fd.set("image", editImage);
        await apiFetch(`/api/admin/uploads`, { method: "POST", body: fd });
      }

      await apiFetch(`/api/admin/products/${editProduct.id}/price-breaks`, { method: "PUT", body: { breaks: validBreaks(editBreaks) } });

      setEditProduct(null);
      load();
    } catch (err) {
      setEditError(err instanceof ApiError ? err.message : "Failed to save changes");
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex shrink-0 items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">Products</h1>
        <div className="flex gap-3">
          {selected.size > 0 && (
            <>
              <Button variant="secondary" disabled={bulkActivating} onClick={activateSelected}>
                {bulkActivating ? "Activating…" : `Activate Selected (${selected.size})`}
              </Button>
              <Button variant="danger" disabled={bulkDeleting} onClick={deleteSelected}>
                {bulkDeleting ? "Deleting…" : `Delete Selected (${selected.size})`}
              </Button>
            </>
          )}
          <Link href="/admin/products/import">
            <Button variant="secondary">Bulk Import</Button>
          </Link>
          <Button onClick={() => setCreateOpen(true)}>New Product</Button>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-3">
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="Search by name or SKU…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-border px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {CATEGORY_NAMES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={materialFilter}
          onChange={(e) => { setMaterialFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-border px-3 py-2 text-sm"
        >
          <option value="">All Materials</option>
          {MATERIAL_OPTIONS.filter((m) => m).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-border px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {data && data.products.length > 0 && data.products.every((p) => selected.has(p.id)) && data.total > data.products.length && (
        <div className="-mt-2 flex shrink-0 items-center gap-2 rounded-lg bg-bg-soft px-4 py-2 text-sm text-muted">
          {selected.size === data.total ? (
            <span>All {data.total} products matching the current filters are selected.</span>
          ) : (
            <>
              <span>All {data.products.length} products on this page are selected.</span>
              <button
                type="button"
                className="font-semibold text-navy-900 underline disabled:opacity-50"
                disabled={selectingAllMatching}
                onClick={selectAllMatching}
              >
                {selectingAllMatching ? "Selecting…" : `Select all ${data.total} matching filters`}
              </button>
            </>
          )}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-auto rounded-card-lg border border-border bg-white shadow-card">
        <table className="w-full min-w-[960px] text-sm">
          <thead className="sticky top-0 z-10 bg-bg-soft text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={(data?.products?.length ?? 0) > 0 && data!.products.every((p) => selected.has(p.id))}
                  onChange={toggleSelectAll}
                  aria-label="Select all products on this page"
                />
              </th>
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
            {data?.products?.map((p) => {
              const edit = editValue(p);
              const dirty = edit.price !== String(p.price) || edit.stock !== String(p.stock) || edit.material !== (p.material ?? "");
              return (
                <tr key={p.id} className={selected.has(p.id) ? "bg-red-600/5" : ""}>
                  <td className="px-4 py-2">
                    <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelected(p.id)} aria-label={`Select ${p.sku}`} />
                  </td>
                  <td className="px-4 py-2">
                    <label className="relative block h-12 w-12 cursor-pointer overflow-hidden rounded-lg border border-border bg-bg-soft">
                      {p.imageUrl && (
                        // Plain <img>, not next/image: these are tiny 48px admin
                        // thumbnails served straight from excloud, and next/image's
                        // optimizer needs that host allow-listed at build time via
                        // NEXT_PUBLIC_R2_PUBLIC_BASE_URL, which silently 400s them
                        // (blank squares) if unset.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={uploadsUrl(p.imageUrl)} alt={p.name} className="absolute inset-0 h-full w-full object-cover" />
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
                    <p className="text-xs text-heading">{p.name}</p>
                  </td>
                  <td className="px-4 py-2 text-xs text-heading">
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
                    <div className="grid w-[180px] grid-cols-2 gap-2">
                      {dirty && (
                        <Button size="sm" disabled={savingId === p.id} onClick={() => saveRow(p)}>
                          Save
                        </Button>
                      )}
                      <Button size="sm" variant="secondary" onClick={() => openEdit(p)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => toggleActive(p)}>
                        {p.active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => deleteProduct(p)}>
                        Delete
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
        <div className="shrink-0 -mt-4">
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(data.total / data.per_page))} onChange={setPage} />
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Product">
        <form onSubmit={createProduct} className="flex flex-col gap-3">
          <ProductFormFields form={form} setForm={setForm} />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-900">Product image</label>
            {formImagePreview && (
              <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-lg border border-border bg-bg-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formImagePreview} alt="Selected preview" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormImage(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-bg-soft file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-navy-900"
            />
          </div>

          <SpecificationsEditor rows={formSpecs} onChange={setFormSpecs} />
          <PriceBreaksEditor rows={formBreaks} onChange={setFormBreaks} />

          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <Button type="submit" disabled={creating}>{creating ? "Creating…" : "Create Product"}</Button>
        </form>
      </Modal>

      <Modal open={!!editProduct} onClose={() => setEditProduct(null)} title={`Edit — ${editProduct?.name ?? ""}`}>
        <form onSubmit={saveEdit} className="flex flex-col gap-3">
          <ProductFormFields form={editForm} setForm={setEditForm} />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-900">Replace product image</label>
            {(editImagePreview || editProduct?.imageUrl) && (
              <div className="mb-2 flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-bg-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editImagePreview ?? uploadsUrl(editProduct!.imageUrl!)}
                    alt={editProduct?.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                {!editImagePreview && editProduct?.imageUrl && (
                  <Button type="button" size="sm" variant="danger" onClick={removeEditProductImage}>
                    Remove Image
                  </Button>
                )}
              </div>
            )}
            {editImagePreview && <p className="mb-2 text-xs text-muted">New image selected — click Save Changes below to upload it.</p>}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditImage(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-bg-soft file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-navy-900"
            />
          </div>

          <SpecificationsEditor rows={editSpecs} onChange={setEditSpecs} />
          <PriceBreaksEditor rows={editBreaks} onChange={setEditBreaks} />

          {editError && <p className="text-sm text-red-600">{editError}</p>}
          <Button type="submit" disabled={editSaving}>{editSaving ? "Saving…" : "Save Changes"}</Button>
        </form>
      </Modal>
    </div>
  );
}
