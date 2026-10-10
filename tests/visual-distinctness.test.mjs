import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('ice and trapdoors have distinct generated cube-face artwork', () => {
 for (const file of ['../src/domain/faceArt.ts', '../web/domain/faceArt.js']) {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8');
  const textures = source.slice(source.indexOf('function surfaceTexture'), source.indexOf('function illustratedBlockFace'));
  assert.match(textures, /case 'ice': return base \+ '<path/);
  assert.match(textures, /case 'water': return base \+ h/);
  assert.match(textures, /case 'trapdoor': return base \+ '<rect/);
  assert.match(textures, /case 'door': return base \+ '<rect/);
  assert.doesNotMatch(textures, /case 'water':\s*case 'ice'/);
  assert.doesNotMatch(textures, /case 'door':\s*case 'trapdoor'/);
 }
});
