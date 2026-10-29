import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { ErrorBanner } from '../components/fields';
import LandDetailsView from '../components/LandDetailsView';
import LocationSelect, { emptyLoc, type Loc } from '../components/LocationSelect';
import PageHeader from '../components/PageHeader';
import ResultPanel from '../components/ResultPanel';
import SearchSelect from '../components/SearchSelect';

// Land Search Details: district > mandal > village > survey no > khata no, then POST /api/public-data/parsed.
export default function LandSearch() {
  const [loc, setLoc] = useState<Loc>(emptyLoc);
  const [survey, setSurvey] = useState('');
  const [khata, setKhata] = useState('');
  const surveys = useQuery({ queryKey: ['surveys', loc.v], queryFn: () => api.surveys(loc.v), enabled: !!loc.v });
  const validSurvey = !!survey && !!surveys.data?.includes(survey);
  const khatas = useQuery({ queryKey: ['khatas', loc.v, survey], queryFn: () => api.khatas(loc.v, survey), enabled: validSurvey });
  const view = useMutation({
    mutationFn: () => api.landParsed({ villageId: loc.v, searchData: survey, district: loc.d, mandal: loc.m, khataNoIdselect: khata }),
  });
  const ready = loc.d && loc.m && loc.v && validSurvey && khata;
  const reset = () => { setLoc(emptyLoc); setSurvey(''); setKhata(''); view.reset(); };
  return (
    <div className="wrap">
      <PageHeader title="Land Search Details" back="/info" />
      <div className="panel"><h2>Land details search</h2><div className="body">
        <LocationSelect value={loc} onChange={(l) => { setLoc(l); setSurvey(''); setKhata(''); }} />
        <ErrorBanner error={surveys.error || khatas.error} />
        <div className="row">
          <SearchSelect label="Survey No. / Sub-Division No." value={survey} options={surveys.data ?? []} disabled={!loc.v}
            placeholder={surveys.isFetching ? 'Loading survey numbers…' : 'Search survey number'}
            onChange={(s: string) => { setSurvey(s.trim()); setKhata(''); }} />
          <label className="f"><span>Khata No. <i>*</i></span>
            <select value={khata} disabled={!khatas.data?.length} onChange={(e) => setKhata(e.target.value)}>
              <option value="">{khatas.isFetching ? 'Loading…' : 'Select khata number'}</option>
              {khatas.data?.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </label>
        </div>
        <div className="go">
          <button className="btn" disabled={!ready || view.isPending} onClick={() => view.mutate()}>Get land details</button>
          <button className="btn alt" onClick={reset}>Reset</button>
        </div>
      </div></div>
      <ResultPanel title="Land details" hasResult={view.data !== undefined} pending={view.isPending} error={view.error}
        pendingText="Fetching land details…" emptyText="The land details will show here after you select Get land details.">
        {view.data && (Object.keys(view.data.pattadarDetails).length + Object.keys(view.data.landDetails).length === 0
          ? <div className="empty">No land details were returned. The portal session or captcha may have expired.</div>
          : <LandDetailsView data={view.data} />)}
      </ResultPanel>
    </div>
  );
}

