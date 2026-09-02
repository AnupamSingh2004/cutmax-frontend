"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";

interface AuditLogEntry {
  id: string;
  action: string;
  detail: string | null;
  status: "OK" | "FAILED" | "BLOCKED" | "LOCKED" | "FAIL";
  ip: string | null;
  createdAt: string;
  adminEmail: string | null;
}

interface AuditLogResponse {
  logs: AuditLogEntry[];
  total: number;
  page: number;
  per_page: number;
}

export default function AdminAuditLogPage() {
  const [data, setData] = useState<AuditLogResponse | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    apiFetch<AuditLogResponse>(`/api/admin/audit?page=${page}&per_page=50`).then(setData);
  }, [page]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.per_page)) : 1;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-navy-900">Audit Log</h1>

      <div className="overflow-hidden rounded-card-lg border border-border bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-bg-soft text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Detail</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">IP</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data?.logs?.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-2 font-medium text-navy-900">{log.action}</td>
                <td className="px-4 py-2 text-muted">{log.detail ?? "-"}</td>
                <td className="px-4 py-2 text-muted">{log.adminEmail ?? "-"}</td>
                <td className="px-4 py-2">
                  <Badge tone={log.status === "OK" ? "success" : log.status === "LOCKED" || log.status === "BLOCKED" ? "warning" : "danger"}>
                    {log.status}
                  </Badge>
                </td>
                <td className="px-4 py-2 text-xs text-muted">{log.ip ?? "-"}</td>
                <td className="px-4 py-2 text-xs text-muted">{new Date(log.createdAt).toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
