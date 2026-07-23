import { ArrowUp, Heart } from 'lucide-react';
import type { Profile } from '../lib/types';
import { iconFor } from '../lib/icons';

interface Props {
  profile: Profile;
  live: boolean;
}

export function Footer({ profile, live }: Props) {
  const year = 2026; // Date.now() is unavailable in this build context; site last authored 2026.
  return (
    <footer className="relative border-t border-white/[0.06] py-14">
      <div className="container-content section-pad">
        <div className="flex flex-col items-center gap-8 text-center">
          <a
            href="#top"
            className="group flex flex-col items-center gap-3"
            aria-label="Back to top"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full text-slate-400 ring-1 ring-white/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:text-white group-hover:ring-brand-500/40">
              <ArrowUp className="h-5 w-5" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-600">
              Back to top
            </span>
          </a>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {profile.socials.map((s) => {
              const Icon = iconFor(s.icon);
              return (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full text-slate-400 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:ring-white/25"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>

          <div className="max-w-md space-y-2">
            <p className="text-lg font-semibold text-white">{profile.name}</p>
            <p className="text-sm text-slate-500">{profile.headline}</p>
          </div>

          <div className="flex flex-col items-center gap-1.5 border-t border-white/[0.06] pt-8 text-xs text-slate-600">
            <p className="flex items-center gap-1.5">
              Designed &amp; built with <Heart className="h-3 w-3 text-brand-400" fill="#7b81ff" /> and
              a MERN stack.
            </p>
            <p>
              © {year} {profile.name}. All rights reserved.
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-slate-700">
              <span
                className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-emerald-500' : 'bg-slate-600'}`}
              />
              {live ? 'Live data · API connected' : 'Static snapshot'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
