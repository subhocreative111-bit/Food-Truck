/**
 * One-line state snapshot for the project. Run via `npm run status`.
 * Designed to be cheap and quick — Claude can call this instead of reading
 * trucks.json or grepping for blog post counts.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

function tryJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
}

const trucks = tryJson('data/trucks.json') ?? [];
const blogs = existsSync('lib/blog') ? readdirSync('lib/blog').filter((f) => f.endsWith('.tsx')) : [];
const stateIntros = (() => {
  try {
    const src = readFileSync('lib/state-intros.ts', 'utf8');
    // Match both quoted ('new-york': "...") and unquoted (texas: "...") keys
    // appearing on their own line as object-literal entries.
    return (src.match(/^\s*(?:['"][a-z][a-z-]*['"]|[a-z][a-z]+)\s*:\s*$/gm) || []).length;
  } catch { return 0; }
})();

const states = new Set(trucks.map((t) => t.state).filter(Boolean));
const hasDetail = trucks.filter((t) =>
  Boolean(t.phone || t.website || t.hours || (t.description?.length > 40) || t.featured),
).length;
const onR2 = trucks.filter((t) => t.photos?.[0]?.startsWith('https://pub-')).length;

let lastCommit = '';
try { lastCommit = execSync('git log -1 --oneline', { encoding: 'utf8' }).trim(); } catch {}

console.log(`
foodtrucksnearmeusa  ·  state snapshot

  trucks total:      ${trucks.length.toLocaleString()}
  ├─ with detail:    ${hasDetail.toLocaleString()}
  ├─ photos on R2:   ${onR2.toLocaleString()} (${((onR2 / trucks.length) * 100).toFixed(1)}%)
  └─ states covered: ${states.size}

  blog posts:        ${blogs.length}
  state intros:      ${stateIntros}

  last commit:       ${lastCommit || '(no git)'}
`);
