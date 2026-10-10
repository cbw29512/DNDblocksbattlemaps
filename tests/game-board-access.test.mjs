import test from 'node:test';
import assert from 'node:assert/strict';
import {getBoardForRequest} from '../netlify/functions/game-board-access.mjs';
const game='11111111-1111-4111-8111-111111111111';
const req=(cookie='')=>new Request('https://example.com/.netlify/functions/game-api?action=get-board&gameId='+game,{headers:cookie?{cookie}:{}});
test('no owner or guest token cannot read a board',async()=>{
 let reads=0;
 const db={sql:async()=>{reads++;return [];}};
 const result=await getBoardForRequest(req(),db,async()=>null,'x'.repeat(32));
 assert.equal(result.status,404);
 assert.equal(reads,0);
});
test('non-owner cannot read a game without guest membership',async()=>{
 const db={sql:async()=>[]};
 const result=await getBoardForRequest(req(),db,async()=>({id:'other'}),'x'.repeat(32));
 assert.equal(result.status,404);
});
test('malformed game ID denied before database access',async()=>{
 let count=0;
 const db={sql:async()=>{count++;return [];}};
 const request=new Request('https://example.com/?gameId=wrong');
 const result=await getBoardForRequest(request,db,async()=>null,'x'.repeat(32));
 assert.equal(result.status,400);assert.equal(count,0);
});

const snapshot={schemaVersion:1,terrain:'castle',revision:4,
 bounds:{minX:0,maxX:30,minZ:0,maxZ:30},objects:[
 {id:'hero',catalogId:'fighter',x:1,z:2,elevation:0,visibility:'visible',locked:false,movementLocked:false,capabilities:['player_controllable']},
 {id:'secret',catalogId:'trap',x:3,z:4,elevation:0,visibility:'dm_only',locked:true,movementLocked:false,capabilities:[]}
]};
test('verified owner gets full validated board',async()=>{
 const queries=[];
 const db={sql:async(strings,...values)=>{
  queries.push(strings.join('?'));
  return queries.length===1?[{id:game}]:[{state:snapshot,revision:4}];
 }};
 const result=await getBoardForRequest(req(),db,async()=>({id:'owner'}),'s'.repeat(32));
 assert.equal(result.status,200);
 assert.equal(result.board.objects.length,2);
 assert.equal(result.board.objects[1].id,'secret');
});
test('guest session is restricted to visible board projection',async()=>{
 const token='A'.repeat(43);
 const db={sql:async(strings,...values)=>{
  const query=strings.join('?');
  if(query.includes('FROM dnd_players'))return [{id:'member'}];
  if(query.includes('FROM dnd_board_snapshots'))return [{state:snapshot,revision:4}];
  throw new Error('Unexpected query');
 }};
 const result=await getBoardForRequest(req('dnd_guest='+token),db,async()=>null,'s'.repeat(32));
 assert.equal(result.status,200);
 assert.deepEqual(result.board.objects,[{id:'hero',catalogId:'fighter',x:1,z:2,elevation:0}]);
 assert.equal(JSON.stringify(result.board).includes('secret'),false);
});
test('a valid guest token with no membership cannot read the board',async()=>{
 const token='B'.repeat(43);
 let boardReads=0;
 const db={sql:async(strings,...values)=>{
  const query=strings.join('?');
  if(query.includes('FROM dnd_board_snapshots'))boardReads++;
  return [];
 }};
 const result=await getBoardForRequest(req('dnd_guest='+token),db,async()=>null,'s'.repeat(32));
 assert.equal(result.status,404);
 assert.equal(boardReads,0);
});
