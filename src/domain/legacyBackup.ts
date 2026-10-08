/**
 * G0a: read-only snapshot of all DND Blocks browser keys.
 * Preserve raw values, including malformed JSON and orphaned custom maps.
 * This module must never call setItem/removeItem.
 */
export interface BackupStorage {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
}

export interface LocalBackup {
  format: 'dndblocks-local-backup';
  version: 1;
  exportedAt: string;
  entries: { key: string; value: string }[];
  inventory: {
    terrainMaps: string[];
    customMaps: number;
    orphanedCustomMaps: string[];
    missingIndexedMaps: string[];
    partyRosterPresent: boolean;
    malformedJsonKeys: string[];
    otherAppKeys: string[];
    totalKeys: number;
  };
}

const PREFIX = 'dndblocks:';
const CUSTOM_PREFIX = 'dndblocks:custom-map:v1:';
const INDEX_KEY = 'dndblocks:custom-maps:v1';
const PARTY_KEY = 'dndblocks:campaign-party:v1';
const TERRAINS = ['castle', 'inn', 'field', 'sea', 'volcano'] as const;

function appKeys(storage: BackupStorage): string[] {
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key === null) throw new Error('Storage changed while listing keys; retry backup.');
    if (key.startsWith(PREFIX)) keys.push(key);
  }
  return keys.sort();
}

export function createLocalBackup(storage: BackupStorage, exportedAt: Date = new Date()): LocalBackup {
  // Snapshot and verify again to avoid silently exporting a partial concurrent edit.
  const keys = appKeys(storage);
  const entries = keys.map(key => {
    const value = storage.getItem(key);
    if (value === null) throw new Error('A saved entry disappeared during backup; retry.');
    return { key, value };
  });
  if (JSON.stringify(keys) !== JSON.stringify(appKeys(storage)) ||
      entries.some(entry => storage.getItem(entry.key) !== entry.value)) {
    throw new Error('Saved data changed during backup; retry.');
  }

  const values = new Map(entries.map(entry => [entry.key, entry.value]));
  const malformedJsonKeys: string[] = [];
  for (const entry of entries) {
    try { JSON.parse(entry.value); }
    catch { malformedJsonKeys.push(entry.key); }
  }

  const customKeys = keys.filter(key => key.startsWith(CUSTOM_PREFIX));
  const indexedIds = new Set<string>();
  try {
    const index = JSON.parse(values.get(INDEX_KEY) ?? '[]') as unknown;
    if (Array.isArray(index)) {
      for (const row of index) {
        if (row && typeof row === 'object' && 'id' in row && typeof row.id === 'string') {
          indexedIds.add(row.id);
        }
      }
    }
  } catch {
    // Preserve the unparseable index as-is; inventory reports malformed JSON.
  }

  const terrainKeys = TERRAINS.map(terrain => 'dndblocks:stage1:' + terrain);
  const known = new Set([...terrainKeys, PARTY_KEY, INDEX_KEY, ...customKeys]);
  return {
    format: 'dndblocks-local-backup',
    version: 1,
    exportedAt: exportedAt.toISOString(),
    entries,
    inventory: {
      terrainMaps: TERRAINS.filter(terrain => values.has('dndblocks:stage1:' + terrain)),
      customMaps: customKeys.length,
      orphanedCustomMaps: customKeys.filter(key => !indexedIds.has(key.slice(CUSTOM_PREFIX.length))),
      missingIndexedMaps: [...indexedIds].filter(id => !values.has(CUSTOM_PREFIX + id)).sort(),
      partyRosterPresent: values.has(PARTY_KEY),
      malformedJsonKeys,
      otherAppKeys: keys.filter(key => !known.has(key)),
      totalKeys: keys.length
    }
  };
}
