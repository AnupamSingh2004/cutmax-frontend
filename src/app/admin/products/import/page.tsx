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
  warnings: { row: number; name?: string; sku?: string; field: string; value: string; message: string }[];
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
        <p className="mb-3 text-sm text-muted">
          Accepts real supplier/stock sheets as-is — headers can be in any order, any casing, and any of the spelling
          variants below. Rows are matched to an existing product first by <strong>SKU</strong> (if that column is
          present and filled in), otherwise <strong>by name</strong>. A match updates only the columns your sheet
          actually has — a column you leave out of the file is left untouched on existing products. A name/SKU that
          doesn&apos;t exist yet creates a new product.
        </p>
        <div className="mb-3 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="bg-bg-soft text-left">
              <tr>
                <th className="px-3 py-2">Field</th>
                <th className="px-3 py-2">Accepted header names</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-3 py-1.5 font-medium">Name</td><td className="px-3 py-1.5 text-muted">Item, Name, Product, Item Name</td></tr>
              <tr><td className="px-3 py-1.5 font-medium">SKU (optional)</td><td className="px-3 py-1.5 text-muted">SKU, Code, Item Code — auto-generated if omitted</td></tr>
              <tr><td className="px-3 py-1.5 font-medium">Category</td><td className="px-3 py-1.5 text-muted">Category, Cotegry, Cat</td></tr>
              <tr><td className="px-3 py-1.5 font-medium">Sub-Category</td><td className="px-3 py-1.5 text-muted">Sub-Category, Sub-Cotegry, Subcat</td></tr>
              <tr><td className="px-3 py-1.5 font-medium">Brand</td><td className="px-3 py-1.5 text-muted">Brand, Make</td></tr>
              <tr><td className="px-3 py-1.5 font-medium">Material (optional)</td><td className="px-3 py-1.5 text-muted">Material, Grade</td></tr>
              <tr><td className="px-3 py-1.5 font-medium">Description (optional)</td><td className="px-3 py-1.5 text-muted">Description, Desc</td></tr>
              <tr><td className="px-3 py-1.5 font-medium">Price</td><td className="px-3 py-1.5 text-muted">Price, Rate, Unit Price, MRP</td></tr>
              <tr><td className="px-3 py-1.5 font-medium">Stock / Qty</td><td className="px-3 py-1.5 text-muted">Qty, Quantity, Stock</td></tr>
              <tr><td className="px-3 py-1.5 font-medium">Unit (optional)</td><td className="px-3 py-1.5 text-muted">Unit, UOM — defaults to NOS</td></tr>
              <tr><td className="px-3 py-1.5 font-medium">Featured (optional)</td><td className="px-3 py-1.5 text-muted">Featured — TRUE/YES/1</td></tr>
              <tr><td className="px-3 py-1.5 font-medium">Sort order (optional)</td><td className="px-3 py-1.5 text-muted">Sort Order, Order, Position</td></tr>
              <tr><td className="px-3 py-1.5 font-medium">Low stock threshold (optional)</td><td className="px-3 py-1.5 text-muted">Low Stock Threshold, Low Stock, Reorder Level</td></tr>
              <tr><td className="px-3 py-1.5 font-medium">Specifications (optional)</td><td className="px-3 py-1.5 text-muted">Specifications, Specs — one cell as &quot;Label: Value | Label2: Value2&quot;</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mb-4 text-xs text-muted">
          Not included: product images — those still go through Bulk Image Import below, matched by filename.
        </p>
        <p className="mb-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-800">
          Newly created products start <strong>Inactive</strong> (and at ₹0 if no price column) — fill in the price
          and upload an image (via Bulk Image Import below, or the product&apos;s edit page) before they&apos;ll
          appear on the storefront.
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
            {stockResult.warnings.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto rounded-lg bg-orange-50 p-3 text-xs text-orange-800">
                <p className="mb-1 font-semibold">Imported, but worth double-checking:</p>
                {stockResult.warnings.map((wobj, i) => (
                  <p key={i}>
                    Row {wobj.row} ({wobj.sku || wobj.name || "?"}): {wobj.message} — got &quot;{wobj.value}&quot;
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
