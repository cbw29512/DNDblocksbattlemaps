import { getCatalogItem } from './catalog.js';
import type { BoardState, WorldObject } from './types.js';

export const PLAYER_RINGS = [
  { color: 0x2688dc, name: 'Blue' }, { color: 0x31b86b, name: 'Green' },
  { color: 0xe0be3d, name: 'Yellow' }, { color: 0xa369d7, name: 'Purple' },
  { color: 0xf18b35, name: 'Orange' }, { color: 0xf4f4f4, name: 'White' }
] as const;

export const CONDITIONS = [
  'Blinded', 'Charmed', 'Deafened', 'Exhaustion', 'Frightened',
  'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified',
  'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious'
] as const;
export type Condition = typeof CONDITIONS[number];

export function isCreature(object: WorldObject): boolean {
  const category = getCatalogItem(object.catalogId).category;
  return category === 'Characters' || category === 'Monsters';
}

export function availableRings(state: BoardState): number[] {
  const assigned = new Set(state.objects.filter(o => getCatalogItem(o.catalogId).category === 'Characters').map(o => o.ringColor).filter((n): n is number => n !== undefined));
  return PLAYER_RINGS.map(r => r.color).filter(n => !assigned.has(n));
}

export function assignRing(state: BoardState, objectId: string, color: number): WorldObject | null {
  const target = state.objects.find(o => o.id === objectId);
  if (!target || getCatalogItem(target.catalogId).category !== 'Characters' ||
    !PLAYER_RINGS.some(r => r.color === color) ||
    state.objects.some(o => o.id !== objectId && getCatalogItem(o.catalogId).category === 'Characters' && o.ringColor === color)) return null;
  return { ...target, ringColor: color };
}

export function toggleCondition(object: WorldObject, condition: Condition): WorldObject {
  if (!CONDITIONS.includes(condition) || !isCreature(object)) return object;
  const conditions = object.conditions ?? [];
  if (condition === 'Exhaustion') {
    const next = ((object.exhaustion ?? 0) + 1) % 7;
    return { ...object, exhaustion: next, conditions: conditions.filter(c => c !== 'Exhaustion') };
  }
  return { ...object, conditions: conditions.includes(condition) ?
    conditions.filter(c => c !== condition) : [...conditions, condition] };
}
