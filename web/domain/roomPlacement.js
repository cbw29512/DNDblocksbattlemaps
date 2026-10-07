import { MAX_BASE_ELEVATION, isBoardCell } from './spatial.js';
import { roomOuterSize } from './room.js';
function directionOrder(corner) {
    const x = corner.x > 0 ? -1 : 1;
    const z = corner.z > 0 ? -1 : 1;
    return [
        { x, z },
        { x: -x, z },
        { x, z: -z },
        { x: -x, z: -z }
    ];
}
export function roomFitsAtCorner(room, corner, orientation) {
    const outer = roomOuterSize(room);
    const farX = corner.x + orientation.x * (outer.lengthCells - 1);
    const farZ = corner.z + orientation.z * (outer.widthCells - 1);
    const top = corner.elevation + room.heightLevels - 1;
    return corner.elevation >= 0
        && top <= MAX_BASE_ELEVATION
        && isBoardCell(corner.x, corner.z)
        && isBoardCell(farX, farZ);
}
export function roomWallPositions(room, placement) {
    if (!roomFitsAtCorner(room, placement.corner, placement.orientation))
        return [];
    const outer = roomOuterSize(room);
    const { corner, orientation } = placement;
    const result = [];
    for (let level = 0; level < room.heightLevels; level += 1) {
        const elevation = corner.elevation + level;
        for (let dx = 0; dx < outer.lengthCells; dx += 1) {
            const x = corner.x + orientation.x * dx;
            result.push({ x, z: corner.z, elevation });
            result.push({
                x,
                z: corner.z + orientation.z * (outer.widthCells - 1),
                elevation
            });
        }
        for (let dz = 1; dz < outer.widthCells - 1; dz += 1) {
            const z = corner.z + orientation.z * dz;
            result.push({ x: corner.x, z, elevation });
            result.push({
                x: corner.x + orientation.x * (outer.lengthCells - 1),
                z,
                elevation
            });
        }
    }
    return result;
}
function overlapScore(room, placement, objects) {
    const outer = roomOuterSize(room);
    const x2 = placement.corner.x + placement.orientation.x * (outer.lengthCells - 1);
    const z2 = placement.corner.z + placement.orientation.z * (outer.widthCells - 1);
    const minX = Math.min(placement.corner.x, x2);
    const maxX = Math.max(placement.corner.x, x2);
    const minZ = Math.min(placement.corner.z, z2);
    const maxZ = Math.max(placement.corner.z, z2);
    const minY = placement.corner.elevation;
    const maxY = minY + room.heightLevels - 1;
    const occupied = new Set();
    for (const object of objects) {
        if (object.x < minX || object.x > maxX || object.z < minZ || object.z > maxZ)
            continue;
        if (object.elevation < minY || object.elevation > maxY)
            continue;
        occupied.add(`${object.x},${object.z}`);
    }
    return occupied.size;
}
export function chooseRoomPlacement(room, corner, objects) {
    const candidates = directionOrder(corner)
        .map((orientation) => ({ corner, orientation }))
        .filter((placement) => roomFitsAtCorner(room, corner, placement.orientation));
    let best = null;
    let bestScore = Number.POSITIVE_INFINITY;
    for (const candidate of candidates) {
        const score = overlapScore(room, candidate, objects);
        if (score < bestScore) {
            best = candidate;
            bestScore = score;
        }
    }
    return best;
}
export function previewRoomPlacement(corner) {
    return { corner, orientation: directionOrder(corner)[0] };
}
