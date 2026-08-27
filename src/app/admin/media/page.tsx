"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";
import type { MediaAsset } from "@/lib/types";
import { Button } from "@/components/ui/Button";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    setLoading(true);
    apiFetch<{ assets: MediaAsset[] }>("/api/admin/media")
      .then((res) => setAssets(res.assets))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      await apiFetch("/api/admin/media", { method: "POST", body: fd });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this asset? This can't be undone.")) return;
    await apiFetch(`/api/admin/media/${id}`, { method: "DELETE" });
    setAssets((a) => a.filter((x) => x.id !== id));
  }

  async function copyUrl(asset: MediaAsset) {
    await navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Media Library</h1>
          <p className="mt-1 text-sm text-muted">
            Images and video not tied to a specific product — e.g. the homepage hero/background video.
            Copy an asset&apos;s URL and paste it into Settings to use it on the site.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={upload}
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? "Uploading…" : "Upload File"}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : assets.length === 0 ? (
        <p className="rounded-card-lg border border-dashed border-border bg-white p-10 text-center text-sm text-muted">
          No media uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((asset) => (
            <div key={asset.id} className="overflow-hidden rounded-card-lg border border-border bg-white shadow-card">
              <div className="flex aspect-video items-center justify-center bg-bg-soft">
                {asset.kind === "IMAGE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset.url} alt={asset.filename} className="h-full w-full object-contain" />
                ) : (
                  <video src={asset.url} className="h-full w-full object-contain" muted controls />
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-navy-900" title={asset.filename}>
                  {asset.filename}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {asset.kind} · {formatSize(asset.sizeBytes)}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => copyUrl(asset)}
                    className="flex-1 rounded-md border border-border px-2 py-1.5 text-xs font-medium text-navy-900 hover:bg-bg-soft"
                  >
                    {copiedId === asset.id ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => remove(asset.id)}
                    className="rounded-md border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
