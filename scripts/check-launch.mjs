// Run after `npm run build` and before going live: fails if placeholders would ship.
//   node scripts/check-launch.mjs
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const bad = [];
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|xml|txt)$/.test(f)) {
      const s = readFileSync(p, 'utf8');
      if (s.includes('yourdomain.com')) bad.push(`${p}: still uses yourdomain.com`);
      for (const m of s.matchAll(/href="([^"]*\[[^"]*)"/g)) bad.push(`${p}: href contains a placeholder: ${m[1]}`);
    }
  }
};
walk('dist');
if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
console.log('Launch check passed.');
