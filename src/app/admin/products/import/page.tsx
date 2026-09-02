"use client";

import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";

interface ProductImportResult {
  inserted: number;
  updated: number;
  skipped: number;
  errors: { row: number; sku?: string; error: string }[];
}

interface ImageImportResult {
  matched: { filename: string; sku: string }[];
  unmatched: string[];
  errors: { filename: string; error: string }[];
  summary: { total: number; matched: number; unmatched: number; errors: number };
}

interface StockImportResult {
  updated: number;
  created: number;
  skipped: number;
  createdProducts: { sku: string; name: string }[];
  errors: { row: number; name?: string; error: string }[];
}

export default function BulkImportPage() {
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productResult, setProductResult] = useState<ProductImportResult | null>(null);
  const [productBusy, setProductBusy] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [imageResult, setImageResult] = useState<ImageImportResult | null>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const [stockFile, setStockFile] = useState<File | null>(null);
  const [stockResult, setStockResult] = useState<StockImportResult | null>(null);
  const [stockBusy, setStockBusy] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  async function submitProducts(e: React.FormEvent) {
    e.preventDefault();
    if (!productFile) return;
    setProductBusy(true);
    setProductError(null);
    try {
      const fd = new FormData();
      fd.set("file", productFile);
      const res = await apiFetch<ProductImportResult>("/api/admin/bulk/products", { method: "POST", body: fd });
      setProductResult(res);
    } catch (err) {
      setProductError(err instanceof ApiError ? err.message : "Import failed");
    } finally {
      setProductBusy(false);
    }
  }

  async function submitImages(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFiles || imageFiles.length === 0) return;
    setImageBusy(true);
    setImageError(null);
    try {
      const fd = new FormData();
      Array.from(imageFiles).forEach((f) => fd.append("images", f));
      const res = await apiFetch<ImageImportResult>("/api/admin/bulk/images", { method: "POST", body: fd });
      setImageResult(res);
    } catch (err) {
      setImageError(err instanceof ApiError ? err.message : "Import failed");
    } finally {
      setImageBusy(false);
    }
  }

  async function submitStock(e: React.FormEvent) {
    e.preventDefault();
    if (!stockFile) return;
    setStockBusy(true);
    setStockError(null);
    try {
      const fd = new FormData();
      fd.set("file", stockFile);
      const res = await apiFetch<StockImportResult>("/api/admin/bulk/stock", { method: "POST", body: fd });
      setStockResult(res);
    } catch (err) {
      setStockError(err instanceof ApiError ? err.message : "Import failed");
    } finally {
      setStockBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-bold text-navy-900">Bulk Import</h1>

      <section className="rounded-card-lg border border-border bg-white p-6 shadow-card">
        <h2 className="mb-2 font-semibold text-navy-900">Import Stock Sheet (.xlsx)</h2>
        <p className="mb-4 text-sm text-muted">
          For real supplier/stock sheets that don&apos;t have a SKU column — just an item name, category, brand and
          quantity (any of Item/Name, Category, Sub-Category, Brand, Qty/Quantity/Stock, in any order or spelling).
          Rows are matched to existing products <strong>by name</strong>: a match updates its stock quantity only; a
          name that doesn&apos;t exist yet creates a new product with an auto-generated SKU.
        </p>
        <p className="mb-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-800">
          Newly created products start at price ₹0 and <strong>Inactive</strong> — fill in the price and upload an
          image (via Bulk Image Import below, or the product&apos;s edit page) before they&apos;ll appear on the
          storefront.
        </p>
        <form onSubmit={submitStock} className="flex items-center gap-3">
          <input type="file" accept=".xlsx" onChange={(e) => setStockFile(e.target.files?.[0] ?? null)} />
          <Button type="submit" disabled={!stockFile || stockBusy}>
            {stockBusy ? "Importing…" : "Import"}
          </Button>
        </form>
        {stockError && <p className="mt-3 text-sm text-red-600">{stockError}</p>}
        {stockResult && (
          <div className="mt-4 text-sm">
            <p>
              Stock updated: <strong>{stockResult.updated}</strong> · New products created:{" "}
              <strong>{stockResult.created}</strong> · Skipped (blank row): <strong>{stockResult.skipped}</strong>
            </p>
            {stockResult.createdProducts.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto rounded-lg bg-bg-soft p-3 text-xs">
                <p className="mb-1 font-semibold text-navy-900">New products needing a price + image:</p>
                {stockResult.createdProducts.map((p) => (
                  <p key={p.sku}>
                    {p.sku} — {p.name}
                  </p>
                ))}
              </div>
            )}
            {stockResult.errors.length > 0 && (
              <ul className="mt-2 max-h-48 overflow-y-auto rounded-lg bg-red-50 p-3 text-xs text-red-700">
                {stockResult.errors.map((e, i) => (
                  <li key={i}>
                    Row {e.row} ({e.name ?? "?"}): {e.error}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <section className="rounded-card-lg border border-border bg-white p-6 shadow-card">
        <h2 className="mb-2 font-semibold text-navy-900">Import Products (.xlsx)</h2>
        <p className="mb-4 text-sm text-muted">
          Columns: sku, name, category, subCategory, brand, description, price, stock, unit, imageUrl, featured.
          Existing SKUs are updated, new SKUs are created.
        </p>
        <p className="mb-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-800">
          Newly created products are imported as <strong>Inactive</strong> and won&apos;t appear on the storefront
          until you upload an image for them below (or add one from the product&apos;s edit page) — this prevents
          half-finished imports from going live with a placeholder image. Filter the product list by
          &quot;Inactive&quot; to see what still needs a photo.
        </p>
        <form onSubmit={submitProducts} className="flex items-center gap-3">
          <input type="file" accept=".xlsx" onChange={(e) => setProductFile(e.target.files?.[0] ?? null)} />
          <Button type="submit" disabled={!productFile || productBusy}>
            {productBusy ? "Importing…" : "Import"}
          </Button>
        </form>
        {productError && <p className="mt-3 text-sm text-red-600">{productError}</p>}
        {productResult && (
          <div className="mt-4 text-sm">
            <p>
              Inserted: <strong>{productResult.inserted}</strong> · Updated: <strong>{productResult.updated}</strong> · Skipped:{" "}
              <strong>{productResult.skipped}</strong>
            </p>
            {productResult.errors.length > 0 && (
              <ul className="mt-2 max-h-48 overflow-y-auto rounded-lg bg-red-50 p-3 text-xs text-red-700">
                {productResult.errors.map((e, i) => (
                  <li key={i}>
                    Row {e.row} ({e.sku ?? "?"}): {e.error}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <section className="rounded-card-lg border border-border bg-white p-6 shadow-card">
        <h2 className="mb-2 font-semibold text-navy-900">Bulk Image Import</h2>
        <p className="mb-4 text-sm text-muted">
          Upload multiple images at once — filenames are fuzzy-matched to product SKU or name.
        </p>
        <form onSubmit={submitImages} className="flex items-center gap-3">
          <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(e.target.files)} />
          <Button type="submit" disabled={!imageFiles || imageBusy}>
            {imageBusy ? "Uploading…" : "Upload"}
          </Button>
        </form>
        {imageError && <p className="mt-3 text-sm text-red-600">{imageError}</p>}
        {imageResult && (
          <div className="mt-4 text-sm">
            <p>
              Matched: <strong>{imageResult.summary.matched}</strong> · Unmatched:{" "}
              <strong>{imageResult.summary.unmatched}</strong> · Errors: <strong>{imageResult.summary.errors}</strong>
            </p>
            {imageResult.unmatched.length > 0 && (
              <p className="mt-2 text-xs text-muted">Unmatched: {imageResult.unmatched.join(", ")}</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
