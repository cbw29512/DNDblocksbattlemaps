import { PLAYER_RINGS, CONDITIONS, CONDITION_COLORS, availableRings, assignRing, toggleCondition, isCreature, normalizeRingAssignments } from '../domain/creatureMarks.js?v=creaturerings1008';
import { catalogPanelHtml, filterCatalog, setCatalogCategory } from './catalogPanel.js?v=creaturerings1008';
import { printBoardMap } from './printMap.js?v=creaturerings1008';
import { roomPanelError, roomPanelHtml, readRoomPanel } from './roomPanel.js?v=creaturerings1008';
import { boundsChanged, growBoardBounds } from '../domain/boardBounds.js?v=creaturerings1008';
import { TERRAIN_THEMES, getCatalogItem } from '../domain/catalog.js?v=creaturerings1008';
import { createBoardState, createWorldObject, findObject, placeCommand, placeManyCommand, removeCommand } from '../domain/commands.js?v=creaturerings1008';
import { commit, createHistory, redo, undo } from '../domain/history.js?v=creaturerings1008';
import { roomSummary } from '../domain/room.js?v=creaturerings1008';
import { roomWallPositions } from '../domain/roomPlacement.js?v=creaturerings1008';
import { BOARD_MAX_CELLS, MAX_BASE_ELEVATION, boardDepth, boardWidth } from '../domain/spatial.js?v=creaturerings1008';
import { clearBoard, loadBoard, saveBoard } from '../domain/storage.js?v=creaturerings1008';
import { createRenderer } from '../render/createRenderer.js?v=creaturerings1008';
function makeId() {
    return crypto.randomUUID?.() ?? `obj-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
export async function renderBuilder(root, terrainId, handlers) {
    const theme = TERRAIN_THEMES[terrainId] ?? TERRAIN_THEMES.castle;
    let state = normalizeRingAssignments(loadBoard(theme.id));
    let history = createHistory();
    let renderer = null;
    let selected = 'stone-block';
    let armedRoom = null;
    let elevation = 0;
    let pickedCreatureId = null;
    let moveMode = false;
    root.innerHTML = `
    <main class="builder-shell" style="--theme-accent:${theme.accentCss}">
      <header class="builder-topbar">
        <button class="brand builder-brand" id="builder-home" type="button">
          <span class="brand-mark"><i></i><i></i><i></i></span><span>DND Blocks</span>
        </button>
        <div class="map-title">
          <b>${theme.name} Map</b>
          <small id="board-size"></small>
        </div>
        <div class="builder-actions">
          <button id="creature-mode" class="button button-ghost" type="button" aria-pressed="false">Combat Mode</button>
          <button id="undo" class="icon-button" type="button" title="Undo">↶</button>
          <button id="redo" class="icon-button" type="button" title="Redo">↷</button>
          <button id="print-map" class="button button-ghost" type="button">Print Map</button>
          <button id="clear" class="button button-ghost" type="button">Clear Map</button>
        </div>
      </header>
      <aside class="builder-sidebar">
        <div id="build-tools">
        ${roomPanelHtml()}
        ${catalogPanelHtml(selected)}
        </div>
        <section class="creature-ring-tools" aria-label="Creature markers">
          <div id="identity-ring-tools">
          <strong>Drag rings onto creatures</strong>
          <small>Each player color belongs to one character. Red is for monsters.</small>
          <div class="creature-ring-options" id="available-ring-colors">
            ${PLAYER_RINGS.map(r => `<button type="button" draggable="true" class="ring-token" data-ring-color="${r.color}" title="Drag ${r.name} onto a character"><i style="--ring:#${r.color.toString(16).padStart(6,'0')}"></i>${r.name}</button>`).join('')}
          </div>
          </div>
          <strong>Status rings</strong>
          <small>Drag a condition onto a character or monster. Drop it again to remove. Exhaustion increases through 6, then clears.</small>
          <div class="creature-status-options">
            ${CONDITIONS.map(s => `<button type="button" draggable="true" class="status-token" data-condition="${s}" style="--status-ring:#${CONDITION_COLORS[s].toString(16).padStart(6,'0')}">${s}</button>`).join('')}
          </div>
        </section>
        <div class="elevation-control">
          <span>Elevation</span>
          <div>
            <button id="elev-down" type="button">−</button>
            <b id="elev-value">Ground</b>
            <button id="elev-up" type="button">+</button>
          </div>
        </div>
        <div class="prototype-tip">
          <b>Controls</b>
          <span>Build Room → click a corner</span>
          <span>Cancel Room / Esc → stop room tool</span>
          <span>Build at an edge → map grows</span>
          <span>Gold room outline: valid</span>
          <span>Top face: build up</span>
          <span>Side face: build out</span>
          <span>Right click: remove</span>
          <span>Wheel: zoom</span>
        </div>
      </aside>
      <section class="board-stage">
        <div class="board-canvas" id="board-canvas" aria-label="Interactive battle map"></div>
        <div class="camera-dock" aria-label="Camera controls">
          <button id="rotate-left" title="Rotate left">↶</button>
          <button id="camera-home" title="Fit whole map">⌂</button>
          <button id="rotate-right" title="Rotate right">↷</button>
          <button id="zoom-in" title="Zoom in">＋</button>
          <button id="zoom-out" title="Zoom out">−</button>
        </div>
        <div class="board-status" id="board-status">Loading board…</div>
      </section>
    </main>
  `;
    const status = document.getElementById('board-status');
    const canvas = document.getElementById('board-canvas');
    const boardSize = document.getElementById('board-size');
    const buildRoomButton = document.getElementById('build-room');
    const updateBoardSize = () => {
        boardSize.textContent =
            `${boardWidth(state.bounds)} × ${boardDepth(state.bounds)} squares · saves in this browser`;
    };
    const updateRingTokens = () => {
        const available = new Set(availableRings(state));
        root.querySelectorAll('[data-ring-color]').forEach(button => {
            const color = Number(button.dataset.ringColor);
            button.hidden = !available.has(color);
            button.draggable = available.has(color);
        });
    };

    const refresh = () => {
        renderer?.render(state);
        saveBoard(state);
        updateBoardSize();
        updateRingTokens();
    };
    const run = (command, positions) => {
        const grown = growBoardBounds(state.bounds, positions);
        if (!grown) {
            status.textContent =
                `Map limit reached. Maximum is ${BOARD_MAX_CELLS} × ${BOARD_MAX_CELLS} squares.`;
            return null;
        }
        const didGrow = boundsChanged(state.bounds, grown);
        if (didGrow)
            state = { ...state, bounds: grown };
        const next = commit(state, history, command);
        state = next.state;
        history = next.history;
        refresh();
        return didGrow;
    };
    const setRoomMode = (room) => {
        armedRoom = room;
        renderer?.setRoomPlacement(room);
        if (room) {
            renderer?.setSelectedCatalog(null);
            root.querySelectorAll('.palette-item').forEach((item) => item.classList.remove('active'));
            buildRoomButton.classList.add('is-armed');
            buildRoomButton.setAttribute('aria-pressed', 'true');
            buildRoomButton.textContent = 'Cancel Room';
            status.textContent =
                `${roomSummary(room)} room ready. Move the gold outline, click, and keep clicking for more rooms. Cancel Room or Esc stops.`;
            return;
        }
        buildRoomButton.classList.remove('is-armed');
        buildRoomButton.setAttribute('aria-pressed', 'false');
        buildRoomButton.textContent = 'Build Room';
    };
    const restoreSelectedBlock = () => {
        setCatalogCategory(root, getCatalogItem(selected).category);
        renderer?.setSelectedCatalog(selected);
        root.querySelectorAll('.palette-item').forEach((item) => {
            item.classList.toggle('active', item.dataset.catalog === selected);
        });
    };
    const cancelRoomMode = () => {
        if (!armedRoom)
            return;
        setRoomMode(null);
        restoreSelectedBlock();
        status.textContent = `Room placement canceled. ${getCatalogItem(selected).name} selected.`;
    };
    renderer = await createRenderer(canvas, {
        onPickCreature(id) {
            if (!moveMode) return;
            const creature = findObject(state, id);
            if (!creature || !isCreature(creature)) return;
            pickedCreatureId = id;
            renderer?.setMovingCreature(id);
            status.textContent = `${getCatalogItem(creature.catalogId).name} picked up. Click a destination square or press Escape.`;
        },
        onMoveCreature(position) {
            const creature = pickedCreatureId ? findObject(state, pickedCreatureId) : null;
            if (!creature || !isCreature(creature)) return;
            const after = { ...creature, x: position.x, z: position.z, elevation: creature.elevation };
            const result = run({ kind: 'update', before: creature, after }, [position]);
            if (result === null) return;
            pickedCreatureId = null;
            renderer?.setMovingCreature(null);
            status.textContent = `${getCatalogItem(creature.catalogId).name} moved. Ring and conditions preserved.`;
        },
        onPlace(position) {
            if (moveMode) return;
            const object = createWorldObject(makeId(), selected, position);
      const grew = run(placeCommand(object), [position]);
            if (grew !== null && !grew)
                status.textContent = `${getCatalogItem(selected).name} placed. Click again to place more.`;
            if (grew) {
                status.textContent =
                    `Map grew to ${boardWidth(state.bounds)} × ${boardDepth(state.bounds)} squares. Keep building.`;
            }
        },
        onRoomPlacement(placement) {
            if (moveMode) return;
            if (!armedRoom)
                return;
            const wallPositions = roomWallPositions(armedRoom, placement, state.bounds);
            if (!wallPositions.length) {
                status.textContent = 'That room would exceed the map or height limit.';
                return;
            }
            const walls = wallPositions
                .filter((position) => !state.objects.some((object) => object.catalogId === 'wall' &&
                object.x === position.x &&
                object.z === position.z &&
                object.elevation === position.elevation))
                .map((position) => createWorldObject(makeId(), 'wall', position));
            if (!walls.length) {
                status.textContent =
                    'Those walls already exist. Move the gold outline and click another corner.';
                return;
            }
            const grew = run(placeManyCommand(walls), wallPositions);
            if (grew === null)
                return;
            const growthText = grew
                ? ` Map grew to ${boardWidth(state.bounds)} × ${boardDepth(state.bounds)} squares.`
                : '';
            status.textContent =
                `Built ${roomSummary(armedRoom)} room.${growthText} Move the gold outline and click again.`;
        },
        onMarkDrop(id, payload) {
            const object = findObject(state, id);
            if (!object || !isCreature(object)) {
                status.textContent = 'Rings can only be attached to characters or monsters.';
                return;
            }
            let updated = null;
            if (payload.startsWith('ring:')) {
                updated = assignRing(state, id, Number.parseInt(payload.slice(5), 16));
                if (!updated) { status.textContent = 'That player ring is unavailable or reserved.'; return; }
            } else if (payload.startsWith('status:')) {
                const condition = payload.slice(7);
                if (!CONDITIONS.some(c => c === condition)) return;
                updated = toggleCondition(object, condition);
            } else return;
            run({ kind: 'update', before: object, after: updated }, []);
            status.textContent = `${getCatalogItem(object.catalogId).name} markers updated.`;
        },
        onRemove(id) {
            const object = findObject(state, id);
            if (object)
                run(removeCommand(object), []);
        },
        onStatus(message) {
            status.textContent = message;
        }
    });
    renderer.setTheme(theme);
    renderer.setSelectedCatalog(selected);
    renderer.setRoomPlacement(null);
    renderer.setElevation(elevation);
    renderer.render(state);
    updateBoardSize();
  updateRingTokens();
    root.querySelectorAll('[data-ring-color], [data-condition]').forEach(token => {
    token.addEventListener('dragstart', (event) => {
      const payload = token.dataset.ringColor
        ? 'ring:' + Number(token.dataset.ringColor).toString(16)
        : 'status:' + token.dataset.condition;
      event.dataTransfer?.setData('text/plain', payload);
      if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy';
    });
  });

  root.querySelector('#creature-mode')?.addEventListener('click', () => {
    moveMode = !moveMode;
    pickedCreatureId = null;
    renderer?.setMovingCreature(null);
    if (moveMode && armedRoom) cancelRoomMode();
    renderer?.setCreatureMoveMode(moveMode);
    const buildTools = root.querySelector('#build-tools');
    const identityTools = root.querySelector('#identity-ring-tools');
    if (buildTools) buildTools.hidden = moveMode;
    if (identityTools) identityTools.hidden = moveMode;
    const button = root.querySelector('#creature-mode');
    button?.setAttribute('aria-pressed', String(moveMode));
    button?.classList.toggle('is-armed', moveMode);
    if (button) button.textContent = moveMode ? 'Build Mode' : 'Combat Mode';
    status.textContent = moveMode
      ? 'Combat Mode: scenery is locked. Select a character or monster, then choose its destination. Status rings remain available.'
      : 'Build Mode: all blocks, characters, monsters, identity rings and statuses are available.';
  });

  buildRoomButton.addEventListener('click', () => {
        if (armedRoom) {
            cancelRoomMode();
            return;
        }
        const room = readRoomPanel();
        if (!room) {
            status.textContent = roomPanelError();
            return;
        }
        setRoomMode(room);
    });
    root.querySelectorAll('[data-category-tab]').forEach((button) => {
        button.addEventListener('click', () => {
            setCatalogCategory(root, button.dataset.categoryTab);
        });
    });
    const catalogSearch = root.querySelector('#catalog-search');
    catalogSearch?.addEventListener('input', () => {
        const activeButton = root.querySelector('[data-category-tab].active');
        const activeCategory = (activeButton?.dataset.categoryTab ?? 'Build');
        filterCatalog(root, activeCategory, catalogSearch.value);
    });
    root.querySelectorAll('[data-catalog]').forEach((button) => {
        button.addEventListener('click', () => {
            if (armedRoom)
                setRoomMode(null);
            if (moveMode) return;
            selected = button.dataset.catalog;
            setCatalogCategory(root, getCatalogItem(selected).category);
            root.querySelectorAll('.palette-item').forEach((item) => {
                item.classList.toggle('active', item === button);
            });
            renderer?.setSelectedCatalog(selected);
            status.textContent =
                `${getCatalogItem(selected).name} selected. Click empty grid, a top face, or a side face.`;
        });
    });
    document.getElementById('builder-home')?.addEventListener('click', handlers.onHome);
    document.getElementById('undo')?.addEventListener('click', () => {
        const next = undo(state, history);
        state = next.state;
        history = next.history;
        refresh();
    });
    document.getElementById('redo')?.addEventListener('click', () => {
        const next = redo(state, history);
        state = next.state;
        history = next.history;
        refresh();
    });
    document.getElementById('print-map')?.addEventListener('click', () => {
        status.textContent =
            'Preparing top-down print map. Use Actual Size / 100% for exact 1-inch squares.';
        void printBoardMap(state, theme).catch((error) => {
            console.warn('[print] Print Map failed.', error);
            status.textContent = 'Could not prepare the print map.';
        });
    });
    document.getElementById('clear')?.addEventListener('click', () => {
        if (!confirm('Clear this prototype map?'))
            return;
        clearBoard(theme.id);
        state = createBoardState(theme.id);
        history = createHistory();
        refresh();
    });
    const updateElevation = (delta) => {
        elevation = Math.min(MAX_BASE_ELEVATION, Math.max(0, elevation + delta));
        renderer?.setElevation(elevation);
        document.getElementById('elev-value').textContent =
            elevation === 0 ? 'Ground' : `+${elevation * 5} ft`;
    };
    document.getElementById('elev-down')?.addEventListener('click', () => updateElevation(-1));
    document.getElementById('elev-up')?.addEventListener('click', () => updateElevation(1));
    document.getElementById('rotate-left')?.addEventListener('click', () => renderer?.rotate(Math.PI / 8));
    document.getElementById('rotate-right')?.addEventListener('click', () => renderer?.rotate(-Math.PI / 8));
    document.getElementById('camera-home')?.addEventListener('click', () => renderer?.resetCamera());
    document.getElementById('zoom-in')?.addEventListener('click', () => renderer?.zoom(0.82));
    document.getElementById('zoom-out')?.addEventListener('click', () => renderer?.zoom(1.2));
    const onKeyDown = (event) => {
        if (event.key !== 'Escape') return;
        if (pickedCreatureId) {
            pickedCreatureId = null;
            renderer?.setMovingCreature(null);
            status.textContent = 'Creature movement canceled.';
            event.preventDefault();
            return;
        }
        if (!armedRoom) return;
        event.preventDefault();
        cancelRoomMode();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.getElementById('print-map-root')?.remove();
        renderer?.dispose();
    };
}
