import test from 'node:test';
import assert from 'node:assert/strict';
import {validateBoardSnapshot,playerBoardSnapshot} from '../netlify/functions/game-board-schema.mjs';

const makeBoard=()=>({schemaVersion:1,terrain:'castle',revision:3,
 bounds:{minX:0,maxX:30,minZ:0,maxZ:30},
 objects:[{id:'hero',catalogId:'fighter',x:1,z:1,elevation:0,
 visibility:'visible',locked:false,movementLocked:false,
 capabilities:['player_controllable']},
 {id:'trap',catalogId:'pit',x:2,z:2,elevation:0,
 visibility:'dm_only',locked:true,movementLocked:false,capabilities:[]}]});
test('valid server snapshot and player projection redact private data',()=>{
 const board=makeBoard();
 assert.equal(validateBoardSnapshot(board),true);
 board.objects[0].metadata={secret:'never expose'};
 board.actions=[{secret:'history'}];
 board.objects[0].triggers=[{secret:'trigger'}];
 const projection=playerBoardSnapshot(board);
 assert.deepEqual(projection.objects,[{id:'hero',catalogId:'fighter',x:1,z:1,elevation:0}]);
 assert.equal(JSON.stringify(projection).includes('secret'),false);
 assert.equal(JSON.stringify(projection).includes('trap'),false);
 assert.equal(JSON.stringify(projection).includes('capabilities'),false);
});
test('missing authorizations, unknown schema, duplicate IDs and malformed positions fail closed',()=>{
 const variants=[
  b=>{delete b.objects[0].visibility;}, b=>{delete b.objects[0].locked;},
  b=>{delete b.objects[0].movementLocked;},b=>{b.objects[0].capabilities=['unknown'];},
  b=>{b.schemaVersion=2;},b=>{b.objects[1].id='hero';},
  b=>{b.objects[0].x=1.5;},b=>{b.revision=-1;},
  b=>{b.bounds.maxX=0;}
 ];
 for(const mutate of variants){
  const board=makeBoard();mutate(board);
  assert.equal(validateBoardSnapshot(board),false);
  assert.equal(playerBoardSnapshot(board),null);
 }
 assert.equal(playerBoardSnapshot(null),null);
});
