"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { apiFetch } from "@/lib/api-client";
import { KpiCard } from "@/components/admin/KpiCard";

interface StatsResponse {
  kpis: {
    totalProducts: number;
    activeProducts: number;
    stockUnits: number;
    stockValue: number;
    totalEnquiries: number;
    newEnquiries: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
  stockBySubCategory: { subCategory: string; stock: number }[];
  stockStatus: { status: string; count: number; value: number }[];
  enquiriesOverTime: { date: string; count: number }[];
  enquiryStatusBreakdown: { status: string; count: number }[];
  topProducts: { sku: string; name: string; enquiryCount: number; totalQty: number }[];
}

const STOCK_STATUS_COLORS: Record<string, string> = {
  "In Stock": "#227a4b",
  "Low Stock": "#c97a0e",
  "Out of Stock": "#c71b20",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    apiFetch<StatsResponse>("/api/admin/stats").then(setStats);
  }, []);

  if (!stats) return <p className="text-muted">Loading dashboard…</p>;

  const { kpis } = stats;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total Products" value={String(kpis.totalProducts)} />
        <KpiCard label="Active Products" value={String(kpis.activeProducts)} />
        <KpiCard label="Stock Units" value={kpis.stockUnits.toLocaleString("en-IN")} />
        <KpiCard label="Stock Value" value={`₹${kpis.stockValue.toLocaleString("en-IN")}`} />
        <KpiCard label="Total Enquiries" value={String(kpis.totalEnquiries)} />
        <KpiCard label="New Enquiries" value={String(kpis.newEnquiries)} />
        <KpiCard label="Low Stock" value={String(kpis.lowStockCount)} tone="warning" />
        <KpiCard label="Out of Stock" value={String(kpis.outOfStockCount)} tone="danger" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-card-lg border border-border bg-white p-5 shadow-card">
          <h2 className="mb-4 text-sm font-semibold text-navy-900">Enquiries — Last 30 Days</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stats.enquiriesOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e4e8" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d: string) => d.slice(5)} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0c2050" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-card-lg border border-border bg-white p-5 shadow-card">
          <h2 className="mb-4 text-sm font-semibold text-navy-900">Stock by Sub-category</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.stockBySubCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e4e8" />
              <XAxis dataKey="subCategory" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="stock" fill="#0c2050" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-card-lg border border-border bg-white p-5 shadow-card">
          <h2 className="mb-4 text-sm font-semibold text-navy-900">Stock Status</h2>
          {stats.stockStatus.length === 0 ? (
            <div className="flex h-[240px] items-center justify-center text-sm text-muted">No active products yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={stats.stockStatus}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {stats.stockStatus.map((entry) => (
                    <Cell key={entry.status} fill={STOCK_STATUS_COLORS[entry.status] ?? "#68717b"} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, _name, item) => [`${value} products`, item.payload.status]} />
                <Legend verticalAlign="bottom" height={24} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-card-lg border border-border bg-white p-5 shadow-card">
          <h2 className="mb-4 text-sm font-semibold text-navy-900">Top Enquired Products</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {stats.topProducts.map((p) => (
              <li key={p.sku} className="flex items-center justify-between border-b border-border pb-2">
                <span className="truncate">{p.name}</span>
                <span className="font-semibold text-navy-900">{p.enquiryCount} enquiries</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
