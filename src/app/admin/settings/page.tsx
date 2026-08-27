"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const SETTINGS_FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "whatsapp", label: "WhatsApp Number" },
  { key: "gst_percent", label: "GST %" },
  { key: "low_stock_limit", label: "Low Stock Threshold" },
  { key: "notify_email", label: "Notification Email" },
  { key: "from_email", label: "From Email" },
  { key: "company_name", label: "Company Name" },
  { key: "company_address", label: "Company Address", multiline: true },
  { key: "company_phone", label: "Company Phone" },
  { key: "hero_title", label: "Hero Title" },
  { key: "hero_subtitle", label: "Hero Subtitle", multiline: true },
  { key: "hero_video_url", label: "Hero Video URL (from Media Library)" },
  { key: "site_background_video_url", label: "Site Background Video URL (from Media Library)" },
];

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);

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
    setPasswordSaved(false);
    try {
      await apiFetch("/api/admin/settings/password", { method: "POST", body: passwordForm });
      setPasswordSaved(true);
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Failed to change password");
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <div>
        <h1 className="mb-6 text-2xl font-bold text-navy-900">Settings</h1>
        <form onSubmit={save} className="flex flex-col gap-4 rounded-card-lg border border-border bg-white p-6 shadow-card">
          {SETTINGS_FIELDS.map((field) =>
            field.multiline ? (
              <Textarea
                key={field.key}
                label={field.label}
                value={values[field.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              />
            ) : (
              <Input
                key={field.key}
                label={field.label}
                value={values[field.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              />
            ),
          )}
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
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
          />
          <Input
            label="New Password"
            type="password"
            required
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
          />
          {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          {passwordSaved && <p className="text-sm text-emerald-700">Password updated.</p>}
          <Button type="submit">Change Password</Button>
        </form>
      </div>
    </div>
  );
}
