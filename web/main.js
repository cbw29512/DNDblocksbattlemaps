import { listCampaignMaps } from './domain/storage.js?v=487aa2e55593';
import { renderBuilder } from './app/builder.js?v=487aa2e55593';
import { renderHome } from './app/home.js?v=487aa2e55593';
import { renderJoin } from './app/join.js?v=487aa2e55593';
function requireRoot() {
    const element = document.getElementById('app');
    if (!element)
        throw new Error('Application root #app was not found.');
    return element;
}
const root = requireRoot();
let cleanup = null;
let routeVersion = 0;
function navigate(view, terrain) {
    const url = new URL(window.location.href);
    url.search = '';
    if (view)
        url.searchParams.set('view', view);
    if (terrain)
        url.searchParams.set('terrain', terrain);
    history.pushState({}, '', url);
    runRoute();
}
async function route() {
    const version = ++routeVersion;
    cleanup?.();
    cleanup = null;
    const params = new URLSearchParams(window.location.search);
    const identityCallback = /(?:^|[&#])(confirmation_token|recovery_token|invite_token|access_token|token)=/.test(window.location.hash);
  const view = identityCallback ? 'dm' : params.get('view');
    if (view === 'build') {
        const terrain = (params.get('terrain') ?? 'castle');
        const requested = params.get('map');
        const selectedMap = listCampaignMaps().find(map => map.id === requested && map.terrain === terrain);
        const dispose = await renderBuilder(root, terrain, { onHome: () => navigate() }, selectedMap?.id);
        if (version !== routeVersion) { dispose(); return; }
        cleanup = dispose;
        return;
    }
    if (view === 'dm') {
    renderDM(root, { onBack: () => navigate() });
    return;
  }
  if (view === 'join') {
        renderJoin(root, { onBack: () => navigate() });
        return;
    }
    renderHome(root, { onBuild: (terrain) => navigate('build', terrain), onJoin: () => navigate('join'), onDM: () => navigate('dm') });
}
function showStartupFailure(error) {
    console.error('DND Blocks failed to load:', error);
    root.innerHTML = `<main id="main-content" tabindex="-1" style="max-width:620px;margin:10vh auto;padding:2rem;color:#f2efe6;font-family:system-ui"><h1>Unable to load DND Blocks</h1><p>The map builder could not start. Please reload this page. Your saved maps have not been intentionally changed.</p><button id="retry-startup" style="padding:.85rem 1.3rem;border:0;border-radius:10px;background:#d7b56d;color:#171611;font:inherit;cursor:pointer">Try again</button></main>`;
    root.querySelector('#retry-startup')?.addEventListener('click', () => window.location.reload());
}
function runRoute() {
    void route().catch(showStartupFailure);
}
window.addEventListener('popstate', runRoute);
window.addEventListener('error', event => showStartupFailure(event.error || event.message));
window.addEventListener('unhandledrejection', event => showStartupFailure(event.reason));
runRoute();
