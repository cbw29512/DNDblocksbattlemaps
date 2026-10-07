import type { BoardBounds, BoardState, WorldObject } from './types.js';

export const PRINT_PAGE_COLUMNS = 8;
export const PRINT_PAGE_ROWS = 10;
export const PRINT_PADDING_CELLS = 1;

export interface PrintArea {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface PrintTile extends PrintArea {
  pageColumn: number;
  pageRow: number;
}

function clampArea(area: PrintArea, bounds: BoardBounds): PrintArea {
  return {
    minX: Math.max(bounds.minX, area.minX),
    maxX: Math.min(bounds.maxX, area.maxX),
    minZ: Math.max(bounds.minZ, area.minZ),
    maxZ: Math.min(bounds.maxZ, area.maxZ)
  };
}

export function printAreaForState(state: BoardState): PrintArea {
  if (!state.objects.length) {
    return {
      minX: state.bounds.minX,
      maxX: Math.min(state.bounds.maxX, state.bounds.minX + PRINT_PAGE_COLUMNS),
      minZ: state.bounds.minZ,
      maxZ: Math.min(state.bounds.maxZ, state.bounds.minZ + PRINT_PAGE_ROWS)
    };
  }

  const xs = state.objects.map((object) => object.x);
  const zs = state.objects.map((object) => object.z);
  return clampArea({
    minX: Math.min(...xs) - PRINT_PADDING_CELLS,
    maxX: Math.max(...xs) + PRINT_PADDING_CELLS + 1,
    minZ: Math.min(...zs) - PRINT_PADDING_CELLS,
    maxZ: Math.max(...zs) + PRINT_PADDING_CELLS + 1
  }, state.bounds);
}

export function printTilesForArea(area: PrintArea): PrintTile[] {
  const tiles: PrintTile[] = [];
  let pageRow = 0;

  for (let z = area.minZ; z < area.maxZ; z += PRINT_PAGE_ROWS) {
    let pageColumn = 0;
    for (let x = area.minX; x < area.maxX; x += PRINT_PAGE_COLUMNS) {
      tiles.push({
        minX: x,
        maxX: Math.min(area.maxX, x + PRINT_PAGE_COLUMNS),
        minZ: z,
        maxZ: Math.min(area.maxZ, z + PRINT_PAGE_ROWS),
        pageColumn,
        pageRow
      });
      pageColumn += 1;
    }
    pageRow += 1;
  }
  return tiles;
}

export function topObjectAt(objects: WorldObject[], x: number, z: number): WorldObject | undefined {
  return objects
    .filter((object) => object.x === x && object.z === z)
    .sort((a, b) => a.elevation - b.elevation || a.createdAt - b.createdAt)
    .at(-1);
}
