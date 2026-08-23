"use client";

import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useCartStore, cartTotals } from "@/lib/cart-store";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const { subtotal } = cartTotals(items);

  return (
    <Drawer open={open} onClose={onClose} title={`Enquiry Bag (${items.length})`}>
      {items.length === 0 ? (
        <p className="text-sm text-muted">Your bag is empty. Browse products to add items.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.sku} className="flex items-center justify-between gap-3 border-b border-border pb-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy-900">{item.name}</p>
                <p className="text-xs text-muted">
                  {item.sku} · ₹{item.unitPrice.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={item.qty}
                  onChange={(e) => setQty(item.sku, Math.max(0, Number(e.target.value)))}
                  className="w-16 rounded-lg border border-border px-2 py-1 text-sm"
                />
                <button onClick={() => removeItem(item.sku)} className="text-xs text-red-600 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2 text-base font-semibold text-navy-900">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted">GST calculated at checkout.</p>

          <Link href="/checkout" onClick={onClose}>
            <Button className="w-full" size="lg">
              Proceed to Enquiry
            </Button>
          </Link>
        </div>
      )}
    </Drawer>
  );
}
