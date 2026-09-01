export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const navBtn = "rounded-[3px] border border-border bg-surface px-3.5 py-2.5 text-[13.5px] font-semibold text-heading transition-colors hover:bg-border disabled:opacity-40 disabled:hover:bg-surface";
  const pageBtn = (n: number) =>
    `h-[38px] w-[38px] rounded-[3px] border border-border text-[13.5px] font-bold transition-colors ${
      n === page ? "bg-navy-900 text-white" : "bg-surface text-heading hover:bg-bg-soft"
    }`;

  // Always show a window of at least 5 page numbers around the current page,
  // plus the first/last page with an ellipsis when they'd otherwise be cut off.
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, Math.min(start, end - windowSize + 1));
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button className={navBtn} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onChange(1)} className={pageBtn(1)}>1</button>
          {start > 2 && <span className="px-1 text-muted">…</span>}
        </>
      )}

      {pages.map((n) => (
        <button key={n} onClick={() => onChange(n)} className={pageBtn(n)}>
          {n}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-muted">…</span>}
          <button onClick={() => onChange(totalPages)} className={pageBtn(totalPages)}>{totalPages}</button>
        </>
      )}

      <button className={navBtn} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  );
}
