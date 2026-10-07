import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyCommand, createBoardState, createWorldObject, invertCommand,
  placeCommand, placeManyCommand, removeCommand
} from '../.test-build/src/domain/commands.js';
import { commit, createHistory, redo, undo } from '../.test-build/src/domain/history.js';
import { elevationAbove, stackElevationAt } from '../.test-build/src/domain/placement.js';
import { normalizeRoomDimensions } from '../.test-build/src/domain/room.js';
import {
  chooseRoomPlacement, roomFitsAtCorner, roomWallPositions
} from '../.test-build/src/domain/roomPlacement.js';
import { MAX_BASE_ELEVATION, MAX_BUILD_HEIGHT_FEET } from '../.test-build/src/domain/spatial.js';
import { placementFromSurface } from '../.test-build/src/domain/surfacePlacement.js';

test('placing preserves intentional overlap', () => {
  let state = createBoardState('castle');
  state = applyCommand(state, placeCommand(createWorldObject('one', 'chest', { x: 2, z: 3, elevation: 0 }, 1)));
  state = applyCommand(state, placeCommand(createWorldObject('two', 'orc', { x: 2, z: 3, elevation: 0 }, 2)));
  assert.deepEqual(state.objects.map((o) => o.id), ['one', 'two']);
});

test('remove command removes only the targeted object', () => {
  let state = createBoardState('field');
  const one = createWorldObject('one', 'chest', { x: 0, z: 0, elevation: 0 }, 1);
  const two = createWorldObject('two', 'orc', { x: 0, z: 0, elevation: 0 }, 2);
  state = applyCommand(applyCommand(state, placeCommand(one)), placeCommand(two));
  assert.deepEqual(applyCommand(state, removeCommand(one)).objects.map((o) => o.id), ['two']);
});

test('inverse command and undo redo preserve reversible edits', () => {
  const state = createBoardState('inn');
  const object = createWorldObject('door-1', 'door', { x: 1, z: -2, elevation: 0 }, 1);
  assert.equal(
    applyCommand(applyCommand(state, placeCommand(object)), invertCommand(placeCommand(object))).objects.length,
    0
  );
  const committed = commit(state, createHistory(), placeCommand(object));
  const undone = undo(committed.state, committed.history);
  const redone = redo(undone.state, undone.history);
  assert.equal(undone.state.objects.length, 0);
  assert.equal(redone.state.objects[0]?.id, 'door-1');
});

test('top stacking obeys the 8-block hard height cap', () => {
  assert.equal(elevationAbove(0, 0), 1);
  assert.equal(elevationAbove(2, 0), 3);
  assert.equal(elevationAbove(MAX_BASE_ELEVATION, 0), null);
  assert.equal(MAX_BUILD_HEIGHT_FEET, 40);
});

test('fallback stacking uses the highest object at the cell', () => {
  const objects = [
    createWorldObject('low', 'stone-block', { x: 4, z: 5, elevation: 0 }, 1),
    createWorldObject('high', 'stone-block', { x: 4, z: 5, elevation: 2 }, 2)
  ];
  assert.equal(stackElevationAt(objects, 4, 5, 0), 3);
  assert.equal(stackElevationAt(objects, 1, 1, 2), 2);
});

test('room dimensions snap safely and reject absurd or over-limit values', () => {
  assert.deepEqual(normalizeRoomDimensions({ lengthFeet: 31, widthFeet: 19, heightFeet: 11 }), {
    lengthFeet: 30, widthFeet: 20, heightFeet: 10,
    lengthCells: 6, widthCells: 4, heightLevels: 2
  });
  assert.equal(normalizeRoomDimensions({ lengthFeet: 30, widthFeet: 20, heightFeet: 99999999999999999999 }), null);
  assert.equal(normalizeRoomDimensions({ lengthFeet: 30, widthFeet: 20, heightFeet: 45 }), null);
  assert.equal(normalizeRoomDimensions({ lengthFeet: 95, widthFeet: 20, heightFeet: 10 }), null);
});

