type Level = "h1" | "h2";

const TITLE_CLASSES: Record<Level, string> = {
  h1: "font-display text-[2rem] font-extrabold leading-[1.15] text-navy-900 sm:text-[2.75rem]",
  h2: "font-display text-[1.75rem] font-bold leading-[1.15] text-navy-900 sm:text-[2.375rem]",
};

export function PageHeading({
  eyebrow,
  title,
  level = "h2",
  className = "",
  light = false,
}: {
  eyebrow: string;
  title: string;
  level?: Level;
  className?: string;
  light?: boolean;
}) {
  const Tag = level;
  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="h-[2px] w-7 bg-red-600" />
        <span className={`text-[13px] font-bold tracking-[0.14em] ${light ? "text-orange-500" : "text-red-600"}`}>{eyebrow}</span>
      </div>
      <Tag className={light ? `${TITLE_CLASSES[level]} !text-white` : TITLE_CLASSES[level]}>{title}</Tag>
    </div>
  );
}
