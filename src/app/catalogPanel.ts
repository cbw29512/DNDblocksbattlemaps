import {
  CATALOG_CATEGORIES, PALETTE, catalogIdsForCategory, catalogMatches, getCatalogItem
} from '../domain/catalog.js';
import type { CatalogCategory, CatalogId, PaletteItem } from '../domain/types.js';
import { resolveBrowserAssetUrl } from '../browserAssetUrl.js';

function visual(item: PaletteItem): string {
  return item.art
    ? '<img class="palette-art" src="' + resolveBrowserAssetUrl(item.art.src) + '" alt="" loading="lazy" decoding="async">'
    : '<i class="palette-swatch" style="--item-color:#' + item.color.toString(16).padStart(6,'0') + '"></i>';
}

function button(item: PaletteItem, selected: CatalogId): string {
  const searchText = [item.name, item.id, ...(item.tags ?? [])].join(' ').toLowerCase();
  return '<button class="palette-item' + (item.id === selected ? ' active' : '') +
    '" data-catalog="' + item.id + '" data-catalog-search="' + searchText +
    '" type="button">' + visual(item) + '<span>' + item.name + '</span></button>';
}

export function catalogPanelHtml(selected: CatalogId): string {
  const active = PALETTE[selected]?.category ?? 'Build';
  const tabs = CATALOG_CATEGORIES.map((category) =>
    '<button class="catalog-tab' + (category === active ? ' active' : '') +
    '" data-category-tab="' + category + '" type="button" aria-selected="' +
    String(category === active) + '">' + category + '</button>'
  ).join('');

  const panels = CATALOG_CATEGORIES.map((category) =>
    '<div class="palette-list" data-category-panel="' + category + '"' +
    (category === active ? '' : ' hidden') + '>' +
    catalogIdsForCategory(category).map((id) => button(getCatalogItem(id), selected)).join('') +
    '<div class="catalog-empty" hidden>No matching blocks.</div></div>'
  ).join('');

  return '<section class="catalog-panel" aria-label="Block catalog">' +
    '<div class="sidebar-heading"><span class="eyebrow">Catalog</span><strong>Pick one. Keep clicking.</strong></div>' +
    '<label class="catalog-search"><span>Find a block</span><input id="catalog-search" type="search" autocomplete="off" placeholder="door, trap, barrel..."></label>' +
    '<div class="catalog-tabs" role="tablist">' + tabs + '</div>' +
    panels + '</section>';
}

export function setCatalogCategory(root: HTMLElement, category: CatalogCategory): void {
  root.querySelectorAll<HTMLButtonElement>('[data-category-tab]').forEach((button) => {
    const active = button.dataset.categoryTab === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  root.querySelectorAll<HTMLElement>('[data-category-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.categoryPanel !== category;
  });
  const input = root.querySelector<HTMLInputElement>('#catalog-search');
  if (input) filterCatalog(root, category, input.value);
}

export function filterCatalog(root: HTMLElement, category: CatalogCategory, query: string): void {
  const panel = root.querySelector<HTMLElement>('[data-category-panel="' + category + '"]');
  if (!panel) return;

  let visible = 0;
  panel.querySelectorAll<HTMLButtonElement>('[data-catalog]').forEach((button) => {
    const item = PALETTE[button.dataset.catalog ?? ''];
    const show = Boolean(item && catalogMatches(item, query));
    button.hidden = !show;
    if (show) visible += 1;
  });

  const empty = panel.querySelector<HTMLElement>('.catalog-empty');
  if (empty) empty.hidden = visible !== 0;
}
