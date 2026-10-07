import { growBoardBounds } from './boardBounds.js';
import { MAX_BASE_ELEVATION } from './spatial.js';
import { roomOuterSize, type NormalizedRoom, type RoomCorner } from './room.js';
import { DEFAULT_BOARD_BOUNDS } from './spatial.js';
import type { BoardBounds, GridPosition, WorldObject } from './types.js';

export type RoomAxisDirection = -1 | 1;

export interface RoomOrientation {
  x: RoomAxisDirection;
  z: RoomAxisDirection;
}

export interface RoomPlacement {
  corner: RoomCorner;
  orientation: RoomOrientation;
}

function directionOrder(corner: RoomCorner): RoomOrientation[] {
  const x: RoomAxisDirection = corner.x > 0 ? -1 : 1;
  const z: RoomAxisDirection = corner.z > 0 ? -1 : 1;
  return [
    { x, z },
    { x: -x as RoomAxisDirection, z },
    { x, z: -z as RoomAxisDirection },
    { x: -x as RoomAxisDirection, z: -z as RoomAxisDirection }
  ];
}

function roomExtentPoints(
  room: NormalizedRoom,
  corner: RoomCorner,
  orientation: RoomOrientation
): Array<Pick<GridPosition, 'x' | 'z'>> {
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

export function roomFitsAtCorner(
  room: NormalizedRoom,
  corner: RoomCorner,
  orientation: RoomOrientation,
  bounds: BoardBounds = DEFAULT_BOARD_BOUNDS
): boolean {
  const top = corner.elevation + room.heightLevels - 1;
  if (corner.elevation < 0 || top > MAX_BASE_ELEVATION) return false;
  return growBoardBounds(bounds, roomExtentPoints(room, corner, orientation)) !== null;
}

export function roomWallPositions(
  room: NormalizedRoom,
  placement: RoomPlacement,
  bounds: BoardBounds = DEFAULT_BOARD_BOUNDS
): GridPosition[] {
  if (!roomFitsAtCorner(room, placement.corner, placement.orientation, bounds)) return [];

  const outer = roomOuterSize(room);
  const { corner, orientation } = placement;
  const result: GridPosition[] = [];

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

function overlapScore(
  room: NormalizedRoom,
  placement: RoomPlacement,
  objects: WorldObject[]
): number {
  const outer = roomOuterSize(room);
  const x2 = placement.corner.x + placement.orientation.x * (outer.lengthCells - 1);
  const z2 = placement.corner.z + placement.orientation.z * (outer.widthCells - 1);
  const minX = Math.min(placement.corner.x, x2);
  const maxX = Math.max(placement.corner.x, x2);
  const minZ = Math.min(placement.corner.z, z2);
  const maxZ = Math.max(placement.corner.z, z2);
  const minY = placement.corner.elevation;
  const maxY = minY + room.heightLevels - 1;

  const occupied = new Set<string>();
  for (const object of objects) {
    if (object.x < minX || object.x > maxX || object.z < minZ || object.z > maxZ) continue;
    if (object.elevation < minY || object.elevation > maxY) continue;
    occupied.add(`${object.x},${object.z}`);
  }
  return occupied.size;
}

export function chooseRoomPlacement(
  room: NormalizedRoom,
  corner: RoomCorner,
  objects: WorldObject[],
  bounds: BoardBounds = DEFAULT_BOARD_BOUNDS
): RoomPlacement | null {
  const candidates = directionOrder(corner)
    .map((orientation) => ({ corner, orientation }))
    .filter((placement) => roomFitsAtCorner(room, corner, placement.orientation, bounds));

  let best: RoomPlacement | null = null;
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

export function previewRoomPlacement(corner: RoomCorner): RoomPlacement {
  const first = directionOrder(corner)[0];
  return { corner, orientation: first ?? { x: 1, z: 1 } };
}
