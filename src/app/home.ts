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

        <div class="hero-visual" aria-label="Block battle map preview">
          <div class="preview-window">
            <div class="preview-topbar"><span></span><span></span><span></span><b>Example build · Medieval Inn</b></div>
            <div class="mini-board home-building-preview">
              <svg class="home-building-art" viewBox="0 0 540 365" role="img" aria-label="A block-built medieval inn with stone walls, timber framing, warm windows, a roof and a doorway">
<defs><pattern id="stone-blocks" width="36" height="24" patternUnits="userSpaceOnUse"><rect width="36" height="24" fill="#88867b"/><path d="M0 0H36M0 24H36M18 0V12M0 12H36M0 12V24" stroke="#52514a" stroke-width="2"/></pattern><pattern id="roof-tiles" width="38" height="22" patternUnits="userSpaceOnUse"><rect width="38" height="22" fill="#704635"/><path d="M0 2H38M0 22H38M19 2V12M0 12H38" stroke="#442b24" stroke-width="2"/></pattern><pattern id="wood-beams" width="36" height="36" patternUnits="userSpaceOnUse"><rect width="36" height="36" fill="#ad8554"/><path d="M0 0H36V36H0Z" fill="none" stroke="#6d492c" stroke-width="4"/></pattern></defs>
<path d="M0 258L270 126L540 260L270 365Z" fill="#515447"/>
<path d="M135 208L312 115L455 187L274 290Z" fill="#5b5b50" stroke="#31302b" stroke-width="5"/>
<path d="M135 208L274 278V322L135 253Z" fill="url(#stone-blocks)" stroke="#35322c" stroke-width="5"/>
<path d="M274 278L455 185V231L274 322Z" fill="url(#stone-blocks)" stroke="#35322c" stroke-width="5"/>
<path d="M135 152L274 223V285L135 214Z" fill="url(#wood-beams)" stroke="#4d3324" stroke-width="5"/>
<path d="M274 223L455 129V192L274 285Z" fill="#8a653f" stroke="#4d3324" stroke-width="5"/>
<path d="M290 230L440 151M290 254L440 176" stroke="#563d2a" stroke-width="5"/>
<path d="M163 178L193 193V230L163 214Z" fill="#f6bd58" stroke="#4e3323" stroke-width="6"/><path d="M164 198L193 212M178 187V221" stroke="#60432e" stroke-width="4"/>
<path d="M357 194L398 173V209L357 230Z" fill="#f6bd58" stroke="#422e20" stroke-width="6"/><path d="M358 213L397 192M378 184V218" stroke="#543725" stroke-width="4"/>
<path d="M212 212L252 232V293L212 271Z" fill="#4b2d1e" stroke="#2b211b" stroke-width="6"/><path d="M222 219L242 229V282L222 271Z" fill="#81502d"/><circle cx="236" cy="255" r="3" fill="#e8b566"/>
<path d="M125 158L259 76L321 113L274 227Z" fill="url(#roof-tiles)" stroke="#38271f" stroke-width="7"/>
<path d="M259 76L321 113L472 138L455 148L274 239Z" fill="url(#roof-tiles)" stroke="#38271f" stroke-width="7"/>
<path d="M124 159L259 77L274 228" fill="none" stroke="#cc9b67" stroke-width="4"/>
<path d="M363 102V56L390 45V112" fill="#74695e" stroke="#3b3630" stroke-width="5"/><path d="M363 56L378 64L390 45L375 38Z" fill="#a39b8d"/>
<path d="M197 286L240 308L240 321L197 300Z" fill="#a29b85"/><path d="M187 302L240 328L240 339L187 314Z" fill="#8d8674"/>
<text x="18" y="31" fill="#f9e2b7" font-size="15" font-weight="800">EXAMPLE BUILD · MEDIEVAL INN</text>
</svg>
            </div>
          </div>
          <span class="floating-note note-one">No install</span>
          <span class="floating-note note-two">Every piece is a cube</span>
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
  root.querySelectorAll<HTMLButtonElement>('[data-terrain]').forEach((button) => {
    button.addEventListener('click', () => handlers.onBuild(button.dataset.terrain as TerrainId));
  });
}
