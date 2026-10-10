/**
 * Server-only v1 board boundary. No legacy browser data is migrated implicitly.
 * No user-supplied metadata, triggers, history, or permission overrides are exported.
 */
const record=value=>value!==null && typeof value==='object' && !Array.isArray(value);
const integer=value=>Number.isSafeInteger(value);
const grid=value=>record(value)&&['x','z','elevation'].every(k=>integer(value[k]));
const bounds=value=>record(value)&&['minX','maxX','minZ','maxZ'].every(k=>integer(value[k]))&&
  value.minX<value.maxX&&value.minZ<value.maxZ;
const visibility=value=>value==='visible'||value==='dm_only';
const capabilities=new Set(['player_controllable','movable','lockable','openable','toggleable','hideable','revealable']);
const terrain=new Set(['castle','inn','field','sea','volcano']);
const safeEntity=entity=>record(entity)&&typeof entity.id==='string'&&entity.id.length>0&&entity.id.length<=128&&
  typeof entity.catalogId==='string'&&entity.catalogId.length>0&&entity.catalogId.length<=128&&
  grid(entity)&&visibility(entity.visibility)&&typeof entity.locked==='boolean'&&
  typeof entity.movementLocked==='boolean'&&Array.isArray(entity.capabilities)&&
  entity.capabilities.every(c=>typeof c==='string'&&capabilities.has(c));
export function validateBoardSnapshot(snapshot){
  try{
    if(!record(snapshot)||snapshot.schemaVersion!==1||!terrain.has(snapshot.terrain)||
       !bounds(snapshot.bounds)||!integer(snapshot.revision)||snapshot.revision<0||
       !Array.isArray(snapshot.objects)||snapshot.objects.length>10000) return false;
    const ids=new Set();
    for(const entity of snapshot.objects){
      if(!safeEntity(entity)||ids.has(entity.id))return false;
      ids.add(entity.id);
    }
    return true;
  }catch(error){
    console.error('Board snapshot validation failed:',error instanceof Error?error.name:'Unknown');
    return false;
  }
}
export function playerBoardSnapshot(snapshot){
  try{
    if(!validateBoardSnapshot(snapshot))return null;
    return {
      schemaVersion:1,terrain:snapshot.terrain,revision:snapshot.revision,
      bounds:{minX:snapshot.bounds.minX,maxX:snapshot.bounds.maxX,
        minZ:snapshot.bounds.minZ,maxZ:snapshot.bounds.maxZ},
      objects:snapshot.objects.filter(e=>e.visibility==='visible').map(e=>({
        id:e.id,catalogId:e.catalogId,x:e.x,z:e.z,elevation:e.elevation
      }))
    };
  }catch(error){
    console.error('Player board projection failed:',error instanceof Error?error.name:'Unknown');
    return null;
  }
}
