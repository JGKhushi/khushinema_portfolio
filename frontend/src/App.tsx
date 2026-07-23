import { useMemo } from 'react';
import { useOverview } from './hooks/useOverview';
import { Background } from './components/Background';
import { CursorGlow } from './components/CursorGlow';
import { ScrollProgress } from './components/ScrollProgress';
import { Navigation } from './components/Navigation';
import { Hero } from './sections/Hero';
import { Marquee } from './sections/Marquee';
import { About } from './sections/About';
import { Experience } from './sections/Experience';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { Education } from './sections/Education';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';

export default function App() {
  const { data, live } = useOverview();
  const { profile, projects, experience, skills, education, achievements } = data;

  // Marquee items: the union of every technology mentioned across skills.
  const techList = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((g) => g.skills.forEach((s) => set.add(s.name)));
    return Array.from(set);
  }, [skills]);

  return (
    <>
      <Background />
      <CursorGlow />
      <ScrollProgress />
      <Navigation name={profile.name} resumeUrl={profile.resumeUrl} />

      <main className="relative z-10 noise">
        <Hero profile={profile} />
        <Marquee items={techList} />
        <About profile={profile} />
        <Experience experience={experience} />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Education education={education} achievements={achievements} />
        <Contact profile={profile} />
      </main>

      <Footer profile={profile} live={live} />
    </>
  );
}
