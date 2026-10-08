import { BOARD_EDGE_GROW_TRIGGER_CELLS, BOARD_GROWTH_CELLS, BOARD_MAX_CELLS, DEFAULT_BOARD_BOUNDS, boardDepth, boardWidth } from './spatial.js?v=3be6df529800';
export function createDefaultBoardBounds() {
    return { ...DEFAULT_BOARD_BOUNDS };
}
export function normalizeBoardBounds(value) {
    if (!value || typeof value !== 'object')
        return createDefaultBoardBounds();
    const candidate = value;
    const values = [candidate.minX, candidate.maxX, candidate.minZ, candidate.maxZ];
    if (!values.every((item) => Number.isInteger(item)))
        return createDefaultBoardBounds();
    const bounds = candidate;
    const width = boardWidth(bounds);
    const depth = boardDepth(bounds);
    if (width < 1 || depth < 1 || width > BOARD_MAX_CELLS || depth > BOARD_MAX_CELLS) {
        return createDefaultBoardBounds();
    }
    return { ...bounds };
}
function growNegative(current, opposite, needed) {
    let next = current;
    while (needed <= next + BOARD_EDGE_GROW_TRIGGER_CELLS - 1) {
        const currentSize = opposite - next;
        if (currentSize >= BOARD_MAX_CELLS)
            return null;
        next -= Math.min(BOARD_GROWTH_CELLS, BOARD_MAX_CELLS - currentSize);
    }
    return next;
}
function growPositive(current, opposite, needed) {
    let next = current;
    while (needed >= next - BOARD_EDGE_GROW_TRIGGER_CELLS) {
        const currentSize = next - opposite;
        if (currentSize >= BOARD_MAX_CELLS)
            return null;
        next += Math.min(BOARD_GROWTH_CELLS, BOARD_MAX_CELLS - currentSize);
    }
    return next;
}
export function growBoardBounds(bounds, positions) {
    if (!positions.length)
        return { ...bounds };
    const minNeededX = Math.min(...positions.map((position) => position.x));
    const maxNeededX = Math.max(...positions.map((position) => position.x));
    const minNeededZ = Math.min(...positions.map((position) => position.z));
    const maxNeededZ = Math.max(...positions.map((position) => position.z));
    const minX = growNegative(bounds.minX, bounds.maxX, minNeededX);
    if (minX === null)
        return null;
    const maxX = growPositive(bounds.maxX, minX, maxNeededX);
    if (maxX === null)
        return null;
    const minZ = growNegative(bounds.minZ, bounds.maxZ, minNeededZ);
    if (minZ === null)
        return null;
    const maxZ = growPositive(bounds.maxZ, minZ, maxNeededZ);
    if (maxZ === null)
        return null;
    const grown = { minX, maxX, minZ, maxZ };
    if (boardWidth(grown) > BOARD_MAX_CELLS || boardDepth(grown) > BOARD_MAX_CELLS)
        return null;
    return grown;
}
export function boundsChanged(a, b) {
    return a.minX !== b.minX || a.maxX !== b.maxX || a.minZ !== b.minZ || a.maxZ !== b.maxZ;
}
