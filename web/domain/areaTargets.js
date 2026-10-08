import { getCatalogItem } from './catalog.js?v=b5a3632acbe5';
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
/** Preview origin at the forward occupied edge of a caster, on its ground plane.
 * Cardinal horizontal aim only; this is not a certified diagonal/3D RAW origin. */
export function selfAreaOriginCell(creature, aim) {
    const cells = creatureOccupiedCells(creature);
    if (cells.length === 0)
        return { x: creature.x, z: creature.z, elevation: creature.elevation };
    const dx = aim.x - creature.x, dz = aim.z - creature.z;
    const horizontal = Math.abs(dx) >= Math.abs(dz);
    const forward = (horizontal ? dx : dz) >= 0 ? 1 : -1;
    const candidates = cells.filter(c => c.elevation === creature.elevation);
    const extreme = Math.max(...candidates.map(c => (horizontal ? c.x : c.z) * forward));
    const face = candidates.filter(c => (horizontal ? c.x : c.z) * forward === extreme);
    const first = face[0];
    if (!first)
        return { x: creature.x, z: creature.z, elevation: creature.elevation };
    return face.reduce((best, c) => {
        const lateral = horizontal ? 'z' : 'x';
        return Math.abs(c[lateral] - aim[lateral]) < Math.abs(best[lateral] - aim[lateral]) ? c : best;
    }, first);
}
