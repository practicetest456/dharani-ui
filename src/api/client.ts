// All backend calls live here. Change an endpoint once and every page follows.
// Run `npm run dev:mock` to use the built-in sample data without the backend.
export type Item = { id: number; name: string; telugu?: string };
export type PdfQuery = { d: string; m: string; v: string; khatas?: string[] };
// Body of POST /api/public-data/parsed (PublicDataRequest). searchData = survey number.
export type LandRequest = { villageId: string; searchData: string; district: string; mandal: string; khataNoIdselect: string };
// Response of /api/public-data/parsed (Ror1BLandDetails): two label -> value maps.
export type LandDetails = { pattadarDetails: Record<string, string>; landDetails: Record<string, string> };
type KhataResult = { surveyNo: string; khataNos: string[]; error: string | null };

export class ApiError extends Error {
  constructor(public code: string, message: string) { super(message); }
}

const MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const MD = '/api/bhu_bharati'; // MasterDataController: all dependent dropdowns

async function http(path: string, init?: RequestInit): Promise<Response> {
  let r: Response;
  try { r = await fetch(path, init); } catch {
    throw new ApiError('NETWORK', 'Cannot reach the API. Check that the Spring Boot app is running.');
  }
  if (!r.ok) {
    let m = '';
    try { m = (await r.json()).message; } catch { /* body was not JSON */ }
    throw new ApiError('HTTP_' + r.status, m || 'The API returned an error.');
  }
  return r;
}
const json = async <T,>(path: string) => (await http(path)).json() as Promise<T>;
const numeric = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });

const SURVEYS = ['1', '1/1', '1/2', '2', '3/A', '4', '5/1', '5/2', '6', '7/1', '8', '9'];
const KHATAS = ['346', '1333', '2050', ...Array.from({ length: 45 }, (_, i) => String(1001 + i))];
const MOCK_PDF = '%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 400 200]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n4 0 obj<</Length 44>>stream\nBT /F1 18 Tf 20 100 Td (Demo ROR-1B) Tj ET\nendstream endobj\n5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\ntrailer<</Root 1 0 R>>\n';

export const api = {
  // GET /api/bhu_bharati/mandal/json?districtId=  ->  { metadata, items: [{id,name,telugu}] }
  mandals: async (d: string): Promise<Item[]> =>
    MOCK ? (await sleep(150), [{ id: 193, name: 'Gajwel', telugu: 'గజ్వేల్' }, { id: 632, name: 'Akbarpet-Bhoompally' }])
         : (await json<{ items: Item[] }>(`${MD}/mandal/json?districtId=${d}`)).items,
  // GET /api/bhu_bharati/village/json?mandalId=
  villages: async (m: string): Promise<Item[]> =>
    MOCK ? (await sleep(150), [{ id: 1007004, name: 'Ahmadipur', telugu: 'అహ్మదాపూర్' }, { id: 1007010, name: 'Sample Village' }])
         : (await json<{ items: Item[] }>(`${MD}/village/json?mandalId=${m}`)).items,
  // GET /api/bhu_bharati/surveyNo/json?villageId=  ->  string[]
  surveys: async (v: string): Promise<string[]> =>
    MOCK ? (await sleep(150), SURVEYS) : json<string[]>(`${MD}/surveyNo/json?villageId=${v}`),
  // GET /api/bhu_bharati/khata-numbers/single?surveyNo=&villageId=  ->  { surveyNo, khataNos, error }
  khatas: async (v: string, survey: string): Promise<string[]> => {
    if (MOCK) return (await sleep(150), KHATAS.slice(0, 2 + (survey.length % 3)));
    const r = await json<KhataResult>(`${MD}/khata-numbers/single?surveyNo=${encodeURIComponent(survey)}&villageId=${v}`);
    if (r.error) throw new ApiError('PORTAL', r.error);
    return r.khataNos;
  },
  // GET /api/bhu_bharati/survey_khataNo/json?villageId=  ->  KhataResult[]  (slow for a big village)
  allKhatas: async (v: string): Promise<string[]> => {
    if (MOCK) return (await sleep(200), KHATAS);
    const rows = await json<KhataResult[]>(`${MD}/survey_khataNo/json?villageId=${v}`);
    return [...new Set(rows.filter((x) => !x.error).flatMap((x) => x.khataNos))].sort(numeric);
  },
  // POST /api/public-data/parsed  ->  { pattadarDetails: {...}, landDetails: {...} }
  landParsed: async (req: LandRequest): Promise<LandDetails> => {
    if (MOCK) {
      await sleep(300);
      return {
        pattadarDetails: { District: 'Siddipet', Mandal: 'Gajwel', Village: 'Ahmadipur', 'Pattadar / Authorised Person Name': 'Ramulu', "Father / Husband's Name": 'Narsaiah', 'Khata Number': req.khataNoIdselect },
        landDetails: { 'Total Extent (Ac. Gts)': '0.0500', 'Survey No./ Sub-Division No.': req.searchData, 'Land Status': 'Digital Signed', 'Nature of Land': 'Patta', 'Land Type': 'Agriculture Lands' },
      };
    }
    const r = await http('/api/public-data/parsed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req) });
    return r.json();
  },
  // GET /api/ror1b/optimized-pdf/generate/pdf?districtId=&mandalId=&villageId=&khataNumbers=  ->  PDF (object URL for an iframe)
  pdf: async (q: PdfQuery): Promise<string> => {
    if (MOCK) { await sleep(300); return URL.createObjectURL(new Blob([MOCK_PDF], { type: 'application/pdf' })); }
    const p = new URLSearchParams({ districtId: q.d, mandalId: q.m, villageId: q.v });
    (q.khatas ?? []).forEach((k) => p.append('khataNumbers', k));
    const r = await http(`/api/ror1b/optimized-pdf/generate/pdf?${p}`);
    return URL.createObjectURL(await r.blob());
  },
};