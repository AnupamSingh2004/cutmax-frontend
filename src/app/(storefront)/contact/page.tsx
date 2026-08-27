"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PageHeading } from "@/components/ui/PageHeading";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await apiFetch("/api/public/subscribe", { method: "POST", body: { email } });
      setStatus("sent");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <PageHeading level="h1" eyebrow="Get In Touch" title="Contact Us" />
      <div className="mt-6 grid grid-cols-1 gap-2 text-muted sm:grid-cols-2">
        <p>Plot 12, Industrial Estate, Pune, Maharashtra, India</p>
        <p>GSTIN: 27ABCDE1234F1Z5</p>
        <p>+91 99999 99999</p>
        <p>sales@cutmaxtech.com</p>
      </div>

      <div className="mt-12 rounded-card-lg border border-border bg-white p-6 shadow-card">
        <h2 className="mb-3 font-semibold text-navy-900">Subscribe for updates</h2>
        <form onSubmit={subscribe} className="flex gap-3">
          <Input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Subscribing…" : "Subscribe"}
          </Button>
        </form>
        {status === "sent" && <p className="mt-2 text-sm text-emerald-700">Subscribed successfully.</p>}
        {status === "error" && <p className="mt-2 text-sm text-red-600">Something went wrong. Please try again.</p>}
      </div>
    </div>
  );
}
