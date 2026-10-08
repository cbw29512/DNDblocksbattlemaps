const PREFIX = 'dndblocks:';
const CUSTOM_PREFIX = 'dndblocks:custom-map:v1:';
const INDEX_KEY = 'dndblocks:custom-maps:v1';
const PARTY_KEY = 'dndblocks:campaign-party:v1';
const TERRAINS = ['castle', 'inn', 'field', 'sea', 'volcano'];
function appKeys(storage) {
    const keys = [];
    for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);
        if (key === null)
            throw new Error('Storage changed while listing keys; retry backup.');
        if (key.startsWith(PREFIX))
            keys.push(key);
    }
    return keys.sort();
}
export function createLocalBackup(storage, exportedAt = new Date()) {
    const keys = appKeys(storage);
    const entries = keys.map(key => {
        const value = storage.getItem(key);
        if (value === null)
            throw new Error('A saved entry disappeared during backup; retry.');
        return { key, value };
    });
    if (JSON.stringify(keys) !== JSON.stringify(appKeys(storage)) ||
        entries.some(entry => storage.getItem(entry.key) !== entry.value)) {
        throw new Error('Saved data changed during backup; retry.');
    }
    const values = new Map(entries.map(entry => [entry.key, entry.value]));
    const malformedJsonKeys = [];
    for (const entry of entries) {
        try {
            JSON.parse(entry.value);
        }
        catch {
            malformedJsonKeys.push(entry.key);
        }
    }
    const customKeys = keys.filter(key => key.startsWith(CUSTOM_PREFIX));
    const indexedIds = new Set();
    try {
        const index = JSON.parse(values.get(INDEX_KEY) ?? '[]');
        if (Array.isArray(index)) {
            for (const row of index) {
                if (row && typeof row === 'object' && 'id' in row && typeof row.id === 'string') {
                    indexedIds.add(row.id);
                }
            }
        }
    }
    catch {
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
