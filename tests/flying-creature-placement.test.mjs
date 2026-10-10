import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('elevated creature placement uses the selected elevation plane',()=>{
 const source=readFileSync(new URL('../src/render/threeRenderer.ts',import.meta.url),'utf8');
 const browser=readFileSync(new URL('../web/render/threeRenderer.js',import.meta.url),'utf8');
 for(const code of [source,browser]){
  const start=code.indexOf('function blockPlacementFor(');
  const end=code.indexOf('function roomPlacementFor(',start);
  assert.ok(start>=0&&end>start,'placement handler exists');
  const handler=code.slice(start,end);
  assert.match(handler,/elevation > 0/);
  assert.match(handler,/\['Characters', 'Monsters'\]/);
  assert.match(handler,/return floorPosition\(event\)/);
  assert.ok(handler.indexOf('return floorPosition(event)')<handler.indexOf('intersectObjects('));
 }
});
