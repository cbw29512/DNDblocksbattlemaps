export function renderInstructions(root: HTMLElement): void {
  root.innerHTML = `
    <main class="instructions-page">
      <div class="instructions-header"><a class="button button-ghost" href="?">← Home</a><span>DND Blocks Battle Maps</span><a class="button button-primary" href="?view=build&terrain=castle">Open Builder</a></div>
      <h1>How to use DND Blocks</h1>
      <p>These instructions describe the current browser prototype. Player multiplayer and additional campaign maps are not live yet.</p>
      <h2>1. Build your map</h2>
      <p>Select <strong>Build</strong> in the map toolbar. Choose Build, Props, Characters, or Monsters from the catalog, then click on the map to place a cube. Build and Props do not move during Combat.</p>
      <p>Use the camera controls to rotate or zoom. Right-clicking a cube removes it during Build Mode. Undo and Redo reverse edits.</p>
      <h2>2. Switch to Combat</h2>
      <p>Select <strong>Combat</strong> in the same toolbar. The catalog and building tools are hidden, while the status-ring palette remains available. Click a Character or Monster to select it, then click the grid square to move it. Press Escape to cancel. Return to <strong>Build</strong> to edit scenery.</p>
      <p>The DM can move any creature in this prototype. Controlling only your own character as a player requires the upcoming multiplayer session and permissions system.</p>
      <h2>3. Assign rings and conditions</h2>
      <p>In Build, drag a player-color ring onto a Character. Each color can belong to only one character; red belongs to Monsters. In Build or Combat, drag a status ring onto a creature. Drop the same condition again to remove it. Exhaustion advances from level 1 through 6, then clears. Rings are visual reminders, not automated combat rules.</p>
      <h2>4. Make a Party</h2>
      <p>In Build, place your player characters and select the <strong>Party</strong> checkbox beside each. Party members are copied automatically to the five available local maps: Castle, Inn, Field, Sea, and Volcano. Each map keeps its own character positions. The five map buttons switch between those local maps.</p>
      <p><strong>Current limit:</strong> Party propagation is saved in this browser. Live DM-to-player map switching and creating unlimited campaign maps are still planned.</p>
      <h2>5. Pick monsters</h2>
      <p>Select Monsters in Build. Search names or filter by CR. The imported SRD visual monster library includes Large (2×2×2 cubes), Huge (3×3×3), and Gargantuan (4×4×4) monsters. The cubes form one selectable creature.</p>
      <h2>6. Print and save</h2>
      <p>Maps save in this browser automatically. Choose <strong>Print Map</strong> for a printable layout. Browser-local data is not yet backed up to a cloud account.</p>
      <p class="instructions-note">Instructions version: October 2026 · Updated whenever controls or implemented features change.</p>
    </main>
  `;
}
