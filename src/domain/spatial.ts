import type { BoardBounds } from './types.js';

export const GRID_FEET = 5;

export const DEFAULT_BOARD_CELLS = 30;
export const BOARD_CELLS = DEFAULT_BOARD_CELLS;
export const BOARD_GROWTH_CELLS = 10;
export const BOARD_MAX_CELLS = 100;
export const BOARD_EDGE_GROW_TRIGGER_CELLS = 1;

export const MAX_BUILD_HEIGHT_FEET = 40;
export const MAX_BUILD_LEVELS = MAX_BUILD_HEIGHT_FEET / GRID_FEET;
export const MAX_BASE_ELEVATION = MAX_BUILD_LEVELS - 1;

export const ROOM_MIN_FEET = 5;
export const ROOM_MAX_LENGTH_FEET = 90;
export const ROOM_MAX_WIDTH_FEET = 90;
export const ROOM_MAX_HEIGHT_FEET = MAX_BUILD_HEIGHT_FEET;

export const DEFAULT_BOARD_BOUNDS: BoardBounds = {
  minX: -DEFAULT_BOARD_CELLS / 2,
  maxX: DEFAULT_BOARD_CELLS / 2,
  minZ: -DEFAULT_BOARD_CELLS / 2,
  maxZ: DEFAULT_BOARD_CELLS / 2
};

export function boardWidth(bounds: BoardBounds): number {
  return bounds.maxX - bounds.minX;
}

export function boardDepth(bounds: BoardBounds): number {
  return bounds.maxZ - bounds.minZ;
}

export function isBoardCell(x: number, z: number, bounds: BoardBounds = DEFAULT_BOARD_BOUNDS): boolean {
  return x >= bounds.minX && x < bounds.maxX && z >= bounds.minZ && z < bounds.maxZ;
}
