import {
  Github,
  Linkedin,
  Mail,
  Code2,
  Terminal,
  Braces,
  Server,
  Layout,
  Database,
  Sparkles,
  ScanLine,
  FlaskConical,
  Cpu,
  type LucideIcon,
} from 'lucide-react';

/** Maps the string `icon` keys used in the API data to Lucide components. */
const MAP: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  code: Code2,
  terminal: Terminal,
  braces: Braces,
  server: Server,
  layout: Layout,
  database: Database,
  sparkles: Sparkles,
  scan: ScanLine,
  flask: FlaskConical,
  cpu: Cpu,
};

export function iconFor(key: string): LucideIcon {
  return MAP[key] ?? Code2;
}
