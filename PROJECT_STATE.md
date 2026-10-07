# PROJECT_STATE.md

> **READ THIS FIRST.**
>
> This is the live handoff/resume document for DND Blocks Battle Maps.
> Any AI or human continuing this project must read this file, `SOUL.md`, and the current relevant design documents before making changes.
> This file must be updated and pushed to GitHub at the end of every meaningful work session.

## Current Status

**Phase:** Stage 0 — Product Contract / Design Only  
**Application code:** None. Do not begin coding yet.  
**Repository:** `cbw29512/DNDblocksbattlemaps`  
**Primary goal:** Define a very simple, low-cost, browser-based block battle map before selecting or implementing the technology stack.

## Current Product Definition

DND Blocks Battle Maps is a browser-based virtual tabletop modeled after physical magnetic dungeon terrain.

The DM selects simple blocks and places them on a grid.

Examples:

- grass = grass block
- stone = stone block
- door = door block
- torch = torch block
- table = table block
- player = player block
- monster = monster block or one multi-square entity

The DM is the authority. The board must work without automated RPG rules.

## Current Locked Decisions

1. **Simple first.** Ease and speed are the main competitive advantage.
2. **Kid-simple UI.** A child should be able to understand the basic build/play flow without reading a manual.
3. **Cheap first.** Initial hosting, persistence, assets, services, and infrastructure should use reliable free or near-free options whenever practical.
4. **No code yet.** Product, interaction, state, cost, and architecture decisions come first.
5. **Documentation is part of the work.** A task is not complete until this live state has been updated and pushed.
6. **Resume-first workflow.** Before making changes, read this file and the governing docs.
7. **One square = 5 feet.**
8. Small/Medium = 1x1, Large = 2x2, Huge = 3x3, Gargantuan = 4x4. Multi-square creatures remain one entity.
9. **Everything is data-driven.** Reuse universal object behaviors instead of object-specific engines.
10. **DM controls the world.** Players only control assigned pieces and allowed interactions.
11. **Blocks snap to the grid.**
12. **No ordinary object rotation is required.** Art should identify a block from all useful sides.
13. **Construction can be locked** to prevent accidental movement.
14. **DM-only/hidden objects** are required; the DM can reveal them.
15. **Prefab rooms are recipes for normal blocks**, not a separate runtime system.
16. Future prefab rooms should accept real-world dimensions such as 40x20 feet.
17. The board should have a simple BUILD mode and PLAY mode concept.
18. Rules automation, if ever added, remains optional. The DM must always be able to decide what happens.
19. **No automatic ceilings.** Rooms stay open from above until ceiling/roof behavior is deliberately revisited.
20. **Primary DM build controls:** left-click sidebar item to select, left-click map to place, right-click placed block to remove.
21. **Room builder:** DM enters Length × Width × Height; the room is generated from ordinary blocks and can be bulk locked/unlocked.
22. **Trap movement lock is universal behavior.** A trigger can apply a movement lock to a player piece until the DM clears it.
23. **Web-first/open-source-first stack.** Prefer browser-native, permissively licensed, free/near-free technology and reuse mature components instead of building commodity infrastructure.
24. **No custom server by default.** The MVP should avoid a dedicated backend if browser + hosted open-source services can safely satisfy persistence/auth/realtime requirements.
25. **Room spatial contract.** Length/Width/Height are entered in feet, snap to 5-foot increments, Length × Width mean usable interior space, and Height means wall height.
26. **Door placement.** A door replaces the lowest wall block at its wall position; wall blocks above remain.
27. **Room lock scope.** Lock Room protects construction/environment positions and removal, not player/monster/NPC movement; allowed state changes still work.
28. **Universal occupancy.** Solid vs overlay and generic movement-blocking are board primitives so traps can share a cell with creatures while walls/closed doors can block space.
29. **Camera contract.** Default camera elevation is near 30° above the board plane; vertical tilt is locked for MVP; users may orbit horizontally, pan, zoom, and Reset/Home.

## Cost Guardrail

This project is being built as cheaply as practical at the start.

Before adopting any paid dependency or hosted service, document:

- what requirement it solves
- free/low-cost alternatives considered
- current free tier or expected cost
- the threshold that would create meaningful cost
- whether it can be replaced later without rewriting the project

Do not introduce a paid service merely for convenience if a dependable free or near-free option meets the current need.

## Mandatory Work Session Protocol

### Before work

1. Read `PROJECT_STATE.md`.
2. Read `SOUL.md`.
3. Read the relevant schema/spec/roadmap documents.
4. Check the actual repository state.
5. Confirm the current stage and the next unfinished decision/task.
6. Do not rely on chat memory when the repository documents can answer the question.

### During work

Document important decisions as they happen.

Do not silently change:

- product philosophy
- data/schema contracts
- interaction behavior
- cost strategy
- permissions
- MVP scope
- architecture decisions

### Before stopping

Update this file with:

1. **Starting State** — where the session began.
2. **Changes Made** — exactly what changed.
3. **Decisions Made** — what was decided and why.
4. **Cost Impact** — any new cost, dependency, hosting, storage, API, licensing, or infrastructure consequence.
5. **Result** — current verified state.
6. **Open Questions / Blockers** — anything still unresolved.
7. **Exact Next Step** — the first thing the next AI/human should do.
8. Push the updated documentation to GitHub.

A work session is not complete until the handoff state is pushed.

## Current Repository Documents

