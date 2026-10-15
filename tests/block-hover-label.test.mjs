import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('3D Inspect hover uses object identity and preserves concealed labels in source and browser',()=>{
 for(const path of ['../src/render/threeRenderer.ts','../web/render/threeRenderer.js']){
  const s=readFileSync(new URL(path,import.meta.url),'utf8');
  assert.match(s,/function updateHoverLabel\(/);
  assert.match(s,/raycaster\.intersectObjects\(objectGroup\.children, true\)/);
  assert.match(s,/getCatalogItem\(object\.catalogId\)/);
  assert.match(s,/item\.category === 'Characters'/);
  assert.match(s,/item\.category === 'Monsters'/);
  assert.match(s,/if \(!inspectMode\) \{ hoverLabel\.hidden = true; return; \}/);
  assert.match(s,/hoverLabel\.textContent = \/mimic\/i\.test\(item\.name\) \? 'Old Chest' : \/secret\/i\.test\(item\.name\) \? 'Stone Wall' : item\.name/);
  assert.match(s,/preview\?\.visible && raycaster\.intersectObject\(preview\.children\[2\], true\)/);
  assert.match(s,/pointerleave/);
  assert.match(s,/hoverLabel\.remove\(\)/);
 }
});
test('fallback hover titles are limited to read-only Inspect mode',()=>{
 for(const path of ['../src/render/fallbackRenderer.ts','../web/render/fallbackRenderer.js']){
  const s=readFileSync(new URL(path,import.meta.url),'utf8');
  assert.match(s,/cell\.title = inspectMode \? item\.name/);
  assert.match(s,/: '';/);
 }
});
