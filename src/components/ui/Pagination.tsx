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

  const pages = totalPages <= 10 ? Array.from({ length: totalPages }, (_, i) => i + 1) : null;
  const navBtn = "rounded-[3px] border border-border bg-white px-3.5 py-2.5 text-[13.5px] font-semibold text-navy-900 transition-colors hover:bg-border disabled:opacity-40 disabled:hover:bg-white";

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button className={navBtn} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>
      {pages ? (
        pages.map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`h-[38px] w-[38px] rounded-[3px] border border-border text-[13.5px] font-bold transition-colors ${
              n === page ? "bg-navy-900 text-white" : "bg-white text-navy-900 hover:bg-bg-soft"
            }`}
          >
            {n}
          </button>
        ))
      ) : (
        <span className="px-3 text-sm font-semibold text-navy-900">
          Page {page} of {totalPages}
        </span>
      )}
      <button className={navBtn} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  );
}
