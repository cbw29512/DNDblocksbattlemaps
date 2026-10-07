import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyCommand, createBoardState, createWorldObject, invertCommand,
  placeCommand, placeManyCommand, removeCommand
} from '../.test-build/src/domain/commands.js';
import { commit, createHistory, redo, undo } from '../.test-build/src/domain/history.js';
import { elevationAbove, stackElevationAt } from '../.test-build/src/domain/placement.js';
import { centeredRoomWallPositions, normalizeRoomDimensions } from '../.test-build/src/domain/room.js';
import { MAX_BASE_ELEVATION } from '../.test-build/src/domain/spatial.js';

test('placing preserves intentional overlap', () => {
  let state = createBoardState('castle');
  const first = createWorldObject('one', 'chest', { x: 2, z: 3, elevation: 0 }, 1);
  const second = createWorldObject('two', 'orc', { x: 2, z: 3, elevation: 0 }, 2);
  state = applyCommand(state, placeCommand(first));
  state = applyCommand(state, placeCommand(second));
  assert.deepEqual(state.objects.map((o) => o.id), ['one', 'two']);
});

test('remove command removes only the targeted object', () => {
  let state = createBoardState('field');
  const first = createWorldObject('one', 'chest', { x: 0, z: 0, elevation: 0 }, 1);
  const second = createWorldObject('two', 'orc', { x: 0, z: 0, elevation: 0 }, 2);
  state = applyCommand(state, placeCommand(first));
  state = applyCommand(state, placeCommand(second));
  state = applyCommand(state, removeCommand(first));
  assert.deepEqual(state.objects.map((o) => o.id), ['two']);
});

test('inverse command restores the prior object state', () => {
  const state = createBoardState('inn');
  const object = createWorldObject('door-1', 'door', { x: 1, z: -2, elevation: 0 }, 1);
  const restored = applyCommand(applyCommand(state, placeCommand(object)), invertCommand(placeCommand(object)));
  assert.equal(restored.objects.length, 0);
});

test('undo and redo operate as reversible commands', () => {
  const object = createWorldObject('wall-1', 'wall', { x: 1, z: 1, elevation: 0 }, 1);
  const committed = commit(createBoardState('castle'), createHistory(), placeCommand(object));
  const undone = undo(committed.state, committed.history);
  const redone = redo(undone.state, undone.history);
  assert.equal(undone.state.objects.length, 0);
  assert.equal(redone.state.objects[0]?.id, 'wall-1');
});

test('top stacking adds one 5-ft level and obeys the hard height cap', () => {
  assert.equal(elevationAbove(0, 0), 1);
  assert.equal(elevationAbove(2, 0), 3);
  assert.equal(elevationAbove(MAX_BASE_ELEVATION, 0), null);
});

test('fallback stacking uses the highest object at the cell', () => {
  const objects = [
    createWorldObject('low', 'stone-block', { x: 4, z: 5, elevation: 0 }, 1),
    createWorldObject('high', 'stone-block', { x: 4, z: 5, elevation: 2 }, 2)
  ];
  assert.equal(stackElevationAt(objects, 4, 5, 0), 3);
  assert.equal(stackElevationAt(objects, 1, 1, 2), 2);
});

test('room dimensions snap safely and reject absurd height values', () => {
  assert.deepEqual(normalizeRoomDimensions({ lengthFeet: 31, widthFeet: 19, heightFeet: 11 }), {
    lengthFeet: 30, widthFeet: 20, heightFeet: 10,
    lengthCells: 6, widthCells: 4, heightLevels: 2
  });
  assert.equal(normalizeRoomDimensions({ lengthFeet: 30, widthFeet: 20, heightFeet: 99999999999999999999 }), null);
  assert.equal(normalizeRoomDimensions({ lengthFeet: 95, widthFeet: 20, heightFeet: 10 }), null);
});

test('30x20x10 room creates two-level perimeter walls and no ceiling', () => {
  const room = normalizeRoomDimensions({ lengthFeet: 30, widthFeet: 20, heightFeet: 10 });
  assert.ok(room);
  const positions = centeredRoomWallPositions(room);
  assert.equal(positions.length, 48);
  assert.equal(positions.some((p) => p.x === 0 && p.z === 0), false);
  assert.deepEqual([...new Set(positions.map((p) => p.elevation))], [0, 1]);
});

test('room generation is reversible as one Undo step', () => {
  const room = normalizeRoomDimensions({ lengthFeet: 30, widthFeet: 20, heightFeet: 10 });
  assert.ok(room);
  const walls = centeredRoomWallPositions(room).map((p, index) =>
    createWorldObject(`room-${index}`, 'wall', p, index)
  );
  const committed = commit(createBoardState('castle'), createHistory(), placeManyCommand(walls));
  const undone = undo(committed.state, committed.history);
  assert.equal(committed.history.past.length, 1);
  assert.equal(undone.state.objects.length, 0);
});
