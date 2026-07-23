// Wire types — mirror the shapes returned by the Express `/api/v1/overview`
// endpoint (see backend/src/seed/data.js and the Mongoose models).

export interface Social {
  label: string;
  handle: string;
  url: string;
  icon: string;
  order?: number;
}

export interface Stat {
  label: string;
  value: string;
  caption?: string;
}

export interface Availability {
  status: 'open' | 'limited' | 'closed' | string;
  message: string;
}

export interface Profile {
  key?: string;
  name: string;
  headline: string;
  roles: string[];
  location: string;
  email: string;
  phone?: string;
  summary: string;
  about: string[];
  availability: Availability;
  resumeUrl: string;
  currentFocus: string[];
  socials: Social[];
  stats: Stat[];
}

export interface Workstream {
  name: string;
  url?: string;
  summary: string;
}

export interface Experience {
  id?: string;
  role: string;
  company: string;
  companyUrl?: string;
  location?: string;
  type?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  summary?: string;
  workstreams?: Workstream[];
  achievements?: string[];
  stack?: string[];
  order?: number;
}

export interface ProjectHighlight {
  text: string;
  metric?: string;
}

export interface ProjectLinks {
  live?: string;
  github?: string;
  demo?: string;
}

export interface Project {
  id?: string;
  title: string;
  slug: string;
  tagline: string;
  category: string;
  accent: string;
  year: string;
  role: string;
  featured?: boolean;
  status?: string;
  order?: number;
  description: string;
  problem?: string;
  solution?: string;
  stack: string[];
  highlights: ProjectHighlight[];
  links: ProjectLinks;
}

export interface Skill {
  name: string;
  level: number;
  note?: string;
}

export interface SkillGroup {
  id?: string;
  category: string;
  icon: string;
  accent: string;
  description?: string;
  order?: number;
  skills: Skill[];
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  location?: string;
  score?: string;
  startDate: string;
  endDate: string;
  coursework: string[];
  order?: number;
}

export interface Achievement {
  id?: string;
  title: string;
  detail: string;
  metric?: string;
  type: string;
  period: string;
  url?: string;
  order?: number;
}

export interface Overview {
  profile: Profile;
  projects: Project[];
  experience: Experience[];
  skills: SkillGroup[];
  education: Education[];
  achievements: Achievement[];
}
