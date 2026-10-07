export type TerrainId = 'castle' | 'inn' | 'field' | 'sea' | 'volcano';
export type CatalogCategory = 'Build' | 'Props' | 'Characters' | 'Monsters';

export type CatalogId =
  | 'stone-block' | 'wall' | 'wood-block' | 'wood-wall' | 'door' | 'pillar'
  | 'table' | 'chair' | 'bed' | 'chest' | 'barrel' | 'crate' | 'torch'
  | 'hero-fighter' | 'hero-cleric' | 'hero-rogue' | 'hero-wizard'
  | 'monster-goblin' | 'monster-skeleton' | 'monster-zombie' | 'monster-wolf'
  | 'monster-mimic' | 'monster-ghoul' | 'monster-kobold' | 'monster-bandit'
  | 'orc';

export type BlockShape = 'cube';

export interface CatalogArt {
  src: string;
  alt: string;
  source: 'iron-pit';
  sourceId: string;
}

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
  | { kind: 'place'; object: WorldObject }
  | { kind: 'remove'; object: WorldObject }
  | { kind: 'place-many'; objects: WorldObject[] }
  | { kind: 'remove-many'; objects: WorldObject[] };

export interface HistoryState {
  past: EditCommand[];
  future: EditCommand[];
}
