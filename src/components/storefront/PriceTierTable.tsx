import type { PriceTier } from "@/lib/types";

export function PriceTierTable({ tiers, basePrice }: { tiers: PriceTier[]; basePrice: number }) {
  if (tiers.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-card-sm border border-border">
      <table className="w-full text-sm">
        <thead className="bg-bg-soft text-left text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Discount</th>
            <th className="px-4 py-2">Price / unit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tiers.map((tier) => (
            <tr key={tier.id}>
              <td className="px-4 py-2 font-medium text-navy-900">{tier.label}</td>
              <td className="px-4 py-2 text-muted">{tier.discountPercent}%</td>
              <td className="px-4 py-2 font-semibold text-navy-900">
                ₹{(basePrice * (1 - tier.discountPercent / 100)).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
