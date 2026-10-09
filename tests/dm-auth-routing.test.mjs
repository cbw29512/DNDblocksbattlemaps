import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('DM sign-in, signup, sign-out and callback use supported Identity package',()=>{
 const dm=read('src/app/dm.ts');
 for(const name of ['handleAuthCallback','getUser','login(','signup(','logout('])assert.ok(dm.includes(name),name);
 assert.match(dm,/import\('@netlify\/identity'\)/);
 assert.match(dm,/\.github\.io/);
});
test('Netlify backend dependencies are declared, and callbacks route to DM',()=>{
 const deps=JSON.parse(read('package.json')).dependencies;
 assert.equal(deps['@netlify/identity'],'2.0.0');
 assert.equal(deps['@netlify/database'],'2.0.1');
 assert.match(read('src/main.ts'),/identityCallback \? 'dm'/);
 assert.match(read('web/main.js'),/identityCallback \? 'dm'/);
});
