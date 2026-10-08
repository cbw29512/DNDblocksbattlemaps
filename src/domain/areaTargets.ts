import type { AreaPoint } from './areaTemplates.js';
import type { WorldObject } from './types.js';
import { getCatalogItem } from './catalog.js';

/** Full cubic occupied space of a creature, starting at its anchor. */
export function creatureOccupiedCells(creature: WorldObject): AreaPoint[] {
  const item=getCatalogItem(creature.catalogId);
  if(item.category!=='Characters' && item.category!=='Monsters') return [];
  const n=item.category==='Monsters' ? (item.footprintCells ?? 1) : 1;
  const result: AreaPoint[]=[];
  for(let dx=0;dx<n;dx++)for(let dz=0;dz<n;dz++)for(let dy=0;dy<n;dy++)
    result.push({x:creature.x+dx,z:creature.z+dz,elevation:creature.elevation+dy});
  return result;
}
/** Preview-only overlap: targets a creature once, even when multiple of its cubes are covered. */
export function previewAffectedCreatures(objects: readonly WorldObject[], area: readonly AreaPoint[]): WorldObject[] {
  const occupied=new Set(area.map(p=>p.x+','+p.z+','+p.elevation));
  return objects.filter(o=>creatureOccupiedCells(o).some(p=>occupied.has(p.x+','+p.z+','+p.elevation)));
}
