import { TERRAIN_THEMES } from '../domain/catalog.js?v=0edcfa1641e0';
export function renderHome(root, handlers) {
    const terrainCards = Object.values(TERRAIN_THEMES).map((theme) => `
    <button class="terrain-card" data-terrain="${theme.id}" type="button">
      <span class="terrain-swatch terrain-art" style="--terrain-swatch:${theme.swatchCss}">
        <img src="./assets/terrain-${theme.id}.svg" alt="" loading="lazy" decoding="async" width="256" height="144" />
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
          <a class="button button-ghost" href="https://buymeacoffee.com/divclass016" target="_blank" rel="noopener noreferrer" aria-label="Buy me a coffee, opens in a new tab">☕ Buy me a coffee</a>
        </nav>
      </header>

      <section class="hero-section">
        <div class="hero-copy">
          <span class="eyebrow">3D tabletop maps · right in your browser</span>
          <h1>Build your world. <em>One block at a time.</em></h1>
          <p>Build dungeons, castles and taverns from 5-foot cubes. Add doors, furniture, traps and creatures, then switch to Combat Mode when you are ready to play.</p>
          <div class="hero-actions">
            <button class="button button-primary button-large" id="build-main" type="button">Build a Map <span>→</span></button>
            <a class="button button-secondary button-large" href="./how-to-play.html">How to Play</a>
            </div>
          <div class="trust-row" aria-label="Product highlights">
            <span>✓ Browser-first</span><span>✓ 5-ft grid</span><span>✓ DM stays in control</span>
          </div>
        </div>

        <div class="hero-visual">
          <figure class="real-map-preview">
            <img src="./assets/home-dungeon.svg" alt="Actual DND Blocks dungeon map built from 5-foot cubes, featuring stone walls, rooms, monsters, doors and treasure chests." width="760" height="371" decoding="async" fetchpriority="high" />
            <figcaption>Actual battle map built in DND Blocks</figcaption>
          </figure>
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

      <footer class="site-footer">
        <div class="footer-content">
          <div class="footer-main">
            <div class="footer-brand"><strong>DND Blocks Battle Maps</strong><span>Build your world. One block at a time.</span></div>
            <nav class="footer-links" aria-label="Footer navigation">
              <a href="?">Home</a>
              <a href="#terrain-start">Choose Terrain</a>
              <a href="https://github.com/cbw29512/DNDblocksbattlemaps" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://buymeacoffee.com/divclass016" target="_blank" rel="noopener noreferrer">☕ Support</a>
            </nav>
          </div>
          <div class="footer-bottom"><span>© 2026 DND Blocks Battle Maps</span><span>Made for Dungeon Masters and their players.</span></div>
        </div>
      </footer>
    </main>
  `;
    const startDefault = () => handlers.onBuild('castle');
    ['build-main'].forEach((id) => document.getElementById(id)?.addEventListener('click', startDefault));
    ['join-top'].forEach((id) => document.getElementById(id)?.addEventListener('click', handlers.onJoin));
    root.querySelectorAll('[data-terrain]').forEach((button) => {
        button.addEventListener('click', () => handlers.onBuild(button.dataset.terrain));
    });
}
