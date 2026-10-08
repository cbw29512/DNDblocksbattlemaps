import { STARTER_TEMPLATES, buildStarterTemplate } from './starterTemplates.js?v=d313c65b7249';
import { partyRosterFromBoard, reconcilePartyOnMap, removePartyFromMap } from './party.js?v=d313c65b7249';
import { normalizeBoardBounds } from './boardBounds.js?v=d313c65b7249';
import { createBoardState } from './commands.js?v=d313c65b7249';
const STORAGE_PREFIX = 'dndblocks:stage1:';
function key(terrain) {
    return `${STORAGE_PREFIX}${terrain}`;
}
function normalizeBoardState(parsed, terrain) {
    return {
        terrain,
        ...(typeof parsed.mapId === 'string' ? { mapId: parsed.mapId } : {}),
        ...(parsed.partyStart ? { partyStart: parsed.partyStart } : {}),
        bounds: normalizeBoardBounds(parsed.bounds),
        objects: Array.isArray(parsed.objects) ? parsed.objects : [],
        revision: Number.isInteger(parsed.revision) ? Number(parsed.revision) : 0
    };
}
export function loadBoard(terrain, mapId) {
    try {
        const raw = localStorage.getItem(mapId ? customKey(mapId) : key(terrain));
        if (!raw)
            return reconcilePartyOnMap(createBoardState(terrain), loadPartyRoster());
        const parsed = JSON.parse(raw);
        if (parsed.terrain !== terrain || (mapId && parsed.mapId !== mapId) || !Array.isArray(parsed.objects)) {
            return createBoardState(terrain);
        }
        return reconcilePartyOnMap(normalizeBoardState(parsed, terrain), loadPartyRoster());
    }
    catch (error) {
        console.warn('[state] Could not restore local prototype board.', error);
        return createBoardState(terrain);
    }
}
const PARTY_KEY = 'dndblocks:campaign-party:v1';
const MAPS = ['castle', 'inn', 'field', 'sea', 'volcano'];
const CUSTOM_INDEX = 'dndblocks:custom-maps:v1';
function customKey(id) { return 'dndblocks:custom-map:v1:' + id; }
export function listCampaignMaps() {
    try {
        const raw = JSON.parse(localStorage.getItem(CUSTOM_INDEX) ?? '[]');
        return Array.isArray(raw) ? raw.filter((map) => map && typeof map.id === 'string' && typeof map.name === 'string' &&
            ['inn', 'castle', 'field', 'sea', 'volcano'].includes(map.terrain)) : [];
    }
    catch {
        return [];
    }
}
export function createStarterMap(templateId) {
    const definition = STARTER_TEMPLATES.find(t => t.id === templateId);
    if (!definition)
        throw new Error('Unknown starter map template');
    const id = 'map-' + (crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2));
    const descriptor = { id, terrain: definition.terrain, name: definition.name, templateId };
    const state = buildStarterTemplate(templateId, id, loadPartyRoster());
    const prior = listCampaignMaps();
    if (localStorage.getItem(customKey(id)) !== null)
        throw new Error('Map already exists');
    localStorage.setItem(customKey(id), JSON.stringify(state));
    try {
        localStorage.setItem(CUSTOM_INDEX, JSON.stringify([...prior, descriptor]));
    }
    catch (error) {
        localStorage.removeItem(customKey(id));
        throw error;
    }
    return descriptor;
}
export function loadPartyRoster() {
    try {
        const value = JSON.parse(localStorage.getItem(PARTY_KEY) ?? '{}');
        return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    }
    catch {
        return {};
    }
}
export function propagateParty(state, removedId) {
    try {
        const previous = loadPartyRoster();
        const roster = partyRosterFromBoard(state, previous);
        if (removedId)
            delete roster[removedId];
        localStorage.setItem(PARTY_KEY, JSON.stringify(roster));
        for (const terrain of MAPS) {
            const saved = localStorage.getItem(key(terrain));
            const current = !state.mapId && terrain === state.terrain ? state :
                saved ? normalizeBoardState(JSON.parse(saved), terrain) : createBoardState(terrain);
            const updated = removedId ? removePartyFromMap(current, removedId, previous[removedId]?.origin ?? state.terrain) : current;
            const result = reconcilePartyOnMap(updated, roster);
            localStorage.setItem(key(terrain), JSON.stringify(result));
        }
        for (const map of listCampaignMaps()) {
            const saved = localStorage.getItem(customKey(map.id));
            if (!saved)
                continue;
            const current = state.mapId === map.id ? state :
                normalizeBoardState(JSON.parse(saved), map.terrain);
            const updated = removedId ? removePartyFromMap(current, removedId, previous[removedId]?.origin ?? state.terrain) : current;
            const result = reconcilePartyOnMap(updated, roster);
            localStorage.setItem(customKey(map.id), JSON.stringify(result));
        }
    }
    catch (error) {
        console.warn('[party] Could not synchronize party maps.', error);
    }
}
export function saveBoard(state) {
    try {
        localStorage.setItem(state.mapId ? customKey(state.mapId) : key(state.terrain), JSON.stringify(state));
    }
    catch (error) {
        console.warn('[state] Could not save local prototype board.', error);
    }
}
export function clearBoard(terrain, mapId) {
    try {
        localStorage.removeItem(mapId ? customKey(mapId) : key(terrain));
    }
    catch (error) {
        console.warn('[state] Could not clear local prototype board.', error);
    }
}
