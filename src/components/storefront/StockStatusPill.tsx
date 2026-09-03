/**
 * The small chip in the top-right corner of a product image showing In
 * Stock / Low Stock / Out of Stock. Single source of truth for this --
 * ProductCard and the homepage's featured-products section both used to
 * compute this inline and neither handled the out-of-stock case, so a
 * sold-out product still showed a green "IN STOCK" chip.
 */
export function StockStatusPill({ stock, threshold, dense }: { stock: number; threshold: number; dense?: boolean }) {
  const status = stock <= 0 ? "out" : stock <= threshold ? "low" : "in";
  const color =
    status === "out" ? "var(--color-red-600)" : status === "low" ? "var(--color-orange-600)" : "var(--color-stock-in)";
  const label = status === "out" ? "OUT OF STOCK" : status === "low" ? "LOW STOCK" : "IN STOCK";

  return (
    <div
      className={
        dense
          ? "absolute right-3 top-3 flex items-center gap-1.5 rounded-[3px] bg-white/92 px-2.5 py-1 text-[10.5px] font-bold"
          : "absolute right-3 top-3 flex items-center gap-1.5 rounded-[3px] bg-white/92 px-3 py-1.5 text-[11px] font-bold"
      }
      style={{ color }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </div>
  );
}
