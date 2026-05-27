import XLSX from 'xlsx';

const path = String.raw`C:\Users\Subho Laha\Downloads\Outscraper-20260527092236s9b.xlsx`;
const wb = XLSX.readFile(path);
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

console.log('Total rows:', rows.length);
console.log();

// Field coverage
const fields = ['name', 'address', 'street', 'phone', 'website', 'working_hours', 'photo', 'rating', 'reviews', 'place_id', 'latitude', 'category', 'subtypes'];
console.log('=== Field coverage ===');
for (const f of fields) {
  const n = rows.filter((r) => r[f] != null && r[f] !== '' && r[f] !== 'None' && r[f] !== '__NO_PLACE_FOUND__').length;
  console.log(`  ${f.padEnd(16)} ${n.toString().padStart(5)}  (${((n/rows.length)*100).toFixed(1)}%)`);
}

// Dupes by place_id
const byPid = new Map();
for (const r of rows) {
  if (r.place_id && r.place_id !== '__NO_PLACE_FOUND__') {
    byPid.set(r.place_id, (byPid.get(r.place_id) ?? 0) + 1);
  }
}
const dupes = [...byPid.values()].filter((n) => n > 1);
console.log('\n=== Duplicates ===');
console.log('  Unique place_ids:', byPid.size);
console.log('  Duplicated place_ids (in 2+ city searches):', dupes.length);

// State distribution
const byState = new Map();
for (const r of rows) {
  const s = r.state_code ?? '??';
  byState.set(s, (byState.get(s) ?? 0) + 1);
}
console.log('\n=== State distribution ===');
const sorted = [...byState.entries()].sort((a, b) => b[1] - a[1]);
for (const [s, n] of sorted) console.log(`  ${s.padEnd(4)} ${n}`);
console.log(`  Total distinct state_codes: ${byState.size}`);

// City distribution
const byCity = new Map();
for (const r of rows) {
  const k = `${r.city}, ${r.state_code}`;
  byCity.set(k, (byCity.get(k) ?? 0) + 1);
}
console.log('\n=== Top 20 cities by result count ===');
const topCities = [...byCity.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
for (const [c, n] of topCities) console.log(`  ${c.padEnd(28)} ${n}`);

// Category distribution — what's actually in the data?
const byCat = new Map();
for (const r of rows) {
  const c = r.category ?? '(none)';
  byCat.set(c, (byCat.get(c) ?? 0) + 1);
}
console.log('\n=== Top 25 categories (subtypes) ===');
const topCats = [...byCat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25);
for (const [c, n] of topCats) console.log(`  ${c.padEnd(40)} ${n}`);

// Business status
const byStatus = new Map();
for (const r of rows) {
  const s = r.business_status ?? '(none)';
  byStatus.set(s, (byStatus.get(s) ?? 0) + 1);
}
console.log('\n=== Business status ===');
for (const [s, n] of [...byStatus.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${s.padEnd(40)} ${n}`);

// Verified
const verified = rows.filter((r) => r.verified === true || r.verified === 'TRUE' || r.verified === 'True').length;
console.log('\n=== Verified ===');
console.log('  Verified by owner:', verified);
