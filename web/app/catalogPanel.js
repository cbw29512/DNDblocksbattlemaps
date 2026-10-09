import { catalogIdsForArea } from '../domain/catalogOrder.js?v=7883e018c870';
import { CATALOG_CATEGORIES, PALETTE, catalogMatches, getCatalogItem } from '../domain/catalog.js?v=7883e018c870';
import { resolveBrowserAssetUrl } from '../browserAssetUrl.js?v=7883e018c870';
function visual(item) {
    return item.art
        ? '<img class="palette-art" src="' + resolveBrowserAssetUrl(item.art.src) + '" alt="" loading="lazy" decoding="async">'
        : '<i class="palette-swatch" style="--item-color:#' + item.color.toString(16).padStart(6, '0') + '"></i>';
}
function button(item, selected) {
    const searchText = [item.name, item.id, ...(item.tags ?? [])].join(' ').toLowerCase();
    return '<button class="palette-item' + (item.id === selected ? ' active' : '') +
        '" data-catalog="' + item.id + '" data-catalog-search="' + searchText +
        '" type="button">' + visual(item) + '<span>' + item.name + '</span></button>';
}
export function catalogPanelHtml(selected, terrain, templateId) {
    const active = PALETTE[selected]?.category ?? 'Build';
    const tabs = CATALOG_CATEGORIES.map((category) => '<button class="catalog-tab' + (category === active ? ' active' : '') +
        '" data-category-tab="' + category + '" type="button" aria-selected="' +
        String(category === active) + '">' + category + '</button>').join('');
    const panels = CATALOG_CATEGORIES.map((category) => '<div class="palette-list" data-category-panel="' + category + '"' +
        (category === active ? '' : ' hidden') + '>' +
        catalogIdsForArea(category, terrain, templateId).map((id) => button(getCatalogItem(id), selected)).join('') +
        '<div class="catalog-empty" hidden>No matching blocks.</div></div>').join('');
    return '<section class="catalog-panel" aria-label="Block catalog">' +
        '<div class="sidebar-heading"><span class="eyebrow">Catalog</span><strong>Pick one. Keep clicking.</strong></div>' +
        '<label class="catalog-search"><span>Find a block</span><input id="catalog-search" type="search" autocomplete="off" placeholder="door, trap, barrel..."></label>' +
        '<div class="catalog-tabs" role="tablist">' + tabs + '</div>' +
        '<div class="monster-filters" id="monster-filters" hidden>' +
        '<label>CR <select id="monster-cr-filter" aria-label="Filter monster challenge rating">' +
        '<option value="">All CRs</option>' +
        ['0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'].map(cr => '<option value="' + cr + '">' + cr + '</option>').join('') +
        '</select></label>' +
        '<label>Edition <select id="monster-edition-filter" aria-label="Filter monster rules edition"><option value="">All</option><option value="2014">2014</option><option value="2024">2024</option></select></label>' +
        '</div>' +
        panels + '</section>';
}
export function setCatalogCategory(root, category) {
    root.querySelectorAll('[data-category-tab]').forEach((button) => {
        const active = button.dataset.categoryTab === category;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
    });
    root.querySelectorAll('[data-category-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.categoryPanel !== category;
    });
    const filters = root.querySelector('#monster-filters');
    if (filters)
        filters.hidden = category !== 'Monsters';
    const input = root.querySelector('#catalog-search');
    if (input)
        filterCatalog(root, category, input.value);
}
export function filterCatalog(root, category, query) {
    const panel = root.querySelector('[data-category-panel="' + category + '"]');
    if (!panel)
        return;
    const cr = root.querySelector('#monster-cr-filter')?.value ?? '';
    const edition = root.querySelector('#monster-edition-filter')?.value ?? '';
    let visible = 0;
    panel.querySelectorAll('[data-catalog]').forEach((button) => {
        const item = PALETTE[button.dataset.catalog ?? ''];
        const show = Boolean(item && catalogMatches(item, query) && (category !== 'Monsters' || ((!cr || item.challengeRating === cr) && (!edition || item.edition === edition))));
        button.hidden = !show;
        if (show)
            visible += 1;
    });
    const empty = panel.querySelector('.catalog-empty');
    if (empty)
        empty.hidden = visible !== 0;
}
