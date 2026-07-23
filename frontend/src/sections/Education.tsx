import { motion } from 'framer-motion';
import { GraduationCap, Trophy, Users, Code2, Award, ArrowUpRight } from 'lucide-react';
import type { Education as Edu, Achievement } from '../lib/types';
import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';

interface Props {
  education: Edu[];
  achievements: Achievement[];
}

const ACH_ICON: Record<string, typeof Trophy> = {
  hackathon: Trophy,
  leadership: Users,
  coding: Code2,
  default: Award,
};

export function Education({ education, achievements }: Props) {
  return (
    <section id="education" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-content section-pad">
        <SectionHeader
          index="05"
          eyebrow="Education & Recognition"
          title="Credentials and the wins along the way."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Education column */}
          <div>
            <Reveal className="mb-6 flex items-center gap-2.5">
              <GraduationCap className="h-5 w-5 text-brand-300" />
              <h3 className="text-lg font-semibold text-white">Education</h3>
            </Reveal>

            <div className="relative space-y-4">
              {education.map((edu, i) => (
                <Reveal key={i} delay={i}>
                  <div className="hairline relative overflow-hidden rounded-2xl glass glass-hover p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h4 className="max-w-[75%] text-[15px] font-semibold leading-snug text-white">
                        {edu.degree}
                      </h4>
                      {edu.score && (
                        <span className="rounded-full bg-brand-500/12 px-2.5 py-0.5 font-mono text-xs font-semibold text-brand-300 ring-1 ring-brand-500/20">
                          {edu.score}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{edu.institution}</p>
                    <p className="mt-0.5 font-mono text-xs text-slate-600">
                      {edu.startDate} — {edu.endDate}
                      {edu.location ? ` · ${edu.location}` : ''}
                    </p>

                    {edu.coursework.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {edu.coursework.map((c) => (
                          <span
                            key={c}
                            className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-400 ring-1 ring-white/[0.06]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Achievements column */}
          <div>
            <Reveal className="mb-6 flex items-center gap-2.5">
              <Trophy className="h-5 w-5 text-amber-300" />
              <h3 className="text-lg font-semibold text-white">Achievements & Leadership</h3>
            </Reveal>

            <div className="space-y-4">
              {achievements.map((ach, i) => {
                const Icon = ACH_ICON[ach.type] ?? ACH_ICON.default;
                const Wrapper = ach.url ? motion.a : motion.div;
                return (
                  <Reveal key={i} delay={i}>
                    <Wrapper
                      {...(ach.url
                        ? { href: ach.url, target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="hairline group relative flex gap-4 overflow-hidden rounded-2xl glass glass-hover p-5"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400/12 text-amber-300 ring-1 ring-amber-400/20">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-[15px] font-semibold text-white">{ach.title}</h4>
                          {ach.url && (
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100" />
                          )}
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-slate-400">{ach.detail}</p>
                        <div className="mt-2.5 flex items-center gap-2">
                          {ach.metric && (
                            <span className="rounded-md bg-amber-400/12 px-2 py-0.5 font-mono text-[11px] font-semibold text-amber-300">
                              {ach.metric}
                            </span>
                          )}
                          <span className="font-mono text-[11px] text-slate-600">{ach.period}</span>
                        </div>
                      </div>
                    </Wrapper>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
