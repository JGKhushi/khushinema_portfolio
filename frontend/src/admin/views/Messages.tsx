import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Mail,
  MailOpen,
  Trash2,
  Reply,
  Archive,
  Loader2,
  Inbox,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  fetchMessages,
  setMessageStatus,
  deleteMessage,
  type Message,
} from '../../lib/adminApi';

const STATUS_TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'Unread' },
  { key: 'read', label: 'Read' },
  { key: 'replied', label: 'Replied' },
  { key: 'archived', label: 'Archived' },
];

const STATUS_STYLE: Record<Message['status'], string> = {
  new: 'bg-brand-500/15 text-brand-200 ring-brand-500/25',
  read: 'bg-white/[0.06] text-slate-300 ring-white/10',
  replied: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/25',
  archived: 'bg-amber-500/12 text-amber-300 ring-amber-500/20',
};

export function Messages() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState<Message | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const { items } = await fetchMessages();
      setItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => (tab === 'all' ? items : items.filter((m) => m.status === tab)),
    [items, tab],
  );
  const unread = items.filter((m) => m.status === 'new').length;

  async function changeStatus(m: Message, status: Message['status']) {
    setBusyId(m.id);
    try {
      const updated = await setMessageStatus(m.id, status);
      setItems((list) => list.map((x) => (x.id === m.id ? updated : x)));
      if (selected?.id === m.id) setSelected(updated);
    } finally {
      setBusyId(null);
    }
  }

  async function open(m: Message) {
    setSelected(m);
    if (m.status === 'new') changeStatus(m, 'read');
  }

  async function remove(m: Message) {
    if (!confirm(`Delete the message from ${m.name}? This cannot be undone.`)) return;
    setBusyId(m.id);
    try {
      await deleteMessage(m.id);
      setItems((list) => list.filter((x) => x.id !== m.id));
      if (selected?.id === m.id) setSelected(null);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="mt-1 text-sm text-slate-500">
            {items.length} total
            {unread > 0 && <span className="ml-2 text-brand-300">· {unread} unread</span>}
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-2 text-sm text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </header>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => {
          const count =
            t.key === 'all' ? items.length : items.filter((m) => m.status === t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                tab === t.key ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === t.key && (
                <motion.span
                  layoutId="msg-tab"
                  className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] ring-1 ring-white/12"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {t.label}
              <span className="ml-1.5 text-xs text-slate-600">{count}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid place-items-center py-20 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="grid place-items-center gap-3 rounded-2xl border border-dashed border-white/10 py-20 text-slate-500">
          <Inbox className="h-8 w-8" />
          <p className="text-sm">No messages here yet.</p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((m) => (
            <li key={m.id}>
              <div
                className={`hairline group relative overflow-hidden rounded-xl glass p-4 transition-colors ${
                  m.status === 'new' ? 'ring-1 ring-brand-500/20' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <button onClick={() => open(m)} className="flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">{m.name}</span>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${STATUS_STYLE[m.status]}`}>
                        {m.status}
                      </span>
                      {m.company && <span className="text-xs text-slate-500">· {m.company}</span>}
                    </div>
                    <div className="mt-0.5 text-sm text-slate-400">
                      {m.subject || '(no subject)'}
                    </div>
                    <p className="mt-1.5 line-clamp-1 text-sm text-slate-500">{m.message}</p>
                    <div className="mt-1.5 font-mono text-[11px] text-slate-600">
                      {m.email} · {formatDate(m.createdAt)}
                    </div>
                  </button>

                  <div className="flex shrink-0 items-center gap-1">
                    <IconBtn title="Mark replied" onClick={() => changeStatus(m, 'replied')} busy={busyId === m.id}>
                      <Reply className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn title="Archive" onClick={() => changeStatus(m, 'archived')} busy={busyId === m.id}>
                      <Archive className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn title="Delete" onClick={() => remove(m)} busy={busyId === m.id} danger>
                      <Trash2 className="h-4 w-4" />
                    </IconBtn>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[70] flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.aside
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-full w-full max-w-lg flex-col border-l border-white/10 bg-ink-850 p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-500/15 text-brand-200">
                      {selected.status === 'new' ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
                      <a
                        href={`mailto:${selected.email}`}
                        className="link-underline text-sm text-brand-300"
                      >
                        {selected.email}
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-full px-3 py-1 text-sm text-slate-400 ring-1 ring-white/10 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 space-y-4 overflow-y-auto">
                {selected.company && (
                  <Meta label="Company" value={selected.company} />
                )}
                <Meta label="Subject" value={selected.subject || '(none)'} />
                <Meta label="Received" value={formatDate(selected.createdAt)} />
                <div>
                  <div className="mb-1.5 text-xs uppercase tracking-wider text-slate-500">Message</div>
                  <p className="whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm leading-relaxed text-slate-300">
                    {selected.message}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 border-t border-white/[0.06] pt-5">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || '')}`}
                  onClick={() => changeStatus(selected, 'replied')}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Reply className="h-4 w-4" /> Reply <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  onClick={() => changeStatus(selected, 'archived')}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-slate-300 hover:bg-white/[0.06]"
                >
                  <Archive className="h-4 w-4" /> Archive
                </button>
                <button
                  onClick={() => remove(selected)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  busy,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  busy?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={busy}
      className={`grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.06] disabled:opacity-40 ${
        danger ? 'hover:text-red-300' : 'hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-0.5 text-sm text-slate-300">{value}</div>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}
