"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore, cartTotals } from "@/lib/cart-store";
import { apiFetch, ApiError } from "@/lib/api-client";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const GST_RATE = 18;
const WHATSAPP_NUMBER = "918856828894";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const { subtotal } = cartTotals(items);
  const gstAmount = Math.round(subtotal * (GST_RATE / 100) * 100) / 100;
  const grandTotal = subtotal + gstAmount;

  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", gstin: "", shipping: "Standard", payment: "Advance", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await apiFetch<{ reference: string }>("/api/public/enquiries", {
        method: "POST",
        body: {
          ...form,
          items: items.map((i) => ({ sku: i.sku, name: i.name, category: i.category, qty: i.qty, unitPrice: i.unitPrice, lineTotal: i.unitPrice * i.qty })),
          subtotal,
          gstRate: GST_RATE,
          gstAmount,
          grandTotal,
        },
      });

      setReference(res.reference);

      const lines = items.map((i) => `- ${i.name} (${i.sku}) x${i.qty} = ₹${(i.unitPrice * i.qty).toFixed(2)}`).join("\n");
      const message = encodeURIComponent(
        `New Enquiry ${res.reference}\nName: ${form.name}\nCompany: ${form.company || "-"}\nPhone: ${form.phone}\n\nItems:\n${lines}\n\nSubtotal: ₹${subtotal.toFixed(2)}\nGST (${GST_RATE}%): ₹${gstAmount.toFixed(2)}\nGrand Total: ₹${grandTotal.toFixed(2)}`,
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
      clear();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-heading">Enquiry submitted!</h1>
        <p className="mt-3 text-muted">
          Your reference is <span className="font-semibold text-heading">{reference}</span>. We&apos;ve opened WhatsApp so you
          can send it directly to our sales team.
        </p>
        <Button className="mt-6" onClick={() => router.push("/products")}>
          Continue shopping
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-heading">Your bag is empty</h1>
        <Button className="mt-6" onClick={() => router.push("/products")}>
          Browse products
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-heading">Checkout</h1>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form onSubmit={submit} className="flex flex-col gap-4 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full name *" required value={form.name} onChange={(e) => set("name", e.target.value)} />
            <Input label="Company" value={form.company} onChange={(e) => set("company", e.target.value)} />
            <Input label="Phone *" required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            <Input label="GSTIN" value={form.gstin} onChange={(e) => set("gstin", e.target.value.toUpperCase())} />
            <Select label="Shipping method" value={form.shipping} onChange={(e) => set("shipping", e.target.value)}>
              <option>Standard</option>
              <option>Express</option>
              <option>Self Pickup</option>
            </Select>
            <Select label="Payment preference" value={form.payment} onChange={(e) => set("payment", e.target.value)}>
              <option>Advance</option>
              <option>Against Delivery</option>
              <option>Credit Terms</option>
            </Select>
          </div>
          <Textarea label="Message" value={form.message} onChange={(e) => set("message", e.target.value)} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Enquiry"}
          </Button>
        </form>

        <div className="rounded-card-lg border border-border bg-surface p-5 shadow-card">
          <h2 className="mb-4 font-semibold text-heading">Order Summary</h2>
          <div className="flex flex-col gap-2 text-sm">
            {items.map((i) => (
              <div key={i.sku} className="flex justify-between text-muted">
                <span>
                  {i.name} × {i.qty}
                </span>
                <span>₹{(i.unitPrice * i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>GST ({GST_RATE}%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-heading">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
