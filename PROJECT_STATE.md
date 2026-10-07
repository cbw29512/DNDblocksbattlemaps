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
2. **Cheap first.** Initial hosting, persistence, assets, services, and infrastructure should use reliable free or near-free options whenever practical.
3. **No code yet.** Product, interaction, state, cost, and architecture decisions come first.
4. **Documentation is part of the work.** A task is not complete until this live state has been updated and pushed.
5. **Resume-first workflow.** Before making changes, read this file and the governing docs.
6. **One square = 5 feet.**
7. Small/Medium = 1x1, Large = 2x2, Huge = 3x3, Gargantuan = 4x4. Multi-square creatures remain one entity.
8. **Everything is data-driven.** Reuse universal object behaviors instead of object-specific engines.
9. **DM controls the world.** Players only control assigned pieces and allowed interactions.
10. **Blocks snap to the grid.**
11. **No ordinary object rotation is required.** Art should identify a block from all useful sides.
12. **Construction can be locked** to prevent accidental movement.
13. **DM-only/hidden objects** are required; the DM can reveal them.
14. **Prefab rooms are recipes for normal blocks**, not a separate runtime system.
15. Future prefab rooms should accept real-world dimensions such as 40x20 feet.
16. The board should have a simple BUILD mode and PLAY mode concept.
17. Rules automation, if ever added, remains optional. The DM must always be able to decide what happens.

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

Planned next documentation:

- `docs/INTERACTION_SPEC.md` — exact DM/player building and play interactions.
- `docs/BLOCK_CATALOG.md` — first block library and object defaults.
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

The project was still in Stage 0 with no application code. The live handoff system was already in place and required reading `PROJECT_STATE.md`, `SOUL.md`, and repository state before work.

A broad VTT scan had been done previously, but there had not yet been a specific competitive scan for the exact Minecraft/voxel/block-building VTT idea.

### Changes Made

- Read the live project state and SOUL before repository changes.
- Researched current voxel/3D VTT competitors and recent community pain points.
- Identified Terrablox as the closest direct voxel competitor.
- Identified VOXEL Tabletop as the closest browser-oriented voxel product found.
- Compared TaleSpire, The RPG Engine, and RPG Stories for overlapping building/VTT behavior.
- Created `docs/COMPETITOR_RESEARCH.md` with sources, differences, pain points, and the resulting product position.
- Updated this live handoff with the competitive findings.

### Decisions Made

**Decision:** Do not base the product thesis on being the first voxel/block VTT.

**Reason:** Direct competitors already exist.

**Decision:** Compete primarily on simplicity, browser access, setup speed, obvious semantic blocks, low friction for players, and DM authority.

**Reason:** Existing 3D VTTs repeatedly add visual richness and large feature surfaces, while user discussions repeatedly cite DM prep time, UI learning, hardware, and setup friction as problems.

**Decision:** Terrablox and VOXEL Tabletop should be revisited periodically during product design.

**Reason:** Both are close enough to this concept that their changes can reveal useful ideas, pain points, and differentiation risks.

### Cost Impact

None. This session was research and documentation only. No paid service, dependency, hosting, database, API, storage, or licensed asset was added.

### Result

The project has a documented competitive landscape.

The concept is validated as an existing category rather than a completely novel category.

The current differentiation is:

> A deliberately simple, browser-first digital box of magnetic-style battle-map blocks where a DM can build a playable encounter in minutes without learning a full 3D world-building application.

No application code has been written.

### Open Questions / Blockers

No blocker prevents continued design.

The most important unresolved issue remains the exact interaction contract: how a completely new DM selects, places, locks, hides, stacks, moves, and plays with blocks with almost no instruction.

### Exact Next Step

Create and agree on `docs/INTERACTION_SPEC.md`, using the competitor research as a guardrail.

The interaction specification must prioritize:

- BUILD vs PLAY
- one-click/select-and-place behavior
- minimal toolbar/palette complexity
- locking/unlocking
- hiding/revealing
- moving assigned pieces
- vertical placement
- basic door interaction
- undo/redo
- player permissions
- a first-use experience that does not require reading a manual

Do not write application code while doing this.
