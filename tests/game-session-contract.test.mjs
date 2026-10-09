import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeGameCode,validateGameCode,validatePlayerName,createJoinUrl,mayControlEntity,mayEditMap} from '../web/domain/gameSession.js';
test('join codes normalize without admitting ambiguous or malformed characters',()=>{
 assert.equal(normalizeGameCode(' ab-cd23 '),'ABCD23');
 assert.equal(validateGameCode('ab-cd23'),'ABCD23');
 assert.equal(validateGameCode('abcdo1'),null);
 assert.equal(validateGameCode('SHORT'),null);
});
test('display names have bounded length and reject markup/control characters',()=>{
 assert.equal(validatePlayerName('  A    B '),'A B');
 assert.equal(validatePlayerName('<script>'),null);
 assert.equal(validatePlayerName(''),null);
 assert.equal(validatePlayerName('x'.repeat(41)),null);
});
test('join links use code parameter and never inherit unrelated app state',()=>{
 const result=createJoinUrl('https://example.com/DNDblocksbattlemaps/?view=build&terrain=inn#old','ABCD23');
 assert.equal(result,'https://example.com/DNDblocksbattlemaps/?view=join&code=ABCD23');
});
test('game roles and entity ownership grant least privilege',()=>{
 assert.equal(mayEditMap('dm'),true);
 assert.equal(mayEditMap('player'),false);
 assert.equal(mayControlEntity('player',['hero-1'],'hero-1'),true);
 assert.equal(mayControlEntity('player',['hero-1'],'hero-2'),false);
 assert.equal(mayControlEntity('dm',[],'hero-2'),true);
});
