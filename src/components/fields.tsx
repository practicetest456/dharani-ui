import type { Item } from '../api/client';
import { ApiError } from '../api/client';

export function SelectField({ label, value, onChange, items, disabled }: {
  label: string; value: string; onChange: (v: string) => void; items: Item[]; disabled?: boolean;
}) {
  return (
    <label className="f">
      <span>{label} <i>*</i></span>
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select an option</option>
        {items.map((i) => <option key={i.id} value={i.id}>{i.name}{i.telugu ? ` | ${i.telugu}` : ''}</option>)}
      </select>
    </label>
  );
}

export function ErrorBanner({ error }: { error: unknown }) {
  if (!error) return null;
  const code = error instanceof ApiError ? error.code : 'ERROR';
  const msg = error instanceof Error ? error.message : String(error);
  return <div className="banner" role="alert"><b>{code}</b> {msg}</div>;
}
