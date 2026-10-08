import { catalogIdsForCategory, getCatalogItem } from './catalog.js?v=86d8296e3087';
const AREA_TAGS = {
    inn: ['inn', 'tavern', 'furniture'],
    castle: ['castle', 'stone', 'dungeon'],
    field: ['field', 'outdoor', 'camp', 'road', 'forest'],
    sea: ['sea', 'ship', 'water', 'dock'],
    volcano: ['volcano', 'lava', 'obsidian', 'fire']
};
const TEMPLATE_TAGS = {
    dungeon: ['dungeon', 'stone', 'trap'], cave: ['cave', 'rock'],
    temple: ['temple', 'stone', 'pillar'], ruins: ['stone', 'outdoor'],
    forest: ['outdoor', 'camp', 'forest'], harbor: ['sea', 'ship', 'dock'],
    inn: ['inn', 'tavern', 'furniture'], castle: ['castle', 'stone']
};
/** Relevant first, alphabetically within both groups. Never excludes other catalog items. */
export function catalogIdsForArea(category, terrain, templateId) {
    const tags = new Set(templateId && TEMPLATE_TAGS[templateId] ? TEMPLATE_TAGS[templateId] : AREA_TAGS[terrain]);
    const relevance = (id) => (getCatalogItem(id).tags ?? []).some(tag => tags.has(tag)) ? 0 : 1;
    return [...catalogIdsForCategory(category)].sort((a, b) => relevance(a) - relevance(b) ||
        getCatalogItem(a).name.localeCompare(getCatalogItem(b).name, 'en', { sensitivity: 'base' }) ||
        a.localeCompare(b));
}
