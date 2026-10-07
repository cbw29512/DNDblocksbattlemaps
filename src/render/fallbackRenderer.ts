import { PALETTE } from '../domain/catalog.js';
import { stackElevationAt } from '../domain/placement.js';
import { roomFitsAtCorner, roomOuterSize, type NormalizedRoom } from '../domain/room.js';
import { MAX_BUILD_HEIGHT_FEET } from '../domain/spatial.js';
import type { CatalogId, TerrainTheme } from '../domain/types.js';
import type { BoardHandlers, BoardRenderer } from './types.js';

const GRID_SIZE = 20;
const ORIGIN = GRID_SIZE / 2;

export function createFallbackRenderer(
  container: HTMLElement,
  handlers: BoardHandlers
): BoardRenderer {
  const board = document.createElement('div');
  board.className = 'fallback-board';
  container.replaceChildren(board);

  let selected: CatalogId | null = null;
  let roomPlacement: NormalizedRoom | null = null;
  let elevation = 0;
  let theme: TerrainTheme | null = null;
  let currentObjects: Parameters<BoardRenderer['render']>[0]['objects'] = [];

  function clearRoomClasses(): void {
    board.querySelectorAll('.fallback-cell').forEach((cell) => {
      cell.classList.remove('room-preview', 'room-corner', 'room-invalid');
    });
  }

  function paintRoomPreview(x: number, z: number): void {
    clearRoomClasses();
    if (!roomPlacement) return;

    const corner = { x, z, elevation };
    const valid = roomFitsAtCorner(roomPlacement, corner);
    const anchor = board.querySelector<HTMLElement>(`[data-x="${x}"][data-z="${z}"]`);
    anchor?.classList.add(valid ? 'room-corner' : 'room-invalid');
    if (!valid) return;

    const outer = roomOuterSize(roomPlacement);
    for (let dx = 0; dx < outer.lengthCells; dx += 1) {
      board.querySelector<HTMLElement>(`[data-x="${x + dx}"][data-z="${z}"]`)?.classList.add('room-preview');
      board.querySelector<HTMLElement>(`[data-x="${x + dx}"][data-z="${z + outer.widthCells - 1}"]`)?.classList.add('room-preview');
    }
    for (let dz = 1; dz < outer.widthCells - 1; dz += 1) {
      board.querySelector<HTMLElement>(`[data-x="${x}"][data-z="${z + dz}"]`)?.classList.add('room-preview');
      board.querySelector<HTMLElement>(`[data-x="${x + outer.lengthCells - 1}"][data-z="${z + dz}"]`)?.classList.add('room-preview');
    }
    anchor?.classList.add('room-corner');
  }

  function draw(): void {
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

        const occupants = currentObjects
          .filter((item) => item.x === x && item.z === z)
          .sort((a, b) => a.elevation - b.elevation);
        const top = occupants.at(-1);

        if (top) {
          const item = PALETTE[top.catalogId];
          cell.style.setProperty('--piece-color', `#${item.color.toString(16).padStart(6, '0')}`);
          cell.innerHTML = `<span class="fallback-piece">${item.name.slice(0, 1)}</span>${occupants.length > 1 ? `<small>${occupants.length}</small>` : ''}`;
        }

        cell.addEventListener('pointerenter', () => {
          if (roomPlacement) paintRoomPreview(x, z);
        });

        cell.addEventListener('click', () => {
          if (roomPlacement) {
            const corner = { x, z, elevation };
            if (!roomFitsAtCorner(roomPlacement, corner)) {
              handlers.onStatus('That room does not fit from this corner.');
              return;
            }
            handlers.onRoomAnchor(corner);
            return;
          }

          if (!selected) return;
          const next = stackElevationAt(currentObjects, x, z, elevation);
          if (next === null) {
            handlers.onStatus(`Maximum build height is ${MAX_BUILD_HEIGHT_FEET} ft.`);
            return;
          }
          handlers.onPlace({ x, z, elevation: next });
        });

        cell.addEventListener('contextmenu', (event) => {
          event.preventDefault();
          if (top) handlers.onRemove(top.id);
        });
        board.append(cell);
      }
    }
  }

  handlers.onStatus('2D fallback ready · room stamp highlights the perimeter before placement.');

  return {
    mode: 'fallback',
    setTheme(next) { theme = next; draw(); },
    setSelectedCatalog(next) { selected = next; },
    setRoomPlacement(next) { roomPlacement = next; draw(); },
    setElevation(next) { elevation = next; },
    render(state) { currentObjects = state.objects; draw(); },
    rotate() {},
    zoom() {},
    resetCamera() {},
    dispose() { board.remove(); }
  };
}
