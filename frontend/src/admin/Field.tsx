import { useState } from 'react';
import { Plus, X } from 'lucide-react';

/**
 * Infers a sensible editor from a value's shape:
 *  - short string  → text input
 *  - long string   → textarea
 *  - boolean       → toggle
 *  - number        → number input
 *  - string[]      → tag/list editor
 *  - object / obj[]→ JSON textarea (safe fallback for nested shapes)
 * Keys the backend manages itself are hidden by the parent.
 */
export function Field({
  name,
  value,
  onChange,
}: {
  name: string;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const label = humanize(name);

  if (typeof value === 'boolean') {
    return (
      <Row label={label}>
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            value ? 'bg-brand-500' : 'bg-white/10'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
              value ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </Row>
    );
  }

  if (typeof value === 'number') {
    return (
      <Row label={label}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="input"
        />
      </Row>
    );
  }

  if (typeof value === 'string') {
    const long = value.length > 80 || name === 'summary' || name === 'description' || name === 'detail';
    return (
      <Row label={label}>
        {long ? (
          <textarea
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input resize-y"
          />
        ) : (
          <input value={value} onChange={(e) => onChange(e.target.value)} className="input" />
        )}
      </Row>
    );
  }

  // Array of plain strings → tag editor
  if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
    return (
      <Row label={label}>
        <TagEditor values={value as string[]} onChange={onChange} />
      </Row>
    );
  }

  // Everything else (objects, arrays of objects, null) → JSON editor
  return (
    <Row label={`${label} (JSON)`}>
      <JsonEditor value={value} onChange={onChange} />
    </Row>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function TagEditor({ values, onChange }: { values: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const t = draft.trim();
    if (t && !values.includes(t)) onChange([...values, t]);
    setDraft('');
  };
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {values.map((v, i) => (
          <span
            key={`${v}-${i}`}
            className="inline-flex items-center gap-1 rounded-md bg-brand-500/15 px-2 py-1 text-xs text-brand-200 ring-1 ring-brand-500/25"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="text-brand-300/70 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {values.length === 0 && <span className="px-1 text-xs text-slate-600">No items yet</span>}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Add and press Enter"
          className="input py-2 text-sm"
        />
        <button
          type="button"
          onClick={add}
          className="grid shrink-0 place-items-center rounded-lg bg-white/[0.06] px-3 text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function JsonEditor({ value, onChange }: { value: unknown; onChange: (v: unknown) => void }) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [err, setErr] = useState('');

  return (
    <div>
      <textarea
        rows={Math.min(14, text.split('\n').length + 1)}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          try {
            onChange(JSON.parse(e.target.value));
            setErr('');
          } catch {
            setErr('Invalid JSON — changes paused until fixed');
          }
        }}
        spellCheck={false}
        className="input resize-y font-mono text-xs leading-relaxed"
      />
      {err && <p className="mt-1 text-xs text-amber-300">{err}</p>}
    </div>
  );
}

function humanize(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}
