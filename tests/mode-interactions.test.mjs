import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');

test('build, combat and inspect movement permissions',()=>{
 for(const p of ['../src/app/builder.ts','../web/app/builder.js']){
  const s=read(p);
  assert.match(s,/onDragMove\(id, position\)/);
  assert.match(s,/if \(inspectMode\) return;/);
  assert.match(s,/moveMode && !\['Characters','Monsters'\]\.includes\(category\)/);
  assert.match(s,/id="object-context-menu"/);
  assert.match(s,/onObjectContext\(id, ?x, ?y\)/);
  assert.match(s,/object\.opened/);
  assert.match(s,/trap\.activated/);
  assert.match(s,/Math\.round\(object\.x\+/);
 }
});
test('both renderers support moving objects and contextual actions',()=>{
 for(const p of ['../src/render/threeRenderer.ts','../web/render/threeRenderer.js','../src/render/fallbackRenderer.ts','../web/render/fallbackRenderer.js']){
  const s=read(p);
  assert.match(s,/handlers\.onDragMove/);
  assert.match(s,/handlers\.onObjectContext/);
  assert.match(s,/inspectMode/);
 }
});
