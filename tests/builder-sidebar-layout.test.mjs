import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('room and catalog collapse independently, height at top inside catalog',()=>{
 for(const file of ['../src/app/builder.ts','../web/app/builder.js']){
  const text=readFileSync(new URL(file,import.meta.url),'utf8');
  const start=text.indexOf('<div id="build-tools">');
  const end=text.indexOf('id="combat-markers-panel"',start);
  const sidebar=text.slice(start,end);
  assert.ok(start>=0&&end>start,file);
  assert.match(sidebar,/<details[^>]*id="room-builder-panel">/);
  assert.match(sidebar,/<details[^>]*id="catalog-panel" open>/);
  assert.ok(sidebar.indexOf('roomPanelHtml()')<sidebar.indexOf('catalogPanelHtml('));
  assert.ok(sidebar.indexOf('roomPanelHtml()')<sidebar.indexOf('id="elev-down"'));
  assert.ok(sidebar.indexOf('id="catalog-panel"')<sidebar.indexOf('id="elev-down"'));
  assert.ok(sidebar.indexOf('id="elev-down"')<sidebar.indexOf('catalogPanelHtml('));
  assert.ok(sidebar.indexOf('id="elev-down"')<sidebar.indexOf('</details>',sidebar.indexOf('id="catalog-panel"')));
  assert.equal((text.match(/id="elev-up"/g)||[]).length,1);
  assert.equal((text.match(/id="elev-down"/g)||[]).length,1);
  assert.match(text,/querySelector[^\n]*['"]#build-tools['"]/);
 }
});
