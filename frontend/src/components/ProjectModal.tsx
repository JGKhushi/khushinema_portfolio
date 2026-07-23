import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Github, Globe, ArrowUpRight, Target, Lightbulb, TrendingUp } from 'lucide-react';
import type { Project } from '../lib/types';
import { hexToRgb } from './SpotlightCard';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (project) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} details`}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-ink-850 shadow-2xl sm:rounded-3xl"
            style={{ ['--accent' as string]: hexToRgb(project.accent) }}
          >
            {/* header band */}
            <div
              className="relative border-b border-white/[0.06] p-6 sm:p-8"
              style={{
                background: `radial-gradient(600px circle at 20% 0%, rgba(${hexToRgb(
                  project.accent,
                )},0.18), transparent 60%)`,
              }}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-slate-400 ring-1 ring-white/10 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <span
                  className="grid h-12 w-12 place-items-center rounded-xl text-lg font-bold"
                  style={{ background: `rgba(${hexToRgb(project.accent)},0.18)`, color: project.accent }}
                >
                  {project.title[0]}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                    <span className="font-mono text-xs text-slate-500">{project.year}</span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: project.accent }}>
                    {project.tagline}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-400">
                <span className="text-slate-500">Role:</span> {project.role}
              </p>
            </div>

            <div className="space-y-7 p-6 sm:p-8">
              <p className="text-[15px] leading-relaxed text-slate-300">{project.description}</p>

              {project.problem && (
                <Block
                  icon={<Target className="h-4 w-4" />}
                  label="The problem"
                  accent={project.accent}
                >
                  {project.problem}
                </Block>
              )}
              {project.solution && (
                <Block
                  icon={<Lightbulb className="h-4 w-4" />}
                  label="What I built"
                  accent={project.accent}
                >
                  {project.solution}
                </Block>
              )}

              {/* Highlights */}
              {(project.highlights ?? []).length > 0 && (
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <TrendingUp className="h-4 w-4" /> Highlights
                  </h4>
                  <ul className="space-y-2.5">
                    {(project.highlights ?? []).map((h, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-sm text-slate-300"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: project.accent }}
                        />
                        <span className="flex-1">
                          {h.text}
                          {h.metric && (
                            <span
                              className="ml-2 rounded-md px-2 py-0.5 font-mono text-xs font-semibold"
                              style={{
                                background: `rgba(${hexToRgb(project.accent)},0.15)`,
                                color: project.accent,
                              }}
                            >
                              {h.metric}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stack */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Built with
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(project.stack ?? []).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-slate-300 ring-1 ring-white/[0.07]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {(project.links?.live || project.links?.github) && (
                <div className="flex flex-wrap gap-3 border-t border-white/[0.06] pt-6">
                  {project.links?.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 transition-transform hover:scale-[1.03]"
                    >
                      <Globe className="h-4 w-4" /> Visit live site
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.07]"
                    >
                      <Github className="h-4 w-4" /> View code
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Block({
  icon,
  label,
  accent,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4
        className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
        style={{ color: accent }}
      >
        {icon} {label}
      </h4>
      <p className="text-sm leading-relaxed text-slate-400">{children}</p>
    </div>
  );
}
