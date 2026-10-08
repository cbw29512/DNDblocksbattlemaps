import { createDefaultBoardBounds } from './boardBounds.js?v=b60b427fbe81';
export function createBoardState(terrain) {
    return { terrain, bounds: createDefaultBoardBounds(), objects: [], revision: 0 };
}
export function createWorldObject(id, catalogId, position, createdAt = Date.now()) {
    return { id, catalogId, ...position, createdAt };
}
export function applyCommand(state, command) {
    let objects = state.objects;
    if (command.kind === 'place')
        objects = [...objects, command.object];
    if (command.kind === 'remove')
        objects = objects.filter((item) => item.id !== command.object.id);
    if (command.kind === 'place-many')
        objects = [...objects, ...command.objects];
    if (command.kind === 'remove-many') {
        const ids = new Set(command.objects.map((item) => item.id));
        objects = objects.filter((item) => !ids.has(item.id));
    }
    return { ...state, objects, revision: state.revision + 1 };
}
export function invertCommand(command) {
    if (command.kind === 'place')
        return { kind: 'remove', object: command.object };
    if (command.kind === 'remove')
        return { kind: 'place', object: command.object };
    if (command.kind === 'place-many')
        return { kind: 'remove-many', objects: command.objects };
    return { kind: 'place-many', objects: command.objects };
}
export function placeCommand(object) {
    return { kind: 'place', object };
}
export function placeManyCommand(objects) {
    return { kind: 'place-many', objects };
}
export function removeCommand(object) {
    return { kind: 'remove', object };
}
export function findObject(state, id) {
    return state.objects.find((item) => item.id === id);
}
