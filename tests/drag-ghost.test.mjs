import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('3D drag has a translucent snapped preview without changing original object',()=>{
 for(const path of ['../src/render/threeRenderer.ts','../web/render/threeRenderer.js']){
  const s=readFileSync(new URL(path,import.meta.url),'utf8');
  assert.match(s,/opacity:0\.38/);
  assert.match(s,/footprintCells\?\?1/);
  assert.match(s,/dragGhost\.position\.set\(position\.x,position\.elevation,position\.z\)/);
  assert.match(s,/Math\.floor\(point\.x\)/);
  assert.match(s,/isBoardCell\(x,z,currentBounds\)/);
  assert.match(s,/new THREE\.Plane\(new THREE\.Vector3\(0,1,0\),-object\.elevation\)/);
  assert.match(s,/clearDragGhost\(\)/);
  assert.match(s,/if\(inspectMode\|\|event\.button!==0/);
 }
});
