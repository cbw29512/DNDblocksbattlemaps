import test from 'node:test';
import assert from 'node:assert/strict';
import {readAuthorizedBoard} from '../netlify/functions/game-board-read.mjs';

test('board service denies unknown roles before reading',async()=>{
 let calls=0;
 const db={sql:async()=>{calls++;return [];}};
 const result=await readAuthorizedBoard(db,'game','unknown');
 assert.equal(result.status,403);
 assert.equal(calls,0);
});
test('board service fails closed when a stored board does not validate',async()=>{
 const db={sql:async()=>[{state:{schemaVersion:999},revision:0}]};
 const result=await readAuthorizedBoard(db,'game','player');
 assert.equal(result.status,503);
});
