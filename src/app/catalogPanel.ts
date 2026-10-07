import { CATALOG_CATEGORIES, PALETTE, catalogIdsForCategory } from '../domain/catalog.js';
import type { CatalogCategory, CatalogId, PaletteItem } from '../domain/types.js';

function visual(item: PaletteItem): string {
  return item.art
    ? `<img class="palette-art" src="${item.art.src}" alt="" loading="lazy" decoding="async">`
    : `<i class="palette-swatch" style="--item-color:#${item.color.toString(16).padStart(6,'0')}"></i>`;
}
function button(item: PaletteItem, selected: CatalogId): string {
  return `<button class="palette-item${item.id===selected?' active':''}" data-catalog="${item.id}" type="button">${visual(item)}<span>${item.name}</span></button>`;
}
export function catalogPanelHtml(selected: CatalogId): string {
  const active=PALETTE[selected]?.category ?? 'Build';
  const tabs=CATALOG_CATEGORIES.map((category)=>`<button class="catalog-tab${category===active?' active':''}" data-category-tab="${category}" type="button" aria-selected="${category===active}">${category}</button>`).join('');
  const panels=CATALOG_CATEGORIES.map((category)=>`<div class="palette-list" data-category-panel="${category}"${category===active?'':' hidden'}>${catalogIdsForCategory(category).map((id)=>button(PALETTE[id],selected)).join('')}</div>`).join('');
  return `<section class="catalog-panel" aria-label="Block catalog"><div class="sidebar-heading"><span class="eyebrow">Catalog</span><strong>Pick one. Keep clicking.</strong></div><div class="catalog-tabs" role="tablist">${tabs}</div>${panels}</section>`;
}
export function setCatalogCategory(root: HTMLElement, category: CatalogCategory): void {
  root.querySelectorAll<HTMLButtonElement>('[data-category-tab]').forEach((button)=>{
    const active=button.dataset.categoryTab===category;
    button.classList.toggle('active',active); button.setAttribute('aria-selected',String(active));
  });
  root.querySelectorAll<HTMLElement>('[data-category-panel]').forEach((panel)=>{ panel.hidden=panel.dataset.categoryPanel!==category; });
}
