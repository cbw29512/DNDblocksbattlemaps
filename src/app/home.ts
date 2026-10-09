import { TERRAIN_THEMES } from '../domain/catalog.js';
import type { TerrainId } from '../domain/types.js';

export interface HomeHandlers {
  onBuild: (terrain: TerrainId) => void;
  onJoin: () => void;
}

export function renderHome(root: HTMLElement, handlers: HomeHandlers): void {
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

        <div class="hero-visual" aria-label="Real builder features">
          <div class="builder-preview-card">
            <span class="eyebrow">What you can actually build</span>
            <h2>Every piece starts as a cube.</h2>
            <p>Build rooms on a 5-foot grid, stack walls, add doors and furniture, then place creatures for combat.</p>
            <div class="preview-feature-grid">
              <span><b>5-ft</b><small>Cube grid</small></span>
              <span><b>3D</b><small>Build & rotate</small></span>
              <span><b>DM</b><small>Map controls</small></span>
            </div>
            <button type="button" class="button button-primary" id="preview-builder">Open the actual map builder →</button>
            <small class="preview-note">Live editor · not an artist's rendering</small>
          </div>
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
  ['build-main', 'preview-builder'].forEach((id) => document.getElementById(id)?.addEventListener('click', startDefault));
  ['join-top', 'join-main'].forEach((id) => document.getElementById(id)?.addEventListener('click', handlers.onJoin));
  root.querySelectorAll<HTMLButtonElement>('[data-terrain]').forEach((button) => {
    button.addEventListener('click', () => handlers.onBuild(button.dataset.terrain as TerrainId));
  });
}
