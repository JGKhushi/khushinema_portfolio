import { motion } from 'framer-motion';
import { ArrowUpRight, Briefcase, ExternalLink } from 'lucide-react';
import type { Experience as ExperienceItem } from '../lib/types';
import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';

interface Props {
  experience: ExperienceItem[];
}

export function Experience({ experience }: Props) {
  return (
    <section id="experience" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-content section-pad">
        <SectionHeader
          index="02"
          eyebrow="Experience"
          title="Where I've shipped."
          description="Three roles, one throughline: writing software that real users and real businesses depend on."
        />

        <div className="relative">
          {/* vertical spine */}
          <div className="absolute bottom-0 left-[7px] top-2 w-px bg-gradient-to-b from-brand-500/60 via-white/10 to-transparent sm:left-[9px]" />

          <div className="space-y-10">
            {experience.map((exp, i) => (
              <Reveal key={`${exp.company}-${i}`} delay={i} as="article">
                <div className="relative pl-8 sm:pl-12">
                  {/* node */}
                  <span className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-ink-950 ring-1 ring-white/15 sm:h-5 sm:w-5">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        exp.current
                          ? 'bg-emerald-400 shadow-[0_0_12px_2px_rgba(52,211,153,0.6)]'
                          : 'bg-brand-400'
                      }`}
                    />
                  </span>

                  <div className="hairline relative overflow-hidden rounded-2xl glass glass-hover p-6 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-white sm:text-xl">
                            {exp.role}
                          </h3>
                          {exp.current && (
                            <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-400/25">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-slate-400">
                          {exp.companyUrl ? (
                            <a
                              href={exp.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-1 font-medium text-brand-300 hover:text-brand-200"
                            >
                              {exp.company}
                              <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                            </a>
                          ) : (
                            <span className="font-medium text-slate-300">{exp.company}</span>
                          )}
                          {exp.location && <span className="text-slate-600">· {exp.location}</span>}
                        </div>
                      </div>
                      <span className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-xs text-slate-400">
                        {exp.startDate} — {exp.endDate}
                      </span>
                    </div>

                    {exp.summary && (
                      <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
                        {exp.summary}
                      </p>
                    )}

                    {/* Workstreams (products) */}
                    {exp.workstreams && exp.workstreams.length > 0 && (
                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {exp.workstreams.map((ws) => (
                          <a
                            key={ws.name}
                            href={ws.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all duration-300 hover:border-brand-500/30 hover:bg-brand-500/[0.05]"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-white">{ws.name}</span>
                              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500 transition-colors group-hover:text-brand-300" />
                            </div>
                            <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-slate-500">
                              {ws.summary}
                            </p>
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Achievements */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="mt-5 space-y-2.5">
                        {exp.achievements.map((a, j) => (
                          <li key={j} className="flex gap-3 text-sm leading-relaxed text-slate-400">
                            <span className="mt-[7px] h-1 w-4 shrink-0 rounded-full bg-gradient-to-r from-brand-400 to-transparent" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Stack */}
                    {exp.stack && exp.stack.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {exp.stack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-slate-400 ring-1 ring-white/[0.06]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* freelance/leadership footnote icon accent */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex items-center gap-2 pl-8 text-xs text-slate-600 sm:pl-12"
        >
          <Briefcase className="h-3.5 w-3.5" />
          Full history and references available on request.
        </motion.div>
      </div>
    </section>
  );
}
