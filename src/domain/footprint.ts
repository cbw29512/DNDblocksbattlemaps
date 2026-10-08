import type { GridPosition } from './types.js';

/** A creature occupies one logical object with N × N five-foot cube cells. */
export function cubeFootprint(origin: GridPosition, cells: 1 | 2 | 3 | 4): GridPosition[] {
  if (!Number.isInteger(cells) || cells < 1 || cells > 4) {
    throw new RangeError('[footprint] Cell width must be an integer between 1 and 4.');
  }
  const occupied: GridPosition[] = [];
  for (let dz = 0; dz < cells; dz += 1) {
    for (let dx = 0; dx < cells; dx += 1) {
      occupied.push({ x: origin.x + dx, z: origin.z + dz, elevation: origin.elevation });
    }
  }
  return occupied;
}