test('30x20x10 room creates two-level perimeter walls and no ceiling', () => {
  const room = normalizeRoomDimensions({ lengthFeet: 30, widthFeet: 20, heightFeet: 10 });
  assert.ok(room);
  const placement = { corner: { x: -4, z: -3, elevation: 0 }, orientation: { x: 1, z: 1 } };
  const positions = roomWallPositions(room, placement);
  assert.equal(positions.length, 48);
  assert.equal(positions.some((p) => p.x === 0 && p.z === 0), false);
  assert.deepEqual([...new Set(positions.map((p) => p.elevation))], [0, 1]);
});

test('room generation is reversible as one Undo step', () => {
  const room = normalizeRoomDimensions({ lengthFeet: 30, widthFeet: 20, heightFeet: 10 });
  assert.ok(room);
  const placement = { corner: { x: -4, z: -3, elevation: 0 }, orientation: { x: 1, z: 1 } };
  const walls = roomWallPositions(room, placement).map((p, index) =>
    createWorldObject(`room-${index}`, 'wall', p, index)
  );
  const committed = commit(createBoardState('castle'), createHistory(), placeManyCommand(walls));
  assert.equal(committed.history.past.length, 1);
  assert.equal(undo(committed.state, committed.history).state.objects.length, 0);
});

test('surface placement uses top face for up and side faces for out', () => {
  const clicked = { x: 2, z: 3, elevation: 4 };
  assert.deepEqual(placementFromSurface(clicked, 4, { x: 0, y: 1, z: 0 }, 0), { x: 2, z: 3, elevation: 5 });
  assert.deepEqual(placementFromSurface(clicked, 4, { x: 1, y: 0, z: 0 }, 0), { x: 3, z: 3, elevation: 4 });
  assert.deepEqual(placementFromSurface(clicked, 4, { x: 0, y: 0, z: -1 }, 0), { x: 2, z: 2, elevation: 4 });
});

test('side-face placement cannot leave the current board', () => {
  assert.equal(placementFromSurface({ x: 9, z: 0, elevation: 0 }, 0, { x: 1, y: 0, z: 0 }, 0), null);
});

test('room stamp can grow in all four directions from a clicked corner', () => {
  const room = normalizeRoomDimensions({ lengthFeet: 30, widthFeet: 20, heightFeet: 10 });
  assert.ok(room);
  for (const orientation of [{ x: 1, z: 1 }, { x: -1, z: 1 }, { x: 1, z: -1 }, { x: -1, z: -1 }]) {
    assert.equal(roomFitsAtCorner(room, { x: 0, z: 0, elevation: 0 }, orientation), true);
  }
});

test('smart room stamp flips inward near the far map corner', () => {
  const room = normalizeRoomDimensions({ lengthFeet: 30, widthFeet: 20, heightFeet: 10 });
  assert.ok(room);
  const placement = chooseRoomPlacement(room, { x: 9, z: 9, elevation: 0 }, []);
  assert.deepEqual(placement?.orientation, { x: -1, z: -1 });
  assert.equal(roomWallPositions(room, placement).length, 48);
});

test('smart room stamp prefers a valid direction when its default direction is blocked by the edge', () => {
  const room = normalizeRoomDimensions({ lengthFeet: 30, widthFeet: 20, heightFeet: 10 });
  assert.ok(room);
  const placement = chooseRoomPlacement(room, { x: 8, z: -8, elevation: 0 }, []);
  assert.equal(placement?.orientation.x, -1);
  assert.equal(placement?.orientation.z, 1);
});

test('smart room stamp avoids heavily occupied room footprint when another direction is clearer', () => {
  const room = normalizeRoomDimensions({ lengthFeet: 30, widthFeet: 20, heightFeet: 10 });
  assert.ok(room);
  const existingPlacement = { corner: { x: 0, z: 0, elevation: 0 }, orientation: { x: 1, z: 1 } };
  const existing = roomWallPositions(room, existingPlacement).map((p, i) =>
    createWorldObject(`existing-${i}`, 'wall', p, i)
  );
  const next = chooseRoomPlacement(room, { x: 0, z: 0, elevation: 0 }, existing);
  assert.notDeepEqual(next?.orientation, { x: 1, z: 1 });
});

test('room stamp rejects placement that would exceed build height', () => {
  const room = normalizeRoomDimensions({ lengthFeet: 30, widthFeet: 20, heightFeet: 10 });
  assert.ok(room);
  assert.equal(
    chooseRoomPlacement(room, { x: 0, z: 0, elevation: 7 }, []),
    null
  );
});
