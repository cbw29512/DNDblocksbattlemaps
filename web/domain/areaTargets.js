import { getCatalogItem } from './catalog.js?v=d313c65b7249';
/** Full cubic occupied space of a creature, starting at its anchor. */
export function creatureOccupiedCells(creature) {
    const item = getCatalogItem(creature.catalogId);
    if (item.category !== 'Characters' && item.category !== 'Monsters')
        return [];
    const n = item.category === 'Monsters' ? (item.footprintCells ?? 1) : 1;
    const result = [];
    for (let dx = 0; dx < n; dx++)
        for (let dz = 0; dz < n; dz++)
            for (let dy = 0; dy < n; dy++)
                result.push({ x: creature.x + dx, z: creature.z + dz, elevation: creature.elevation + dy });
    return result;
}
/** Preview-only overlap: targets a creature once, even when multiple of its cubes are covered. */
export function previewAffectedCreatures(objects, area) {
    const occupied = new Set(area.map(p => p.x + ',' + p.z + ',' + p.elevation));
    return objects.filter(o => creatureOccupiedCells(o).some(p => occupied.has(p.x + ',' + p.z + ',' + p.elevation)));
}
