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

export default function BulkImportPage() {
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productResult, setProductResult] = useState<ProductImportResult | null>(null);
  const [productBusy, setProductBusy] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [imageResult, setImageResult] = useState<ImageImportResult | null>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-bold text-navy-900">Bulk Import</h1>

      <section className="rounded-card-lg border border-border bg-white p-6 shadow-card">
        <h2 className="mb-2 font-semibold text-navy-900">Import Products (.xlsx)</h2>
        <p className="mb-4 text-sm text-muted">
          Columns: sku, name, category, subCategory, brand, description, price, stock, unit, imageUrl, featured.
          Existing SKUs are updated, new SKUs are created.
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
