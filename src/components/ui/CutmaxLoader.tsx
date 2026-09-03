import Image from "next/image";

/**
 * Branded loading indicator — the logo with a spinning accent ring, used for
 * every full-page loading state (route transitions, initial admin auth
 * check, etc.) instead of plain "Loading…" text.
 */
export function CutmaxLoader({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="cutmax-loader-ring absolute inset-0 rounded-full border-[3px] border-border border-t-red-600" />
        <Image src="/logo.png" alt="" width={64} height={64} priority className="h-8 w-8 object-contain" aria-hidden />
      </div>
      {label && <p className="text-sm font-medium text-muted-soft">{label}</p>}
    </div>
  );
}

export function CutmaxPageLoader({ label = "Loading…" }: { label?: string }) {
  // Full viewport height, not just a chunk of it -- used as a route-level
  // loading.tsx fallback with nothing else on the page, so anything shorter
  // lets the layout's Footer show up right underneath the spinner.
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <CutmaxLoader label={label} />
    </div>
  );
}
