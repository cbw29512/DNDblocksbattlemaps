import { partyRosterFromBoard, reconcilePartyOnMap, removePartyFromMap, type PartyRoster } from './party.js';
import { normalizeBoardBounds } from './boardBounds.js';
import { createBoardState } from './commands.js';
import type { BoardState, TerrainId } from './types.js';

const STORAGE_PREFIX = 'dndblocks:stage1:';

function key(terrain: TerrainId): string {
  return `${STORAGE_PREFIX}${terrain}`;
}

function normalizeBoardState(parsed: Partial<BoardState>, terrain: TerrainId): BoardState {
  return {
    terrain,
    bounds: normalizeBoardBounds(parsed.bounds),
    objects: Array.isArray(parsed.objects) ? parsed.objects : [],
    revision: Number.isInteger(parsed.revision) ? Number(parsed.revision) : 0
  };
}

export function loadBoard(terrain: TerrainId): BoardState {
  try {
    const raw = localStorage.getItem(key(terrain));
    if (!raw) return reconcilePartyOnMap(createBoardState(terrain), loadPartyRoster());

    const parsed = JSON.parse(raw) as Partial<BoardState>;
    if (parsed.terrain !== terrain || !Array.isArray(parsed.objects)) {
      return createBoardState(terrain);
    }
    return reconcilePartyOnMap(normalizeBoardState(parsed, terrain), loadPartyRoster());
  } catch (error) {
    console.warn('[state] Could not restore local prototype board.', error);
    return createBoardState(terrain);
  }
}

const PARTY_KEY = 'dndblocks:campaign-party:v1';
const MAPS = ['castle', 'inn', 'field', 'sea', 'volcano'] as const;

export function loadPartyRoster(): PartyRoster {
  try {
    const value = JSON.parse(localStorage.getItem(PARTY_KEY) ?? '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value as PartyRoster : {};
  } catch { return {}; }
}

export function propagateParty(state: BoardState, removedId?: string): void {
  try {
    const previous = loadPartyRoster();
    const roster = partyRosterFromBoard(state, previous);
    if (removedId) delete roster[removedId];
    localStorage.setItem(PARTY_KEY, JSON.stringify(roster));
    for (const terrain of MAPS) {
      const saved = localStorage.getItem(key(terrain));
      const current = terrain === state.terrain ? state :
        saved ? normalizeBoardState(JSON.parse(saved) as BoardState, terrain) : createBoardState(terrain);
      const updated = removedId ? removePartyFromMap(current, removedId, previous[removedId]?.origin ?? state.terrain) : current;
      const result = reconcilePartyOnMap(updated, roster);
      localStorage.setItem(key(terrain), JSON.stringify(result));
    }
  } catch (error) { console.warn('[party] Could not synchronize party maps.', error); }
}

export function saveBoard(state: BoardState): void {
  try {
    localStorage.setItem(key(state.terrain), JSON.stringify(state));
  } catch (error) {
    console.warn('[state] Could not save local prototype board.', error);
  }
}

export function clearBoard(terrain: TerrainId): void {
  try {
    localStorage.removeItem(key(terrain));
  } catch (error) {
    console.warn('[state] Could not clear local prototype board.', error);
  }
}
