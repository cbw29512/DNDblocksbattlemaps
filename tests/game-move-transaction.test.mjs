import test from 'node:test';
import assert from 'node:assert/strict';
import {commitMove} from '../netlify/functions/game-move-transaction.mjs';
const gameId='11111111-1111-4111-8111-111111111111';
const actionId='22222222-2222-4222-8222-222222222222';
const command={gameId,actionId,entityId:'hero',expectedRevision:0,destination:{x:3,z:4,elevation:0}};
const actor={id:'dm1',role:'dm',verified:true};
function setup(){
 const queries=[];
 const state={schemaVersion:1,terrain:'castle',revision:0,bounds:{minX:0,maxX:20,minZ:0,maxZ:20},
 objects:[{id:'hero',catalogId:'fighter',x:1,z:1,elevation:0,visibility:'visible',
 locked:false,movementLocked:false,capabilities:['player_controllable']}]};
 let revision=0,action=null,released=false;
 const client={async query(sql,params=[]){
  queries.push(sql);
  if(sql==='BEGIN'||sql==='COMMIT'||sql==='ROLLBACK')return {rows:[]};
  if(sql.includes('FROM dnd_games WHERE id='))return {rows:[{id:gameId,owner_identity_id:'dm1',status:'open'}]};
  if(sql.includes('FROM dnd_actions'))return {rows:action?[action]:[]};
  if(sql.includes('FROM dnd_board_snapshots'))return {rows:[{state,revision}]};
  if(sql.startsWith('UPDATE dnd_board_snapshots')){revision=params[1];return {rows:[{revision}]};}
  if(sql.startsWith('UPDATE dnd_games'))return {rows:[{revision:params[0]}]};
  if(sql.startsWith('INSERT INTO dnd_actions')){action={actor_identity:params[2],
   expected_revision:params[3],payload:JSON.parse(params[4])};return {rows:[]};}
  throw Error('Unexpected SQL');
 },release(){released=true;}};
 return {db:{pool:{connect:async()=>client}},queries,isReleased:()=>released};
}
test('movement commits board and action in one transaction',async()=>{
 const mock=setup();const outcome=await commitMove(mock.db,command,actor);
 assert.equal(outcome.status,200);assert.equal(outcome.revision,1);
 assert.ok(mock.queries.includes('BEGIN'));assert.ok(mock.queries.includes('COMMIT'));
 assert.ok(mock.queries.some(q=>q.startsWith('INSERT INTO dnd_actions')));
 assert.equal(mock.isReleased(),true);
});
test('wrong DM is rejected without writing',async()=>{
 const mock=setup();const result=await commitMove(mock.db,command,{...actor,id:'stranger'});
 assert.equal(result.status,403);
 assert.ok(mock.queries.includes('ROLLBACK'));
 assert.ok(!mock.queries.some(q=>q.startsWith('UPDATE dnd_board_snapshots')));
});
test('invalid actor never opens a database connection',async()=>{
 const mock=setup();const outcome=await commitMove(mock.db,command,{...actor,verified:false});
 assert.equal(outcome.status,400);assert.equal(mock.queries.length,0);
});
