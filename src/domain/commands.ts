import { createDefaultBoardBounds } from './boardBounds.js';
import type { BoardState, CatalogId, EditCommand, GridPosition, WorldObject } from './types.js';

export function createBoardState(terrain: BoardState['terrain']): BoardState {
  return { terrain, bounds: createDefaultBoardBounds(), objects: [], revision: 0 };
}

export function createWorldObject(
  id: string,
  catalogId: CatalogId,
  position: GridPosition,
  createdAt = Date.now(),
  ringColor?: number
): WorldObject {
  return { id, catalogId, ...position, createdAt, ...(ringColor === undefined ? {} : { ringColor }) };
}

export function applyCommand(state: BoardState, command: EditCommand): BoardState {
  let objects = state.objects;
  if (command.kind === 'place') objects = [...objects, command.object];
  if (command.kind === 'remove') objects = objects.filter((item) => item.id !== command.object.id);
  if (command.kind === 'place-many') objects = [...objects, ...command.objects];
  if (command.kind === 'remove-many') {
    const ids = new Set(command.objects.map((item) => item.id));
    objects = objects.filter((item) => !ids.has(item.id));
  }
  return { ...state, objects, revision: state.revision + 1 };
}

export function invertCommand(command: EditCommand): EditCommand {
  if (command.kind === 'place') return { kind: 'remove', object: command.object };
  if (command.kind === 'remove') return { kind: 'place', object: command.object };
  if (command.kind === 'place-many') return { kind: 'remove-many', objects: command.objects };
  return { kind: 'place-many', objects: command.objects };
}

export function placeCommand(object: WorldObject): EditCommand {
  return { kind: 'place', object };
}

export function placeManyCommand(objects: WorldObject[]): EditCommand {
  return { kind: 'place-many', objects };
}

export function removeCommand(object: WorldObject): EditCommand {
  return { kind: 'remove', object };
}

export function findObject(state: BoardState, id: string): WorldObject | undefined {
  return state.objects.find((item) => item.id === id);
}
