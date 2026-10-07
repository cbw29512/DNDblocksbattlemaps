import { elevationAbove } from './placement.js';
import { isBoardCell } from './spatial.js';
import type { GridPosition } from './types.js';

export interface SurfaceNormal {
  x: number;
  y: number;
  z: number;
}

export function placementFromSurface(
  clicked: GridPosition,
  highestInColumn: number,
  normal: SurfaceNormal,
  explicitElevation: number
): GridPosition | null {
  if (normal.y > 0.5) {
    const next = elevationAbove(highestInColumn, explicitElevation);
    return next === null ? null : { x: clicked.x, z: clicked.z, elevation: next };
  }

  const absX = Math.abs(normal.x);
  const absZ = Math.abs(normal.z);
  if (Math.max(absX, absZ) < 0.35) return null;

  const dx = absX >= absZ ? Math.sign(normal.x) : 0;
  const dz = absZ > absX ? Math.sign(normal.z) : 0;
  const x = clicked.x + dx;
  const z = clicked.z + dz;
  if (!isBoardCell(x, z)) return null;

  return { x, z, elevation: clicked.elevation };
}
