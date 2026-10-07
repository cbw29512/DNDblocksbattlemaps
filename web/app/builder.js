import { roomPanelError, roomPanelHtml, readRoomPanel } from './roomPanel.js';
import { DEFAULT_PALETTE, PALETTE, TERRAIN_THEMES } from '../domain/catalog.js';
import { createWorldObject, findObject, placeCommand, placeManyCommand, removeCommand } from '../domain/commands.js';
import { commit, createHistory, redo, undo } from '../domain/history.js';
import { roomSummary } from '../domain/room.js';
import { roomWallPositions } from '../domain/roomPlacement.js';
import { MAX_BASE_ELEVATION } from '../domain/spatial.js';
import { clearBoard, loadBoard, saveBoard } from '../domain/storage.js';
import { createRenderer } from '../render/createRenderer.js';
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
    const palette = DEFAULT_PALETTE.map((id) => {
        const item = PALETTE[id];
        return `<button class="palette-item${id === selected ? ' active' : ''}" data-catalog="${id}" type="button"><i style="--item-color:#${item.color.toString(16).padStart(6, '0')}"></i><span>${item.name}</span></button>`;
    }).join('');
    root.innerHTML = `
    <main class="builder-shell" style="--theme-accent:${theme.accentCss}">
      <header class="builder-topbar">
        <button class="brand builder-brand" id="builder-home" type="button"><span class="brand-mark"><i></i><i></i><i></i></span><span>DND Blocks</span></button>
        <div class="map-title"><b>${theme.name} Map</b><small>Prototype · saves in this browser</small></div>
        <div class="builder-actions"><button id="undo" class="icon-button" type="button" title="Undo">↶</button><button id="redo" class="icon-button" type="button" title="Redo">↷</button><button id="clear" class="button button-ghost" type="button">Clear Map</button></div>
      </header>
      <aside class="builder-sidebar">
        ${roomPanelHtml()}
        <div class="sidebar-heading"><span class="eyebrow">Blocks</span><strong>Pick one. Keep clicking.</strong></div>
        <div class="palette-list">${palette}</div>
        <div class="elevation-control"><span>Elevation</span><div><button id="elev-down" type="button">−</button><b id="elev-value">Ground</b><button id="elev-up" type="button">+</button></div></div>
        <div class="prototype-tip"><b>Controls</b><span>Build Room → click a corner</span><span>Gold room outline: valid</span><span>Top face: build up</span><span>Side face: build out</span><span>Right click: remove</span><span>Wheel: zoom</span></div>
      </aside>
      <section class="board-stage">
        <div class="board-canvas" id="board-canvas" aria-label="Interactive battle map"></div>
        <div class="camera-dock" aria-label="Camera controls"><button id="rotate-left" title="Rotate left">↶</button><button id="camera-home" title="Reset view">⌂</button><button id="rotate-right" title="Rotate right">↷</button><button id="zoom-in" title="Zoom in">＋</button><button id="zoom-out" title="Zoom out">−</button></div>
        <div class="board-status" id="board-status">Loading board…</div>
      </section>
    </main>
  `;
    const status = document.getElementById('board-status');
    const canvas = document.getElementById('board-canvas');
    const buildRoomButton = document.getElementById('build-room');
    const refresh = () => { renderer?.render(state); saveBoard(state); };
    const run = (command) => {
        const next = commit(state, history, command);
        state = next.state;
        history = next.history;
        refresh();
    };
    const setRoomMode = (room) => {
        armedRoom = room;
        renderer?.setRoomPlacement(room);
        if (room) {
            renderer?.setSelectedCatalog(null);
            root.querySelectorAll('.palette-item').forEach((item) => item.classList.remove('active'));
            buildRoomButton.classList.add('is-armed');
            buildRoomButton.textContent = 'Click Map to Place';
            status.textContent = `${roomSummary(room)} room ready. Move the gold outline anywhere it fits, then click. Keep clicking to make more rooms.`;
        }
        else {
            buildRoomButton.classList.remove('is-armed');
            buildRoomButton.textContent = 'Build Room';
        }
    };
    renderer = await createRenderer(canvas, {
        onPlace(position) { run(placeCommand(createWorldObject(makeId(), selected, position))); },
        onRoomPlacement(placement) {
            if (!armedRoom)
                return;
            const walls = roomWallPositions(armedRoom, placement)
                .filter((p) => !state.objects.some((o) => o.catalogId === 'wall' && o.x === p.x && o.z === p.z && o.elevation === p.elevation))
                .map((p) => createWorldObject(makeId(), 'wall', p));
            if (walls.length)
                run(placeManyCommand(walls));
            status.textContent = walls.length
                ? `Built ${roomSummary(armedRoom)} room. Move the gold outline and click again for another room.`
                : 'Those walls already exist. Move the gold outline and click another corner.';
        },
        onRemove(id) { const object = findObject(state, id); if (object)
            run(removeCommand(object)); },
        onStatus(message) { status.textContent = message; }
    });
    renderer.setTheme(theme);
    renderer.setSelectedCatalog(selected);
    renderer.setRoomPlacement(null);
    renderer.setElevation(elevation);
    renderer.render(state);
    buildRoomButton.addEventListener('click', () => {
        const room = readRoomPanel();
        if (!room) {
            status.textContent = roomPanelError();
            return;
        }
        setRoomMode(room);
    });
    root.querySelectorAll('[data-catalog]').forEach((button) => button.addEventListener('click', () => {
        setRoomMode(null);
        selected = button.dataset.catalog;
        root.querySelectorAll('.palette-item').forEach((item) => item.classList.toggle('active', item === button));
        renderer?.setSelectedCatalog(selected);
        status.textContent = `${PALETTE[selected].name} selected. Click empty grid, a top face, or a side face.`;
    }));
    document.getElementById('builder-home')?.addEventListener('click', handlers.onHome);
    document.getElementById('undo')?.addEventListener('click', () => { const next = undo(state, history); state = next.state; history = next.history; refresh(); });
    document.getElementById('redo')?.addEventListener('click', () => { const next = redo(state, history); state = next.state; history = next.history; refresh(); });
    document.getElementById('clear')?.addEventListener('click', () => {
        if (!confirm('Clear this prototype map?'))
            return;
        clearBoard(theme.id);
        state = { terrain: theme.id, objects: [], revision: state.revision + 1 };
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
    return () => renderer?.dispose();
}
