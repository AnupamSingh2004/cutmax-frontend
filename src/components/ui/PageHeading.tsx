type Level = "h1" | "h2";

const TITLE_CLASSES: Record<Level, string> = {
  h1: "text-3xl font-bold text-navy-900 sm:text-4xl",
  h2: "text-2xl font-bold text-navy-900 sm:text-3xl",
};

export function PageHeading({
  eyebrow,
  title,
  level = "h2",
  className = "",
}: {
  eyebrow: string;
  title: string;
  level?: Level;
  className?: string;
}) {
  const Tag = level;
  return (
    <div className={className}>
      <div className="mb-3 flex items-center gap-3">
        <span className="h-px w-8 bg-navy-900" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-navy-900">{eyebrow}</span>
      </div>
      <Tag className={TITLE_CLASSES[level]}>{title}</Tag>
    </div>
  );
}
