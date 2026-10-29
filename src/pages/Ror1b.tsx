import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { ErrorBanner } from '../components/fields';
import KhataMultiSelect from '../components/KhataMultiSelect';
import LocationSelect, { emptyLoc, type Loc } from '../components/LocationSelect';
import PageHeader from '../components/PageHeader';
import ResultPanel from '../components/ResultPanel';

// RoR1B: pick a village, then either every record in it or specific khata numbers.
export default function Ror1b() {
  const [loc, setLoc] = useState<Loc>(emptyLoc);
  const [mode, setMode] = useState<'all' | 'some'>('all');
  const [sel, setSel] = useState<string[]>([]);
  const khatas = useQuery({ queryKey: ['khatas-all', loc.v], queryFn: () => api.allKhatas(loc.v), enabled: mode === 'some' && !!loc.v });
  const pdf = useMutation({ mutationFn: () => api.pdf({ ...loc, khatas: mode === 'all' ? [] : sel }) });
  useEffect(() => () => { if (pdf.data) URL.revokeObjectURL(pdf.data); }, [pdf.data]);
  const ready = loc.d && loc.m && loc.v && (mode === 'all' || sel.length > 0);
  const reset = () => { setLoc(emptyLoc); setSel([]); pdf.reset(); };
  return (
    <div className="wrap">
      <PageHeader title="RoR1B" back="/info" />
      <div className="panel"><div className="body">
        <LocationSelect value={loc} onChange={(l) => { setLoc(l); setSel([]); }} />
        <div className="radios" role="radiogroup" aria-label="Records">
          <label><input type="radio" checked={mode === 'all'} onChange={() => setMode('all')} /> All records in the village</label>
          <label><input type="radio" checked={mode === 'some'} onChange={() => setMode('some')} /> Selected khata numbers</label>
        </div>
        {mode === 'all'
          ? <p className="hint">A whole-village PDF can take a few minutes to generate.</p>
          : <><ErrorBanner error={khatas.error} /><KhataMultiSelect options={khatas.data ?? []} value={sel} onChange={setSel} loading={khatas.isFetching} disabled={!loc.v} /></>}
        <div className="go">
          <button className="btn" disabled={!ready || pdf.isPending} onClick={() => pdf.mutate()}>Submit</button>
          <button className="btn alt" onClick={reset}>Reset</button>
        </div>
      </div></div>
      <ResultPanel title="ROR-1B" hasResult={!!pdf.data} pending={pdf.isPending} error={pdf.error}
        pendingText="Generating ROR-1B…" emptyText="The ROR-1B PDF will show here after you select Submit.">
        <iframe title="ROR-1B PDF" src={pdf.data} />
      </ResultPanel>
    </div>
  );
}
