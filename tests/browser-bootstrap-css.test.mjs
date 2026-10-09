import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const browserJs = readFileSync(new URL('../web/main.js', import.meta.url), 'utf8');
test('browser entrypoint contains no raw CSS module imports', () => {
  assert.doesNotMatch(browserJs, /import\\s+['\"][^'\"]+\\.css['\"]/);
});
test('HTML includes all three required site stylesheets', () => {
  for (const name of ['base','home','builder']) assert.match(html, new RegExp('src/styles/' + name + '\\\\.css'));
});
