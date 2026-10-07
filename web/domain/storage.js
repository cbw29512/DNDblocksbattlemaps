import { createBoardState } from './commands.js';
const STORAGE_PREFIX = 'dndblocks:stage1:';
function key(terrain) {
    return `${STORAGE_PREFIX}${terrain}`;
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
        return parsed;
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
    localStorage.removeItem(key(terrain));
}
