import { PALETTE } from '../domain/catalog.js';
const GRID_SIZE = 20;
const ORIGIN = GRID_SIZE / 2;
export function createFallbackRenderer(container, handlers) {
    const board = document.createElement('div');
    board.className = 'fallback-board';
    container.replaceChildren(board);
    let selected = null;
    let elevation = 0;
    let theme = null;
    let currentObjects = [];
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
                cell.title = `${x * 5} ft, ${z * 5} ft`;
                const occupants = currentObjects.filter((item) => item.x === x && item.z === z);
                const top = occupants.at(-1);
                if (top) {
                    const item = PALETTE[top.catalogId];
                    cell.style.setProperty('--piece-color', `#${item.color.toString(16).padStart(6, '0')}`);
                    cell.dataset.objectId = top.id;
                    cell.innerHTML = `<span class="fallback-piece">${item.name.slice(0, 1)}</span>${occupants.length > 1 ? `<small>${occupants.length}</small>` : ''}`;
                }
                cell.addEventListener('click', () => {
                    if (!selected)
                        return;
                    handlers.onPlace({ x, z, elevation });
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
    handlers.onStatus('3D library unavailable locally — using the interactive 2D fallback.');
    return {
        mode: 'fallback',
        setTheme(next) { theme = next; draw(); },
        setSelectedCatalog(next) { selected = next; },
        setElevation(next) { elevation = next; },
        render(state) { currentObjects = state.objects; draw(); },
        rotate() { },
        zoom() { },
        resetCamera() { },
        dispose() { board.remove(); }
    };
}
