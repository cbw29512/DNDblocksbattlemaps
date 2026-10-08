import { creatureOccupiedCells } from '../domain/areaTargets.js?v=8727e55596a9';
import { areaCells } from '../domain/areaTemplates.js?v=8727e55596a9';
import { resolveBrowserAssetUrl } from '../browserAssetUrl.js?v=8727e55596a9';
import { getCatalogItem } from '../domain/catalog.js?v=8727e55596a9';
import { stackElevationAt } from '../domain/placement.js?v=8727e55596a9';
import { roomOuterSize } from '../domain/room.js?v=8727e55596a9';
import { chooseRoomPlacement, previewRoomPlacement } from '../domain/roomPlacement.js?v=8727e55596a9';
import { DEFAULT_BOARD_BOUNDS, MAX_BUILD_HEIGHT_FEET, boardDepth, boardWidth } from '../domain/spatial.js?v=8727e55596a9';
export function createFallbackRenderer(container, handlers) {
    const board = document.createElement('div');
    board.className = 'fallback-board';
    container.replaceChildren(board);
    let selected = null;
    let movingCreatureId = null;
    let creatureMoveMode = false;
    let room = null;
    let elevation = 0;
    let theme = null;
    let currentBounds = { ...DEFAULT_BOARD_BOUNDS };
    let areaTemplate = null;
    let areaTargetIds = new Set();
    let areaPlacement = null;
    let currentObjects = [];
    function cellAt(x, z) {
        return board.querySelector(`[data-x="${x}"][data-z="${z}"]`);
    }
    function clearRoomPreview() {
        board.querySelectorAll('.fallback-cell').forEach((cell) => {
            cell.classList.remove('room-preview', 'room-corner', 'room-invalid');
        });
    }
    function paintRoomPreview(placement, valid) {
        clearRoomPreview();
        const anchor = cellAt(placement.corner.x, placement.corner.z);
        anchor?.classList.add(valid ? 'room-corner' : 'room-invalid');
        if (!valid || !room)
            return;
        const outer = roomOuterSize(room);
        const { corner, orientation } = placement;
        for (let dx = 0; dx < outer.lengthCells; dx += 1) {
            const x = corner.x + orientation.x * dx;
            cellAt(x, corner.z)?.classList.add('room-preview');
            cellAt(x, corner.z + orientation.z * (outer.widthCells - 1))?.classList.add('room-preview');
        }
        for (let dz = 1; dz < outer.widthCells - 1; dz += 1) {
            const z = corner.z + orientation.z * dz;
            cellAt(corner.x, z)?.classList.add('room-preview');
            cellAt(corner.x + orientation.x * (outer.lengthCells - 1), z)?.classList.add('room-preview');
        }
        anchor?.classList.add('room-corner');
    }
    function draw() {
        board.innerHTML = '';
        board.style.setProperty('--fallback-ground', theme?.accentCss ?? '#879072');
        board.style.gridTemplateColumns = `repeat(${boardWidth(currentBounds)}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${boardDepth(currentBounds)}, 1fr)`;
        const affected = new Set(areaTemplate && areaPlacement ?
            areaCells(areaTemplate, areaPlacement, { ...currentBounds, minElevation: elevation, maxElevation: elevation })
                .map(p => p.x + ',' + p.z) : []);
        for (let z = currentBounds.minZ; z < currentBounds.maxZ; z += 1) {
            for (let x = currentBounds.minX; x < currentBounds.maxX; x += 1) {
                const cell = document.createElement('button');
                cell.className = 'fallback-cell';
                if (affected.has(x + ',' + z))
                    cell.classList.add('aoe-affected');
                if (currentObjects.some(o => areaTargetIds.has(o.id) && creatureOccupiedCells(o).some(p => p.x === x && p.z === z && p.elevation === elevation)))
                    cell.classList.add('aoe-target');
                cell.type = 'button';
                cell.dataset.x = String(x);
                cell.dataset.z = String(z);
                const occupants = currentObjects
                    .filter((item) => item.x === x && item.z === z)
                    .sort((a, b) => a.elevation - b.elevation);
                const top = occupants.at(-1);
                if (top) {
                    const item = getCatalogItem(top.catalogId);
                    cell.style.setProperty('--piece-color', `#${item.color.toString(16).padStart(6, '0')}`);
                    const visual = item.art
                        ? `<img src="${resolveBrowserAssetUrl(item.art.src)}" alt="" loading="lazy" decoding="async">`
                        : item.name.slice(0, 1);
                    cell.innerHTML = `<span class="fallback-piece">${visual}</span>${occupants.length > 1 ? `<small>${occupants.length}</small>` : ''}`;
                    if (item.category === 'Characters' || item.category === 'Monsters') {
                        const marks = [...(top.conditions ?? [])];
                        if ((top.exhaustion ?? 0) > 0)
                            marks.push('Exhaustion ' + top.exhaustion);
                        cell.title = item.name + (marks.length ? ' — ' + marks.join(', ') : '');
                        const caption = document.createElement('span');
                        caption.className = 'fallback-creature-name';
                        caption.textContent = item.name + (marks.length ? ' [' + marks.length + ']' : '');
                        cell.append(caption);
                        const color = item.category === 'Monsters' ? 0xd83030 : top.ringColor;
                        if (color !== undefined)
                            cell.style.setProperty('--creature-ring', '#' + color.toString(16).padStart(6, '0'));
                    }
                }
                cell.addEventListener('pointerenter', () => {
                    if (areaTemplate) {
                        handlers.onAreaPoint({ x, z, elevation }, false);
                        return;
                    }
                    if (!room)
                        return;
                    const corner = { x, z, elevation };
                    const placement = chooseRoomPlacement(room, corner, currentObjects, currentBounds);
                    paintRoomPreview(placement ?? previewRoomPlacement(corner), Boolean(placement));
                });
                let lastPointerWasTouch = false;
                cell.addEventListener('pointerdown', (event) => { lastPointerWasTouch = event.pointerType === 'touch'; });
                cell.addEventListener('click', (event) => {
                    if (areaTemplate) {
                        handlers.onAreaPoint({ x, z, elevation }, true, lastPointerWasTouch || event.pointerType === 'touch');
                        lastPointerWasTouch = false;
                        return;
                    }
                    if (top && handlers.onMarkTarget(top.id))
                        return;
                    if (room) {
                        const placement = chooseRoomPlacement(room, { x, z, elevation }, currentObjects, currentBounds);
                        if (placement)
                            handlers.onRoomPlacement(placement);
                        else
                            handlers.onStatus('That room would exceed the map limit.');
                        return;
                    }
                    if (creatureMoveMode && !movingCreatureId) {
                        if (top && ['Characters', 'Monsters'].includes(getCatalogItem(top.catalogId).category))
                            handlers.onPickCreature(top.id);
                        else
                            handlers.onStatus('Move Creatures: select a creature.');
                        return;
                    }
                    if (movingCreatureId) {
                        handlers.onMoveCreature({ x, z, elevation });
                        return;
                    }
                    if (top && ['Characters', 'Monsters'].includes(getCatalogItem(top.catalogId).category)) {
                        handlers.onPickCreature(top.id);
                        return;
                    }
                    if (!selected)
                        return;
                    const next = stackElevationAt(currentObjects, x, z, elevation);
                    if (next === null) {
                        handlers.onStatus(`Maximum build height is ${MAX_BUILD_HEIGHT_FEET} ft.`);
                        return;
                    }
                    handlers.onPlace({ x, z, elevation: next });
                });
                cell.addEventListener('dragover', event => { event.preventDefault(); });
                cell.addEventListener('drop', event => {
                    event.preventDefault();
                    const payload = event.dataTransfer?.getData('text/plain');
                    if (top && payload)
                        handlers.onMarkDrop(top.id, payload);
                    else
                        handlers.onStatus('Drop the ring on an existing creature.');
                });
                cell.addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                    if (areaTemplate) {
                        handlers.onAreaPoint({ x, z, elevation }, false);
                        return;
                    }
                    if (top)
                        handlers.onRemove(top.id);
                });
                board.append(cell);
            }
        }
    }
    handlers.onStatus('Build toward an edge and the map grows automatically.');
    return {
        mode: 'fallback',
        setAreaTargets(ids) { areaTargetIds = new Set(ids); draw(); },
        setAreaPreview(template, placement) { areaTemplate = template; areaPlacement = placement; draw(); },
        setTheme(next) {
            theme = next;
            draw();
        },
        setSelectedCatalog(next) {
            selected = next;
        },
        setRoomPlacement(next) {
            room = next;
            draw();
        },
        setMovingCreature(id) { movingCreatureId = id; },
        setCreatureMoveMode(enabled) { creatureMoveMode = enabled; },
        setElevation(next) {
            elevation = next;
        },
        render(state) {
            currentBounds = { ...state.bounds };
            currentObjects = state.objects;
            draw();
        },
        rotate() { },
        zoom() { },
        resetCamera() { },
        dispose() {
            board.remove();
        }
    };
}
