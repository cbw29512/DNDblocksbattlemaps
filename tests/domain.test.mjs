import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyCommand, createBoardState, createWorldObject, invertCommand,
  placeCommand, placeManyCommand, removeCommand
} from '../.test-build/src/domain/commands.js';
import {
  CATALOG_CATEGORIES, DEFAULT_PALETTE, PALETTE, catalogIdsForCategory, getCatalogItem
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
      assert.ok(item.art?.source === 'iron-pit' || (id.startsWith('monster-srd-') && item.art?.source === 'generated'), `${id} needs Iron Pit or visible generated fallback`);
      if (item.art?.source === 'iron-pit') assert.match(item.art?.src ?? '', /^https:\/\/raw\.githubusercontent\.com\/cbw29512\/D20-ironpit\/main\/frontend\/assets\/portraits\/(heroes|monsters)\/.+\.webp$/);
      else assert.match(item.art?.src ?? '', /^data:image\/svg\+xml/);
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
    assert.ok([1,2,3,4].includes(item.footprintCells ?? 1), `${id} footprint must consist of full five-foot cubes`);
    if (item.category !== 'Monsters') assert.equal(item.footprintCells ?? 1, 1, `${id} non-monster footprint must be one cell`);
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
    const THREE = { MeshBasicMaterial, MeshLambertMaterial: MeshBasicMaterial, CanvasTexture, Mesh, BoxGeometry, SRGBColorSpace: 'srgb' };
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

test('starter monster challenge ratings are edition-tagged for exact encounter filtering', () => {
  const expected = { goblin:'1/4', skeleton:'1/4', zombie:'1/4', wolf:'1/4', mimic:'2', ghoul:'1', kobold:'1/8', bandit:'1/8', orc:'1/2' };
  for (const [id,cr] of Object.entries(expected)) {
    const item = getCatalogItem('monster-' + id);
    assert.equal(item.challengeRating, cr, id);
    assert.equal(item.edition,'2014',id);
  }
});

test('campaign party propagates once to every map with stable IDs and local positions', async () => {
  const { setPartyMembership, partyRosterFromBoard, reconcilePartyOnMap } = await import('../.test-build/src/domain/party.js');
  const fighter = createWorldObject('campaign-fighter','hero-fighter',{x:3,z:4,elevation:0},1,0x2688dc);
  const castle = setPartyMembership(applyCommand(createBoardState('castle'),placeCommand(fighter)),fighter.id,true);
  const roster = partyRosterFromBoard(castle,{});
  assert.equal(Object.keys(roster).length,1);
  const inn = reconcilePartyOnMap(createBoardState('inn'),roster);
  assert.equal(inn.objects.length,1);
  assert.equal(inn.objects[0].id,fighter.id);
  assert.equal(inn.objects[0].ringColor,0x2688dc);
  const relocated = {...inn.objects[0],x:8,z:9,conditions:['Poisoned']};
  const placedInn = {...inn,objects:[relocated]};
  const latest = partyRosterFromBoard(placedInn,roster);
  const revisited = reconcilePartyOnMap(placedInn,latest);
  assert.equal(revisited.objects.length,1);
  assert.equal(revisited.objects[0].x,8);
  assert.deepEqual(revisited.objects[0].conditions,['Poisoned']);
  assert.equal(reconcilePartyOnMap(revisited,latest).objects.length,1);
});
test('unchecking Party removes copies without deleting the original character', async () => {
  const { setPartyMembership, removePartyFromMap } = await import('../.test-build/src/domain/party.js');
  const hero = createWorldObject('member','hero-cleric',{x:2,z:2,elevation:0},1);
  const origin = applyCommand(createBoardState('castle'),placeCommand(hero));
  const checked = setPartyMembership(origin,hero.id,true);
  const unchecked = removePartyFromMap(checked,hero.id,'castle');
  assert.equal(unchecked.objects.length,1);
  assert.equal(unchecked.objects[0].partyMember,false);
  const inn = {...createBoardState('inn'),objects:[{...hero,partyMember:true}]};
  assert.equal(removePartyFromMap(inn,hero.id,'castle').objects.length,0);
});

test('all canonical SRD monsters have a visual cube block, CR and footprint', () => {
  const monsters = catalogIdsForCategory('Monsters').filter(id => id.startsWith('monster-srd-'));
  assert.equal(monsters.length,330);
  assert.equal(new Set(monsters).size,330);
  for (const id of monsters) {
    const item = getCatalogItem(id);
    assert.ok(item.art?.src, id);
    assert.ok(['2014','2024'].includes(item.edition),id);
    assert.ok(item.challengeRating !== undefined,id);
    assert.ok([1,2,3,4].includes(item.footprintCells),id);
    assert.equal(item.shape,'cube',id);
  }
  assert.equal(getCatalogItem('monster-srd-aboleth').footprintCells,2);
  assert.equal(getCatalogItem('monster-srd-adult-black-dragon').footprintCells,3);
  assert.equal(getCatalogItem('monster-srd-ancient-red-dragon').footprintCells,4);
  assert.equal(getCatalogItem('monster-srd-goblin-warrior').footprintCells,1);
});

test('starter templates create editable real catalog cubes with unique IDs', async () => {
  const { STARTER_TEMPLATES, buildStarterTemplate } = await import('../.test-build/src/domain/starterTemplates.js');
  assert.equal(STARTER_TEMPLATES.length,8);
  for(const t of STARTER_TEMPLATES) {
    const state = buildStarterTemplate(t.id,'map-test-'+t.id);
    assert.equal(state.mapId,'map-test-'+t.id);
    assert.ok(state.objects.length > 30,t.id);
    assert.equal(state.objects.length,new Set(state.objects.map(o=>o.id)).size,t.id);
    for(const o of state.objects) {
      assert.ok(PALETTE[o.catalogId],o.catalogId);
      assert.ok(Number.isInteger(o.x)&&Number.isInteger(o.z)&&Number.isInteger(o.elevation));
    }
    assert.deepEqual(buildStarterTemplate(t.id,'map-test-'+t.id),state);
  }
});
test('Starter Inn entrance and partition doorways are actually open', async () => {
  const {buildStarterTemplate} = await import('../.test-build/src/domain/starterTemplates.js');
  const state=buildStarterTemplate('inn','map-test-inn');
  for(const [x,z] of [[0,9],[0,-1],[-2,-5],[4,-5]]) {
    assert.ok(state.objects.some(o=>o.x===x&&o.z===z&&o.catalogId==='open-doorway'));
    assert.equal(state.objects.filter(o=>o.x===x&&o.z===z&&o.elevation===1&&o.catalogId==='wood-wall').length,0);
  }
  assert.ok(state.objects.some(o=>o.catalogId==='table'));
  assert.ok(state.objects.some(o=>o.catalogId==='bed'));
  assert.ok(state.objects.some(o=>o.catalogId==='fireplace'));
});
test('starter map Party uses canonical character identity and entrance squares', async () => {
  const {buildStarterTemplate} = await import('../.test-build/src/domain/starterTemplates.js');
  const hero={...createWorldObject('party-fighter','hero-fighter',{x:2,z:3,elevation:0},1,0x2688dc),partyMember:true,conditions:['Poisoned']};
  const roster={'party-fighter':{character:hero,origin:'castle'}};
  const inn=buildStarterTemplate('inn','map-test-party',roster);
  const found=inn.objects.filter(o=>o.id===hero.id);
  assert.equal(found.length,1);
  assert.equal(found[0].ringColor,hero.ringColor);
  assert.deepEqual(found[0].conditions,hero.conditions);
  assert.equal(found[0].x,inn.partyStart.x);
  assert.equal(found[0].z,inn.partyStart.z);
  assert.equal(inn.objects.some(o=>o.id===hero.id && o.catalogId==='hero-fighter'),true);
});
test('multiple saved Starter Inns do not change existing terrain maps or each other', async () => {
  const {createStarterMap,loadBoard,loadPartyRoster,listCampaignMaps}=await import('../.test-build/src/domain/storage.js');
  const oldStorage=globalThis.localStorage;
  const data=new Map();
  globalThis.localStorage={
    getItem:k=>data.has(k)?data.get(k):null,
    setItem:(k,v)=>data.set(k,String(v)),
    removeItem:k=>data.delete(k)
  };
  try {
    const original=JSON.stringify({terrain:'inn',bounds:{minX:-15,maxX:15,minZ:-15,maxZ:15},objects:[createWorldObject('existing','table',{x:0,z:0,elevation:0},1)],revision:1});
    data.set('dndblocks:stage1:inn',original);
    const one=createStarterMap('inn'),two=createStarterMap('inn');
    assert.notEqual(one.id,two.id);
    assert.equal(listCampaignMaps().length,2);
    assert.equal(data.get('dndblocks:stage1:inn'),original);
    assert.equal(loadBoard('inn',one.id).mapId,one.id);
    assert.equal(loadBoard('inn',two.id).mapId,two.id);
    assert.equal(loadBoard('inn').objects[0].id,'existing');
    assert.ok(loadPartyRoster());
  } finally {globalThis.localStorage=oldStorage;}
});

test('Inn palette lists area-relevant blocks first in alphabetical order, then all others alphabetically', async () => {
  const { catalogIdsForArea } = await import('../.test-build/src/domain/catalogOrder.js');
  const sorted = catalogIdsForArea('Props','inn','inn');
  const relevant = id => (getCatalogItem(id).tags ?? []).some(t => ['inn','tavern','furniture'].includes(t));
  const firstUnrelated = sorted.findIndex(id => !relevant(id));
  assert.ok(firstUnrelated > 0);
  assert.ok(sorted.slice(0,firstUnrelated).every(relevant));
  assert.ok(sorted.slice(firstUnrelated).every(id => !relevant(id)));
  for(const group of [sorted.slice(0,firstUnrelated),sorted.slice(firstUnrelated)]) {
    const names=group.map(id=>getCatalogItem(id).name);
    assert.deepEqual(names,[...names].sort((a,b)=>a.localeCompare(b,'en',{sensitivity:'base'})));
  }
  assert.deepEqual(new Set(sorted),new Set(catalogIdsForCategory('Props')));
  assert.equal(sorted.length,catalogIdsForCategory('Props').length);
});
test('area ordering adapts for harbor and cave without dropping blocks', async () => {
  const { catalogIdsForArea } = await import('../.test-build/src/domain/catalogOrder.js');
  for (const [terrain,template] of [['sea','harbor'],['castle','cave'],['castle','dungeon'],['field','forest']]) {
    const result=catalogIdsForArea('Build',terrain,template);
    assert.equal(result.length,catalogIdsForCategory('Build').length);
    assert.deepEqual(new Set(result),new Set(catalogIdsForCategory('Build')));
  }
  assert.notDeepEqual(catalogIdsForArea('Build','inn','inn'),catalogIdsForArea('Build','sea','harbor'));
});

test('G0a backup includes legacy maps, custom maps, roster and corrupted saves without mutation', async () => {
  const { createBrowserBackup, validateBrowserBackup } = await import('../.test-build/src/domain/browserBackup.js');
  const records = new Map([
    ['dndblocks:stage1:inn', '{"terrain":"inn","objects":[1]}'],
    ['dndblocks:campaign-party:v1', '{"hero":{"id":"party-1"}}'],
    ['dndblocks:custom-maps:v1', '[{"id":"map-one"}]'],
    ['dndblocks:custom-map:v1:map-one', '{"mapId":"map-one"}'],
    ['dndblocks:custom-map:v1:damaged', '{"incomplete":'],
    ['unrelated:secret', 'never export this']
  ]);
  const before = [...records.entries()];
  let writes = 0;
  const storage = {
    get length() { return records.size; },
    key: n => [...records.keys()][n] ?? null,
    getItem: k => records.get(k) ?? null,
    setItem: () => { writes++; throw new Error('write forbidden'); },
    removeItem: () => { writes++; throw new Error('delete forbidden'); }
  };
  const backup=createBrowserBackup(storage, '2026-10-08T00:00:00.000Z');
  assert.equal(backup.version,1);
  assert.equal(backup.entries.length,5);
  assert.equal(backup.entries.some(x => x.key === 'unrelated:secret'), false);
  assert.equal(backup.entries.find(x=>x.key.endsWith('damaged')).validJson,false);
  assert.equal(backup.entries.find(x=>x.key.endsWith('damaged')).raw,'{"incomplete":');
  assert.equal(writes,0);
  assert.deepEqual([...records.entries()],before);
  assert.equal(validateBrowserBackup(JSON.parse(JSON.stringify(backup))),true);
  assert.equal(validateBrowserBackup({...backup,version:2}),false);
  assert.equal(validateBrowserBackup({...backup,entries:[backup.entries[0],backup.entries[0]]}),false);
  assert.equal(validateBrowserBackup({...backup,entries:[{...backup.entries[0],raw:'invalid'}]}),false);
});
test('G0a empty storage exports a valid empty backup', async () => {
  const {createBrowserBackup,validateBrowserBackup}=await import('../.test-build/src/domain/browserBackup.js');
  const storage={length:0,key:()=>null,getItem:()=>null};
  const backup=createBrowserBackup(storage,'2026-10-08T00:00:00Z');
  assert.deepEqual(backup.entries,[]);
  assert.equal(validateBrowserBackup(backup),true);
});

test('AoE sphere includes cells inside 20-foot radius, excludes beyond and honors height', async () => {
  const { AREA_PRESETS, areaContainsPoint, isInCastingRange } = await import('../.test-build/src/domain/areaTemplates.js');
  const fireball=AREA_PRESETS.find(x=>x.id==='fireball');
  const placement={origin:{x:0,z:0,elevation:0},center:{x:10,z:0,elevation:0}};
  assert.ok(isInCastingRange(fireball,placement));
  assert.equal(areaContainsPoint(fireball,placement,{x:13,z:0,elevation:0}),true);
  assert.equal(areaContainsPoint(fireball,placement,{x:14,z:0,elevation:0}),false);
  assert.equal(areaContainsPoint(fireball,placement,{x:15,z:0,elevation:0}),false);
  assert.equal(areaContainsPoint(fireball,placement,{x:10,z:0,elevation:5}),false);
  assert.equal(isInCastingRange(fireball,{...placement,center:{x:31,z:0,elevation:0}}),false);
});
test('AoE cones and lines require direction and do not treat breath as cubes', async () => {
  const {AREA_PRESETS,areaContainsPoint}=await import('../.test-build/src/domain/areaTemplates.js');
  const cone=AREA_PRESETS.find(x=>x.id==='dragon-fire-cone');
  const line=AREA_PRESETS.find(x=>x.id==='lightning-bolt');
  const p={origin:{x:0,z:0,elevation:0},center:{x:5,z:0,elevation:0}};
  assert.equal(areaContainsPoint(cone,p,{x:4,z:1,elevation:0}),true);
  assert.equal(areaContainsPoint(cone,p,{x:4,z:3,elevation:0}),false);
  assert.equal(areaContainsPoint(cone,p,{x:-1,z:0,elevation:0}),false);
  assert.equal(areaContainsPoint(line,p,{x:5,z:0,elevation:0}),true);
  assert.equal(areaContainsPoint(line,p,{x:5,z:1,elevation:0}),false);
  assert.equal(areaContainsPoint(line,{origin:p.origin,center:p.origin},{x:1,z:0,elevation:0}),false);
});

test('AoE preview intersects full Large, Huge and Gargantuan monster volumes once', async () => {
 const {creatureOccupiedCells,previewAffectedCreatures}=await import('../.test-build/src/domain/areaTargets.js');
 const ids=['monster-srd-ogre','monster-srd-stone-giant','monster-srd-ancient-red-dragon'];
 const actual=ids.map(id=>({id,catalogId:id,x:0,z:0,elevation:0,createdAt:0}));
 const counts=actual.map(o=>creatureOccupiedCells(o).length);
 assert.deepEqual(counts,[8,27,64]);
 const hits=previewAffectedCreatures(actual,[{x:1,z:1,elevation:1},{x:2,z:2,elevation:2},{x:3,z:3,elevation:3}]);
 assert.equal(hits.length,3);
 assert.deepEqual(hits.map(x=>x.id),ids);
 assert.equal(previewAffectedCreatures(actual,[{x:4,z:4,elevation:4}]).length,0);
});
test('AoE preview ignores non-creature scenery, preserves identity',async()=>{
 const {previewAffectedCreatures}=await import('../.test-build/src/domain/areaTargets.js');
 const objects=[{id:'wall',catalogId:'wall',x:0,z:0,elevation:0,createdAt:0},
 {id:'pc',catalogId:'hero-fighter',x:0,z:0,elevation:0,createdAt:1}];
 assert.deepEqual(previewAffectedCreatures(objects,[{x:0,z:0,elevation:0}]).map(x=>x.id),['pc']);
});

test('DMG circular half-square grid: 20-foot Fireball has 52 horizontal squares, not full 8x8 box', async () => {
  const { circularGridCellAffected, circularSquareCoverage } = await import('../.test-build/src/domain/areaTemplates.js');
  const selected=[];
  for(let z=-4;z<4;z++)for(let x=-4;x<4;x++)if(circularGridCellAffected(20,0,0,x,z))selected.push([x,z]);
  assert.equal(selected.length,52);
  assert.equal(circularGridCellAffected(20,0,0,-4,-4),false);
  assert.equal(circularGridCellAffected(20,0,0,-1,-1),true);
  assert.ok(circularSquareCoverage(20,0,0,-4,-4)<0.5);
  assert.equal(circularGridCellAffected(10,0,0,0,0),true);
});

test('area registry keeps edition identities distinct and samples fail closed',async()=>{
 const {AREA_ABILITY_REGISTRY,getAreaAbility,isRawCertified}=await import('../.test-build/src/domain/areaAbilityRegistry.js');
 const entries=AREA_ABILITY_REGISTRY.filter(x=>x.actionId==='fireball');
 assert.deepEqual(entries.map(x=>x.edition),['2014','2024']);
 assert.notEqual(entries[0].key,entries[1].key);
 assert.equal(new Set(AREA_ABILITY_REGISTRY.map(x=>x.key)).size,AREA_ABILITY_REGISTRY.length);
 assert.equal(getAreaAbility('2014:sample:fireball')?.verification,'illustrative');
 assert.equal(getAreaAbility('2024:sample:fireball')?.verification,'illustrative');
 assert.equal(getAreaAbility('2024:sample:missing'),null);
 assert.ok(AREA_ABILITY_REGISTRY.every(x=>!isRawCertified(x)));
});

test('horizontal 60-foot line is exactly 12 joined translucent-cube cells',async()=>{
 const {areaCells}=await import('../.test-build/src/domain/areaTemplates.js');
 const shape={id:'sample-60',label:'60 foot sample',shape:'line',sizeFeet:60,widthFeet:5,maxRangeFeet:0,visual:'lightning'};
 const limits={minX:-25,maxX:26,minZ:-25,maxZ:26,minElevation:0,maxElevation:1};
 const east=areaCells(shape,{origin:{x:0,z:0,elevation:0},center:{x:4,z:0,elevation:0}},limits);
 assert.equal(east.length,12);
 assert.deepEqual(east.map(p=>p.x),Array.from({length:12},(_,i)=>i+1));
 assert.ok(east.every(p=>p.z===0 && p.elevation===0));
 const north=areaCells(shape,{origin:{x:0,z:0,elevation:0},center:{x:0,z:-2,elevation:0}},limits);
 assert.equal(north.length,12);
 assert.deepEqual(north.map(p=>p.z),Array.from({length:12},(_,i)=>-12+i));
});
test('standard sample 100-foot line is 20 five-foot cubes',async()=>{
 const {areaCells,AREA_PRESETS}=await import('../.test-build/src/domain/areaTemplates.js');
 const shape=AREA_PRESETS.find(x=>x.id==='lightning-bolt');
 const cubes=areaCells(shape,{origin:{x:5,z:2,elevation:0},center:{x:10,z:2,elevation:0}},
 {minX:0,maxX:35,minZ:0,maxZ:8,minElevation:0,maxElevation:0});
 assert.equal(cubes.length,20);
 assert.ok(cubes.every(p=>p.z===2 && p.elevation===0));
});

test('Self-origin line and cone stay anchored at caster while pointer changes aim',async()=>{
 const {AREA_PRESETS,areaCells,isInCastingRange}=await import('../.test-build/src/domain/areaTemplates.js');
 const origin={x:8,z:8,elevation:0};
 const limits={minX:0,maxX:32,minZ:0,maxZ:32,minElevation:0,maxElevation:0};
 for(const id of ['lightning-bolt','burning-hands','cone-of-cold','dragon-fire-line']){
  const shape=AREA_PRESETS.find(x=>x.id===id);
  assert.equal(shape.originMode,'self');
  const east={origin,center:{x:12,z:8,elevation:0}};
  const north={origin,center:{x:8,z:12,elevation:0}};
  assert.ok(isInCastingRange(shape,east));
  const e=areaCells(shape,east,limits),n=areaCells(shape,north,limits);
  assert.ok(e.length>0 && n.length>0);
  assert.notDeepEqual(e,n,'aim changes affected cells without changing the caster origin');
  assert.ok(e.some(p=>p.x>=origin.x && p.z===origin.z));
 }
 const fireball=AREA_PRESETS.find(x=>x.id==='fireball');
 assert.notEqual(fireball.originMode,'self');
 assert.equal(isInCastingRange(fireball,{origin,center:{x:100,z:100,elevation:0}}),false);
});

test('Self line starts at forward occupied edge of larger casters',async()=>{
 const {selfAreaOriginCell}=await import('../.test-build/src/domain/areaTargets.js');
 const cases=[['monster-srd-ogre',2],['monster-srd-stone-giant',3],['monster-srd-ancient-red-dragon',4]];
 for(const [catalogId,size] of cases){
  const actor={id:catalogId,catalogId,x:10,z:10,elevation:0};
  assert.deepEqual(selfAreaOriginCell(actor,{x:30,z:10,elevation:0}),{x:10+size-1,z:10,elevation:0});
  assert.deepEqual(selfAreaOriginCell(actor,{x:0,z:10,elevation:0}),{x:10,z:10,elevation:0});
  assert.deepEqual(selfAreaOriginCell(actor,{x:10,z:30,elevation:0}),{x:10,z:10+size-1,elevation:0});
 }
});

test('eight-direction line preview preserves feet for diagonal steps',async()=>{
 const {areaCells}=await import('../.test-build/src/domain/areaTemplates.js');
 const area={id:'diag-sample',label:'Line sample',shape:'line',sizeFeet:60,widthFeet:5,maxRangeFeet:0,originMode:'self',visual:'lightning'};
 const origin={x:10,z:10,elevation:0};
 const limits={minX:0,maxX:30,minZ:0,maxZ:30,minElevation:0,maxElevation:0};
 const cardinal=areaCells(area,{origin,center:{x:20,z:10,elevation:0}},limits);
 const diagonal=areaCells(area,{origin,center:{x:20,z:20,elevation:0}},limits);
 assert.equal(cardinal.length,12);
 assert.equal(diagonal.length,8);
 assert.deepEqual(diagonal.map(p=>[p.x,p.z]),Array.from({length:8},(_,i)=>[11+i,11+i]));
 assert.ok(diagonal.every(p=>Math.hypot(p.x-origin.x,p.z-origin.z)*5<=60));
 const opposite=areaCells(area,{origin,center:{x:0,z:0,elevation:0}},limits);
 assert.equal(opposite.length,8);
 assert.deepEqual(opposite[0],{x:2,z:2,elevation:0});
});

test('DND Blocks sphere selects any positive 3D cube overlap without clipping below map or at walls',async()=>{
  const {AREA_PRESETS,areaContainsPoint,areaCells}=await import('../.test-build/src/domain/areaTemplates.js');
  const fireball=AREA_PRESETS.find(x=>x.id==='fireball');
  const origin={x:0,z:0,elevation:0};
  const placement={origin,center:origin};
  // A tiny corner of each cube counts as a FULL affected cube.
  assert.equal(areaContainsPoint(fireball,placement,{x:3,z:2,elevation:0}),true);
  // Both above and below the floor, even when outside a visible ground-level board.
  assert.equal(areaContainsPoint(fireball,placement,{x:0,z:0,elevation:-4}),true);
  assert.equal(areaContainsPoint(fireball,placement,{x:0,z:0,elevation:3}),true);
  assert.equal(areaContainsPoint(fireball,placement,{x:0,z:0,elevation:4}),false);
  // At altitude, horizontal footprint narrows: this must NOT be a cylinder.
  assert.equal(areaContainsPoint(fireball,placement,{x:4,z:3,elevation:3}),false);
  // Occluding scenery is not provided to pure geometric projection.
  // Never truncate underlying geometry to current camera/window viewport.
  const out=areaCells(fireball,placement,{minX:-5,maxX:6,minZ:-5,maxZ:6,minElevation:-5,maxElevation:5});
  assert.ok(out.some(c=>c.elevation<0));
  assert.ok(out.some(c=>c.x<0));
  assert.ok(!out.some(c=>c.elevation===5));
});

test('Fireball area reports caster, friendly hero and enemy once each, not scenery', async () => {
  const { AREA_PRESETS, areaCells } = await import('../.test-build/src/domain/areaTemplates.js');
  const { previewAffectedCreatures } = await import('../.test-build/src/domain/areaTargets.js');
  const fireball = AREA_PRESETS.find(x => x.id === 'fireball');
  const origin = {x: 0, z: 0, elevation: 0};
  const center = {x: 2, z: 0, elevation: 0};
  const area = areaCells(fireball, {origin, center}, {
    minX: -5, maxX: 8, minZ: -6, maxZ: 7, minElevation: -5, maxElevation: 6
  });
  const creature = (id, catalogId, x, z, elevation = 0) =>
    ({id, catalogId, x, z, elevation, createdAt: 0});
  const objects = [
    creature('caster','hero-fighter',0,0),
    creature('ally','hero-fighter',1,0),
    creature('enemy','monster-srd-ogre',5,0),
    creature('outside','monster-srd-ogre',12,0),
    creature('wall','wall',2,0)
  ];
  assert.deepEqual(previewAffectedCreatures(objects, area).map(o => o.id),
    ['caster','ally','enemy']);
  assert.equal(previewAffectedCreatures(objects, []).length,0);
});

test('core terrain blocks carry distinct square face patterns without changing cube geometry', async () => {
  const { generatedCubeArt } = await import('../.test-build/src/domain/faceArt.js');
  const ids = ['grass','stone-block','wood-block','water','lava','brick-wall','sand'];
  const svgs = ids.map(id => decodeURIComponent(generatedCubeArt(id,id,'terrain',0x777777).src.split(',')[1]));
  assert.equal(new Set(svgs).size, ids.length);
  for (const svg of svgs) {
    assert.match(svg, /viewBox="0 0 128 128"/);
    assert.match(svg, /<rect width="128" height="128"/);
    assert.doesNotMatch(svg, /<text/);
  }
  assert.match(decodeURIComponent(generatedCubeArt('barrel','Barrel','barrel',0x777777).src.split(',')[1]), /<text/);
});
