export function renderJoin(root, handlers) {
    root.innerHTML = `
    <main id="main-content" tabindex="-1" class="simple-page">
      <button class="text-back" id="join-back" type="button">← Back home</button>
      <section class="join-card">
        <span class="eyebrow">Player entry</span>
        <h1>Join a Game</h1>
        <p>The multiplayer table arrives in Stage 2. This screen is here now so we can test the website flow without pretending the feature is finished.</p>
        <label>Game code <input type="text" inputmode="text" placeholder="ABCD12" disabled /></label>
        <label>Your name <input type="text" placeholder="Your name" disabled /></label>
        <button class="button button-primary button-large" type="button" disabled>Join Game</button>
        <small>Prototype status: builder first, multiplayer next.</small>
      </section>
    </main>
  `;
    document.getElementById('join-back')?.addEventListener('click', handlers.onBack);
}
