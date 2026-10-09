/**
 * Pre-integration, fail-closed authorization primitives.
 * Actor verification must come from server-side identity or guest cookie lookup.
 * These helpers do not authorize requests by themselves.
 */
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const trustedActor = actor => isRecord(actor) && actor.verified === true &&
  (actor.role === 'dm' || actor.role === 'player');
const validEntity = entity => isRecord(entity) &&
  typeof entity.id === 'string' && entity.id.length > 0 &&
  typeof entity.visibility === 'string' &&
  (entity.visibility === 'visible' || entity.visibility === 'dm_only');

export function canMoveEntity({actor, entity, assignedEntityIds} = {}) {
  try {
    if(!trustedActor(actor) || !validEntity(entity)) return false;
    if(actor.role === 'dm') return true;
    if(!Array.isArray(assignedEntityIds) ||
       !assignedEntityIds.includes(entity.id)) return false;
    if(entity.visibility !== 'visible') return false;
    // Player state must have explicit false flags, not missing fields.
    if(entity.locked !== false || entity.movementLocked !== false) return false;
    if(!Array.isArray(entity.capabilities)) return false;
    return entity.capabilities.includes('player_controllable');
  } catch(error) {
    console.error('Movement authorization failed:',error instanceof Error?error.name:'Unknown');
    return false;
  }
}

/**
 * Only filter top-level entities. Never send this output as a complete player
 * snapshot: nested metadata/history can still reveal DM-only information.
 */
export function visibleEntitiesForActor(entities, actor) {
  try {
    if(!trustedActor(actor) || !Array.isArray(entities)) return [];
    if(actor.role === 'dm') return entities.filter(validEntity);
    return entities.filter(entity=>validEntity(entity) && entity.visibility === 'visible');
  } catch(error) {
    console.error('Visibility filtering failed:',error instanceof Error?error.name:'Unknown');
    return [];
  }
}
