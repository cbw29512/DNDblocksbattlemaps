import { PALETTE } from '../domain/catalog.js';
import { stackElevationAt } from '../domain/placement.js';
import { roomOuterSize } from '../domain/room.js';
import { chooseRoomPlacement, previewRoomPlacement } from '../domain/roomPlacement.js';
import { MAX_BUILD_HEIGHT_FEET } from '../domain/spatial.js';
const GRID_SIZE = 20;
const ORIGIN = GRID_SIZE / 2;
export function createFallbackRenderer(container, handlers) {
    const board = document.createElement('div');
    board.className = 'fallback-board';
    container.replaceChildren(board);
    let selected = null;
    let room = null;
    let elevation = 0;
    let theme = null;
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
        for (let z = -ORIGIN; z < ORIGIN; z += 1) {
            for (let x = -ORIGIN; x < ORIGIN; x += 1) {
                const cell = document.createElement('button');
                cell.className = 'fallback-cell';
                cell.type = 'button';
                cell.dataset.x = String(x);
                cell.dataset.z = String(z);
                const occupants = currentObjects
                    .filter((item) => item.x === x && item.z === z)
                    .sort((a, b) => a.elevation - b.elevation);
                const top = occupants.at(-1);
                if (top) {
                    const item = PALETTE[top.catalogId];
                    cell.style.setProperty('--piece-color', `#${item.color.toString(16).padStart(6, '0')}`);
                    const visual = item.art
                        ? `<img src="${item.art.src}" alt="" loading="lazy" decoding="async">`
                        : item.name.slice(0, 1);
                    cell.innerHTML = `<span class="fallback-piece">${visual}</span>${occupants.length > 1 ? `<small>${occupants.length}</small>` : ''}`;
                }
                cell.addEventListener('pointerenter', () => {
                    if (!room)
                        return;
                    const corner = { x, z, elevation };
                    const placement = chooseRoomPlacement(room, corner, currentObjects);
                    paintRoomPreview(placement ?? previewRoomPlacement(corner), Boolean(placement));
                });
                cell.addEventListener('click', () => {
                    if (room) {
                        const placement = chooseRoomPlacement(room, { x, z, elevation }, currentObjects);
                        if (placement)
                            handlers.onRoomPlacement(placement);
                        else
                            handlers.onStatus('That corner cannot fit this room.');
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
                cell.addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                    if (top)
                        handlers.onRemove(top.id);
                });
                board.append(cell);
            }
        }
    }
    handlers.onStatus('Room stamp automatically flips direction to fit near map edges.');
    return {
        mode: 'fallback',
        setTheme(next) { theme = next; draw(); },
        setSelectedCatalog(next) { selected = next; },
        setRoomPlacement(next) { room = next; draw(); },
        setElevation(next) { elevation = next; },
        render(state) { currentObjects = state.objects; draw(); },
        rotate() { },
        zoom() { },
        resetCamera() { },
        dispose() { board.remove(); }
    };
}
