export interface USState {
  name: string;
  slug: string;
  abbr: string;
  /** Roughly centered point — used for the homepage map markers */
  coords: [number, number]; // [lng, lat]
}

export const US_STATES: USState[] = [
  { name: 'Alabama', slug: 'alabama', abbr: 'AL', coords: [-86.79113, 32.806671] },
  { name: 'Alaska', slug: 'alaska', abbr: 'AK', coords: [-152.404419, 61.370716] },
  { name: 'Arizona', slug: 'arizona', abbr: 'AZ', coords: [-111.431221, 33.729759] },
  { name: 'Arkansas', slug: 'arkansas', abbr: 'AR', coords: [-92.373123, 34.969704] },
  { name: 'California', slug: 'california', abbr: 'CA', coords: [-119.681564, 36.116203] },
  { name: 'Colorado', slug: 'colorado', abbr: 'CO', coords: [-105.311104, 39.059811] },
  { name: 'Connecticut', slug: 'connecticut', abbr: 'CT', coords: [-72.755371, 41.597782] },
  { name: 'Delaware', slug: 'delaware', abbr: 'DE', coords: [-75.507141, 39.318523] },
  { name: 'Florida', slug: 'florida', abbr: 'FL', coords: [-81.686783, 27.766279] },
  { name: 'Georgia', slug: 'georgia', abbr: 'GA', coords: [-83.643074, 33.040619] },
  { name: 'Hawaii', slug: 'hawaii', abbr: 'HI', coords: [-157.498337, 21.094318] },
  { name: 'Idaho', slug: 'idaho', abbr: 'ID', coords: [-114.478828, 44.240459] },
  { name: 'Illinois', slug: 'illinois', abbr: 'IL', coords: [-88.986137, 40.349457] },
  { name: 'Indiana', slug: 'indiana', abbr: 'IN', coords: [-86.258278, 39.849426] },
  { name: 'Iowa', slug: 'iowa', abbr: 'IA', coords: [-93.210526, 42.011539] },
  { name: 'Kansas', slug: 'kansas', abbr: 'KS', coords: [-96.726486, 38.526600] },
  { name: 'Kentucky', slug: 'kentucky', abbr: 'KY', coords: [-84.670067, 37.668140] },
  { name: 'Louisiana', slug: 'louisiana', abbr: 'LA', coords: [-91.867805, 31.169546] },
  { name: 'Maine', slug: 'maine', abbr: 'ME', coords: [-69.381927, 44.693947] },
  { name: 'Maryland', slug: 'maryland', abbr: 'MD', coords: [-76.802101, 39.063946] },
  { name: 'Massachusetts', slug: 'massachusetts', abbr: 'MA', coords: [-71.530106, 42.230171] },
  { name: 'Michigan', slug: 'michigan', abbr: 'MI', coords: [-84.536095, 43.326618] },
  { name: 'Minnesota', slug: 'minnesota', abbr: 'MN', coords: [-93.900192, 45.694454] },
  { name: 'Mississippi', slug: 'mississippi', abbr: 'MS', coords: [-89.678696, 32.741646] },
  { name: 'Missouri', slug: 'missouri', abbr: 'MO', coords: [-92.288368, 38.456085] },
  { name: 'Montana', slug: 'montana', abbr: 'MT', coords: [-110.454353, 46.921925] },
  { name: 'Nebraska', slug: 'nebraska', abbr: 'NE', coords: [-98.268082, 41.125370] },
  { name: 'Nevada', slug: 'nevada', abbr: 'NV', coords: [-117.055374, 38.313515] },
  { name: 'New Hampshire', slug: 'new-hampshire', abbr: 'NH', coords: [-71.563896, 43.452492] },
  { name: 'New Jersey', slug: 'new-jersey', abbr: 'NJ', coords: [-74.521011, 40.298904] },
  { name: 'New Mexico', slug: 'new-mexico', abbr: 'NM', coords: [-106.248482, 34.840515] },
  { name: 'New York', slug: 'new-york', abbr: 'NY', coords: [-74.948051, 42.165726] },
  { name: 'North Carolina', slug: 'north-carolina', abbr: 'NC', coords: [-79.806419, 35.630066] },
  { name: 'North Dakota', slug: 'north-dakota', abbr: 'ND', coords: [-99.784012, 47.528912] },
  { name: 'Ohio', slug: 'ohio', abbr: 'OH', coords: [-82.764915, 40.388783] },
  { name: 'Oklahoma', slug: 'oklahoma', abbr: 'OK', coords: [-96.928917, 35.565342] },
  { name: 'Oregon', slug: 'oregon', abbr: 'OR', coords: [-122.070938, 44.572021] },
  { name: 'Pennsylvania', slug: 'pennsylvania', abbr: 'PA', coords: [-77.209755, 40.590752] },
  { name: 'Rhode Island', slug: 'rhode-island', abbr: 'RI', coords: [-71.51178, 41.680893] },
  { name: 'South Carolina', slug: 'south-carolina', abbr: 'SC', coords: [-80.945007, 33.856892] },
  { name: 'South Dakota', slug: 'south-dakota', abbr: 'SD', coords: [-99.438828, 44.299782] },
  { name: 'Tennessee', slug: 'tennessee', abbr: 'TN', coords: [-86.692345, 35.747845] },
  { name: 'Texas', slug: 'texas', abbr: 'TX', coords: [-97.563461, 31.054487] },
  { name: 'Utah', slug: 'utah', abbr: 'UT', coords: [-111.862434, 40.150032] },
  { name: 'Vermont', slug: 'vermont', abbr: 'VT', coords: [-72.710686, 44.045876] },
  { name: 'Virginia', slug: 'virginia', abbr: 'VA', coords: [-78.169968, 37.769337] },
  { name: 'Washington', slug: 'washington', abbr: 'WA', coords: [-121.490494, 47.400902] },
  { name: 'West Virginia', slug: 'west-virginia', abbr: 'WV', coords: [-80.954453, 38.491226] },
  { name: 'Wisconsin', slug: 'wisconsin', abbr: 'WI', coords: [-89.616508, 44.268543] },
  { name: 'Wyoming', slug: 'wyoming', abbr: 'WY', coords: [-107.30249, 42.755966] },
];

export const STATE_BY_SLUG: Record<string, USState> = Object.fromEntries(
  US_STATES.map((s) => [s.slug, s]),
);

export const STATE_BY_NAME: Record<string, USState> = Object.fromEntries(
  US_STATES.map((s) => [s.name.toLowerCase(), s]),
);

export const STATE_BY_ABBR: Record<string, USState> = Object.fromEntries(
  US_STATES.map((s) => [s.abbr, s]),
);
