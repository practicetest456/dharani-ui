// Every dashboard / module tile comes from this file. `to` makes a tile clickable; without it the tile is a placeholder.
export type Module = { title: string; desc: string; color: string; icon: string; to?: string; soon?: boolean };

const blue = '#0d6efd', green = '#0a6b3a', purple = '#6f42c1', teal = '#1ab394', navy = '#2a52a3';

export const dashboardModules: Module[] = [
  { title: 'Information Services', desc: 'ROR-1B, mutation orders, NALA orders, etc.', color: blue, icon: 'ℹ', to: '/info' },
  { title: 'Registration Services', desc: 'Registration applications & transaction.', color: green, icon: '📄', soon: true },
  { title: 'SurveyMap Services (LPM)', desc: 'LPM view, survey map, village map.', color: purple, icon: '📍' },
  { title: 'Revenue Services', desc: 'Market value, challan status, revenue info.', color: teal, icon: '🏛' },
  { title: 'Appeal Services', desc: 'Raise appeal, view appeal status, history.', color: navy, icon: '⚖', soon: true },
];

export const infoModules: Module[] = [
  { title: 'Land Search Details', desc: 'View land records by survey or khata number.', color: blue, icon: '☰', to: '/info/land-search' },
  { title: 'ROR-1B', desc: 'Access Record of Rights & transactions.', color: green, icon: '📄', to: '/info/ror1b' },
  { title: 'Mutation Orders', desc: 'Track mutation status.', color: purple, icon: '📑' },
  { title: 'Nala Orders', desc: 'Track NALA orders and status.', color: teal, icon: '📋' },
  { title: 'Lpm With Bhudhar', desc: 'Access Land Parcel Map.', color: blue, icon: '📍' },
  { title: 'View Market Value Of Lands', desc: 'Know current land market value.', color: green, icon: '₹' },
  { title: 'Registered Document Details', desc: 'View registered document information.', color: purple, icon: '📄' },
  { title: 'My Applications', desc: 'Track status of your applications.', color: teal, icon: '🗂' },
  { title: 'Bhoo Naksha', desc: 'View village and survey maps.', color: blue, icon: '🗺' },
  { title: 'Downloads', desc: 'Download documents.', color: green, icon: '⬇' },
];
