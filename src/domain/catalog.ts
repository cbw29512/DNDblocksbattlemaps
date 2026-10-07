import type {
  CatalogArt, CatalogCategory, CatalogId, PaletteItem, TerrainId, TerrainTheme
} from './types.js';

export const TERRAIN_THEMES: Record<TerrainId, TerrainTheme> = {
  castle: { id: 'castle', name: 'Castle', tagline: 'Stone halls & keeps', groundColor: 0x777b77, accentCss: '#d7b56d', swatchCss: 'linear-gradient(135deg,#454946,#9aa09a)' },
  inn: { id: 'inn', name: 'Inn', tagline: 'Warm rooms & taverns', groundColor: 0x75533c, accentCss: '#e1a85e', swatchCss: 'linear-gradient(135deg,#593b2d,#bd875a)' },
  field: { id: 'field', name: 'Field', tagline: 'Grass, roads & ambushes', groundColor: 0x617c45, accentCss: '#9cc56b', swatchCss: 'linear-gradient(135deg,#405b32,#91b769)' },
  sea: { id: 'sea', name: 'Sea', tagline: 'Docks, ships & islands', groundColor: 0x315f74, accentCss: '#6bc7dc', swatchCss: 'linear-gradient(135deg,#254b61,#5da8c2)' },
  volcano: { id: 'volcano', name: 'Volcano', tagline: 'Lava, rock & danger', groundColor: 0x3b302c, accentCss: '#ff7a3d', swatchCss: 'linear-gradient(135deg,#241e1c,#b94a24)' }
};

const heroArt = (id: string, name: string): CatalogArt => ({
  src: `assets/catalog/heroes/${id}.webp`,
  alt: name,
  source: 'iron-pit',
  sourceId: id
});

const monsterArt = (id: string, name: string): CatalogArt => ({
  src: `assets/catalog/monsters/${id}.webp`,
  alt: name,
  source: 'iron-pit',
  sourceId: id
});

const cube = (
  id: CatalogId,
  name: string,
  category: CatalogCategory,
  color: number,
  art?: CatalogArt
): PaletteItem => ({
  id,
  name,
  category,
  color,
  shape: 'cube',
  height: 1,
  width: 1,
  depth: 1,
  footprintCells: 1,
  ...(art ? { art } : {})
});

export const PALETTE: Record<CatalogId, PaletteItem> = {
  'stone-block': cube('stone-block', 'Stone', 'Build', 0x8c908c),
  wall: cube('wall', 'Stone Wall', 'Build', 0x666b68),
  'wood-block': cube('wood-block', 'Wood', 'Build', 0x8a5f3d),
  'wood-wall': cube('wood-wall', 'Wood Wall', 'Build', 0x6d4932),
  door: cube('door', 'Door', 'Build', 0x70472d),
  pillar: cube('pillar', 'Pillar', 'Build', 0x97978f),

  table: cube('table', 'Table', 'Props', 0x7c5335),
  chair: cube('chair', 'Chair', 'Props', 0x765036),
  bed: cube('bed', 'Bed', 'Props', 0x735a4f),
  chest: cube('chest', 'Chest', 'Props', 0xa36d38),
  barrel: cube('barrel', 'Barrel', 'Props', 0x8a5a34),
  crate: cube('crate', 'Crate', 'Props', 0x986a43),
  torch: cube('torch', 'Torch', 'Props', 0xe08b37),

  'hero-fighter': cube('hero-fighter', 'Fighter', 'Characters', 0x8f6d4e, heroArt('hero-2024-fighter', 'Fighter')),
  'hero-cleric': cube('hero-cleric', 'Cleric', 'Characters', 0xb7a87d, heroArt('hero-2024-cleric', 'Cleric')),
  'hero-rogue': cube('hero-rogue', 'Rogue', 'Characters', 0x5f625f, heroArt('hero-2024-rogue', 'Rogue')),
  'hero-wizard': cube('hero-wizard', 'Wizard', 'Characters', 0x5c608d, heroArt('hero-2024-wizard', 'Wizard')),

  'monster-goblin': cube('monster-goblin', 'Goblin', 'Monsters', 0x657b48, monsterArt('goblin', 'Goblin')),
  'monster-skeleton': cube('monster-skeleton', 'Skeleton', 'Monsters', 0xb8b09d, monsterArt('skeleton', 'Skeleton')),
  'monster-zombie': cube('monster-zombie', 'Zombie', 'Monsters', 0x6c7457, monsterArt('zombie', 'Zombie')),
  'monster-wolf': cube('monster-wolf', 'Wolf', 'Monsters', 0x77746c, monsterArt('wolf', 'Wolf')),
  'monster-mimic': cube('monster-mimic', 'Mimic', 'Monsters', 0x79513a, monsterArt('mimic', 'Mimic')),
  'monster-ghoul': cube('monster-ghoul', 'Ghoul', 'Monsters', 0x6f725b, monsterArt('ghoul', 'Ghoul')),
  'monster-kobold': cube('monster-kobold', 'Kobold', 'Monsters', 0x8e5d42, monsterArt('kobold', 'Kobold')),
  'monster-bandit': cube('monster-bandit', 'Bandit', 'Monsters', 0x705d4c, monsterArt('bandit', 'Bandit')),

  // Backward compatibility for existing prototype saves.
  orc: cube('orc', 'Orc', 'Monsters', 0x577a4b)
};

export const CATALOG_CATEGORIES: CatalogCategory[] = ['Build', 'Props', 'Characters', 'Monsters'];

export const DEFAULT_PALETTE: CatalogId[] = [
  'stone-block', 'wall', 'wood-block', 'wood-wall', 'door', 'pillar',
  'table', 'chair', 'bed', 'chest', 'barrel', 'crate', 'torch',
  'hero-fighter', 'hero-cleric', 'hero-rogue', 'hero-wizard',
  'monster-goblin', 'monster-skeleton', 'monster-zombie', 'monster-wolf',
  'monster-mimic', 'monster-ghoul', 'monster-kobold', 'monster-bandit', 'orc'
];

export function catalogIdsForCategory(category: CatalogCategory): CatalogId[] {
  return DEFAULT_PALETTE.filter((id) => PALETTE[id].category === category);
}
