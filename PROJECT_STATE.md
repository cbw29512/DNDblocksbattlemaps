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
30. **DM-authoritative placement.** BUILD mode allows intentional overlap/stacking; occupancy may warn but does not reject DM placement.
31. **Universal trigger/effect system.** Traps, hazards, switches, ambushes, and surprises are composed from reusable triggers/effects rather than named engines.
32. **Universal transform/replace.** An object may change identity/category/capabilities in place when triggered, such as chest → mimic.
33. **Select once, place many.** A palette item remains active until changed/cleared; repeated clicks place repeated copies.
34. **Surface-based stacking.** Floor places on floor, top face places one 5-foot level above, side face places adjacent at the clicked block's base level; explicit elevation in feet is available as an escape hatch.
35. **Floating placement allowed.** DM may deliberately place unsupported elevated objects; no physics validator blocks creation.
36. **Pick-up/put-down movement.** Unlocked existing objects are moved by selecting/picking up and dropping, not transform gizmos.
37. **Overlap chooser only when needed.** Ambiguous overlapping selections use a minimal What's Here? chooser rather than a permanent object inspector.
38. **Undo/Redo is Stage 1 safety infrastructure.** Fast placement/removal should remain confirmation-free because board edits are reversible.
39. **Low-friction player join.** DM uses a durable signed-in identity; players join via link/code + display name with a lightweight session identity and no required standalone account in MVP.
40. **DM assigns pieces.** Players control only assigned entities; DM may assign/reassign at any time and always retains override.
41. **Player UI stays minimal.** No build tools; players see map, owned piece, visible objects, camera controls, and relevant interactions only.
42. **Tiny creatures keep the 5-foot grid.** Tiny pieces share a 5-foot square and auto-offset visually rather than introducing a permanent 2.5-foot subgrid.
43. **Current state is canonical.** Maps load from current persisted state, not by replaying the entire edit history.
44. **Autosave is continuous.** Every committed board edit enters the save pipeline; ordinary use does not require a manual Save button.
45. **Undo is compensating history.** Undo/Redo uses reversible commands; Undo records an inverse edit instead of deleting history.
46. **Revision + action IDs protect realtime.** Game/map revisions detect gaps/staleness and unique action IDs deduplicate retries/reconnects.
47. **Realtime sends logical edits, not frames.** Movement sync transmits committed grid moves/state changes rather than animation frames.

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
- `docs/TRAPS_AND_EFFECTS.md` — authoritative trigger/effect, hazard, permissive-overlap, and transforming-object contract.
- `docs/PLACEMENT_CONTRACT.md` — authoritative select/place, stacking, elevation, overlap-selection, move, and undo interaction.
- `docs/PLAYER_JOIN_CONTRACT.md` — authoritative player join, session identity, assignment, control, interaction, DM override, and Tiny creature behavior.
- `docs/PERSISTENCE_UNDO_CONTRACT.md` — authoritative current-state persistence, autosave, Undo/Redo, revision, dedupe, crash, and reconnect behavior.

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

1. Shared-wall editing behavior between adjacent generated rooms if the simple no-duplicate rule is insufficient.
2. Technology stack final selection and hosting/persistence providers.
3. Exact asset/art production approach.
4. Exact visual treatment for player ownership, hidden DM-only objects, placement ghosts, and Tiny auto-offsets.
5. Bounded Undo/Redo history retention after real usage testing.

## Latest Work Record

### Date

2026-10-07

### Starting State

The project remained in Stage 0 with no application code.

Player join/ownership and Tiny-creature behavior were resolved. The next open product architecture issue was persistence, Undo/Redo, autosave, crash recovery, and realtime reconnect behavior.

### Changes Made

- Continued from the verified live project state.
- Created `docs/PERSISTENCE_UNDO_CONTRACT.md`.
- Updated `SOUL.md` with canonical-current-state, autosave, Undo/Redo, revision, action-ID, and reconnect rules.
- Updated `docs/DATA_SCHEMA.md` with game revision and a fuller reversible EditHistory model.
- Updated `docs/ROADMAP.md` with autosave, revision/dedupe, logical movement events, crash recovery, and reconnect recovery.
- Linked the persistence/recovery contract from README.

### Decisions Made

**Decision:** Persist current board state separately from bounded recent edit history.

**Reason:** A map should load directly from its current state and must not require replaying its entire lifetime history.

**Decision:** Every committed board edit enters the autosave pipeline.

**Reason:** The product should feel continuously saved and should not depend on a manual Save button.

**Decision:** Undo commits a compensating inverse edit rather than deleting the original edit.

**Reason:** This keeps history explainable and works better for multiplayer/reconnect recovery.

**Decision:** Bulk user actions are one logical history step.

**Reason:** Generate Room or Lock Room should Undo as one user action rather than dozens of individual block edits.

**Decision:** General shared-board Undo/Redo is a DM tool.

**Reason:** Player corrections remain simple and DM authority stays clear.

**Decision:** Every committed action gets a unique action ID and every game/map uses a monotonically increasing revision.

**Reason:** Retries/reconnects need deduplication, ordering, stale-state detection, and gap recovery.

**Decision:** Initial load reads canonical current state first, then subscribes to later realtime changes.

**Reason:** This avoids full event replay and makes map opening/recovery fast.

**Decision:** Realtime movement transmits logical grid moves, not animation frames.

**Reason:** This dramatically reduces network/realtime traffic and keeps the cheap-first architecture viable.

**Decision:** Do not build CRDT/offline-first synchronization unless testing proves it necessary.

**Reason:** Strong DM authority, ownership, locks, revisions, and refresh-on-gap should handle the intended MVP without adding major complexity.

### Cost Impact

None.

No application code, dependency, hosted service, or paid infrastructure was added.

The persistence contract intentionally minimizes future storage/realtime cost by keeping current state compact, history bounded, and network messages logical rather than frame-based.

### Result

The save/recovery mental model is now:

> Every meaningful edit autosaves. Current board state opens directly. Recent edits remain reversible. Reconnect checks revision, deduplicates action IDs, and refreshes state instead of guessing.

A browser crash should not lose important board state such as positions, hidden/revealed objects, transforms, assignments, room locks, or movement-lock effects.

No application code has been written.

### Open Questions / Blockers

1. Shared-wall editing if simple duplicate prevention proves insufficient.
2. Three.js vs Babylon.js final rendering choice.
3. Hosted persistence/auth/realtime final choice.
4. Exact asset/art production approach.
5. Visual language for placement ghosts, hidden DM-only objects, ownership cues, and Tiny auto-offset.
6. Final bounded Undo/Redo history retention after real usage testing.

### Exact Next Step

Stay in design/architecture mode.

Perform the written architecture decision comparing the smallest viable web stacks against the now-defined requirements:

- Three.js vs Babylon.js
- Supabase vs simpler alternatives
- native HTML/CSS vs UI framework
- Cloudflare Pages vs other low-cost static hosts
- dependency/license/cost/complexity impact

No application code yet.
