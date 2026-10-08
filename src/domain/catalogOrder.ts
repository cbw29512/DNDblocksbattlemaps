import { catalogIdsForCategory, getCatalogItem } from './catalog.js';
import type { CatalogCategory, CatalogId, TerrainId } from './types.js';

const AREA_TAGS: Record<TerrainId, readonly string[]> = {
  inn: ['inn', 'tavern', 'furniture'],
  castle: ['castle', 'stone', 'dungeon'],
  field: ['field', 'outdoor', 'camp', 'road', 'forest'],
  sea: ['sea', 'ship', 'water', 'dock'],
  volcano: ['volcano', 'lava', 'obsidian', 'fire']
};
const TEMPLATE_TAGS: Record<string, readonly string[]> = {
  dungeon: ['dungeon', 'stone', 'trap'], cave: ['cave', 'rock'],
  temple: ['temple', 'stone', 'pillar'], ruins: ['stone', 'outdoor'],
  forest: ['outdoor', 'camp', 'forest'], harbor: ['sea', 'ship', 'dock'],
  inn: ['inn', 'tavern', 'furniture'], castle: ['castle', 'stone']
};

/** Relevant first, alphabetically within both groups. Never excludes other catalog items. */
export function catalogIdsForArea(category: CatalogCategory, terrain: TerrainId, templateId?: string): CatalogId[] {
  const tags = new Set(templateId && TEMPLATE_TAGS[templateId] ? TEMPLATE_TAGS[templateId] : AREA_TAGS[terrain]);
  const relevance = (id: CatalogId): number =>
    (getCatalogItem(id).tags ?? []).some(tag => tags.has(tag)) ? 0 : 1;
  return [...catalogIdsForCategory(category)].sort((a,b) =>
    relevance(a) - relevance(b) ||
    getCatalogItem(a).name.localeCompare(getCatalogItem(b).name, 'en', { sensitivity: 'base' }) ||
    a.localeCompare(b));
}
