import { useRef, type ReactNode, type MouseEvent } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  accent?: string;
}

/**
 * Glass card with a pointer-following radial highlight. Uses CSS custom
 * properties updated on mousemove — no re-renders.
 */
export function SpotlightCard({ children, className = '', accent = '99,102,241' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      style={{ ['--accent' as string]: accent }}
      className={`group relative overflow-hidden rounded-2xl glass glass-hover ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(360px circle at var(--mx) var(--my), rgba(var(--accent),0.14), transparent 45%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/** Turns a hex string like #6366f1 into an "r,g,b" string for rgba(). */
export function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3 ? clean.replace(/(.)/g, '$1$1') : clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}
