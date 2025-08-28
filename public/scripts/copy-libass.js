// scripts/copy-libass.js
const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'node_modules', 'libass-wasm', 'dist', 'js');
const outDir = path.join(process.cwd(), 'public', 'libass');

const files = [
  'subtitles-octopus.js',
  'subtitles-octopus-worker.js',
  'subtitles-octopus-worker.wasm',
  'subtitles-octopus-worker-legacy.js'
];

fs.mkdirSync(outDir, { recursive: true });
for (const f of files) {
  fs.copyFileSync(path.join(srcDir, f), path.join(outDir, f));
}
console.log('✅ Copied libass-wasm files to public/libass');

