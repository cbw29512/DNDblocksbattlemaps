import {
  BOARD_CELLS, GRID_FEET, ROOM_MAX_HEIGHT_FEET,
  ROOM_MAX_LENGTH_FEET, ROOM_MAX_WIDTH_FEET, ROOM_MIN_FEET
} from './spatial.js';
import type { GridPosition } from './types.js';

export interface RoomDimensions {
  lengthFeet: number;
  widthFeet: number;
  heightFeet: number;
}

export interface NormalizedRoom extends RoomDimensions {
  lengthCells: number;
  widthCells: number;
  heightLevels: number;
}

export type RoomCorner = GridPosition;

function snapFeet(value: number): number {
  return Math.round(value / GRID_FEET) * GRID_FEET;
}

export function normalizeRoomDimensions(input: RoomDimensions): NormalizedRoom | null {
  if (![input.lengthFeet, input.widthFeet, input.heightFeet].every(Number.isFinite)) return null;

  const lengthFeet = snapFeet(input.lengthFeet);
  const widthFeet = snapFeet(input.widthFeet);
  const heightFeet = snapFeet(input.heightFeet);

  if (lengthFeet < ROOM_MIN_FEET || lengthFeet > ROOM_MAX_LENGTH_FEET) return null;
  if (widthFeet < ROOM_MIN_FEET || widthFeet > ROOM_MAX_WIDTH_FEET) return null;
  if (heightFeet < ROOM_MIN_FEET || heightFeet > ROOM_MAX_HEIGHT_FEET) return null;

  const lengthCells = lengthFeet / GRID_FEET;
  const widthCells = widthFeet / GRID_FEET;
  const heightLevels = heightFeet / GRID_FEET;

  if (lengthCells + 2 > BOARD_CELLS || widthCells + 2 > BOARD_CELLS) return null;

  return { lengthFeet, widthFeet, heightFeet, lengthCells, widthCells, heightLevels };
}

export function roomOuterSize(room: NormalizedRoom): { lengthCells: number; widthCells: number } {
  return { lengthCells: room.lengthCells + 2, widthCells: room.widthCells + 2 };
}

export function roomSummary(room: NormalizedRoom): string {
  return `${room.lengthFeet} × ${room.widthFeet} × ${room.heightFeet} ft`;
}
