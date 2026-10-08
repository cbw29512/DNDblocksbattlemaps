import { catalogPanelHtml, filterCatalog, setCatalogCategory } from './catalogPanel.js?v=00134766f884';
import { printBoardMap } from './printMap.js?v=00134766f884';
import { roomPanelError, roomPanelHtml, readRoomPanel } from './roomPanel.js?v=00134766f884';
import { boundsChanged, growBoardBounds } from '../domain/boardBounds.js?v=00134766f884';
import { TERRAIN_THEMES, getCatalogItem } from '../domain/catalog.js?v=00134766f884';
import { createBoardState, createWorldObject, findObject, placeCommand, placeManyCommand, removeCommand } from '../domain/commands.js?v=00134766f884';
import { commit, createHistory, redo, undo } from '../domain/history.js?v=00134766f884';
import { roomSummary } from '../domain/room.js?v=00134766f884';
import { roomWallPositions } from '../domain/roomPlacement.js?v=00134766f884';
import { BOARD_MAX_CELLS, MAX_BASE_ELEVATION, boardDepth, boardWidth } from '../domain/spatial.js?v=00134766f884';
import { clearBoard, loadBoard, saveBoard } from '../domain/storage.js?v=00134766f884';
import { createRenderer } from '../render/createRenderer.js?v=00134766f884';
function makeId() {
    return crypto.randomUUID?.() ?? `obj-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
export async function renderBuilder(root, terrainId, handlers) {
    const theme = TERRAIN_THEMES[terrainId] ?? TERRAIN_THEMES.castle;
    let state = loadBoard(theme.id);
    let history = createHistory();
    let renderer = null;
    let selected = 'stone-block';
    let armedRoom = null;
    let elevation = 0;
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
          <button id="undo" class="icon-button" type="button" title="Undo">↶</button>
          <button id="redo" class="icon-button" type="button" title="Redo">↷</button>
          <button id="print-map" class="button button-ghost" type="button">Print Map</button>
          <button id="clear" class="button button-ghost" type="button">Clear Map</button>
        </div>
      </header>
      <aside class="builder-sidebar">
        ${roomPanelHtml()}
        ${catalogPanelHtml(selected)}
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
    const refresh = () => {
        renderer?.render(state);
        saveBoard(state);
        updateBoardSize();
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
        onPlace(position) {
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
        if (event.key !== 'Escape' || !armedRoom)
            return;
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
