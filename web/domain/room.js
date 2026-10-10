import { GRID_FEET, ROOM_MAX_HEIGHT_FEET, ROOM_MAX_LENGTH_FEET, ROOM_MAX_WIDTH_FEET, ROOM_MIN_FEET } from './spatial.js?v=b5ed9895f361';
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
    return {
        lengthFeet,
        widthFeet,
        heightFeet,
        lengthCells: lengthFeet / GRID_FEET,
        widthCells: widthFeet / GRID_FEET,
        heightLevels: heightFeet / GRID_FEET
    };
}
export function roomOuterSize(room) {
    return { lengthCells: room.lengthCells + 2, widthCells: room.widthCells + 2 };
}
export function roomSummary(room) {
    return `${room.lengthFeet} × ${room.widthFeet} × ${room.heightFeet} ft`;
}
