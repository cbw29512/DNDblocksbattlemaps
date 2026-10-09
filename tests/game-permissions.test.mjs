import test from 'node:test';
import assert from 'node:assert/strict';
import {canMoveEntity,visibleEntitiesForActor} from '../netlify/functions/game-permissions.mjs';

const dm={role:'dm',verified:true};
const player={role:'player',verified:true};
const entity={id:'hero-1',visibility:'visible',locked:false,movementLocked:false,capabilities:['player_controllable']};
test('only server-verified members can move assigned controllable pieces',()=>{
 assert.equal(canMoveEntity({actor:player,entity,assignedEntityIds:['hero-1']}),true);
 assert.equal(canMoveEntity({actor:player,entity,assignedEntityIds:['other']}),false);
 assert.equal(canMoveEntity({actor:{role:'player',verified:false},entity,assignedEntityIds:['hero-1']}),false);
 assert.equal(canMoveEntity({actor:{role:'dm',verified:false},entity}),false);
 assert.equal(canMoveEntity({actor:dm,entity:{...entity,movementLocked:true}}),true);
});
test('movement locks, visibility, and capabilities block players, not DMs',()=>{
 for(const changed of [{movementLocked:true},{locked:true},{visibility:'dm_only'},{capabilities:[]}]){
  assert.equal(canMoveEntity({actor:player,entity:{...entity,...changed},assignedEntityIds:['hero-1']}),false);
  assert.equal(canMoveEntity({actor:dm,entity:{...entity,...changed}}),true);
 }
 assert.equal(canMoveEntity({actor:player,entity:null,assignedEntityIds:['hero-1']}),false);
});
test('unverified and malformed views never receive hidden objects',()=>{
 const hidden={...entity,id:'secret',visibility:'dm_only'};
 const board=[entity,hidden,{id:'unknown'},null];
 assert.deepEqual(visibleEntitiesForActor(board,player),[entity]);
 assert.deepEqual(visibleEntitiesForActor(board,dm),[entity,hidden,{id:'unknown'}]);
 assert.deepEqual(visibleEntitiesForActor(board,{role:'player',verified:false}),[]);
 assert.deepEqual(visibleEntitiesForActor(null,player),[]);
});
