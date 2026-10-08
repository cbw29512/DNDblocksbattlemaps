import { listCampaignMaps } from './domain/storage.js?v=bc84cff504a5';
import { renderBuilder } from './app/builder.js?v=bc84cff504a5';
import { renderHome } from './app/home.js?v=bc84cff504a5';
import { renderJoin } from './app/join.js?v=bc84cff504a5';
function requireRoot() {
    const element = document.getElementById('app');
    if (!element)
        throw new Error('Application root #app was not found.');
    return element;
}
const root = requireRoot();
let cleanup = null;
function navigate(view, terrain) {
    const url = new URL(window.location.href);
    url.search = '';
    if (view)
        url.searchParams.set('view', view);
    if (terrain)
        url.searchParams.set('terrain', terrain);
    history.pushState({}, '', url);
    void route();
}
async function route() {
    cleanup?.();
    cleanup = null;
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'build') {
        const terrain = (params.get('terrain') ?? 'castle');
        const requested = params.get('map');
        const selectedMap = listCampaignMaps().find(map => map.id === requested && map.terrain === terrain);
        cleanup = await renderBuilder(root, terrain, { onHome: () => navigate() }, selectedMap?.id);
        return;
    }
    if (view === 'join') {
        renderJoin(root, { onBack: () => navigate() });
        return;
    }
    renderHome(root, { onBuild: (terrain) => navigate('build', terrain), onJoin: () => navigate('join') });
}
window.addEventListener('popstate', () => void route());
void route();
