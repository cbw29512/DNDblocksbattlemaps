import { getCatalogItem } from './catalog.js?v=8727e55596a9';
export const PLAYER_RINGS = [
    { color: 0x2688dc, name: 'Blue' }, { color: 0x31b86b, name: 'Green' },
    { color: 0xe0be3d, name: 'Yellow' }, { color: 0xa369d7, name: 'Purple' },
    { color: 0xf18b35, name: 'Orange' }, { color: 0xf4f4f4, name: 'White' }
];
export const CONDITIONS = [
    'Blinded', 'Charmed', 'Deafened', 'Exhaustion', 'Frightened',
    'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified',
    'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious'
];
export const CONDITION_COLORS = {
    Blinded: 0x8a8c91, Charmed: 0xec74b4, Deafened: 0x6e91ab,
    Exhaustion: 0xb58955, Frightened: 0x9d82ee, Grappled: 0x4cc4aa,
    Incapacitated: 0x8978a9, Invisible: 0x89d4e5, Paralyzed: 0xf7a04c,
    Petrified: 0x9aa19b, Poisoned: 0x6edc75, Prone: 0xe7c47f,
    Restrained: 0x659ada, Stunned: 0xffdc62, Unconscious: 0xecece4
};
export function isCreature(object) {
    const category = getCatalogItem(object.catalogId).category;
    return category === 'Characters' || category === 'Monsters';
}
export function availableRings(state) {
    const assigned = new Set(state.objects.filter(o => getCatalogItem(o.catalogId).category === 'Characters').map(o => o.ringColor).filter((n) => n !== undefined));
    return PLAYER_RINGS.map(r => r.color).filter(n => !assigned.has(n));
}
export function assignRing(state, objectId, color) {
    const target = state.objects.find(o => o.id === objectId);
    if (!target || getCatalogItem(target.catalogId).category !== 'Characters' ||
        !PLAYER_RINGS.some(r => r.color === color) ||
        state.objects.some(o => o.id !== objectId && getCatalogItem(o.catalogId).category === 'Characters' && o.ringColor === color))
        return null;
    return { ...target, ringColor: color };
}
export function toggleCondition(object, condition) {
    if (!CONDITIONS.includes(condition) || !isCreature(object))
        return object;
    const conditions = object.conditions ?? [];
    if (condition === 'Exhaustion') {
        const next = ((object.exhaustion ?? 0) + 1) % 7;
        return { ...object, exhaustion: next, conditions: conditions.filter(c => c !== 'Exhaustion') };
    }
    return { ...object, conditions: conditions.includes(condition) ?
            conditions.filter(c => c !== condition) : [...conditions, condition] };
}
/** Migrate previously placed character colors to the new one-ring-per-player rule. */
export function normalizeRingAssignments(state) {
    const assigned = new Set();
    let changed = false;
    const objects = state.objects.map(object => {
        if (getCatalogItem(object.catalogId).category !== 'Characters' || object.ringColor === undefined)
            return object;
        const color = object.ringColor;
        if (!PLAYER_RINGS.some(r => r.color === color) || assigned.has(color)) {
            changed = true;
            const { ringColor: _unused, ...withoutRing } = object;
            return withoutRing;
        }
        assigned.add(color);
        return object;
    });
    return changed ? { ...state, objects } : state;
}
