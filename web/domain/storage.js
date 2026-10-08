import { normalizeBoardBounds } from './boardBounds.js?v=b60b427fbe81';
import { createBoardState } from './commands.js?v=b60b427fbe81';
const STORAGE_PREFIX = 'dndblocks:stage1:';
function key(terrain) {
    return `${STORAGE_PREFIX}${terrain}`;
}
function normalizeBoardState(parsed, terrain) {
    return {
        terrain,
        bounds: normalizeBoardBounds(parsed.bounds),
        objects: Array.isArray(parsed.objects) ? parsed.objects : [],
        revision: Number.isInteger(parsed.revision) ? Number(parsed.revision) : 0
    };
}
export function loadBoard(terrain) {
    try {
        const raw = localStorage.getItem(key(terrain));
        if (!raw)
            return createBoardState(terrain);
        const parsed = JSON.parse(raw);
        if (parsed.terrain !== terrain || !Array.isArray(parsed.objects)) {
            return createBoardState(terrain);
        }
        return normalizeBoardState(parsed, terrain);
    }
    catch (error) {
        console.warn('[state] Could not restore local prototype board.', error);
        return createBoardState(terrain);
    }
}
export function saveBoard(state) {
    try {
        localStorage.setItem(key(state.terrain), JSON.stringify(state));
    }
    catch (error) {
        console.warn('[state] Could not save local prototype board.', error);
    }
}
export function clearBoard(terrain) {
    try {
        localStorage.removeItem(key(terrain));
    }
    catch (error) {
        console.warn('[state] Could not clear local prototype board.', error);
    }
}
