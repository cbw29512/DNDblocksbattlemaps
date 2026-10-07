import { DEFAULT_PALETTE, PALETTE, TERRAIN_THEMES } from '../domain/catalog.js';
import { createWorldObject, findObject, placeCommand, removeCommand } from '../domain/commands.js';
import { commit, createHistory, redo, undo } from '../domain/history.js';
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
        <div class="sidebar-heading"><span class="eyebrow">Blocks</span><strong>Pick one. Keep clicking.</strong></div>
        <div class="palette-list">${palette}</div>
        <div class="elevation-control"><span>Elevation</span><div><button id="elev-down" type="button">−</button><b id="elev-value">Ground</b><button id="elev-up" type="button">+</button></div></div>
        <div class="prototype-tip"><b>Controls</b><span>Left click: place</span><span>Right click: remove</span><span>Right drag: orbit</span><span>Wheel: zoom</span></div>
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
    const refresh = () => { renderer?.render(state); saveBoard(state); };
    const run = (command) => { const next = commit(state, history, command); state = next.state; history = next.history; refresh(); };
    renderer = await createRenderer(canvas, {
        onPlace(position) { run(placeCommand(createWorldObject(makeId(), selected, position))); },
        onRemove(id) { const object = findObject(state, id); if (object)
            run(removeCommand(object)); },
        onStatus(message) { status.textContent = message; }
    });
    renderer.setTheme(theme);
    renderer.setSelectedCatalog(selected);
    renderer.setElevation(elevation);
    renderer.render(state);
    root.querySelectorAll('[data-catalog]').forEach((button) => button.addEventListener('click', () => {
        selected = button.dataset.catalog;
        root.querySelectorAll('.palette-item').forEach((item) => item.classList.toggle('active', item === button));
        renderer?.setSelectedCatalog(selected);
    }));
    document.getElementById('builder-home')?.addEventListener('click', handlers.onHome);
    document.getElementById('undo')?.addEventListener('click', () => { const next = undo(state, history); state = next.state; history = next.history; refresh(); });
    document.getElementById('redo')?.addEventListener('click', () => { const next = redo(state, history); state = next.state; history = next.history; refresh(); });
    document.getElementById('clear')?.addEventListener('click', () => { if (confirm('Clear this prototype map?')) {
        clearBoard(theme.id);
        state = { terrain: theme.id, objects: [], revision: state.revision + 1 };
        history = createHistory();
        refresh();
    } });
    const updateElevation = (delta) => { elevation = Math.max(0, elevation + delta); renderer?.setElevation(elevation); document.getElementById('elev-value').textContent = elevation === 0 ? 'Ground' : `+${elevation * 5} ft`; };
    document.getElementById('elev-down')?.addEventListener('click', () => updateElevation(-1));
    document.getElementById('elev-up')?.addEventListener('click', () => updateElevation(1));
    document.getElementById('rotate-left')?.addEventListener('click', () => renderer?.rotate(Math.PI / 8));
    document.getElementById('rotate-right')?.addEventListener('click', () => renderer?.rotate(-Math.PI / 8));
    document.getElementById('camera-home')?.addEventListener('click', () => renderer?.resetCamera());
    document.getElementById('zoom-in')?.addEventListener('click', () => renderer?.zoom(0.82));
    document.getElementById('zoom-out')?.addEventListener('click', () => renderer?.zoom(1.2));
    return () => renderer?.dispose();
}
