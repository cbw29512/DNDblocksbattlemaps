import type { BoardState, CatalogId, EditCommand, GridPosition, WorldObject } from './types.js';

export function createBoardState(terrain: BoardState['terrain']): BoardState {
  return { terrain, objects: [], revision: 0 };
}

export function createWorldObject(
  id: string,
  catalogId: CatalogId,
  position: GridPosition,
  createdAt = Date.now()
): WorldObject {
  return { id, catalogId, ...position, createdAt };
}

export function applyCommand(state: BoardState, command: EditCommand): BoardState {
  const objects = command.kind === 'place'
    ? [...state.objects, command.object]
    : state.objects.filter((item) => item.id !== command.object.id);

  return { ...state, objects, revision: state.revision + 1 };
}

export function invertCommand(command: EditCommand): EditCommand {
  return {
    kind: command.kind === 'place' ? 'remove' : 'place',
    object: command.object
  };
}

export function placeCommand(object: WorldObject): EditCommand {
  return { kind: 'place', object };
}

export function removeCommand(object: WorldObject): EditCommand {
  return { kind: 'remove', object };
}

export function findObject(state: BoardState, id: string): WorldObject | undefined {
  return state.objects.find((item) => item.id === id);
}
