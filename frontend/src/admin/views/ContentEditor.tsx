import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Save, Trash2, Plus, Check, AlertCircle, FileEdit } from 'lucide-react';
import {
  fetchCollection,
  updateItem,
  createItem,
  removeItem,
  fetchProfile,
  updateProfile,
  type Collection,
} from '../../lib/adminApi';
import { Field } from '../Field';

// Keys that are server-managed — never shown in the editor.
const HIDDEN = new Set(['id', '_id', '__v', 'createdAt', 'updatedAt']);

type Item = Record<string, unknown>;

interface Props {
  /** A content collection, or 'profile' for the single profile document. */
  target: Collection | 'profile';
  title: string;
  /** Sensible blank record used by "Add new". */
  template?: Item;
}

export function ContentEditor({ target, title, template }: Props) {
  const isProfile = target === 'profile';
  const [items, setItems] = useState<Item[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      if (isProfile) {
        const p = await fetchProfile();
        setItems([p]);
        setActiveId(idOf(p));
        setDraft(structuredClone(p));
      } else {
        const list = await fetchCollection(target as Collection);
        setItems(list);
        if (list[0]) {
          setActiveId(idOf(list[0]));
          setDraft(structuredClone(list[0]));
        } else {
          setActiveId(null);
          setDraft(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  function select(item: Item) {
    setActiveId(idOf(item));
    setDraft(structuredClone(item));
    setStatus('idle');
  }

  function setField(key: string, value: unknown) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
    setStatus('idle');
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    setStatus('idle');
    setError('');
    try {
      const payload = stripHidden(draft);
      let saved: Item;
      if (isProfile) {
        saved = await updateProfile(payload);
      } else if (activeId && activeId !== 'new') {
        saved = await updateItem(target as Collection, activeId, payload);
      } else {
        saved = await createItem(target as Collection, payload);
      }
      setStatus('saved');
      await load();
      setActiveId(idOf(saved));
      setDraft(structuredClone(saved));
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    if (!activeId || activeId === 'new') return;
    const name = (draft?.title || draft?.degree || draft?.role || draft?.category || 'this item') as string;
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await removeItem(target as Collection, activeId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setSaving(false);
    }
  }

  function addNew() {
    const blank: Item = template ? structuredClone(template) : {};
    setActiveId('new');
    setDraft(blank);
    setStatus('idle');
    // Surface it at the top of the list as a pending entry.
    setItems((list) => [{ ...blank, id: 'new' }, ...list.filter((i) => idOf(i) !== 'new')]);
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isProfile ? 'Your core profile — one record.' : `${items.filter((i) => idOf(i) !== 'new').length} items · edits go live on save`}
          </p>
        </div>
        {!isProfile && (
          <button
            onClick={addNew}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Add new
          </button>
        )}
      </header>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/20">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {loading ? (
        <div className="grid place-items-center py-20 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className={`grid gap-6 ${isProfile ? '' : 'lg:grid-cols-[280px_1fr]'}`}>
          {/* List */}
          {!isProfile && (
            <aside className="space-y-1.5">
              {items.map((item) => {
                const id = idOf(item);
                const label = (item.title || item.role || item.degree || item.category || 'Untitled') as string;
                const sub = (item.company || item.institution || item.tagline || item.type || '') as string;
                return (
                  <button
                    key={id}
                    onClick={() => select(item)}
                    className={`flex w-full flex-col rounded-xl border px-3.5 py-3 text-left transition-colors ${
                      activeId === id
                        ? 'border-brand-500/40 bg-brand-500/[0.08]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-sm font-medium text-white">
                      {id === 'new' && <span className="text-brand-300">●</span>}
                      {label}
                    </span>
                    {sub && <span className="mt-0.5 truncate text-xs text-slate-500">{sub}</span>}
                  </button>
                );
              })}
            </aside>
          )}

          {/* Editor */}
          <section>
            {draft ? (
              <motion.div
                key={activeId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="hairline relative overflow-hidden rounded-2xl glass p-6"
              >
                <div className="space-y-5">
                  {Object.keys(draft)
                    .filter((k) => !HIDDEN.has(k))
                    .map((key) => (
                      <Field
                        key={key}
                        name={key}
                        value={draft[key]}
                        onChange={(v) => setField(key, v)}
                      />
                    ))}
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-5">
                  <button
                    onClick={save}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save changes
                  </button>
                  {!isProfile && activeId !== 'new' && (
                    <button
                      onClick={del}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/20 disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  )}
                  {status === 'saved' && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-300">
                      <Check className="h-4 w-4" /> Saved & live
                    </span>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="grid place-items-center gap-3 rounded-2xl border border-dashed border-white/10 py-20 text-slate-500">
                <FileEdit className="h-8 w-8" />
                <p className="text-sm">Nothing here yet — click “Add new”.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function idOf(item: Item): string {
  return (item.id ?? item._id ?? '') as string;
}

function stripHidden(item: Item): Item {
  const out: Item = {};
  for (const [k, v] of Object.entries(item)) {
    if (!HIDDEN.has(k)) out[k] = v;
  }
  return out;
}
