"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api-client";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// Every field here is live on the storefront (Nav, Footer, About, Contact,
// Checkout, homepage hero) — see src/lib/settings-context.tsx for how pages
// read these. Removed notify_email/from_email: there's no email-sending
// backend, enquiries go to the business WhatsApp number above instead.
const SETTINGS_FIELDS: { key: string; label: string; multiline?: boolean; hint?: string }[] = [
  { key: "whatsapp", label: "WhatsApp Number" },
  { key: "gst_percent", label: "GST %" },
  {
    key: "low_stock_limit",
    label: "Low Stock Threshold",
    hint: "A product shows a \"Low Stock\" badge once its stock count is at or below this number (and 0 always shows \"Out of Stock\"). E.g. set to 10 and any product with 10 units or fewer left is flagged.",
  },
  { key: "company_address", label: "Company Address", multiline: true },
  { key: "company_phone", label: "Company Phone" },
  { key: "hero_title", label: "Hero Title (homepage headline)" },
  { key: "hero_subtitle", label: "Hero Subtitle (homepage tagline)", multiline: true },
  { key: "hero_video_url", label: "Hero Video URL (direct link to an .mp4)" },
  { key: "site_background_video_url", label: "Site Background Video URL (direct link to an .mp4)" },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordBusy, setPasswordBusy] = useState(false);

  useEffect(() => {
    apiFetch<{ settings: Record<string, string> }>("/api/admin/settings").then((res) => setValues(res.settings));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await apiFetch("/api/admin/settings", { method: "PUT", body: { values } });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 10) {
      setPasswordError("New password must be at least 10 characters.");
      return;
    }

    if (!window.confirm("Are you sure you want to change your admin password?")) return;
    if (!window.confirm("This will log you out immediately and you'll need to sign in again with the new password. Continue?")) return;

    setPasswordBusy(true);
    try {
      await apiFetch("/api/admin/auth/password", { method: "PUT", body: passwordForm });
      router.replace("/admin/login");
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Failed to change password");
      setPasswordBusy(false);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <div>
        <h1 className="mb-6 text-2xl font-bold text-navy-900">Settings</h1>
        <form onSubmit={save} className="flex flex-col gap-4 rounded-card-lg border border-border bg-white p-6 shadow-card">
          {SETTINGS_FIELDS.map((field) => (
            <div key={field.key} className="flex flex-col gap-1">
              {field.multiline ? (
                <Textarea
                  label={field.label}
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                />
              ) : (
                <Input
                  label={field.label}
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                />
              )}
              {field.hint && <p className="text-xs text-muted">{field.hint}</p>}
            </div>
          ))}
          {saved && <p className="text-sm text-emerald-700">Settings saved.</p>}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Settings"}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold text-navy-900">Change Password</h2>
        <form onSubmit={changePassword} className="flex flex-col gap-4 rounded-card-lg border border-border bg-white p-6 shadow-card">
          <Input
            label="Current Password"
            type="password"
            required
            autoComplete="current-password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="New Password"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
            />
            <Input
              label="Retype New Password"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            />
          </div>
          <p className="text-xs text-muted">Must be at least 10 characters.</p>
          {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          <Button type="submit" disabled={passwordBusy}>
            {passwordBusy ? "Updating…" : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
