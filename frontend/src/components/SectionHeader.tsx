import { Reveal } from './Reveal';

interface Props {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}

/** Consistent numbered section heading used across the page. */
export function SectionHeader({ index, eyebrow, title, description }: Props) {
  return (
    <div className="mb-14 max-w-3xl">
      <Reveal className="mb-4 flex items-center gap-3">
        <span className="font-mono text-sm text-brand-400">{index}</span>
        <span className="h-px w-8 bg-gradient-to-r from-brand-500/60 to-transparent" />
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={1}>
        <h2 className="text-fluid-md font-bold leading-[1.05] text-white">{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={2}>
          <p className="mt-5 text-lg leading-relaxed text-slate-400">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
