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
    if (!raw) return createBoardState(terrain);

    const parsed = JSON.parse(raw) as Partial<BoardState>;
    if (parsed.terrain !== terrain || !Array.isArray(parsed.objects)) {
      return createBoardState(terrain);
    }
    return normalizeBoardState(parsed, terrain);
  } catch (error) {
    console.warn('[state] Could not restore local prototype board.', error);
    return createBoardState(terrain);
  }
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
