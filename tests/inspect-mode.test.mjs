import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('Inspect is a top-toolbar toggle and has a read-only details card', () => {
  for (const path of ['../src/app/builder.ts', '../web/app/builder.js']) {
    const text=source(path);
    assert.match(text, /id="inspect-mode"[^>]*aria-pressed="false"/);
    assert.ok(text.indexOf('id="inspect-mode"') < text.indexOf('</header>'));
    assert.match(text, /id="inspect-card"/);
    assert.match(text, /onInspect\(id\)/);
    assert.match(text, /setInspectMode\(inspectMode\)/);
    assert.match(text, /inspectMode \? 'Inspect ON/);
    assert.match(text, /Old Chest/);
    assert.match(text, /Stone Wall/);
  }
});

test('Both renderers block board editing and only show names during Inspect', () => {
 for (const path of ['../src/render/threeRenderer.ts','../web/render/threeRenderer.js','../src/render/fallbackRenderer.ts','../web/render/fallbackRenderer.js']) {
  const text=source(path);
  assert.match(text,/setInspectMode\(enabled\)/);
  assert.match(text,/handlers\.onInspect/);
  const click=text.slice(text.indexOf("addEventListener('click'"));
  assert.ok(click.indexOf('if (inspectMode)') < click.indexOf('if (activeArea)') || click.indexOf('if (inspectMode)') < click.indexOf('if (areaTemplate)'));
  const context=text.slice(text.indexOf("addEventListener('contextmenu'"));
  assert.match(context,/if \(inspectMode\) return/);
 }
 for (const path of ['../src/render/threeRenderer.ts','../web/render/threeRenderer.js']) {
   const text=source(path);
   assert.match(text,/if \(!inspectMode\) \{ hoverLabel\.hidden = true; return; \}/);
   assert.match(text,/hoverLabel\.textContent = \/mimic\/i\.test/);
 }
});
