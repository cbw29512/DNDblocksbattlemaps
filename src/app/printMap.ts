import { resolveBrowserAssetUrl } from '../browserAssetUrl.js';
import { PALETTE } from '../domain/catalog.js';
import {
  PRINT_PAGE_COLUMNS, PRINT_PAGE_ROWS,
  printAreaForState, printTilesForArea, topObjectAt
} from '../domain/printLayout.js';
import type { BoardState, TerrainTheme } from '../domain/types.js';

function colorCss(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`;
}

function cellHtml(
  state: BoardState,
  theme: TerrainTheme,
  x: number,
  z: number,
  inTile: boolean
): string {
  if (!inTile) return '<div class="print-cell print-cell-blank"></div>';

  const object = topObjectAt(state.objects, x, z);
  if (!object) {
    return `<div class="print-cell" style="--print-cell-color:${colorCss(theme.groundColor)}"></div>`;
  }

  const item = PALETTE[object.catalogId];
  const visual = item.art
    ? `<img src="${resolveBrowserAssetUrl(item.art.src)}" alt="">`
    : `<span>${item.name}</span>`;

  return `<div class="print-cell print-cell-object" style="--print-cell-color:${colorCss(item.color)}">${visual}</div>`;
}

function sheetHtml(
  state: BoardState,
  theme: TerrainTheme,
  tile: ReturnType<typeof printTilesForArea>[number],
  pageNumber: number,
  pageCount: number
): string {
  const cells: string[] = [];

  for (let row = 0; row < PRINT_PAGE_ROWS; row += 1) {
    for (let column = 0; column < PRINT_PAGE_COLUMNS; column += 1) {
      const x = tile.minX + column;
      const z = tile.minZ + row;
      cells.push(cellHtml(state, theme, x, z, x < tile.maxX && z < tile.maxZ));
    }
  }

  return `
    <section class="print-sheet">
      <div class="print-page-label">${theme.name} Map · Page ${pageNumber} of ${pageCount}</div>
      <div class="print-grid">${cells.join('')}</div>
      <i class="print-mark print-mark-tl"></i>
      <i class="print-mark print-mark-tr"></i>
      <i class="print-mark print-mark-bl"></i>
      <i class="print-mark print-mark-br"></i>
    </section>
  `;
}

async function waitForPrintImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll<HTMLImageElement>('img'));
  await Promise.all(images.map(async (image) => {
    try {
      if (image.complete) return;
      await image.decode();
    } catch (error) {
      console.warn('[print] A print-map image did not decode; printing fallback color.', error);
    }
  }));
}

export async function printBoardMap(state: BoardState, theme: TerrainTheme): Promise<void> {
  try {
    document.getElementById('print-map-root')?.remove();

    const area = printAreaForState(state);
    const tiles = printTilesForArea(area);
    const root = document.createElement('div');
    root.id = 'print-map-root';
    root.className = 'print-map-root';
    root.innerHTML = tiles
      .map((tile, index) => sheetHtml(state, theme, tile, index + 1, tiles.length))
      .join('');

    document.body.append(root);
    await waitForPrintImages(root);

    const cleanup = (): void => {
      window.removeEventListener('afterprint', cleanup);
      root.remove();
    };

    window.addEventListener('afterprint', cleanup);
    window.print();
  } catch (error) {
    console.warn('[print] Could not prepare printable map.', error);
    throw error;
  }
}
