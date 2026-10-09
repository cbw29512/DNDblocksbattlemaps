import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('homepage CSS media blocks are balanced', () => {
  const source = readFileSync(new URL('../src/styles/home.css', import.meta.url), 'utf8');
  const clean = source.replace(/\/\*[\s\S]*?\*\//g, '');
  let depth = 0;
  for (const ch of clean) {
    if (ch === '{') depth++;
    if (ch === '}') depth--;
    assert.ok(depth >= 0, 'Unexpected closing brace in home.css');
  }
  assert.equal(depth, 0, 'Unclosed CSS block or media query in home.css');
});

test('desktop hero layout is in a desktop media query, not the mobile query', () => {
  const source = readFileSync(new URL('../src/styles/home.css', import.meta.url), 'utf8');
  const desktop = source.indexOf('@media(min-width:901px){');
  assert.ok(desktop > 0);
  const beforeDesktop = source.slice(0, desktop);
  const depth = [...beforeDesktop].reduce((n, c) => n + (c === '{') - (c === '}'), 0);
  assert.equal(depth, 0, 'Desktop media query incorrectly nested inside another CSS block');
});
