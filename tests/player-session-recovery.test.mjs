import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
for(const path of ['src/app/join.ts','web/app/join.js']){
  test(path+' only restores server-confirmed player identity',()=>{
    const source=read(path);
    assert.match(source,/action=my-player-session/);
    assert.match(source,/credentials:'same-origin'/);
    assert.match(source,/response\.status===401/);
    assert.match(source,/result\?\.player\?\.id/);
    assert.match(source,/result\.player\.display_name/);
    assert.match(source,/assignedEntityIds/);
    assert.match(source,/root\.contains\(feedback\)/);
    assert.match(source,/catch\(error\)/);
    assert.doesNotMatch(source,/localStorage\.getItem\(['"]player/);
    assert.match(source,/replace\(\/\[\\s-\]\/g/);
  });
}
