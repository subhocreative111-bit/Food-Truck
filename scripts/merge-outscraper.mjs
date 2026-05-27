import XLSX from 'xlsx';

const files = [
  String.raw`C:\Users\Subho Laha\Downloads\Outscraper-20260527092011s25.xlsx`,
  String.raw`C:\Users\Subho Laha\Downloads\Outscraper-20260527092236s9b.xlsx`,
  String.raw`C:\Users\Subho Laha\Downloads\Outscraper-20260527094623s32.xlsx`,
];

const all = [];
for (const path of files) {
  const wb = XLSX.readFile(path);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  console.log(`${path.split('\\').pop()}: ${rows.length} rows`);
  for (const r of rows) all.push({ ...r, __source: path.split('\\').pop() });
}
console.log(`\nTotal raw rows: ${all.length}`);

// Dedupe by place_id, preferring the row with MORE filled fields
function fillCount(r) {
  let n = 0;
  for (const v of Object.values(r)) {
    if (v != null && v !== '' && v !== 'None' && v !== '__NO_PLACE_FOUND__') n++;
  }
  return n;
}
const byPid = new Map();
for (const r of all) {
  if (!r.place_id || r.place_id === '__NO_PLACE_FOUND__') continue;
  const existing = byPid.get(r.place_id);
  if (!existing || fillCount(r) > fillCount(existing)) byPid.set(r.place_id, r);
}
const merged = [...byPid.values()];
console.log(`Unique place_ids after merge: ${merged.length}`);
console.log(`Overlap (in both files): ${all.length - merged.length}`);

// Combined state distribution
const byState = new Map();
for (const r of merged) {
  const s = r.state_code ?? '??';
  byState.set(s, (byState.get(s) ?? 0) + 1);
}
console.log('\n=== States in merged dataset ===');
const sorted = [...byState.entries()].sort((a, b) => b[1] - a[1]);
for (const [s, n] of sorted) console.log(`  ${s.padEnd(4)} ${n}`);
console.log(`Distinct states/territories: ${byState.size}`);

// Field coverage on merged
const fields = ['name', 'phone', 'website', 'working_hours', 'photo', 'rating', 'reviews', 'verified'];
console.log('\n=== Field coverage on merged ===');
for (const f of fields) {
  const n = merged.filter((r) => {
    const v = r[f];
    return v != null && v !== '' && v !== 'None' && v !== false && v !== 'FALSE' && v !== 'False';
  }).length;
  console.log(`  ${f.padEnd(16)} ${n.toString().padStart(5)}  (${((n/merged.length)*100).toFixed(1)}%)`);
}

// Category breakdown (to inform filtering)
const byCat = new Map();
for (const r of merged) {
  const c = r.category ?? '(none)';
  byCat.set(c, (byCat.get(c) ?? 0) + 1);
}
console.log('\n=== Top categories ===');
for (const [c, n] of [...byCat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30)) {
  console.log(`  ${c.padEnd(40)} ${n}`);
}

// Status filter preview
const operational = merged.filter((r) => r.business_status === 'OPERATIONAL').length;
console.log(`\nOPERATIONAL after merge: ${operational}`);

// Persist the merged raw dataset for the importer to consume
import { writeFileSync } from 'node:fs';
writeFileSync('data/outscraper-merged.json', JSON.stringify(merged, null, 0));
console.log(`\nWrote data/outscraper-merged.json (${merged.length} rows)`);
