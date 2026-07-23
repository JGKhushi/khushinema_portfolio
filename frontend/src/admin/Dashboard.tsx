import { useState } from 'react';
import {
  Inbox,
  User,
  FolderGit2,
  Briefcase,
  Wrench,
  GraduationCap,
  Trophy,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Messages } from './views/Messages';
import { ContentEditor } from './views/ContentEditor';
import type { Collection } from '../lib/adminApi';

type ViewKey = 'messages' | 'profile' | Collection;

const NAV: { key: ViewKey; label: string; icon: typeof Inbox }[] = [
  { key: 'messages', label: 'Messages', icon: Inbox },
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'projects', label: 'Projects', icon: FolderGit2 },
  { key: 'experience', label: 'Experience', icon: Briefcase },
  { key: 'skills', label: 'Skills', icon: Wrench },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'achievements', label: 'Achievements', icon: Trophy },
];

// Blank templates for "Add new" so generated forms have the right field shape.
const TEMPLATES: Partial<Record<Collection, Record<string, unknown>>> = {
  projects: {
    title: '',
    slug: '',
    tagline: '',
    category: 'full-stack',
    accent: '#6366f1',
    year: '2026',
    role: '',
    featured: false,
    status: 'shipped',
    order: 99,
    description: '',
    problem: '',
    solution: '',
    stack: [],
    highlights: [],
    links: {},
    published: true,
  },
  experience: {
    role: '',
    company: '',
    location: '',
    type: 'internship',
    startDate: '',
    endDate: '',
    current: false,
    summary: '',
    achievements: [],
    stack: [],
    order: 99,
    published: true,
  },
  skills: { category: '', icon: 'code', accent: '#6366f1', description: '', order: 99, skills: [], published: true },
  education: { degree: '', institution: '', location: '', score: '', startDate: '', endDate: '', coursework: [], order: 99, published: true },
  achievements: { title: '', detail: '', metric: '', type: 'hackathon', period: '', order: 99, published: true },
};

export function Dashboard() {
  const { user, logout } = useAuth();
  const [view, setView] = useState<ViewKey>('messages');
  const [mobileOpen, setMobileOpen] = useState(false);

  const label = NAV.find((n) => n.key === view)?.label ?? '';

  return (
    <div className="min-h-screen bg-ink-950 text-slate-300">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/[0.06] bg-ink-900 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 text-sm font-bold text-white">
            KN
          </span>
          <div>
            <div className="text-sm font-semibold text-white">Admin</div>
            <div className="text-[11px] text-slate-500">Portfolio CMS</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setView(item.key);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  view === item.key
                    ? 'bg-brand-500/15 text-white ring-1 ring-brand-500/25'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <a
            href="/"
            className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <ExternalLink className="h-4 w-4" /> View site
          </a>
          <div className="mb-2 px-3 pt-2 text-[11px] text-slate-600">
            Signed in as
            <div className="truncate text-slate-400">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/[0.06] bg-ink-950/80 px-5 py-3 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg text-white ring-1 ring-white/10"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-semibold text-white">{label}</span>
        </header>

        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
          {view === 'messages' && <Messages />}
          {view === 'profile' && <ContentEditor target="profile" title="Profile" />}
          {view !== 'messages' && view !== 'profile' && (
            <ContentEditor
              key={view}
              target={view}
              title={label}
              template={TEMPLATES[view as Collection]}
            />
          )}
        </main>
      </div>
    </div>
  );
}
