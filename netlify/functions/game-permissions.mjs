/**
 * Pure, fail-closed authorization for existing universal WorldObject behavior.
 * Call only after server-side DM ownership or cookie membership verification.
 * This module makes no database calls and never trusts client-declared roles.
 */
export function canMoveEntity({actor, entity, assignedEntityIds}) {
  try {
    if(!actor || !entity || typeof entity.id !== 'string' || !entity.id) return false;
    if(actor.role === 'dm' && actor.verified === true) return true;
    if(actor.role !== 'player' || actor.verified !== true) return false;
    if(!Array.isArray(assignedEntityIds) || !assignedEntityIds.includes(entity.id)) return false;
    if(entity.visibility === 'dm_only' || entity.locked === true) return false;
    if(entity.movementLocked === true) return false;
    return entity.capabilities?.includes('player_controllable') === true;
  } catch(error) {
    console.error('Movement authorization failed:',error instanceof Error?error.name:'Unknown');
    return false;
  }
}

/** Return a new object array: never leak DM-only records in player payloads. */
export function visibleEntitiesForActor(entities, actor) {
  try {
    if(!Array.isArray(entities) || !actor || actor.verified !== true) return [];
    if(actor.role === 'dm') return entities.filter(entity=>entity && typeof entity === 'object');
    if(actor.role !== 'player') return [];
    return entities.filter(entity=>entity && typeof entity === 'object' && entity.visibility === 'visible');
  } catch(error) {
    console.error('Visibility filtering failed:',error instanceof Error?error.name:'Unknown');
    return [];
  }
}
