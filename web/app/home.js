import { TERRAIN_THEMES } from '../domain/catalog.js?v=cb5dac18a9bb';
export function renderHome(root, handlers) {
    const terrainCards = Object.values(TERRAIN_THEMES).map((theme) => `
    <button class="terrain-card" data-terrain="${theme.id}" type="button">
      <span class="terrain-swatch" style="--terrain-swatch:${theme.swatchCss}">
        <span class="swatch-block swatch-block-a"></span>
        <span class="swatch-block swatch-block-b"></span>
        <span class="swatch-block swatch-block-c"></span>
      </span>
      <span class="terrain-copy"><strong>${theme.name}</strong><small>${theme.tagline}</small></span>
      <span class="terrain-arrow" aria-hidden="true">→</span>
    </button>
  `).join('');
    root.innerHTML = `
    <main class="site-shell">
      <header class="site-header">
        <a class="brand" href="?" aria-label="DND Blocks Battle Maps home">
          <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
          <span>DND Blocks <b>Battle Maps</b></span>
        </a>
        <nav class="header-actions" aria-label="Primary navigation">
          <button class="button button-ghost" id="join-top" type="button">Join a Game</button>
          <button class="button button-small" id="build-top" type="button">Build a Map</button>
        </nav>
      </header>

      <section class="hero-section">
        <div class="hero-copy">
          <span class="eyebrow">3D tabletop maps · right in your browser</span>
          <h1>Build the battle map in your head. <em>In minutes.</em></h1>
          <p>Choose a terrain, drop in rooms, doors, traps, monsters and props, then invite your players. No download. No mapmaking degree.</p>
          <div class="hero-actions">
            <button class="button button-primary button-large" id="build-main" type="button">Build a Map <span>→</span></button>
            <button class="button button-secondary button-large" id="join-main" type="button">Join a Game</button>
          </div>
          <div class="trust-row" aria-label="Product highlights">
            <span>✓ Browser-first</span><span>✓ 5-ft grid</span><span>✓ DM stays in control</span>
          </div>
        </div>

        <div class="hero-visual" aria-label="Block battle map preview">
          <div class="preview-window">
            <div class="preview-topbar"><span></span><span></span><span></span><b>Castle Room · 30 × 20 ft</b></div>
            <div class="mini-board" aria-hidden="true">
              <i class="mini-grid"></i>
              <i class="mini-cube cube-1"></i><i class="mini-cube cube-2"></i><i class="mini-cube cube-3"></i>
              <i class="mini-cube cube-4"></i><i class="mini-cube cube-5"></i><i class="mini-cube cube-door"></i>
              <i class="mini-piece piece-orc">O</i><i class="mini-piece piece-hero">H</i>
              <span class="mini-label">CLICK. PLACE. PLAY.</span>
            </div>
          </div>
          <span class="floating-note note-one">No install</span>
          <span class="floating-note note-two">Kid-simple controls</span>
        </div>
      </section>

      <section class="quick-start" id="terrain-start">
        <div class="section-heading">
          <span class="eyebrow">Start immediately</span>
          <h2>What terrain do you want?</h2>
          <p>Pick one. The grid opens ready to build.</p>
        </div>
        <div class="terrain-grid">${terrainCards}</div>
      </section>

      <section class="three-steps" aria-label="How it works">
        <article><span>1</span><div><h3>Pick a terrain</h3><p>Castle, inn, field, sea, volcano—and more later.</p></div></article>
        <article><span>2</span><div><h3>Drop in blocks</h3><p>Walls, doors, tables, traps, creatures. Put anything anywhere.</p></div></article>
        <article><span>3</span><div><h3>Share & play</h3><p>Your players join in the browser and control only their pieces.</p></div></article>
      </section>

      <section class="difference-strip">
        <strong>Not another complicated VTT.</strong>
        <span>Build fast.</span><span>Nothing to install.</span><span>DM decides what happens.</span>
      </section>

      <section class="final-cta">
        <span class="eyebrow">Your table is waiting</span>
        <h2>Start with one block.</h2>
        <p>This prototype already lets you choose a terrain and build directly on the grid.</p>
        <button class="button button-primary button-large" id="build-bottom" type="button">Build a Map <span>→</span></button>
      </section>
    </main>
  `;
    const startDefault = () => handlers.onBuild('castle');
    ['build-top', 'build-main', 'build-bottom'].forEach((id) => document.getElementById(id)?.addEventListener('click', startDefault));
    ['join-top', 'join-main'].forEach((id) => document.getElementById(id)?.addEventListener('click', handlers.onJoin));
    root.querySelectorAll('[data-terrain]').forEach((button) => {
        button.addEventListener('click', () => handlers.onBuild(button.dataset.terrain));
    });
}
