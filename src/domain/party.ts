import type { BoardState, TerrainId, WorldObject } from './types.js';

export interface PartyMember { character: WorldObject; origin: TerrainId; }
export type PartyRoster = Record<string, PartyMember>;

export function setPartyMembership(state: BoardState, id: string, enabled: boolean): BoardState {
  return { ...state, revision: state.revision + 1, objects: state.objects.map(object =>
    object.id === id ? { ...object, partyMember: enabled } : object
  ) };
}

export function partyRosterFromBoard(state: BoardState, roster: PartyRoster): PartyRoster {
  const next: PartyRoster = { ...roster };
  for (const object of state.objects) {
    if (object.partyMember && (object.catalogId.startsWith('hero-'))) {
      next[object.id] = { character: { ...object }, origin: roster[object.id]?.origin ?? state.terrain };
    }
  }
  return next;
}

export function reconcilePartyOnMap(state: BoardState, roster: PartyRoster): BoardState {
  const existingIds = new Set(state.objects.map(object => object.id));
  const additions: WorldObject[] = [];
  let index = 0;
  for (const member of Object.values(roster)) {
    if (existingIds.has(member.character.id)) continue;
    const { character } = member;
    const x = state.bounds.minX + 2 + index % 4;
    const z = state.bounds.minZ + 2 + Math.floor(index / 4);
    additions.push({ ...character, x, z, elevation: 0, partyMember: true });
    existingIds.add(character.id);
    index += 1;
  }
  const objects = state.objects.map(object => {
    const master = roster[object.id]?.character;
    if (!master || !object.partyMember) return object;
    const { x, z, elevation } = object;
    return { ...master, x, z, elevation, partyMember: true };
  });
  return additions.length || objects.some((o,i) => JSON.stringify(o) !== JSON.stringify(state.objects[i]))
    ? { ...state, objects: [...objects, ...additions], revision: state.revision + 1 }
    : state;
}

export function removePartyFromMap(state: BoardState, id: string, origin: TerrainId): BoardState {
  if (state.terrain === origin) return setPartyMembership(state, id, false);
  const objects = state.objects.filter(object => object.id !== id);
  return objects.length === state.objects.length ? state : { ...state, objects, revision: state.revision + 1 };
}
