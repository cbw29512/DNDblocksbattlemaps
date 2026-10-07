export type TerrainId = 'castle' | 'inn' | 'field' | 'sea' | 'volcano';

export type CatalogId =
  | 'stone-block'
  | 'wood-block'
  | 'wall'
  | 'door'
  | 'torch'
  | 'chest'
  | 'orc';

export type BlockShape = 'cube' | 'door' | 'pillar' | 'creature';

export interface GridPosition {
  x: number;
  z: number;
  elevation: number;
}

export interface WorldObject extends GridPosition {
  id: string;
  catalogId: CatalogId;
  createdAt: number;
}

export interface BoardState {
  terrain: TerrainId;
  objects: WorldObject[];
  revision: number;
}

export interface PaletteItem {
  id: CatalogId;
  name: string;
  category: 'Build' | 'Objects' | 'Creatures';
  color: number;
  shape: BlockShape;
  height: number;
  width: number;
  depth: number;
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
  | { kind: 'place'; object: WorldObject }
  | { kind: 'remove'; object: WorldObject }
  | { kind: 'place-many'; objects: WorldObject[] }
  | { kind: 'remove-many'; objects: WorldObject[] };

export interface HistoryState {
  past: EditCommand[];
  future: EditCommand[];
}
