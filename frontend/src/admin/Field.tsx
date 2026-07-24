import { useState } from 'react';
import { Plus, X, Info } from 'lucide-react';

/**
 * Fields the API expects as arrays-of-objects (or fixed-shape objects). An
 * empty `[]` is indistinguishable from a list of strings, so these are declared
 * explicitly — otherwise the editor would offer a tag input and the API would
 * reject the strings it produced.
 */
const SHAPES: Record<string, { example: unknown; hint: string }> = {
  highlights: {
    example: { text: 'What was achieved', metric: '' },
    hint: 'Each item needs "text" (required) and an optional "metric".',
  },
  skills: {
    example: { name: 'Skill name', level: 80, note: '' },
    hint: 'Each item needs "name", plus optional "level" (0–100) and "note".',
  },
  workstreams: {
    example: { name: 'Project name', url: 'https://example.com', summary: 'What you did' },
    hint: 'Each item needs "name" and "summary", plus an optional "url".',
  },
  socials: {
    example: { label: 'GitHub', handle: 'username', url: 'https://github.com/u', icon: 'github', order: 1 },
    hint: 'Each item needs "label" and a valid "url".',
  },
  stats: {
    example: { label: 'Label', value: '10', caption: '' },
    hint: 'Each item needs "label" and "value" (both text).',
  },
  links: {
    example: { github: '', live: '' },
    hint: 'Only "github", "live" and "caseStudy" are allowed, and each must be a full URL (https://…). Other keys are ignored.',
  },
  availability: {
    example: { status: 'open', message: '' },
    hint: '"status" must be one of: open, selective, closed.',
  },
};

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
  error,
}: {
  name: string;
  value: unknown;
  onChange: (v: unknown) => void;
  /** Server-side message for this field, shown inline. */
  error?: string;
}) {
  const label = humanize(name);
  const shape = SHAPES[name];

  // Structured fields always get the JSON editor + a shape hint, even when the
  // current value is an empty array (which would otherwise look like a tag list).
  if (shape) {
    return (
      <Row label={`${label} (JSON)`} error={error} hint={shape.hint}>
        <JsonEditor
          value={value}
          onChange={onChange}
          addExample={Array.isArray(value) ? shape.example : undefined}
        />
      </Row>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <Row label={label} error={error}>
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
      <Row label={label} error={error}>
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
      <Row label={label} error={error}>
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
      <Row label={label} error={error}>
        <TagEditor values={value as string[]} onChange={onChange} />
      </Row>
    );
  }

  // Everything else (objects, arrays of objects, null) → JSON editor
  return (
    <Row label={`${label} (JSON)`} error={error}>
      <JsonEditor value={value} onChange={onChange} />
    </Row>
  );
}

function Row({
  label,
  children,
  error,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <label className={`block rounded-lg ${error ? 'ring-1 ring-red-500/40 p-3 -m-1 bg-red-500/[0.04]' : ''}`}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </span>
      {hint && (
        <span className="mb-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-500">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          {hint}
        </span>
      )}
      {children}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-300">⚠ {error}</span>}
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

function JsonEditor({
  value,
  onChange,
  addExample,
}: {
  value: unknown;
  onChange: (v: unknown) => void;
  /** When set, shows an "Add item" button that appends this template. */
  addExample?: unknown;
}) {
  const [text, setText] = useState(() => JSON.stringify(value ?? null, null, 2));
  const [err, setErr] = useState('');

  const write = (next: unknown) => {
    setText(JSON.stringify(next, null, 2));
    onChange(next);
    setErr('');
  };

  const addItem = () => {
    let current: unknown[] = [];
    try {
      const parsed = JSON.parse(text);
      current = Array.isArray(parsed) ? parsed : [];
    } catch {
      current = [];
    }
    write([...current, structuredClone(addExample)]);
  };

  return (
    <div>
      <textarea
        rows={Math.min(16, text.split('\n').length + 1)}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          try {
            onChange(JSON.parse(e.target.value));
            setErr('');
          } catch {
            setErr('Invalid JSON — fix the syntax before saving');
          }
        }}
        spellCheck={false}
        className="input resize-y font-mono text-xs leading-relaxed"
      />
      <div className="mt-1.5 flex items-center gap-3">
        {addExample !== undefined && (
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[11px] text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <Plus className="h-3 w-3" /> Add item
          </button>
        )}
        {err && <p className="text-xs text-amber-300">{err}</p>}
      </div>
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
