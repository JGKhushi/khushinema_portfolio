interface Props {
  items: string[];
}

/** Infinite horizontal scroll of technology names. Decorative. */
export function Marquee({ items }: Props) {
  const doubled = [...items, ...items];
  return (
    <div className="relative border-y border-white/[0.06] bg-white/[0.015] py-5">
      <div className="mask-fade-r flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-10 whitespace-nowrap pr-10">
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className="font-mono text-sm font-medium uppercase tracking-wider text-slate-500 transition-colors hover:text-brand-300">
                {item}
              </span>
              <span className="text-brand-500/50">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
