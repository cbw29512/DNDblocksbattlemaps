import { MAX_BASE_ELEVATION } from './spatial.js';
import type { WorldObject } from './types.js';

export function elevationAbove(
  objectElevation: number,
  explicitElevation: number
): number | null {
  const next = Math.max(explicitElevation, objectElevation + 1);
  return next <= MAX_BASE_ELEVATION ? next : null;
}

export function highestElevationAt(
  objects: WorldObject[],
  x: number,
  z: number
): number | null {
  let highest: number | null = null;
  for (const object of objects) {
    if (object.x !== x || object.z !== z) continue;
    highest = highest === null ? object.elevation : Math.max(highest, object.elevation);
  }
  return highest;
}

export function stackElevationAt(
  objects: WorldObject[],
  x: number,
  z: number,
  explicitElevation: number
): number | null {
  if (explicitElevation > MAX_BASE_ELEVATION) return null;
  const highest = highestElevationAt(objects, x, z);
  return highest === null ? explicitElevation : elevationAbove(highest, explicitElevation);
}
