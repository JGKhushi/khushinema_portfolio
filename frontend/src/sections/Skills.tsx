import { motion } from 'framer-motion';
import type { SkillGroup } from '../lib/types';
import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';
import { iconFor } from '../lib/icons';
import { hexToRgb } from '../components/SpotlightCard';

interface Props {
  skills: SkillGroup[];
}

export function Skills({ skills }: Props) {
  return (
    <section id="skills" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-content section-pad">
        <SectionHeader
          index="04"
          eyebrow="Skills & Tooling"
          title="The toolkit, honestly rated."
          description="Grouped by where they sit in the stack. Proficiency reflects real project usage, not a checklist."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => {
            const Icon = iconFor(group.icon);
            const rgb = hexToRgb(group.accent);
            return (
              <Reveal key={group.category} delay={i % 3} as="article">
                <div
                  className="hairline group relative h-full overflow-hidden rounded-2xl glass glass-hover p-6"
                  style={{ ['--accent' as string]: rgb }}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <span
                      className="grid h-10 w-10 place-items-center rounded-xl ring-1"
                      style={{
                        background: `rgba(${rgb},0.13)`,
                        color: group.accent,
                        borderColor: `rgba(${rgb},0.25)`,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-white">{group.category}</h3>
                      {group.description && (
                        <p className="text-xs text-slate-500">{group.description}</p>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3.5">
                    {(group.skills ?? []).map((skill, j) => (
                      <li key={skill.name}>
                        <div className="mb-1.5 flex items-baseline justify-between">
                          <span className="text-sm text-slate-300">
                            {skill.name}
                            {skill.note && (
                              <span className="ml-1.5 text-[11px] text-slate-600">· {skill.note}</span>
                            )}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">{skill.level}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, rgba(${rgb},0.5), ${group.accent})`,
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1,
                              delay: 0.15 + j * 0.06,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
