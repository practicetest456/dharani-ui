import { useEffect, useMemo, useRef, useState } from 'react';

// Searchable dropdown where you can tick one or many khata numbers.
export default function KhataMultiSelect({ options, value, onChange, loading, disabled }: {
  options: string[]; value: string[]; onChange: (v: string[]) => void; loading?: boolean; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const shown = useMemo(() => options.filter((k) => k.toLowerCase().includes(q.trim().toLowerCase())), [options, q]);
  const toggle = (k: string) => onChange(value.includes(k) ? value.filter((x) => x !== k) : [...value, k]);
  const label = loading ? 'Loading khata numbers…' : value.length ? `${value.length} khata number${value.length > 1 ? 's' : ''} selected` : 'Select khata numbers';
  return (
    <div className="mf" ref={ref} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <span>Khata No. <i>*</i></span>
      <button type="button" className="ms" aria-expanded={open} disabled={disabled || loading || !options.length}
        onClick={() => setOpen((o) => !o)}>{label}</button>
      {open && (
        <div className="mspop">
          <input type="text" autoFocus placeholder="Search khata number" aria-label="Search khata numbers" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="msact">
            <button type="button" onClick={() => onChange([...new Set([...value, ...shown])])}>Select all shown</button>
            <button type="button" onClick={() => onChange([])}>Clear</button>
          </div>
          <div className="mslist">
            {shown.length ? shown.map((k) => (
              <label key={k}><input type="checkbox" checked={value.includes(k)} onChange={() => toggle(k)} /> Khata {k}</label>
            )) : <div className="empty">No khata number matches.</div>}
          </div>
        </div>
      )}
      <div className="chipsel">
        {value.map((k) => <button type="button" key={k} aria-label={`Remove khata ${k}`} onClick={() => toggle(k)}>{k} ×</button>)}
      </div>
    </div>
  );
}
