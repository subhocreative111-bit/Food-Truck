/**
 * One-shot cleanup: removes brick-and-mortar chain restaurants from
 * data/trucks.json based on lib/chain-blocklist.ts.
 *
 * Run:   npm run clean:chains
 * Or:    tsx scripts/clean-chain-restaurants.ts --dry-run   (preview only)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { matchChain } from '../lib/chain-blocklist';
import type { Truck } from '../lib/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TRUCKS_JSON = resolve(ROOT, 'data', 'trucks.json');

const DRY = process.argv.includes('--dry-run');

if (!existsSync(TRUCKS_JSON)) {
  console.error(`Missing ${TRUCKS_JSON}. Run an import first.`);
  process.exit(1);
}

const before: Truck[] = JSON.parse(readFileSync(TRUCKS_JSON, 'utf8'));
console.log(`[clean-chains] Loaded ${before.length.toLocaleString()} trucks.`);

const removalsByChain = new Map<string, number>();
const removalsByState = new Map<string, number>();
const after: Truck[] = [];

for (const t of before) {
  const chain = matchChain(t.name);
  if (chain) {
    removalsByChain.set(chain, (removalsByChain.get(chain) ?? 0) + 1);
    removalsByState.set(t.state, (removalsByState.get(t.state) ?? 0) + 1);
    continue;
  }
  after.push(t);
}

const removed = before.length - after.length;

console.log(`\n[clean-chains] Would remove ${removed.toLocaleString()} chain-restaurant rows`);
console.log(`[clean-chains] After cleanup: ${after.length.toLocaleString()} trucks (${(removed / before.length * 100).toFixed(1)}% trimmed)`);

console.log('\n[clean-chains] Top 20 chains removed:');
for (const [chain, n] of [...removalsByChain.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
  console.log(`            ${chain.padEnd(28)} ${n.toLocaleString()}`);
}

console.log('\n[clean-chains] Removals by state (top 15):');
for (const [state, n] of [...removalsByState.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)) {
  console.log(`            ${state.padEnd(20)} ${n.toLocaleString()}`);
}

if (DRY) {
  console.log('\n[clean-chains] --dry-run set; not writing file. Re-run without the flag to apply.');
  process.exit(0);
}

writeFileSync(TRUCKS_JSON, JSON.stringify(after));
console.log(`\n[clean-chains] Wrote ${after.length.toLocaleString()} trucks → ${TRUCKS_JSON}`);
