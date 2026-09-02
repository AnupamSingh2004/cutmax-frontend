"use client";

import { createContext, useContext } from "react";
import type { PublicSettings } from "@/lib/types";

const SettingsContext = createContext<PublicSettings | null>(null);

export function SettingsProvider({ value, children }: { value: PublicSettings; children: React.ReactNode }) {
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

/**
 * Storefront-wide settings (WhatsApp number, company info, hero copy, etc.),
 * fetched once server-side in the storefront layout and provided here so any
 * client component can read the admin-editable value instead of a hardcoded
 * constant. Falls back to the same defaults as an empty/failed settings
 * fetch if used outside the provider (shouldn't happen in practice).
 */
export function useSettings(): PublicSettings {
  return (
    useContext(SettingsContext) ?? {
      whatsapp: "",
      gst_percent: 18,
      low_stock: 10,
    }
  );
}
