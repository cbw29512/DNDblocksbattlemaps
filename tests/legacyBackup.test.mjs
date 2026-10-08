import test from 'node:test';
import assert from 'node:assert/strict';
import { createLocalBackup } from '../.test-build/src/domain/legacyBackup.js';

function storageOf(seed) {
  const data = new Map(Object.entries(seed));
  return {
    data,
    get length() { return data.size; },
    key(i) { return [...data.keys()][i] ?? null; },
    getItem(k) { return data.get(k) ?? null; }
  };
}

test('backup preserves raw saves, corrupt JSON and orphan maps without writing', () => {
  const original = {
    'dndblocks:stage1:inn': '{"terrain":"inn"}',
    'dndblocks:campaign-party:v1': '{"hero":{}}',
    'dndblocks:custom-maps:v1': '[{"id":"one"},{"id":"missing"}]',
    'dndblocks:custom-map:v1:one': '{"mapId":"one"}',
    'dndblocks:custom-map:v1:orphan': '{broken',
    'another-app': 'private'
  };
  const storage = storageOf(original);
  const backup = createLocalBackup(storage, new Date('2026-10-08T13:00:00Z'));
  assert.equal(backup.version, 1);
  assert.deepEqual(Object.fromEntries(backup.entries.map(x => [x.key, x.value])),
    Object.fromEntries(Object.entries(original).filter(([key]) => key.startsWith('dndblocks:'))));
  assert.deepEqual(backup.inventory.terrainMaps, ['inn']);
  assert.equal(backup.inventory.customMaps, 2);
  assert.deepEqual(backup.inventory.missingIndexedMaps, ['missing']);
  assert.deepEqual(backup.inventory.orphanedCustomMaps, ['dndblocks:custom-map:v1:orphan']);
  assert.deepEqual(backup.inventory.malformedJsonKeys, ['dndblocks:custom-map:v1:orphan']);
  assert.deepEqual(Object.fromEntries(storage.data), original);
});

test('backup handles empty storage without creating records', () => {
  const storage = storageOf({});
  assert.equal(createLocalBackup(storage).entries.length, 0);
  assert.equal(storage.length, 0);
});

test('backup fails closed if an entry changes or disappears', () => {
  const storage = storageOf({ 'dndblocks:stage1:castle': '{"revision":1}' });
  let count = 0;
  storage.getItem = () => ++count === 1 ? '{"revision":1}' : '{"revision":2}';
  assert.throws(() => createLocalBackup(storage), /changed during backup/);
  storage.getItem = () => null;
  assert.throws(() => createLocalBackup(storage), /disappeared during backup/);
});
