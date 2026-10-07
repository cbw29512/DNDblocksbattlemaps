export function createBoardState(terrain) {
    return { terrain, objects: [], revision: 0 };
}
export function createWorldObject(id, catalogId, position, createdAt = Date.now()) {
    return { id, catalogId, ...position, createdAt };
}
export function applyCommand(state, command) {
    const objects = command.kind === 'place'
        ? [...state.objects, command.object]
        : state.objects.filter((item) => item.id !== command.object.id);
    return { ...state, objects, revision: state.revision + 1 };
}
export function invertCommand(command) {
    return {
        kind: command.kind === 'place' ? 'remove' : 'place',
        object: command.object
    };
}
export function placeCommand(object) {
    return { kind: 'place', object };
}
export function removeCommand(object) {
    return { kind: 'remove', object };
}
export function findObject(state, id) {
    return state.objects.find((item) => item.id === id);
}
