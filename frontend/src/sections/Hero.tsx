import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDown, MapPin, Circle } from 'lucide-react';
import type { Profile } from '../lib/types';
import { iconFor } from '../lib/icons';

interface Props {
  profile: Profile;
}

/** Cycles the role words in the sub-headline. */
function useRotatingRole(roles: string[]) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (roles.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, [roles.length]);
  return roles[index] ?? '';
}

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero({ profile }: Props) {
  const role = useRotatingRole(profile.roles);
  const isOpen = profile.availability?.status === 'open';

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center pt-28 pb-20 sm:pt-32">
      <div className="container-content section-pad">
        <div className="grid items-center gap-14 lg:grid-cols-[1.35fr_1fr]">
          {/* ── Left: copy ── */}
          <div>
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-slate-300"
            >
              <span className="relative flex h-2 w-2">
                {isOpen && (
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
                )}
                <Circle
                  className={`h-2 w-2 ${isOpen ? 'fill-emerald-400 text-emerald-400' : 'fill-slate-400 text-slate-400'}`}
                />
              </span>
              {profile.availability?.message ?? 'Available for opportunities'}
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-fluid-lg font-bold leading-[0.95] tracking-tight text-white"
            >
              {profile.name.split(' ')[0]}
              <br />
              <span className="text-gradient">{profile.name.split(' ').slice(1).join(' ')}</span>
            </motion.h1>

            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 flex items-center gap-2 text-lg text-slate-300 sm:text-xl"
            >
              <span className="text-slate-500">I&apos;m a</span>
              <span className="relative inline-flex h-8 min-w-[13ch] items-center overflow-hidden">
                <motion.span
                  key={role}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="font-semibold text-white"
                >
                  {role}
                </motion.span>
              </span>
            </motion.div>

            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
            >
              {profile.summary}
            </motion.p>

            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              >
                View my work
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/[0.07]"
              >
                Get in touch
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.div>

            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-9 flex flex-wrap items-center gap-5"
            >
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="h-4 w-4" /> {profile.location}
              </span>
              <span className="hidden h-4 w-px bg-white/10 sm:block" />
              <div className="flex items-center gap-1">
                {profile.socials
                  .filter((s) => s.icon !== 'mail')
                  .map((s) => {
                    const Icon = iconFor(s.icon);
                    return (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="grid h-9 w-9 place-items-center rounded-full text-slate-400 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:ring-white/25"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
              </div>
            </motion.div>
          </div>

          {/* ── Right: stat panel ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:mx-0"
          >
            <div className="animate-float">
              <div className="hairline relative overflow-hidden rounded-3xl glass p-6 shadow-card">
                {/* terminal chrome */}
                <div className="mb-5 flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <span className="h-3 w-3 rounded-full bg-green-400/80" />
                  <span className="ml-3 font-mono text-xs text-slate-500">~/khushi — whoami</span>
                </div>

                <pre className="mb-6 overflow-x-auto font-mono text-[13px] leading-relaxed text-slate-300">
                  <code>
                    <span className="text-brand-400">const</span>{' '}
                    <span className="text-white">engineer</span> = {'{'}
                    {'\n'}  focus: <span className="text-emerald-300">&apos;backend&apos;</span>,
                    {'\n'}  ships: <span className="text-cyan-300">&apos;production&apos;</span>,
                    {'\n'}  stack: [<span className="text-amber-300">&apos;MERN&apos;</span>,{' '}
                    <span className="text-amber-300">&apos;FastAPI&apos;</span>],
                    {'\n'}  ai: <span className="text-emerald-300">true</span>,
                    {'\n'}
                    {'}'};
                  </code>
                </pre>

                <div className="grid grid-cols-2 gap-3">
                  {profile.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5"
                    >
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="mt-0.5 text-[11px] font-medium leading-tight text-slate-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-500 md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}
