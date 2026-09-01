"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cutmax-theme";
const SHELL_ID = "storefront-shell";

function applyTheme(theme: "light" | "dark") {
  const shell = document.getElementById(SHELL_ID);
  if (!shell) return;
  if (theme === "dark") shell.setAttribute("data-theme", "dark");
  else shell.removeAttribute("data-theme");
}

export function ThemeSwitcher() {
  // Starts null so the server-rendered icon and the client's first render
  // match exactly (avoids a hydration mismatch) — the inline script in the
  // layout already applied the real theme to the DOM before this mounts,
  // we just read it back here to sync the icon.
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const shell = document.getElementById(SHELL_ID);
    setTheme(shell?.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (private mode, etc.) — theme just won't persist
    }
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] border border-border bg-bg-soft text-heading transition-colors hover:bg-border"
    >
      {isDark ? (
        <svg className="h-[17px] w-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="4.5" />
          <path strokeLinecap="round" d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
      ) : (
        <svg className="h-[17px] w-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.5 14.5A8.5 8.5 0 119.5 3.5a7 7 0 0011 11z" />
        </svg>
      )}
    </button>
  );
}
