/**
 * Brick-and-mortar restaurant chains that should never appear in a food-truck
 * directory. The original legacy-HTML scraper grabbed nearby restaurants when
 * users searched "food trucks near me" — so the dataset got polluted with
 * Subway, Wendy's, Domino's, etc.
 *
 * Matching is conservative: a truck row is removed only if its name STARTS
 * WITH one of these chain names (after normalization). That handles
 *   "Subway"                  → match
 *   "Subway #1234"            → match
 *   "Subway - Hoboken"        → match
 *   "The Subway Food Truck"   → no match (independent operator)
 *   "Cousins Maine Lobster"   → no match (we keep this — they really are trucks)
 */

/** Lowercase + strip punctuation + collapse whitespace for a stable compare. */
export function normalizeName(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')         // strip diacritics
    .replace(/[''`]/g, '')                  // strip apostrophes
    .replace(/[.,!?:;()&\-/\\]/g, ' ')     // strip common punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Canonical chain names — already normalized via normalizeName().
 * Grouped purely for readability; matching ignores groups.
 */
export const CHAIN_BLOCKLIST: string[] = [
  // ── Burgers
  'mcdonalds', 'burger king', 'wendys', 'five guys', 'in n out', 'in n out burger',
  'jack in the box', 'carls jr', 'hardees', 'whataburger', 'sonic drive in',
  'sonic', 'steak n shake', 'white castle', 'krystal', 'checkers', 'rallys',
  'smashburger', 'mooyah burgers fries shakes', 'mooyah', 'culvers',
  'a w', 'a and w', 'fatburger', 'shake shack', 'red robin',

  // ── Pizza
  'dominos', 'dominos pizza', 'pizza hut', 'papa johns', 'little caesars',
  'marcos pizza', 'round table pizza', 'california pizza kitchen', 'cpk',
  'papa murphys', 'sbarro', 'jets pizza',

  // ── Subs / sandwiches
  'subway', 'jersey mikes', 'jersey mikes subs', 'jimmy johns', 'quiznos',
  'firehouse subs', 'potbelly', 'arbys', 'cousins subs', 'schlotzskys',
  'blimpie', 'mr sub', 'lennys', 'penn station east coast subs',
  'penn station', 'pretzelmaker', 'auntie annes', 'einstein bros bagels',
  'einstein bros', 'brueggers', 'bagel street',

  // ── Chicken
  'kfc', 'chick fil a', 'popeyes', 'popeyes louisiana kitchen', 'churchs chicken',
  'churchs', 'bojangles', 'zaxbys', 'raising canes', 'wingstop', 'buffalo wild wings',
  'pollo tropical', 'el pollo loco', 'pdq', 'pollo campero', 'wing zone',
  'wingit on', 'super chix',

  // ── Mexican chains
  'taco bell', 'chipotle', 'chipotle mexican grill', 'qdoba', 'qdoba mexican eats',
  'del taco', 'moes southwest grill', 'moes', 'baja fresh', 'rubios',
  'rubios coastal grill', 'taco johns', 'taco cabana', 'pancheros',
  'pancheros mexican grill',

  // ── Donuts / coffee
  'dunkin', 'dunkin donuts', 'starbucks', 'starbucks coffee', 'krispy kreme',
  'tim hortons', 'peets coffee', 'caribou coffee', 'tropical smoothie cafe',
  'jamba juice', 'jamba', 'smoothie king', 'planet smoothie',
  'philz coffee', 'biggby coffee',

  // ── Asian chains
  'panda express', 'p f changs', 'pf changs', 'pei wei', 'pei wei asian diner',
  'pick up stix', 'sarku japan', 'sushi katsu',

  // ── BBQ / steakhouse chains
  'dickeys barbecue pit', 'dickeys', 'mission bbq', 'famous daves',
  'texas roadhouse', 'longhorn steakhouse', 'outback steakhouse',
  'ruby tuesday', 'logans roadhouse', 'rib crib', 'sonny s bbq',

  // ── Family / diner chains
  'ihop', 'dennys', 'waffle house', 'cracker barrel', 'bob evans',
  'perkins restaurant', 'perkins', 'big boy', 'first watch', 'another broken egg',

  // ── Casual dining
  'applebees', 'tgi fridays', 'tgi friday s', 'chilis', 'olive garden',
  'red lobster', 'longhorn', 'chuck e cheese', 'chuck e cheeses',
  'cheesecake factory', 'the cheesecake factory',

  // ── Ice cream / dessert chains
  'baskin robbins', 'dairy queen', 'cold stone creamery', 'cold stone',
  'carvel', 'friendlys', 'ben and jerrys', 'haagen dazs', 'menchies',
  'orange leaf', 'tcby', 'rita s', 'ritas italian ice',
  'crumbl', 'crumbl cookies', 'insomnia cookies',

  // ── Other fast-casual chains
  'panera bread', 'panera', 'boston market', 'corner bakery cafe',
  'corner bakery', 'au bon pain', 'noodles company', 'noodles and company',
  'firehouse', 'genghis grill', 'pollo tropical',

  // ── Convenience / gas-station food
  '7 eleven', '7eleven', 'wawa', 'sheetz', 'speedway', 'circle k',
  'caseys general store', 'caseys', 'quiktrip', 'racetrac', 'pilot travel center',
  'loves travel stop', 'kwik trip', 'kum and go', 'maverik',

  // ── Mass-market retail food
  'walmart', 'target', 'costco', 'costco wholesale', 'sams club', 'kroger',
  'publix', 'whole foods', 'whole foods market', 'trader joes',

  // ── Misc.
  'long john silvers', 'captain ds', 'church s chicken',
  'jacks family restaurants', 'jacks', 'culver s',
  'wienerschnitzel', 'fuddruckers', 'red rock canyon grill',
];

const NORMALIZED = CHAIN_BLOCKLIST.map(normalizeName).filter(Boolean);
// Sort longest-first so "subway sandwich" matches before "subway"
NORMALIZED.sort((a, b) => b.length - a.length);

/**
 * True when the truck name starts with a known brick-and-mortar chain.
 * Returns the matched chain name (for reporting), or null.
 */
export function matchChain(rawName: string): string | null {
  const n = normalizeName(rawName);
  if (!n) return null;
  for (const chain of NORMALIZED) {
    if (n === chain) return chain;
    if (n.startsWith(chain + ' ')) return chain;
  }
  return null;
}

export function isChainRestaurant(rawName: string): boolean {
  return matchChain(rawName) !== null;
}
