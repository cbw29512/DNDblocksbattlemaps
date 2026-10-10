import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('3D hover uses the existing object ID and catalog name in source and browser',()=>{
 for(const path of ['../src/render/threeRenderer.ts','../web/render/threeRenderer.js']){
  const s=readFileSync(new URL(path,import.meta.url),'utf8');
  assert.match(s,/function updateHoverLabel\(/);
  assert.match(s,/raycaster\.intersectObjects\(objectGroup\.children, true\)/);
  assert.match(s,/getCatalogItem\(object\.catalogId\)/);
  assert.match(s,/item\.category === 'Characters'/);
  assert.match(s,/item\.category === 'Monsters'/);
  assert.match(s,/hoverLabel\.textContent = item\.name/);
  assert.match(s,/preview\?\.visible && raycaster\.intersectObject\(preview\.children\[2\], true\)/);
  assert.match(s,/pointerleave/);
  assert.match(s,/hoverLabel\.remove\(\)/);
 }
});
test('fallback hover titles cover every catalog block',()=>{
 for(const path of ['../src/render/fallbackRenderer.ts','../web/render/fallbackRenderer.js']){
  const s=readFileSync(new URL(path,import.meta.url),'utf8');
  assert.match(s,/cell\.title = item\.name/);
 }
});
