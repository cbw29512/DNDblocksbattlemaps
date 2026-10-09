import { growBoardBounds } from './boardBounds.js?v=23ffd3360e40';
import { MAX_BASE_ELEVATION } from './spatial.js?v=23ffd3360e40';
import { roomOuterSize } from './room.js?v=23ffd3360e40';
import { DEFAULT_BOARD_BOUNDS } from './spatial.js?v=23ffd3360e40';
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
function roomExtentPoints(room, corner, orientation) {
    const outer = roomOuterSize(room);
    const farX = corner.x + orientation.x * (outer.lengthCells - 1);
    const farZ = corner.z + orientation.z * (outer.widthCells - 1);
    return [
        { x: corner.x, z: corner.z },
        { x: farX, z: corner.z },
        { x: corner.x, z: farZ },
        { x: farX, z: farZ }
    ];
}
export function roomFitsAtCorner(room, corner, orientation, bounds = DEFAULT_BOARD_BOUNDS) {
    const top = corner.elevation + room.heightLevels - 1;
    if (corner.elevation < 0 || top > MAX_BASE_ELEVATION)
        return false;
    return growBoardBounds(bounds, roomExtentPoints(room, corner, orientation)) !== null;
}
export function roomWallPositions(room, placement, bounds = DEFAULT_BOARD_BOUNDS) {
    if (!roomFitsAtCorner(room, placement.corner, placement.orientation, bounds))
        return [];
    const outer = roomOuterSize(room);
    const { corner, orientation } = placement;
    const result = [];
    for (let level = 0; level < room.heightLevels; level += 1) {
        const elevation = corner.elevation + level;
        for (let dx = 0; dx < outer.lengthCells; dx += 1) {
            const x = corner.x + orientation.x * dx;
            result.push({ x, z: corner.z, elevation });
            result.push({ x, z: corner.z + orientation.z * (outer.widthCells - 1), elevation });
        }
        for (let dz = 1; dz < outer.widthCells - 1; dz += 1) {
            const z = corner.z + orientation.z * dz;
            result.push({ x: corner.x, z, elevation });
            result.push({ x: corner.x + orientation.x * (outer.lengthCells - 1), z, elevation });
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
export function chooseRoomPlacement(room, corner, objects, bounds = DEFAULT_BOARD_BOUNDS) {
    const candidates = directionOrder(corner)
        .map((orientation) => ({ corner, orientation }))
        .filter((placement) => roomFitsAtCorner(room, corner, placement.orientation, bounds));
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
    const first = directionOrder(corner)[0];
    return { corner, orientation: first ?? { x: 1, z: 1 } };
}
