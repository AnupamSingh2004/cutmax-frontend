export function KpiCard({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "warning" | "danger" }) {
  const toneClass = tone === "warning" ? "text-amber-700" : tone === "danger" ? "text-red-600" : "text-navy-900";
  return (
    <div className="rounded-card-lg border border-border bg-white p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}
