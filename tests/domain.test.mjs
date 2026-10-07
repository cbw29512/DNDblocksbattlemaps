import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyCommand,
  createBoardState,
  createWorldObject,
  invertCommand,
  placeCommand,
  removeCommand
} from '../.test-build/src/domain/commands.js';
import { commit, createHistory, redo, undo } from '../.test-build/src/domain/history.js';

test('placing preserves intentional overlap', () => {
  let state = createBoardState('castle');
  const first = createWorldObject('one', 'chest', { x: 2, z: 3, elevation: 0 }, 1);
  const second = createWorldObject('two', 'orc', { x: 2, z: 3, elevation: 0 }, 2);
  state = applyCommand(state, placeCommand(first));
  state = applyCommand(state, placeCommand(second));
  assert.equal(state.objects.length, 2);
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
  const placed = applyCommand(state, placeCommand(object));
  const restored = applyCommand(placed, invertCommand(placeCommand(object)));
  assert.equal(restored.objects.length, 0);
});

test('undo and redo operate as reversible commands', () => {
  const object = createWorldObject('wall-1', 'wall', { x: 1, z: 1, elevation: 0 }, 1);
  const initial = createBoardState('castle');
  const committed = commit(initial, createHistory(), placeCommand(object));
  const undone = undo(committed.state, committed.history);
  const redone = redo(undone.state, undone.history);
  assert.equal(undone.state.objects.length, 0);
  assert.equal(redone.state.objects[0]?.id, 'wall-1');
  assert.equal(redone.history.future.length, 0);
});
