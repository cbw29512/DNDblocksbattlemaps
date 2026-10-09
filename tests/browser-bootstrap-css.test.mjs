import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const browserJs = readFileSync(new URL('../web/main.js', import.meta.url), 'utf8');

test('browser entrypoint contains no raw CSS imports', () => {
  assert.ok(!browserJs.split('\n').some(line =>
    line.trim().startsWith('import ') && line.includes('.css')
  ));
});
test('HTML includes all required stylesheets', () => {
  for (const name of ['base', 'home', 'builder']) {
    assert.ok(html.includes('./src/styles/' + name + '.css'), name + ' stylesheet link missing');
  }
});
