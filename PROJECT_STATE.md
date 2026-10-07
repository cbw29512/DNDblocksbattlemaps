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
- `docs/OPEN_SOURCE_REUSE.md` — Minecraft inspiration boundary, license gate, and open-source engine/library candidates.

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

The project was still in Stage 0 with no application code.

The kid-simple interaction contract and initial block catalog were documented. The user clarified that prior block examples were examples rather than an exhaustive catalog and asked whether Minecraft block options could be used as inspiration and whether Minecraft or other open-source code could accelerate development.

### Changes Made

- Read the live project state, SOUL, interaction spec, block catalog, and competitor research before making changes.
- Reviewed Minecraft's current EULA and Usage Guidelines.
- Reviewed Minecraft/Microsoft creative inventory/category documentation for organizational ideas.
- Researched permissively licensed browser 3D and voxel-related projects.
- Created `docs/OPEN_SOURCE_REUSE.md`.
- Added an external-code/asset license gate to `SOUL.md`.
- Expanded `docs/BLOCK_CATALOG.md` with broader kid-readable catalog families inspired by the usability lesson of Minecraft's grouped inventory, without copying Minecraft assets or inventory.
- Linked the new research document from README.

### Decisions Made

**Decision:** Minecraft is a design/catalog reference only.

**Reason:** Mojang/Microsoft's current terms reserve their game software/content and specifically treat Minecraft block textures/look-and-feel as their property.

**Decision:** Do not copy Minecraft code, textures, sounds, models, game files, UI art, or proprietary block artwork.

**Reason:** The project should remain legally clean, original, and commercially flexible.

**Decision:** Generic block concepts may be inspired by ordinary world/fantasy objects and organized into a few simple families.

**Reason:** The useful lesson from Minecraft is discoverability through grouping, not the proprietary assets themselves.

**Decision:** Prefer a permissively licensed browser rendering library over forking an entire voxel game.

**Reason:** DND Blocks Battle Maps does not need survival, crafting, mining, procedural infinite worlds, biomes, game AI, or first-person game architecture.

**Decision:** Three.js is the first candidate to evaluate later; Babylon.js is the strongest batteries-included alternative.

**Reason:** Both are browser-focused and permissively licensed; Three.js is smaller/more architectural-control oriented, while Babylon.js offers more built-in engine behavior.

**Decision:** Luanti and Terasology are reference sources rather than preferred foundations.

**Reason:** They are much larger game engines and would likely introduce unnecessary complexity and architectural drift for this small browser VTT.

### Cost Impact

None.

All research and candidate technologies identified here are open source. No dependency has been adopted and no paid service has been added.

### Result

The project now has a documented legal/reuse boundary and a shortlist of open-source technologies that could reduce development cost without turning the product into a Minecraft clone.

Current reuse posture:

> Learn from Minecraft's block organization and simplicity, create original assets/behavior, and reuse only verified open-source code where it genuinely saves work.

No application code has been written.

### Open Questions / Blockers

1. Room spatial contract remains unresolved.
2. Exact camera/view model remains unresolved.
3. Final rendering technology remains unselected.
4. Before any external code is imported, the exact library/repository/version and license obligations must be recorded.
5. Exact asset/art production approach is still open.

### Exact Next Step

Stay in design mode.

Continue the room spatial contract and block-library design.

When the architecture stage begins, compare **Three.js vs Babylon.js** against the exact MVP requirements before selecting either one.

Do not import Minecraft assets or code. Do not adopt an open-source voxel engine wholesale without a documented necessity review.
