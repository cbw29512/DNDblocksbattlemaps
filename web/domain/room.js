import { BOARD_CELLS, GRID_FEET, MAX_BASE_ELEVATION, ROOM_MAX_HEIGHT_FEET, ROOM_MAX_LENGTH_FEET, ROOM_MAX_WIDTH_FEET, ROOM_MIN_FEET, isBoardCell } from './spatial.js';
function snapFeet(value) {
    return Math.round(value / GRID_FEET) * GRID_FEET;
}
export function normalizeRoomDimensions(input) {
    if (![input.lengthFeet, input.widthFeet, input.heightFeet].every(Number.isFinite))
        return null;
    const lengthFeet = snapFeet(input.lengthFeet);
    const widthFeet = snapFeet(input.widthFeet);
    const heightFeet = snapFeet(input.heightFeet);
    if (lengthFeet < ROOM_MIN_FEET || lengthFeet > ROOM_MAX_LENGTH_FEET)
        return null;
    if (widthFeet < ROOM_MIN_FEET || widthFeet > ROOM_MAX_WIDTH_FEET)
        return null;
    if (heightFeet < ROOM_MIN_FEET || heightFeet > ROOM_MAX_HEIGHT_FEET)
        return null;
    const lengthCells = lengthFeet / GRID_FEET;
    const widthCells = widthFeet / GRID_FEET;
    const heightLevels = heightFeet / GRID_FEET;
    if (lengthCells + 2 > BOARD_CELLS || widthCells + 2 > BOARD_CELLS)
        return null;
    return { lengthFeet, widthFeet, heightFeet, lengthCells, widthCells, heightLevels };
}
export function roomOuterSize(room) {
    return { lengthCells: room.lengthCells + 2, widthCells: room.widthCells + 2 };
}
export function roomFitsAtCorner(room, corner) {
    const outer = roomOuterSize(room);
    const farX = corner.x + outer.lengthCells - 1;
    const farZ = corner.z + outer.widthCells - 1;
    const topElevation = corner.elevation + room.heightLevels - 1;
    return corner.elevation >= 0
        && topElevation <= MAX_BASE_ELEVATION
        && isBoardCell(corner.x, corner.z)
        && isBoardCell(farX, farZ);
}
export function roomWallPositionsFromCorner(room, corner) {
    if (!roomFitsAtCorner(room, corner))
        return [];
    const outer = roomOuterSize(room);
    const result = [];
    for (let level = 0; level < room.heightLevels; level += 1) {
        const elevation = corner.elevation + level;
        for (let dx = 0; dx < outer.lengthCells; dx += 1) {
            result.push({ x: corner.x + dx, z: corner.z, elevation });
            result.push({ x: corner.x + dx, z: corner.z + outer.widthCells - 1, elevation });
        }
        for (let dz = 1; dz < outer.widthCells - 1; dz += 1) {
            result.push({ x: corner.x, z: corner.z + dz, elevation });
            result.push({ x: corner.x + outer.lengthCells - 1, z: corner.z + dz, elevation });
        }
    }
    return result;
}
export function centeredRoomWallPositions(room) {
    const outer = roomOuterSize(room);
    return roomWallPositionsFromCorner(room, {
        x: -Math.floor(outer.lengthCells / 2),
        z: -Math.floor(outer.widthCells / 2),
        elevation: 0
    });
}
export function roomSummary(room) {
    return `${room.lengthFeet} × ${room.widthFeet} × ${room.heightFeet} ft`;
}
