/** Read-only inventory/export of DND Blocks browser saves. Never mutates Storage. */
export const BACKUP_SCHEMA = 'dndblocks-browser-backup';
export const BACKUP_VERSION = 1;
const PREFIX = 'dndblocks:';
const MAP_PREFIX = 'dndblocks:stage1:';
const CUSTOM_PREFIX = 'dndblocks:custom-map:v1:';
const TERRAIN = new Set(['castle','inn','field','sea','volcano']);
export function classifySaveKey(key) {
  if (key === 'dndblocks:campaign-party:v1') return 'party';
  if (key === 'dndblocks:custom-maps:v1') return 'custom-index';
  if (key.startsWith(CUSTOM_PREFIX)) return 'custom-map';
  if (key.startsWith(MAP_PREFIX) && TERRAIN.has(key.slice(MAP_PREFIX.length))) return 'legacy-map';
  return 'other-project-save';
}
export function inventoryBrowserSaves(storage) {
  const entries = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (typeof key !== 'string' || !key.startsWith(PREFIX)) continue;
    const raw = storage.getItem(key);
    if (raw === null) throw new Error('Save changed during inventory: ' + key);
    let validJson = true;
    try { JSON.parse(raw); } catch { validJson = false; }
    entries.push({ key, category: classifySaveKey(key), raw, validJson });
  }
  entries.sort((a,b) => a.key.localeCompare(b.key,'en'));
  return entries;
}
export function createBrowserBackup(storage, date = new Date().toISOString()) {
  if (typeof date !== 'string' || !Number.isFinite(Date.parse(date))) throw new Error('Invalid backup timestamp');
  const entries = inventoryBrowserSaves(storage);
  return { schema: BACKUP_SCHEMA, version: BACKUP_VERSION, createdAt: date, entries };
}
export function validateBrowserBackup(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      value.schema !== BACKUP_SCHEMA || value.version !== BACKUP_VERSION ||
      typeof value.createdAt !== 'string' || !Number.isFinite(Date.parse(value.createdAt)) ||
      !Array.isArray(value.entries)) return false;
  const keys = new Set();
  for (const item of value.entries) {
    if (!item || typeof item.key !== 'string' || !item.key.startsWith(PREFIX) ||
        typeof item.raw !== 'string' || typeof item.validJson !== 'boolean' ||
        item.category !== classifySaveKey(item.key) || keys.has(item.key)) return false;
    let isJson = true;
    try { JSON.parse(item.raw); } catch { isJson = false; }
    if (isJson !== item.validJson) return false;
    keys.add(item.key);
  }
  return true;
}
