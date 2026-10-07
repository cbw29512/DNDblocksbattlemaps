import type { CatalogId, PaletteItem, TerrainId, TerrainTheme } from './types.js';

export const TERRAIN_THEMES: Record<TerrainId, TerrainTheme> = {
  castle: {
    id: 'castle', name: 'Castle', tagline: 'Stone halls & keeps',
    groundColor: 0x777b77, accentCss: '#d7b56d', swatchCss: 'linear-gradient(135deg,#454946,#9aa09a)'
  },
  inn: {
    id: 'inn', name: 'Inn', tagline: 'Warm rooms & taverns',
    groundColor: 0x75533c, accentCss: '#e1a85e', swatchCss: 'linear-gradient(135deg,#593b2d,#bd875a)'
  },
  field: {
    id: 'field', name: 'Field', tagline: 'Grass, roads & ambushes',
    groundColor: 0x617c45, accentCss: '#9cc56b', swatchCss: 'linear-gradient(135deg,#405b32,#91b769)'
  },
  sea: {
    id: 'sea', name: 'Sea', tagline: 'Docks, ships & islands',
    groundColor: 0x315f74, accentCss: '#6bc7dc', swatchCss: 'linear-gradient(135deg,#254b61,#5da8c2)'
  },
  volcano: {
    id: 'volcano', name: 'Volcano', tagline: 'Lava, rock & danger',
    groundColor: 0x3b302c, accentCss: '#ff7a3d', swatchCss: 'linear-gradient(135deg,#241e1c,#b94a24)'
  }
};

export const PALETTE: Record<CatalogId, PaletteItem> = {
  'stone-block': { id: 'stone-block', name: 'Stone', category: 'Build', color: 0x8c908c, shape: 'cube', height: 1, width: 1, depth: 1 },
  'wood-block': { id: 'wood-block', name: 'Wood', category: 'Build', color: 0x8a5f3d, shape: 'cube', height: 1, width: 1, depth: 1 },
  wall: { id: 'wall', name: 'Wall', category: 'Build', color: 0x666b68, shape: 'cube', height: 1, width: 1, depth: 1 },
  door: { id: 'door', name: 'Door', category: 'Objects', color: 0x70472d, shape: 'door', height: 1, width: 0.82, depth: 0.24 },
  torch: { id: 'torch', name: 'Torch', category: 'Objects', color: 0xe08b37, shape: 'pillar', height: 0.8, width: 0.22, depth: 0.22 },
  chest: { id: 'chest', name: 'Chest', category: 'Objects', color: 0xa36d38, shape: 'cube', height: 0.55, width: 0.72, depth: 0.72 },
  orc: { id: 'orc', name: 'Orc', category: 'Creatures', color: 0x577a4b, shape: 'creature', height: 1.05, width: 0.68, depth: 0.68 }
};

export const DEFAULT_PALETTE: CatalogId[] = ['stone-block', 'wall', 'door', 'torch', 'chest', 'orc'];
