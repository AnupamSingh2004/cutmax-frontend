"use client";

import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { useCartStore, cartTotals } from "@/lib/cart-store";

const GST_PERCENT = 18;

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const { subtotal } = cartTotals(items);
  const gst = subtotal * (GST_PERCENT / 100);
  const total = subtotal + gst;

  return (
    <Drawer open={open} onClose={onClose} title="Your Enquiry Bag">
      {items.length === 0 ? (
        <p className="text-[13.5px] leading-relaxed text-white/55">
          Add products from the catalogue to prepare an enquiry. Your requirement goes straight to our sales team on WhatsApp.
        </p>
      ) : (
        <div className="flex flex-col">
          <div className="mb-4 flex flex-col gap-3.5">
            {items.map((item) => (
              <div key={item.sku} className="flex items-start justify-between gap-2.5 border-b border-white/10 pb-3">
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] font-semibold">{item.name}</div>
                  <div className="text-xs text-white/55">
                    {item.qty} × ₹{item.unitPrice.toFixed(2)}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <button onClick={() => setQty(item.sku, item.qty - 1)} className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-white/10 text-sm font-bold hover:bg-white/20">−</button>
                    <span className="w-5 text-center text-xs font-bold">{item.qty}</span>
                    <button onClick={() => setQty(item.sku, item.qty + 1)} className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-white/10 text-sm font-bold hover:bg-white/20">+</button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.sku)} className="shrink-0 text-[13px] text-white/50 transition-colors hover:text-white">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mb-1.5 flex justify-between text-[13.5px] text-white/70">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="mb-3.5 flex justify-between text-[13.5px] text-white/70">
            <span>GST ({GST_PERCENT}%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          <div className="font-display mb-4.5 flex justify-between border-t border-white/15 pt-3.5 text-[17px] font-bold">
            <span>Grand Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <Link
            href="/checkout"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-[3px] bg-red-600 py-3.5 text-center text-[14.5px] font-bold text-white transition-colors hover:bg-red-700"
          >
            Proceed to Enquiry
          </Link>
        </div>
      )}
    </Drawer>
  );
}
