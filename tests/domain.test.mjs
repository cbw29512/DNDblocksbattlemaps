import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyCommand, createBoardState, createWorldObject, invertCommand,
  placeCommand, placeManyCommand, removeCommand
} from '../.test-build/src/domain/commands.js';
import {
  CATALOG_CATEGORIES, DEFAULT_PALETTE, PALETTE, catalogIdsForCategory
} from '../.test-build/src/domain/catalog.js';
import {
  createDefaultBoardBounds, growBoardBounds
} from '../.test-build/src/domain/boardBounds.js';
import {
  PRINT_PAGE_COLUMNS, PRINT_PAGE_ROWS,
  printAreaForState, printTilesForArea, topObjectAt
} from '../.test-build/src/domain/printLayout.js';
import { commit, createHistory, redo, undo } from '../.test-build/src/domain/history.js';
import { elevationAbove, stackElevationAt } from '../.test-build/src/domain/placement.js';
import { normalizeRoomDimensions } from '../.test-build/src/domain/room.js';
import {
  chooseRoomPlacement, roomFitsAtCorner, roomWallPositions
} from '../.test-build/src/domain/roomPlacement.js';
import {
  BOARD_MAX_CELLS, DEFAULT_BOARD_CELLS,
  MAX_BASE_ELEVATION, MAX_BUILD_HEIGHT_FEET,
  boardDepth, boardWidth
} from '../.test-build/src/domain/spatial.js';
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

