import test from 'node:test';
import assert from 'node:assert/strict';
import {verticalFrame} from '../src/render/verticalFrame.js';

test('flying large dragon is included in vertical camera framing',()=>{
 const objects=[{elevation:4,footprint:4}];
 assert.deepEqual(verticalFrame(objects,o=>o.footprint),{targetY:4,highest:8});
});
test('ground-only boards retain a low camera target',()=>{
 assert.deepEqual(verticalFrame([],()=>1),{targetY:0,highest:0});
 assert.deepEqual(verticalFrame([{elevation:0}],()=>1),{targetY:0.5,highest:1});
});
