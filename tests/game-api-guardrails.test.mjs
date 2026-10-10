import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../netlify/functions/game-api.mjs',import.meta.url),'utf8');
const migration=readFileSync(new URL('../netlify/database/migrations/20261009112000_join_rate_limits.sql',import.meta.url),'utf8');
test('join API requires a Netlify-verified client IP and rate limits before code lookup',()=>{
 const join=source.slice(source.indexOf("if(action==='join-game')"));
 assert.match(join,/context\?\.ip/);
 assert.match(join,/ON CONFLICT\(actor_hash\) DO UPDATE/);
 assert.match(join,/attempts\[0\]\?\.attempts\)>8/);
 assert.match(join,/429,\{'Retry-After':'900'\}/);
 assert.ok(join.indexOf('if(Number(attempts')<join.indexOf("digest('invite:'"),'limit must precede code lookup');
});
test('join limiter stores hashes, not raw IP addresses',()=>{
 assert.match(migration,/actor_hash char\(64\) PRIMARY KEY/);
 assert.doesNotMatch(migration,/ip_address|remote_address/i);
 assert.match(source,/digest\('join-ip:'\+remoteAddress,signingKey\(\)\)/);
});

test('guest recovery restores only the cookie-authenticated member assignments',()=>{
 const start=source.indexOf("if(action==='my-player-session'||action==='leave-game')");
 const end=source.indexOf("if(action==='players'||action==='assign-piece')",start);
 const block=source.slice(start,end);
 assert.match(block,/readGuestCookie\(req\)/);
 assert.match(block,/p\.session_hash=\$\{hash\}/);
 assert.match(block,/p\.revoked_at IS NULL/);
 assert.match(block,/g\.status='open'/);
 assert.match(block,/game_id=\$\{member\.game_id\} AND player_id=\$\{member\.id\}/);
 assert.match(block,/assignedEntityIds:assignments\.map/);
 assert.match(block,/last_seen_at=now\(\)/);
 assert.ok(block.indexOf("if(action==='leave-game')") < block.indexOf('const assignments='),'revoked session must not be returned');
 assert.doesNotMatch(block,/SELECT \*/);
});
