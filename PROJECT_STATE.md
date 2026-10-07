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

1. Exact visual/camera model for the board.
2. Exact vertical placement interaction.
3. Whether a prefab room dimension means interior usable area or total exterior footprint.
4. Exact door cell/wall relationship.
5. Tiny creature placement.
6. MVP identity/authentication model.
7. Persistence and undo/redo strategy.
8. Initial block catalog.
9. Exact DM/player interaction contract.
10. Technology stack and hosting/persistence providers.

## Latest Work Record

### Date

2026-10-07

### Starting State

The project was in Stage 0 with no application code.

The competitor scan had been completed, but the exact first-use UI and room-building interaction had not yet been documented.

The user then defined the intended experience more concretely:

- UI simple enough for a child
- hero page explains the product
- large terrain choices such as Castle, Inn, Field, Sea, and Volcano
- terrain selection immediately opens a gridded map
- sidebar room builder using Length × Width × Height
- no ceilings
- add room blocks such as table, torch, pit, trap, monster, and door
- hidden/invisible objects controlled by the DM
- trap can stop a player from moving until the DM releases them
- DM can lock a room so its current contents do not move accidentally
- left click to select/place, right click to remove
- the earlier word "date" was clarified as a typo; a calendar/date block is only a possible future idea and is not MVP

### Changes Made

- Read the live project state, SOUL, data schema, and roadmap before making changes.
- Created `docs/INTERACTION_SPEC.md`.
- Created `docs/BLOCK_CATALOG.md`.
- Updated `SOUL.md` with the kid-simple UI requirement, mouse interaction contract, no-ceiling rule, and reusable movement-lock behavior.
- Updated `docs/DATA_SCHEMA.md` with terrain theme, room-region association, room bulk-lock state, and reusable movement-lock concepts.
- Updated `docs/ROADMAP.md` so the first builder prototype includes the hero terrain choice, room generator, no ceilings, right-click remove, and room bulk lock.
- Clarified that "date" was a typo and removed it from the active block requirements.
- Recorded calendar/date display as a deferred idea only.
- Updated README links so a new AI or human can find the interaction and block-catalog documents quickly.

### Decisions Made

**Decision:** The UI must be simple enough for a child to understand without reading a manual.

**Reason:** Simplicity is the primary product differentiator.

**Decision:** The first hero-page action is choosing a terrain/theme from large obvious buttons.

**Reason:** The DM should reach a usable grid immediately instead of configuring a project.

**Decision:** Rooms are created from Length × Width × Height inputs and generate ordinary blocks.

**Reason:** This gives DMs fast room construction without introducing a second map engine.

**Decision:** Rooms do not automatically receive ceilings.

**Reason:** The DM and players must be able to look into and use the room easily.

**Decision:** The base DM mouse contract is left-click select/place and right-click remove.

**Reason:** It is easy to learn and remember.

**Decision:** Room locking is a bulk editing concept.

**Reason:** Once a room is arranged, the DM should be able to protect its current pieces from accidental movement and later unlock them for editing.

**Decision:** Trap-imposed immobility is a reusable movement-lock effect controlled by the DM.

**Reason:** The same board behavior can later support pits, webs, cages, restraints, and other sources without unique engines.

**Decision:** "date" was a typo.

**Reason:** User clarification. A calendar/date block is only a future idea and is not part of the MVP catalog.

### Cost Impact

None. This work is documentation and product design only.

No paid service, dependency, hosting, database, API, storage, licensed asset, or application code was added.

### Result

The project now has a concrete first-use UI contract and an initial block-catalog contract.

The current intended first-use flow is:

> Hero page → choose terrain → grid appears → create room → add blocks → hide/reveal as needed → lock room → invite players → play.

No application code has been written.

### Open Questions / Blockers

1. Exact camera/view model.
2. Whether Length/Width/Height inputs use feet, grid cells, block levels, or a mix.
3. Whether room dimensions represent interior usable area or total exterior footprint.
4. Exact scope of room lock when creatures/player pieces are present.
5. Whether a selected block stays active for repeated placement or clears after one placement.
6. Door placement relationship to walls/cells.
7. Tiny creature placement.
8. MVP login/authentication approach.
9. Persistence and undo/redo design.
10. Technology stack and hosting/persistence provider.

### Exact Next Step

Stay in design mode.

Resolve the **room spatial contract** next:

- what Length means
- what Width means
- what Height means
- whether dimensions are entered in feet or squares
- whether dimensions describe interior playable space or outside dimensions
- how a door replaces/occupies a wall position
- what exactly the room lock includes

Do not write application code yet.
