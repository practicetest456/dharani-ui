import type { ReactNode } from 'react';
import type { LandDetails } from '../api/client';

type Map = Record<string, string>;

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]/g, '');

const none = (v: string) =>
  !v || /^-+$/.test(v);

// "Mittapalle | మిట్టపల్లి" -> English + Telugu.
const bi = (v: string) => {
  const [en, te] = v.split('|').map((s) => s.trim());
  return { en: en || '-', te: te || '' };
};

// "X / X" with identical halves is shown once.
const dedupe = (v: string) => {
  const p = v.split(' / ').map((x) => x.trim());
  return p.length === 2 && p[0] === p[1] ? p[0] : v;
};

const inr = (v: string) => {
  const n = Number(v);
  return v && !isNaN(n)
    ? '₹ ' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
    : v || '-';
};

function reader(m: Map) {
  const used = new Set<string>();

  const get = (label: string) => {
    const key = Object.keys(m).find((k) =>
      norm(k).startsWith(norm(label))
    );

    if (key) used.add(key);
    return key ? m[key].trim() : '';
  };

  return {
    get,
    rest: () => Object.entries(m).filter(([k]) => !used.has(k))
  };
}

const SummaryItem = ({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="land-summary-item">
    <span>{label}</span>
    <strong>{children}</strong>
  </div>
);

const DetailRow = ({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="land-detail-row">
    <dt>{label}</dt>
    <dd>{children}</dd>
  </div>
);

const Location = ({
  label,
  value
}: {
  label: string;
  value: { en: string; te: string };
}) => (
  <div className="land-location">
    <span>{label}</span>
    <strong>
      {value.en}
      {value.te && <> | {value.te}</>}
    </strong>
  </div>
);

export default function LandDetailsView({ data }: { data: LandDetails }) {
  const p = reader(data.pattadarDetails);
  const l = reader(data.landDetails);

  const village = bi(p.get('Village'));
  const mandal = bi(p.get('Mandal'));
  const district = bi(p.get('District'));

  const name = dedupe(p.get('Pattadar'));
  const father = dedupe(p.get('Father'));
  const ppb = p.get('PPB');
  const ekyc = p.get('eKYC');
  const khata = p.get('Khata');

  const survey = l.get('Survey No');
  const extent = l.get('Total Extent');
  const value = l.get('Market value');
  const status = l.get('Land Status');
  const nature = l.get('Nature');
  const cls = l.get('Classification');
  const type = l.get('Land Type');
  const tx = l.get('Transaction');

  const more = [...p.rest(), ...l.rest()];

  return (
    <article className="land-record">
      <header className="land-location-header">
        <Location label="District" value={district} />
        <Location label="Mandal" value={mandal} />
        <Location label="Village" value={village} />
      </header>

      <div className="land-content">
        <section className="land-summary">
          <SummaryItem label="Survey No.">
            {survey || '-'}
          </SummaryItem>

          <SummaryItem label="Khata No.">
            {khata || '-'}
          </SummaryItem>

          <SummaryItem label="Total extent (Ac. Gts)">
            {extent || '-'}
          </SummaryItem>

          <SummaryItem label="Market value">
            {inr(value)}
          </SummaryItem>
        </section>

        <div className="land-details-grid">
          <section className="land-card">
            <h2>PATTADAR DETAILS</h2>

            <dl>
              <DetailRow label="Name">
                {name || '-'}
              </DetailRow>

              <DetailRow label="Father / Husband">
                {father || '-'}
              </DetailRow>

              <DetailRow label="PPB number">
                {ppb || '-'}
              </DetailRow>

              <DetailRow label="eKYC status">
                {none(ekyc) ? 'Not available' : ekyc}
              </DetailRow>
            </dl>
          </section>

          <section className="land-card">
            <h2>LAND DETAILS</h2>

            <dl>
              <DetailRow label="Land status">
                {status || '-'}
              </DetailRow>

              <DetailRow label="Nature of land">
                {nature || '-'}
              </DetailRow>

              <DetailRow label="Classification of land">
                {cls || '-'}
              </DetailRow>

              <DetailRow label="Land type">
                {type || '-'}
              </DetailRow>

              <DetailRow label="Transaction status">
                {tx || '--'}
              </DetailRow>

              {more.map(([k, v]) => (
                <DetailRow key={k} label={k}>
                  {v || '-'}
                </DetailRow>
              ))}
            </dl>
          </section>
        </div>

        <footer className="land-footer">
          <div className="land-disclaimer">
            <div>
              <strong>Disclaimer - </strong>
              The information provided online is updated, and no physical visit is required.
            </div>
            <div>
              Click here for CERSAI for Asset Based Search.
            </div>
            <div>
              <strong>Note : </strong>
              Records are updated as on - {new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
