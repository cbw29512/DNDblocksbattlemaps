export type TerrainId = 'castle' | 'inn' | 'field' | 'sea' | 'volcano';
export type CatalogCategory = 'Build' | 'Props' | 'Characters' | 'Monsters';
export type CatalogId = string;
export type BlockShape = 'cube';

export interface CatalogArt {
  src: string;
  alt: string;
  source: 'iron-pit' | 'generated';
  sourceId: string;
}

export interface GridPosition {
  x: number;
  z: number;
  elevation: number;
}

export interface BoardBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface WorldObject extends GridPosition {
  id: string;
  catalogId: CatalogId;
  /** Character-only ring color; red is reserved for monsters. */
  ringColor?: number;
  conditions?: string[];
  exhaustion?: number;
  createdAt: number;
}

export interface BoardState {
  terrain: TerrainId;
  bounds: BoardBounds;
  objects: WorldObject[];
  revision: number;
}

export interface PaletteItem {
  id: CatalogId;
  name: string;
  category: CatalogCategory;
  color: number;
  shape: BlockShape;
  height: number;
  width: number;
  depth: number;
  footprintCells?: 1 | 2 | 3 | 4;
  art?: CatalogArt;
  tags?: string[];
}

export interface TerrainTheme {
  id: TerrainId;
  name: string;
  tagline: string;
  groundColor: number;
  accentCss: string;
  swatchCss: string;
}

export type EditCommand =
  | { kind: 'update'; before: WorldObject; after: WorldObject }
  | { kind: 'place'; object: WorldObject }
  | { kind: 'remove'; object: WorldObject }
  | { kind: 'place-many'; objects: WorldObject[] }
  | { kind: 'remove-many'; objects: WorldObject[] };

export interface HistoryState {
  past: EditCommand[];
  future: EditCommand[];
}
