import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, AlertCircle, Loader2, Copy, MapPin } from 'lucide-react';
import type { Profile } from '../lib/types';
import { SectionHeader } from '../components/SectionHeader';
import { Reveal } from '../components/Reveal';
import { submitContact, type RequestError } from '../lib/api';
import { iconFor } from '../lib/icons';

interface Props {
  profile: Profile;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

export function Contact({ profile }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      // Tell the visitor what actually went wrong instead of blaming the
      // network for everything — and never hijack the page to a mail client.
      const e = err as RequestError;
      setStatus('error');

      if (e.offline) {
        setError('Could not reach the server. You can email me directly instead.');
      } else if (e.status === 429) {
        setError('Too many messages sent from this device. Please try again in an hour, or email me directly.');
      } else if (e.status === 503) {
        setError('The server is temporarily unavailable. Please try again shortly, or email me directly.');
      } else {
        setError(e.message || 'Something went wrong. Please try again, or email me directly.');
      }
    }
  }

  /** Pre-filled mail link offered as a fallback — the visitor chooses to use it. */
  const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(
    form.subject || 'Hello from your portfolio',
  )}&body=${encodeURIComponent(`${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ''}`)}`;

  function copyEmail() {
    navigator.clipboard?.writeText(profile.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-content section-pad">
        <SectionHeader
          index="06"
          eyebrow="Contact"
          title="Let's build something that ships."
          description={profile.availability?.message}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: direct info */}
          <div className="space-y-4">
            <Reveal>
              <button
                onClick={copyEmail}
                className="hairline group flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl glass glass-hover p-5 text-left"
              >
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">Email me directly</div>
                  <div className="mt-1 text-lg font-semibold text-white">{profile.email}</div>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-400 ring-1 ring-white/10 transition-colors group-hover:text-white">
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </span>
              </button>
            </Reveal>

            <Reveal delay={1}>
              <div className="hairline flex items-center gap-3 overflow-hidden rounded-2xl glass p-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-500/12 text-brand-300 ring-1 ring-brand-500/20">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">Based in</div>
                  <div className="mt-0.5 font-medium text-white">{profile.location}</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <div className="hairline overflow-hidden rounded-2xl glass p-5">
                <div className="mb-3 text-xs uppercase tracking-wider text-slate-500">
                  Find me online
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.socials.map((s) => {
                    const Icon = iconFor(s.icon);
                    return (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-2 text-sm text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/30 hover:text-white"
                      >
                        <Icon className="h-4 w-4" /> {s.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: form */}
          <Reveal delay={1}>
            <form
              onSubmit={handleSubmit}
              className="hairline relative overflow-hidden rounded-2xl glass p-6 sm:p-7"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" htmlFor="name">
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Jane Doe"
                    className="input"
                  />
                </Field>
                <Field label="Email" htmlFor="email">
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update('email')}
                    placeholder="jane@company.com"
                    className="input"
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Subject" htmlFor="subject">
                  <input
                    id="subject"
                    value={form.subject}
                    onChange={update('subject')}
                    placeholder="A role, a project, or just hello"
                    className="input"
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Message" htmlFor="message">
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Tell me what you're working on…"
                    className="input resize-none"
                  />
                </Field>
              </div>

              <motion.button
                type="submit"
                disabled={status === 'sending' || status === 'success'}
                whileTap={{ scale: 0.98 }}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {status === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === 'success' && <Check className="h-4 w-4" />}
                {(status === 'idle' || status === 'error') && <Send className="h-4 w-4" />}
                {status === 'sending'
                  ? 'Sending…'
                  : status === 'success'
                    ? 'Message sent — thank you!'
                    : 'Send message'}
              </motion.button>

              {status === 'error' && (
                <div className="mt-3 rounded-lg bg-amber-500/10 px-3.5 py-3 ring-1 ring-amber-500/20">
                  <p className="flex items-start gap-2 text-sm text-amber-200">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
                  </p>
                  <a
                    href={mailtoHref}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-100 underline underline-offset-2 hover:text-white"
                  >
                    <Send className="h-3.5 w-3.5" /> Open email with your message
                  </a>
                </div>
              )}
              {status === 'success' && (
                <p className="mt-3 flex items-center gap-2 text-sm text-emerald-300">
                  <Check className="h-4 w-4" /> I&apos;ll get back to you shortly.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
