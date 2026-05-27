import XLSX from 'xlsx';

const path = String.raw`C:\Users\Subho Laha\Downloads\Outscraper-20260527094623s32.xlsx`;
const wb = XLSX.readFile(path);
console.log('Sheets:', wb.SheetNames);

for (const name of wb.SheetNames) {
  const ws = wb.Sheets[name];
  const rows = XLSX.utils.sheet_to_json(ws);
  console.log('\n=== Sheet:', name, '·', rows.length, 'rows ===');
  if (rows.length > 0) {
    console.log('\nColumns (' + Object.keys(rows[0]).length + '):');
    for (const k of Object.keys(rows[0])) {
      const sample = rows.find((r) => r[k] != null && r[k] !== '');
      const v = sample ? String(sample[k]).slice(0, 80) : '';
      console.log('  -', k, v ? '→ ' + v : '(empty in row 0)');
    }
    console.log('\nFirst row full JSON:');
    console.log(JSON.stringify(rows[0], null, 2));
  }
}
