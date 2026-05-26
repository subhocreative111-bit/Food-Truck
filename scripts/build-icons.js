/**
 * Render app/icon.svg into PNG variants for older browsers + iOS.
 * Run once after editing icon.svg:   node scripts/build-icons.js
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'app', 'icon.svg');
const APP = path.join(ROOT, 'app');

if (!fs.existsSync(SRC)) {
  console.error(`Missing ${SRC}`);
  process.exit(1);
}

const svg = fs.readFileSync(SRC);

const targets = [
  // Next App Router auto-discovery file names — icon.svg covers modern
  // browsers; apple-icon.png is what iOS uses for home-screen pins.
  { out: path.join(APP, 'apple-icon.png'),  size: 180 },
];

(async () => {
  for (const t of targets) {
    await sharp(svg, { density: 384 })
      .resize(t.size, t.size)
      .png({ compressionLevel: 9 })
      .toFile(t.out);
    console.log(`  wrote ${path.relative(ROOT, t.out)}  (${t.size}×${t.size})`);
  }
})();
