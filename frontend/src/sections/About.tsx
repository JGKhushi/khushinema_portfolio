import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import type { Profile } from '../lib/types';
import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';

interface Props {
  profile: Profile;
}

export function About({ profile }: Props) {
  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-content section-pad">
        <SectionHeader
          index="01"
          eyebrow="About"
          title="I build backends that hold up in production."
        />

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          {/* Narrative */}
          <div className="space-y-5">
            {profile.about.map((para, i) => (
              <Reveal key={i} delay={i} as="span">
                <p className="text-lg leading-relaxed text-slate-400 [&>strong]:text-white">
                  {para}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Current focus panel */}
          <Reveal delay={1}>
            <div className="hairline relative overflow-hidden rounded-2xl glass p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/25">
                  <Compass className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white">Currently focused on</h3>
                  <p className="text-xs text-slate-500">Where my attention goes right now</p>
                </div>
              </div>

              <ul className="space-y-3">
                {profile.currentFocus.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand-400 to-cyan-400" />
                    {item}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 border-t border-white/[0.06] pt-5">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div>
                    <div className="text-slate-500">Email</div>
                    <a
                      href={`mailto:${profile.email}`}
                      className="link-underline font-medium text-white"
                    >
                      {profile.email}
                    </a>
                  </div>
                  {profile.phone && (
                    <div>
                      <div className="text-slate-500">Phone</div>
                      <span className="font-medium text-white">{profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
