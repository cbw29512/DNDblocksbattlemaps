import test from 'node:test';
import assert from 'node:assert/strict';
import {newGameCode,cleanCode,cleanName,digest,newGuestToken,cookieForGuest,readGuestCookie,allowedOrigin,validAction} from '../netlify/functions/game-security.mjs';
test('secure invite format, case folding and code validation',()=>{
 for(let i=0;i<100;i++)assert.match(newGameCode(),/^[A-HJ-NP-Z2-9]{6}$/);
 assert.equal(cleanCode(' ab-cd23 '),'ABCD23');
 assert.equal(cleanCode('badO01'),null);
});
test('display names reject markup, control chars and oversize',()=>{
 assert.equal(cleanName(' Ana    B '),'Ana B');
 assert.equal(cleanName('<img>'),null);
 assert.equal(cleanName('x'.repeat(41)),null);
});
test('tokens, digest and secure HttpOnly cookies',()=>{
 const token=newGuestToken();
 assert.match(token,/^[A-Za-z0-9_-]{43}$/);
 assert.equal(digest('test','x'.repeat(32)).length,64);
 assert.match(cookieForGuest(token),/HttpOnly; SameSite=Strict/);
 assert.equal(readGuestCookie(new Request('https://example.com/',{headers:{cookie:'dnd_guest='+token}})),token);
 assert.equal(readGuestCookie(new Request('https://example.com/')),null);
});
test('same-origin POST and allowed route/method pairs',()=>{
 const req=new Request('https://example.com/.netlify/functions/game-api?action=join-game',{method:'POST',headers:{origin:'https://example.com'}});
 assert.equal(allowedOrigin(req),true);
 assert.equal(allowedOrigin(new Request(req.url,{method:'POST',headers:{origin:'https://other.net'}})),false);
 assert.equal(validAction('POST','join-game'),true);
 assert.equal(validAction('GET','create-game'),false);
});
