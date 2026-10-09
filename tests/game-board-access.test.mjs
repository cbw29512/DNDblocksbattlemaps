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
