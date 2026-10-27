import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const html = await readFile(path.join(publicDir, 'index.html'), 'utf8');
assert(html.includes('A note from Teacher Wayne'), 'Missing approved personal note');
assert(html.indexOf('/templates.js') < html.indexOf('/studio.js'), 'Template script must load first');
const context = { window: {} };
vm.runInNewContext(await readFile(path.join(publicDir, 'templates.js'), 'utf8'), context);
for (const module of ['softening', 'pushback', 'zoom', 'supply-chain']) {
  const templates = context.window.STUDIO_TEMPLATES[module];
  assert.equal(templates.length, 10, `${module} must contain ten templates`);
  for (const template of templates) assert(template.text?.trim(), 'Template text is missing');
}
for (const country of ['korea', 'japan', 'taiwan']) {
  const page = await readFile(path.join(publicDir, `${country}.html`), 'utf8');
  assert(page.length > 10000, `${country} landing page is still a placeholder`);
  assert(page.includes('country-studio.js'), `${country} is not linked to the studio`);
}
const stylesheet = html.match(/href="([^"]+\.css)"/g)?.find(match => !match.includes('https:'));
assert(stylesheet, 'Missing local stylesheet');
const stylesheetPath = stylesheet.match(/href="([^"]+)"/)[1];
assert(!stylesheetPath.startsWith('/src/'), 'Export must contain compiled CSS, not Vite source references');
await readFile(path.join(publicDir, stylesheetPath.replace(/^\//, '')));
console.info('Package checks passed: 40 templates, Teacher Wayne note, three complete linked landing pages, and compiled stylesheet.');
