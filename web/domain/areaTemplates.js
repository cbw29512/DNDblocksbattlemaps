import { GRID_FEET } from './spatial.js?v=083312a16c27';
export const AREA_PRESETS = [
    { id: 'fireball', label: 'Fireball', shape: 'sphere', sizeFeet: 20, maxRangeFeet: 150, visual: 'fire' },
    { id: 'lightning-bolt', label: 'Lightning Bolt', shape: 'line', sizeFeet: 100, widthFeet: 5, maxRangeFeet: 0, originMode: 'self', visual: 'lightning' },
    { id: 'burning-hands', label: 'Burning Hands', shape: 'cone', sizeFeet: 15, maxRangeFeet: 0, originMode: 'self', visual: 'fire' },
    { id: 'cone-of-cold', label: 'Cone of Cold', shape: 'cone', sizeFeet: 60, maxRangeFeet: 0, originMode: 'self', visual: 'cold' },
    { id: 'dragon-fire-cone', label: 'Dragon Fire Breath (cone)', shape: 'cone', sizeFeet: 30, maxRangeFeet: 0, originMode: 'self', visual: 'fire' },
    { id: 'dragon-fire-line', label: 'Dragon Fire Breath (line)', shape: 'line', sizeFeet: 60, widthFeet: 5, maxRangeFeet: 0, originMode: 'self', visual: 'fire' },
    { id: 'cloudkill', label: 'Cloudkill', shape: 'sphere', sizeFeet: 20, maxRangeFeet: 120, visual: 'poison' },
    { id: 'darkness', label: 'Darkness', shape: 'sphere', sizeFeet: 15, maxRangeFeet: 60, visual: 'neutral' }
];
const EPSILON = 0.000001;
export function feetBetween(a, b) {
    return Math.hypot(a.x - b.x, a.z - b.z, a.elevation - b.elevation) * GRID_FEET;
}
/** Grid-center preview, not a complete RAW cover/partial-cell adjudicator. */
export function areaContainsPoint(t, p, point) {
    const cx = (point.x - p.center.x) * GRID_FEET, cz = (point.z - p.center.z) * GRID_FEET;
    const cy = (point.elevation - p.center.elevation) * GRID_FEET;
    // A one-cell-wide horizontal line is a single grouped row of whole cubes.
    // Its direction is chosen by the dominant aim axis. No diagonal approximation is claimed.
    if (t.shape === 'line' && (t.widthFeet ?? 5) === GRID_FEET &&
        p.origin.elevation === p.center.elevation && t.sizeFeet % GRID_FEET === 0) {
        const dx = p.center.x - p.origin.x, dz = p.center.z - p.origin.z;
        if (dx === 0 && dz === 0)
            return false;
        // Eight-direction temporary cube projection. Diagonal step length is 5*sqrt(2) feet.
        const diagonal = Math.abs(dx) > 0 && Math.abs(dz) > 0 &&
            Math.min(Math.abs(dx), Math.abs(dz)) / Math.max(Math.abs(dx), Math.abs(dz)) >= Math.SQRT2 - 1;
        const sx = dx === 0 ? 0 : Math.sign(dx), sz = dz === 0 ? 0 : Math.sign(dz);
        const ux = diagonal ? sx : Math.abs(dx) >= Math.abs(dz) ? sx : 0;
        const uz = diagonal ? sz : Math.abs(dz) > Math.abs(dx) ? sz : 0;
        const step = ux !== 0 ? (point.x - p.origin.x) * ux : (point.z - p.origin.z) * uz;
        return point.elevation === p.origin.elevation && step >= 1 &&
            step * Math.hypot(ux, uz) * GRID_FEET <= t.sizeFeet + EPSILON &&
            point.x === p.origin.x + step * ux && point.z === p.origin.z + step * uz;
    }
    if (t.shape === 'sphere') {
        // Grid cells are full 5-foot volumes, not point samples or horizontal slices.
        // The center and each cell coordinate refer to a grid boundary.
        // Squared distance to the nearest point of the cell's axis-aligned cube
        // gives an exact sphere/cube positive-intersection test.
        const r = t.sizeFeet / GRID_FEET;
        const distanceAxis = (origin, low) => Math.max(low - origin, origin - (low + 1), 0);
        const ax = distanceAxis(p.center.x, point.x);
        const az = distanceAxis(p.center.z, point.z);
        const ay = distanceAxis(p.center.elevation, point.elevation);
        return ax * ax + az * az + ay * ay < r * r - EPSILON;
    }
    if (t.shape === 'cylinder')
        return Math.hypot(cx, cz) <= t.sizeFeet + EPSILON &&
            cy >= -EPSILON && cy <= (t.heightFeet ?? 20) + EPSILON;
    if (t.shape === 'cube') {
        const half = t.sizeFeet / 2;
        return Math.max(Math.abs(cx), Math.abs(cz), Math.abs(cy)) <= half + EPSILON;
    }
    const dx = (p.center.x - p.origin.x) * GRID_FEET, dz = (p.center.z - p.origin.z) * GRID_FEET;
    const dy = (p.center.elevation - p.origin.elevation) * GRID_FEET;
    const dirLength = Math.hypot(dx, dz, dy);
    if (dirLength < EPSILON)
        return false;
    const ox = (point.x - p.origin.x) * GRID_FEET, oz = (point.z - p.origin.z) * GRID_FEET;
    const oy = (point.elevation - p.origin.elevation) * GRID_FEET;
    const forward = (ox * dx + oz * dz + oy * dy) / dirLength;
    if (forward < -EPSILON || forward > t.sizeFeet + EPSILON)
        return false;
    const perpendicular = Math.sqrt(Math.max(0, ox * ox + oz * oz + oy * oy - forward * forward));
    return perpendicular <= (t.shape === 'line' ? (t.widthFeet ?? 5) / 2 : forward / 2) + EPSILON;
}
export function areaCells(t, p, limits) {
    const cells = [];
    for (let y = limits.minElevation; y <= limits.maxElevation; y++)
        for (let z = limits.minZ; z < limits.maxZ; z++)
            for (let x = limits.minX; x < limits.maxX; x++) {
                const cell = { x, z, elevation: y };
                if (areaContainsPoint(t, p, cell))
                    cells.push(cell);
            }
    return cells;
}
export function isInCastingRange(t, p) {
    return t.originMode === 'self' || feetBetween(p.origin, p.center) <= t.maxRangeFeet + EPSILON;
}
/**
 * Grid-template rule for a circular horizontal cross-section (2014/2024 DMG).
 * Uses the exact circle/square intersection geometry with Simpson integration;
 * the 5-foot cell is included when at least half its area lies inside the circle.
 * The center is a grid intersection. Vertical slices are NOT certified by this helper.
 */
export function circularSquareCoverage(radiusFeet, originX, originZ, cellX, cellZ) {
    if (!Number.isFinite(radiusFeet) || radiusFeet <= 0)
        return 0;
    const r = radiusFeet / GRID_FEET;
    const step = 1 / 128;
    let sum = 0;
    for (let i = 0; i <= 128; i++) {
        const x = cellX + i * step;
        const dx = x - originX;
        const extent = Math.sqrt(Math.max(0, r * r - dx * dx));
        const clipped = Math.abs(dx) > r ? 0 : Math.max(0, Math.min(cellZ + 1, originZ + extent) - Math.max(cellZ, originZ - extent));
        sum += (i === 0 || i === 128 ? 1 : i % 2 === 0 ? 2 : 4) * clipped;
    }
    return Math.min(1, Math.max(0, sum * step / 3));
}
export function circularGridCellAffected(radiusFeet, originX, originZ, cellX, cellZ) {
    return circularSquareCoverage(radiusFeet, originX, originZ, cellX, cellZ) >= 0.5 - 1e-9;
}
