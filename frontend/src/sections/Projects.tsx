import { forwardRef, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Github, Globe, Star } from 'lucide-react';
import type { Project } from '../lib/types';
import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';
import { hexToRgb } from '../components/SpotlightCard';
import { ProjectModal } from '../components/ProjectModal';

interface Props {
  projects: Project[];
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All work',
  'full-stack': 'Full-stack',
  backend: 'Backend',
  ai: 'AI / GenAI',
  data: 'Data',
};

export function Projects({ projects }: Props) {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Project | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>(['all']);
    projects.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [projects]);

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter],
  );

  return (
    <section id="work" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-content section-pad">
        <SectionHeader
          index="03"
          eyebrow="Selected Work"
          title="Things I've designed, built and shipped."
          description="From production e-commerce backends to AI-assisted visualizers — a mix of team work at AskGalore and independent full-stack builds."
        />

        {/* Filter bar */}
        <Reveal className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                filter === cat ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter === cat && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] ring-1 ring-white/12"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </Reveal>

        {/* Grid */}
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                onOpen={() => setSelected(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

// forwardRef so AnimatePresence's popLayout can attach its measurement ref.
const ProjectCard = forwardRef<
  HTMLElement,
  { project: Project; index: number; onOpen: () => void }
>(function ProjectCard({ project, index, onOpen }, ref) {
  const rgb = hexToRgb(project.accent);
  // Featured projects take a wider span on large screens for editorial rhythm.
  const span = project.featured ? 'lg:col-span-3' : 'lg:col-span-2';
  const stack = project.stack ?? [];
  const links = project.links ?? {};

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`group ${span}`}
    >
      <button
        onClick={onOpen}
        style={{ ['--accent' as string]: rgb }}
        className="hairline relative flex h-full w-full flex-col overflow-hidden rounded-2xl glass glass-hover p-6 text-left"
      >
        {/* accent glow on hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(500px circle at 30% 0%, rgba(${rgb},0.16), transparent 55%)`,
          }}
        />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="grid h-9 w-9 place-items-center rounded-lg text-sm font-bold"
              style={{ background: `rgba(${rgb},0.15)`, color: project.accent }}
            >
              {project.title[0]}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">{project.title}</h3>
                {project.featured && (
                  <Star
                    className="h-3.5 w-3.5"
                    style={{ color: project.accent }}
                    fill={project.accent}
                  />
                )}
              </div>
              <span className="font-mono text-[11px] text-slate-500">{project.year}</span>
            </div>
          </div>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-500 ring-1 ring-white/[0.08] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white group-hover:ring-white/20">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <p className="relative mt-3 text-sm font-medium text-slate-300">{project.tagline}</p>
        <p className="relative mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
          {project.description}
        </p>

        <div className="relative mt-5 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-400 ring-1 ring-white/[0.06]"
              >
                {tech}
              </span>
            ))}
            {stack.length > 4 && (
              <span className="px-1 py-0.5 font-mono text-[10px] text-slate-500">
                +{stack.length - 4}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            {links.github && <Github className="h-3.5 w-3.5" />}
            {links.live && <Globe className="h-3.5 w-3.5" />}
          </div>
        </div>
      </button>
    </motion.article>
  );
});
