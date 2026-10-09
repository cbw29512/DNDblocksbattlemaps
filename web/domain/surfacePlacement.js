import { elevationAbove } from './placement.js?v=2693d6ceb233';
export function placementFromSurface(clicked, highestInColumn, normal, explicitElevation) {
    if (normal.y > 0.5) {
        const next = elevationAbove(highestInColumn, explicitElevation);
        return next === null ? null : { x: clicked.x, z: clicked.z, elevation: next };
    }
    const absX = Math.abs(normal.x);
    const absZ = Math.abs(normal.z);
    if (Math.max(absX, absZ) < 0.35)
        return null;
    const dx = absX >= absZ ? Math.sign(normal.x) : 0;
    const dz = absZ > absX ? Math.sign(normal.z) : 0;
    // Side placement may intentionally step past the current board edge.
    // The authoritative board-growth layer decides whether the board can expand.
    return { x: clicked.x + dx, z: clicked.z + dz, elevation: clicked.elevation };
}