test('side-face placement may request the next cell so the board can grow', () => {
  assert.deepEqual(
    placementFromSurface({ x: 14, z: 0, elevation: 0 }, 0, { x: 1, y: 0, z: 0 }, 0),
    { x: 15, z: 0, elevation: 0 }
  );
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


test('expanded catalog is grouped and every visible id resolves', () => {
  assert.deepEqual(CATALOG_CATEGORIES, ['Build', 'Props', 'Characters', 'Monsters']);
  assert.ok(DEFAULT_PALETTE.length >= 100);
  assert.ok(catalogIdsForCategory('Build').length >= 30);
  assert.ok(catalogIdsForCategory('Props').length >= 45);
  assert.equal(catalogIdsForCategory('Characters').length, 12);
  assert.ok(catalogIdsForCategory('Monsters').length >= 9);
  for (const id of DEFAULT_PALETTE) assert.ok(PALETTE[id], `missing catalog item ${id}`);
});

test('ordinary blocks have generated face art and combatants keep local Iron Pit art', () => {
  for (const category of ['Build', 'Props']) {
    for (const id of catalogIdsForCategory(category)) {
      const item = PALETTE[id];
      assert.equal(item.art?.source, 'generated', `${id} must use generated DND Blocks face art`);
      assert.match(item.art?.src ?? '', /^data:image\/svg\+xml/);
    }
  }

  for (const category of ['Characters', 'Monsters']) {
    for (const id of catalogIdsForCategory(category)) {
      const item = PALETTE[id];
      assert.equal(item.art?.source, 'iron-pit', `${id} must use Iron Pit art`);
      assert.match(item.art?.src ?? '', /^https:\/\/raw\.githubusercontent\.com\/cbw29512\/D20-ironpit\/main\/frontend\/assets\/portraits\/(heroes|monsters)\/.+\.webp$/);
    }
  }
});

test('all twelve 2024 player classes are present as one-cube character blocks', () => {
  const names = catalogIdsForCategory('Characters').map((id) => PALETTE[id].name).sort();
  assert.deepEqual(names, [
    'Barbarian','Bard','Cleric','Druid','Fighter','Monk',
    'Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard'
  ].sort());
});


test('every starter catalog object obeys the perfect-cube invariant', () => {
  for (const id of DEFAULT_PALETTE) {
    const item = PALETTE[id];
    assert.equal(item.shape, 'cube', `${id} must be a cube`);
    assert.equal(item.width, 1, `${id} width must be one grid cell`);
    assert.equal(item.depth, 1, `${id} depth must be one grid cell`);
    assert.equal(item.height, 1, `${id} height must be one grid cell`);
    assert.equal(item.footprintCells ?? 1, 1, `${id} starter footprint must be one cell`);
  }
});


test('new boards start at 30x30 squares', () => {
  const state = createBoardState('castle');
  assert.equal(DEFAULT_BOARD_CELLS, 30);
  assert.equal(boardWidth(state.bounds), 30);
  assert.equal(boardDepth(state.bounds), 30);
});

test('building on an edge grows only that board side by a 10-square chunk', () => {
  const start = createDefaultBoardBounds();
  const grown = growBoardBounds(start, [{ x: 14, z: 0 }]);
  assert.ok(grown);
  assert.equal(grown.minX, -15);
  assert.equal(grown.maxX, 25);
  assert.equal(boardWidth(grown), 40);
  assert.equal(boardDepth(grown), 30);
});

test('board growth stops at the 100x100 safety cap', () => {
  const maxWidth = { minX: -15, maxX: 85, minZ: -15, maxZ: 15 };
  assert.equal(boardWidth(maxWidth), BOARD_MAX_CELLS);
  assert.equal(growBoardBounds(maxWidth, [{ x: 84, z: 0 }]), null);
});

test('print pages are physical 8x10-square tiles', () => {
  assert.equal(PRINT_PAGE_COLUMNS, 8);
  assert.equal(PRINT_PAGE_ROWS, 10);
  const tiles = printTilesForArea({ minX: 0, maxX: 17, minZ: 0, maxZ: 21 });
  assert.equal(tiles.length, 9);
  assert.deepEqual(tiles[0], {
    minX: 0, maxX: 8, minZ: 0, maxZ: 10, pageColumn: 0, pageRow: 0
  });
});

test('print area follows built content with one-square padding', () => {
  const state = createBoardState('field');
  state.objects = [
    createWorldObject('one', 'wall', { x: -2, z: 3, elevation: 0 }, 1),
    createWorldObject('two', 'hero-fighter', { x: 4, z: 7, elevation: 0 }, 2)
  ];
  assert.deepEqual(printAreaForState(state), {
    minX: -3, maxX: 6, minZ: 2, maxZ: 9
  });
});

test('print map uses the top object in an occupied square', () => {
  const objects = [
    createWorldObject('ground', 'chest', { x: 1, z: 1, elevation: 0 }, 1),
    createWorldObject('top', 'hero-fighter', { x: 1, z: 1, elevation: 1 }, 2)
  ];
  assert.equal(topObjectAt(objects, 1, 1)?.id, 'top');
});

test('cube face art is rasterized and solid color remains until loaded', async () => {
  const { meshFor } = await import('../.test-build/src/render/threeObjects.js');
  const originalImage = globalThis.Image;
  const originalDocument = globalThis.document;
  let image;
  let draws = 0;
  try {
    globalThis.Image = class { constructor() { image = this; this.naturalWidth = 128; this.naturalHeight = 128; } set src(value) { this.url = value; } };
    globalThis.document = { baseURI: 'https://example.com/', createElement() {
      return { width: 0, height: 0, getContext() { return { fillRect() {}, drawImage() { draws += 1; } }; } };
    } };
    class MeshBasicMaterial { constructor(options) { Object.assign(this, options); this.color = { value: options.color, setHex: (v) => { this.color.value = v; } }; } }
    class CanvasTexture { constructor(canvas) { this.image = canvas; } }
    class Mesh { constructor(geometry, material) { this.geometry = geometry; this.material = material; this.position = { set() {} }; this.userData = {}; } }
    class BoxGeometry {}
    const THREE = { MeshBasicMaterial, CanvasTexture, Mesh, BoxGeometry, SRGBColorSpace: 'srgb' };
    const cube = meshFor(THREE, { id: 'test', catalogId: 'barrel', x: 0, z: 0, elevation: 0, createdAt: 1 });
    assert.equal(cube.material[0].color.value, PALETTE.barrel.color);
    assert.equal(cube.material[0].map, undefined);
    image.onload();
    assert.equal(draws, 1);
    assert.equal(cube.material[0].map.image.width, 256);
    assert.equal(cube.material[0].color.value, 0xffffff);
    assert.equal(cube.material[0].transparent, false);
  } finally {
    globalThis.Image = originalImage;
    globalThis.document = originalDocument;
  }
});

test('character ring color persists in a placed world object', () => {
  const character = createWorldObject('ring-test', 'hero-fighter', { x: 0, z: 0, elevation: 0 }, 1, 0x2688dc);
  assert.equal(character.ringColor, 0x2688dc);
  const state = applyCommand(createBoardState('castle'), placeCommand(character));
  assert.equal(state.objects[0].ringColor, 0x2688dc);
});

test('exclusive character rings return to palette on reassignment or removal', async () => {
  const { PLAYER_RINGS, availableRings, assignRing } = await import('../.test-build/src/domain/creatureMarks.js');
  const blue = PLAYER_RINGS[0].color, green = PLAYER_RINGS[1].color;
  const hero = createWorldObject('hero-1', 'hero-fighter', {x:1,z:1,elevation:0}, 1);
  const other = createWorldObject('hero-2', 'hero-monk', {x:2,z:2,elevation:0}, 2);
  let state = applyCommand(createBoardState('castle'), placeCommand(hero));
  state = applyCommand(state, placeCommand(other));
  const assigned = assignRing(state, hero.id, blue);
  assert.equal(assigned.ringColor, blue);
  state = applyCommand(state, {kind:'update', before:hero, after:assigned});
  assert.ok(!availableRings(state).includes(blue));
  assert.equal(assignRing(state, other.id, blue), null);
  const swapped = assignRing(state, hero.id, green);
  state = applyCommand(state, {kind:'update', before:assigned, after:swapped});
  assert.ok(availableRings(state).includes(blue));
  assert.ok(!availableRings(state).includes(green));
  state = applyCommand(state, removeCommand(swapped));
  assert.ok(availableRings(state).includes(green));
  assert.equal(assignRing(state, other.id, 0xd83030), null);
});
test('official condition markers toggle independently and exhaustion has six levels', async () => {
  const { CONDITIONS, toggleCondition } = await import('../.test-build/src/domain/creatureMarks.js');
  assert.equal(CONDITIONS.length, 15);
  let creature = createWorldObject('m', 'monster-goblin', {x:1,z:1,elevation:0}, 1);
  creature = toggleCondition(creature, 'Poisoned');
  creature = toggleCondition(creature, 'Stunned');
  assert.deepEqual(creature.conditions, ['Poisoned','Stunned']);
  creature = toggleCondition(creature, 'Poisoned');
  assert.deepEqual(creature.conditions, ['Stunned']);
  for (let i=1;i<=6;i++) {
    creature = toggleCondition(creature, 'Exhaustion');
    assert.equal(creature.exhaustion,i);
  }
  creature = toggleCondition(creature, 'Exhaustion');
  assert.equal(creature.exhaustion, 0);
  const wall = createWorldObject('w','wall',{x:0,z:0,elevation:0},2);
  assert.equal(toggleCondition(wall,'Stunned'),wall);
});
test('marker edits undo and redo without duplicating creatures', async () => {
  const before = createWorldObject('hero','hero-fighter',{x:0,z:0,elevation:0},1);
  const after = {...before, ringColor:0x31b86b, conditions:['Prone']};
  let state = applyCommand(createBoardState('castle'),placeCommand(before));
  let history = createHistory();
  const changed = commit(state, history,{kind:'update',before,after});
  const reverted = undo(changed.state,changed.history);
  assert.equal(reverted.state.objects.length,1);
  assert.deepEqual(reverted.state.objects[0],before);
  const restored = redo(reverted.state,reverted.history);
  assert.deepEqual(restored.state.objects[0],after);
});

test('legacy duplicate player colors are released safely on map load', async () => {
  const { normalizeRingAssignments, availableRings } = await import('../.test-build/src/domain/creatureMarks.js');
  const state = createBoardState('castle');
  state.objects = [
    createWorldObject('first', 'hero-fighter', {x:0,z:0,elevation:0}, 1, 0x2688dc),
    createWorldObject('second', 'hero-wizard', {x:1,z:0,elevation:0}, 2, 0x2688dc),
    createWorldObject('third', 'hero-rogue', {x:2,z:0,elevation:0}, 3, 0xd83030)
  ];
  const updated = normalizeRingAssignments(state);
  assert.equal(updated.objects[0].ringColor, 0x2688dc);
  assert.equal(updated.objects[1].ringColor, undefined);
  assert.equal(updated.objects[2].ringColor, undefined);
  assert.ok(!availableRings(updated).includes(0x2688dc));
  assert.equal(updated.objects.length, 3);
});

test('each official status ring has a stable non-red color', async () => {
  const { CONDITIONS, CONDITION_COLORS } = await import('../.test-build/src/domain/creatureMarks.js');
  for (const condition of CONDITIONS) {
    assert.ok(Number.isInteger(CONDITION_COLORS[condition]), condition);
    assert.notEqual(CONDITION_COLORS[condition], 0xd83030);
  }
});

test('moving a creature preserves identity, colored ring and conditions with undo', () => {
  const before = { ...createWorldObject('fighter-1','hero-fighter',{x:1,z:2,elevation:0},1,0x2688dc), conditions:['Poisoned'], exhaustion:2 };
  const after = {...before,x:5,z:6};
  const initial = applyCommand(createBoardState('castle'), placeCommand(before));
  const changed = commit(initial,createHistory(),{kind:'update',before,after});
  assert.equal(changed.state.objects.length,1);
  assert.deepEqual(changed.state.objects[0],after);
  assert.equal(changed.state.objects[0].ringColor,0x2688dc);
  assert.deepEqual(changed.state.objects[0].conditions,['Poisoned']);
  const restored = undo(changed.state,changed.history);
  assert.deepEqual(restored.state.objects[0],before);
});
