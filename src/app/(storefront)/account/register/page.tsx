"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/api/public/auth/register", { method: "POST", body: form });
      router.push("/account/my-enquiries");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-heading">Create an account</h1>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        <Input label="Full name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
        <Input label="Email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
        <Input label="Phone" required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <Input label="Company" value={form.company} onChange={(e) => set("company", e.target.value)} />
        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
        />
        <p className="text-xs text-muted">At least 10 characters, with uppercase, lowercase, a digit, and a symbol.</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/account/login" className="font-semibold text-heading hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
