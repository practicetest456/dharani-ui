import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { districts } from '../config/districts';
import { ErrorBanner, SelectField } from './fields';

export type Loc = { d: string; m: string; v: string };
export const emptyLoc: Loc = { d: '', m: '', v: '' };

// District > Mandal > Village. Mandals and villages come from /api/bhu_bharati; changing a parent clears its children.
export default function LocationSelect({ value, onChange }: { value: Loc; onChange: (l: Loc) => void }) {
  const ms = useQuery({ queryKey: ['mandals', value.d], queryFn: () => api.mandals(value.d), enabled: !!value.d });
  const vs = useQuery({ queryKey: ['villages', value.m], queryFn: () => api.villages(value.m), enabled: !!value.m });
  return (
    <>
      <ErrorBanner error={ms.error || vs.error} />
      <div className="row">
        <SelectField label="District" value={value.d} items={districts} onChange={(d) => onChange({ d, m: '', v: '' })} />
        <SelectField label="Mandal" value={value.m} items={ms.data ?? []} disabled={!value.d} onChange={(m) => onChange({ ...value, m, v: '' })} />
        <SelectField label="Village" value={value.v} items={vs.data ?? []} disabled={!value.m} onChange={(v) => onChange({ ...value, v })} />
      </div>
    </>
  );
}
