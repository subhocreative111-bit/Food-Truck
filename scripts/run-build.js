/**
 * One-shot production build for any deployment runner.
 *
 * Why this exists: `npm run build` is a `&&`-chained sequence of npm scripts.
 * Some deployment runners (notably Hostinger's static deploy) parse only the
 * first script in the chain, or run the package.json "build" entry in a shell
 * where `&&` behaves unexpectedly. This script runs all three steps via
 * child_process.execSync so the full pipeline always executes.
 *
 * Hostinger build command setting should be: `node scripts/run-build.js`
 * Output directory should be: `out`
 */
const { execSync } = require('node:child_process');

const steps = [
  ['Generate trucks.json',     'npm run build:data'],
  ['Generate search index',    'npm run build:search'],
  ['Next.js static export',    'npx next build'],
];

for (const [label, cmd] of steps) {
  console.log(`\n========================================`);
  console.log(`>> ${label}`);
  console.log(`>> ${cmd}`);
  console.log(`========================================`);
  execSync(cmd, { stdio: 'inherit' });
}

console.log('\n>> All build steps completed.\n');
