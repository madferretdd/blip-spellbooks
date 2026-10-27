// Checks every book and rebuilds index.json.
//   node tools/check.mjs          check (CI runs this on every pull request)
//   node tools/check.mjs --write  check and rewrite index.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
require('./spellbook.js'); // same checker the app uses
const { Spellbook } = globalThis;

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BROWSERS = ['chrome', 'msedge', 'firefox', 'brave', 'opera', 'vivaldi'];
const reviewed = JSON.parse(fs.readFileSync(path.join(root, 'reviewed.json'), 'utf8'));
let failed = 0;
const entries = [];
for (const f of fs.readdirSync(path.join(root, 'books')).filter((f) => f.endsWith('.json')).sort()) {
  const bytes = fs.readFileSync(path.join(root, 'books', f));
  const r = Spellbook.validate(bytes.toString('utf8'));
  const id = f.replace(/\.json$/, '');
  const say = (kind, msg) => console.log(`${kind} books/${f}: ${msg}`);
  for (const p of r.problems) say(r.ok ? 'note' : 'FAIL', p);
  if (!r.ok) { failed++; continue; }
  if (r.book.id !== id) { say('FAIL', `id "${r.book.id}" must match the file name "${id}"`); failed++; continue; }
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  const unchecked = r.book.recipes.filter((x) => !x.checked).length;
  if (unchecked) say('note', `${unchecked} recipe(s) not tested yet`);
  entries.push({ id, name: r.book.name, version: r.book.version, language: r.book.language, file: `books/${f}`, sha256,
    reviewed: reviewed[id] === sha256, web: r.book.app.title.length > 0 && r.book.app.exe.some((e) => BROWSERS.includes(e)),
    exe: r.book.app.exe, recipes: r.book.recipes.length });
}
const index = JSON.stringify({ spellbooks: 1, books: entries }, null, 2) + '\n';
const indexPath = path.join(root, 'index.json');
if (process.argv.includes('--write')) fs.writeFileSync(indexPath, index);
else if (!fs.existsSync(indexPath) || fs.readFileSync(indexPath, 'utf8') !== index) {
  console.log('FAIL index.json is out of date: run  node tools/check.mjs --write  and commit it'); failed++;
}
for (const id of Object.keys(reviewed)) if (!entries.some((e) => e.id === id)) console.log(`note reviewed.json lists "${id}" but there's no such book`);
const ok = entries.filter((e) => e.reviewed).length;
console.log(`${entries.length} book(s), ${ok} reviewed, ${failed} problem(s)`);
process.exit(failed ? 1 : 0);