- `PROJECT_STATE.md` — live resume/handoff state; read first.
- `SOUL.md` — permanent product philosophy, cheap-first rule, and anti-drift rules.
- `README.md` — public project overview and resume entry point.
- `docs/DATA_SCHEMA.md` — conceptual state model.
- `docs/ROADMAP.md` — staged product plan.
- `docs/COMPETITOR_RESEARCH.md` — live competitor/pain-point research and product differentiation.
- `docs/INTERACTION_SPEC.md` — kid-simple DM/player building and play interaction contract.
- `docs/BLOCK_CATALOG.md` — initial terrain, room-object, creature, and universal behavior catalog.
- `docs/OPEN_SOURCE_REUSE.md` — Minecraft inspiration boundary, license gate, and open-source engine/library candidates.
- `docs/TECH_STACK_CANDIDATES.md` — web-first, open-source-first, low-cost technology candidates and current free-tier research.
- `docs/SPATIAL_CONTRACT.md` — authoritative 5-foot room dimensions, floor/wall/door placement, occupancy, and room-lock behavior.
- `docs/CAMERA_CONTRACT.md` — authoritative tabletop camera elevation, orbit, pan, zoom, and recovery behavior.

Planned next documentation:

- Architecture/cost decision record after product interactions are stable.

## Current Competitive Position

Specific voxel/3D VTT research has now been completed and documented.

Key findings:

- **Terrablox** is the closest direct competitor: a 3D voxel VTT with block building, tokens, fog, dice, and multiplayer.
- **VOXEL Tabletop** is the closest browser-oriented voxel product found.
- TaleSpire, The RPG Engine, and RPG Stories validate demand for 3D building but also demonstrate the prep-time, UI-complexity, installation, and feature-bloat risks this project is intended to avoid.
- The project thesis is therefore **not** "voxel VTTs do not exist."
- The working differentiation is: **browser-first, deliberately simple semantic blocks, fixed tabletop-friendly defaults, minimal setup, DM authority, and encounter creation measured in minutes rather than detailed world-building.**

The closest product to watch is Terrablox. The closest browser product to watch is VOXEL Tabletop.

See `docs/COMPETITOR_RESEARCH.md`.

## Open Design Questions

These are deliberately unresolved and must not be guessed during implementation.

1. Exact manual vertical placement/elevation interaction outside generated room walls.
2. Tiny creature placement.
3. MVP identity/authentication model.
4. Persistence and undo/redo strategy.
5. Whether a selected block remains active for repeated placement or clears after one placement.
6. Shared-wall editing behavior between adjacent generated rooms if the simple no-duplicate rule is insufficient.
7. Technology stack final selection and hosting/persistence providers.
8. Exact asset/art production approach.

## Latest Work Record

### Date

2026-10-07

### Starting State

The project was in Stage 0 with no application code.

The room spatial contract had been resolved. The next open design topic was the camera/view model and manual placement feel.

The user proposed a camera around a 30-degree tabletop angle that can move around the map.

### Changes Made

- Read the live project state, SOUL, interaction spec, and spatial contract before changes.
- Created `docs/CAMERA_CONTRACT.md`.
- Updated `SOUL.md` with the fixed-angle tabletop camera rule.
- Updated `docs/INTERACTION_SPEC.md` with visible camera controls and candidate mouse shortcuts.
- Updated `docs/ROADMAP.md` with camera requirements.
- Linked the camera contract from README.
- Updated this live state and removed the camera model from unresolved questions.

### Decisions Made

**Decision:** Default camera elevation is approximately 30° above the board plane.

**Reason:** It gives a readable 3D tabletop view while keeping walls, room interiors, and stacked blocks understandable.

**Decision:** The exact rendering angle may be tuned slightly during visual testing; mathematical isometric purity is not required.

**Reason:** A true isometric elevation is roughly 35.3°, but readability is more important than exact projection geometry.

**Decision:** Vertical camera tilt is locked for MVP.

**Reason:** Users should not be able to flip under the board, look upside down, or lose the map through free-fly camera controls.

**Decision:** Camera can orbit horizontally around its focus point while maintaining the fixed elevation.

**Reason:** This gives access to all sides of the board without requiring object rotation.

**Decision:** Pan and zoom are supported.

**Reason:** DMs need to move between rooms and inspect details.

**Decision:** An obvious Reset/Home control is required.

**Reason:** A child/new user must always be able to recover the view.

**Decision:** Visible camera controls are authoritative; mouse/touch gestures are optional conveniences.

**Reason:** Basic operation should not depend on knowing hidden desktop gestures.

### Cost Impact

None.

This is documentation and product design only. No dependency, service, asset, or application code was added.

### Result

The camera model is now defined:

> fixed tabletop angle near 30° + horizontal orbit + pan + zoom + Reset/Home.

No first-person, free-fly, or free vertical tilt is part of MVP.

Both Three.js and Babylon.js can support this model, so this decision does not force the rendering-library choice.

No application code has been written.

### Open Questions / Blockers

1. Exact manual vertical placement/elevation interaction.
2. Tiny creature placement.
3. MVP authentication/join identity model.
4. Persistence and undo/redo strategy.
5. Repeated-placement behavior after selecting a block.
6. Shared-wall editing if needed.
7. Three.js vs Babylon.js final choice.
8. Exact art/asset production approach.

### Exact Next Step

Stay in design mode.

Resolve **manual block placement behavior** next:

- how the DM places a block on top of another block
- whether selected blocks remain active for repeated placement
- placement preview behavior
- valid/invalid placement feedback
- how moving an existing unlocked block differs from placing a new block

Do not write application code yet.
