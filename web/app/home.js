import { TERRAIN_THEMES } from '../domain/catalog.js?v=2693d6ceb233';
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
            <button class="button button-secondary button-large" id="join-main" type="button">Join a Game</button>
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

      <section class="final-cta">
        <span class="eyebrow">Your table is waiting</span>
        <h2>Start with one block.</h2>
        <p>This prototype already lets you choose a terrain and build directly on the grid.</p>
        <a class="button button-secondary button-large" href="#terrain-start">Explore terrain options →</a>
      </section>
    </main>
  `;
    const startDefault = () => handlers.onBuild('castle');
    ['build-main'].forEach((id) => document.getElementById(id)?.addEventListener('click', startDefault));
    ['join-top', 'join-main'].forEach((id) => document.getElementById(id)?.addEventListener('click', handlers.onJoin));
    root.querySelectorAll('[data-terrain]').forEach((button) => {
        button.addEventListener('click', () => handlers.onBuild(button.dataset.terrain));
    });
}
