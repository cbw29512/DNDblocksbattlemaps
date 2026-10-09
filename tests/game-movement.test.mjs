import test from 'node:test';
import assert from 'node:assert/strict';
import {applyMove} from '../netlify/functions/game-movement.mjs';
const actor={role:'player',verified:true};
const dm={role:'dm',verified:true};
const board=()=>({schemaVersion:1,terrain:'castle',revision:2,bounds:{minX:0,maxX:20,minZ:0,maxZ:20},
 objects:[{id:'hero',catalogId:'fighter',x:1,z:2,elevation:0,visibility:'visible',locked:false,movementLocked:false,capabilities:['player_controllable']},
 {id:'trap',catalogId:'trap',x:5,z:6,elevation:0,visibility:'dm_only',locked:true,movementLocked:true,capabilities:[]}]});
const move={entityId:'hero',expectedRevision:2,destination:{x:3,z:4,elevation:0}};
test('assigned player movement creates immutable next revision',()=>{
 const source=board(),result=applyMove(source,move,actor,['hero']);
 assert.equal(result.status,200);
 assert.equal(result.revision,3);
 assert.deepEqual([result.board.objects[0].x,result.board.objects[0].z],[3,4]);
 assert.equal(source.objects[0].x,1);
});
test('stale, unauthorized and out-of-bounds actions are rejected',()=>{
 assert.equal(applyMove(board(),{...move,expectedRevision:1},actor,['hero']).status,409);
 assert.equal(applyMove(board(),move,actor,['another']).status,403);
 assert.equal(applyMove(board(),{...move,destination:{x:20,z:4,elevation:0}},actor,['hero']).status,400);
 assert.equal(applyMove(board(),{...move,destination:{x:1.5,z:4,elevation:0}},actor,['hero']).status,400);
});
test('only verified DM can override hidden and movement locked pieces',()=>{
 const cmd={...move,entityId:'trap'};
 assert.equal(applyMove(board(),cmd,actor,['trap']).status,403);
 assert.equal(applyMove(board(),cmd,{role:'dm',verified:false}).status,403);
 assert.equal(applyMove(board(),cmd,dm).status,200);
});
