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

1. Tiny creature placement.
2. MVP identity/authentication/join model.
3. Persistence granularity and recovery strategy behind Undo/Redo.
4. Shared-wall editing behavior between adjacent generated rooms if the simple no-duplicate rule is insufficient.
5. Technology stack final selection and hosting/persistence providers.
6. Exact asset/art production approach.
7. Player-side interaction contract beyond basic movement.

## Latest Work Record

### Date

2026-10-07

### Starting State

The project remained in Stage 0 with no application code.

DM-authoritative overlap, broad trigger/effect hazards, and transform/replace behavior were documented. The next unresolved design area was the ordinary manual placement experience.

### Changes Made

- Read the live project state, SOUL, interaction spec, spatial contract, traps/effects contract, and data schema before work.
- Created `docs/PLACEMENT_CONTRACT.md`.
- Updated `SOUL.md` with persistent selection, natural surface stacking, explicit elevation fallback, pick-up/put-down movement, overlap selection, and Undo/Redo requirements.
- Updated `docs/INTERACTION_SPEC.md` to resolve repeated placement, manual elevation, moving existing objects, overlap selection, and Undo/Redo.
- Updated `docs/DATA_SCHEMA.md` with transient EditorState and renderer-independent EditHistory concepts.
- Updated `docs/ROADMAP.md` so these behaviors are part of the first single-user builder prototype.
- Linked the placement contract from README.
- A GitHub read briefly disconnected during reconciliation; the read was retried in smaller batches and repository work continued without changing the design.

### Decisions Made

**Decision:** Selecting a palette object persists until the DM chooses another object or clears placement mode.

**Reason:** Physical terrain building often requires placing several copies of the same thing, and returning to the sidebar after every block is unnecessary friction.

**Decision:** Placement uses a ghost preview.

**Reason:** The DM should see exactly where and at what elevation the next object will appear before clicking.

**Decision:** Natural stacking follows the hovered surface.

**Reason:** Ground/floor, top-face, and side-face placement are visually understandable and avoid requiring users to think in X/Y/Z coordinates.

**Decision:** A visible elevation control in 5-foot units also exists.

**Reason:** It provides a simple escape hatch for exact heights or locations without a convenient visible support surface.

**Decision:** Unsupported/floating placement is allowed.

**Reason:** The DM may need flying creatures, suspended objects, magical platforms, falling hazards, or other intentionally unsupported elements. The app is not a physics engine.

**Decision:** Moving an unlocked object uses pick-up → ghost → put-down.

**Reason:** This matches the physical-block metaphor and avoids transform gizmos.

**Decision:** Ambiguous overlap gets a small `What's Here?` chooser only when needed.

**Reason:** Normal clicks should remain direct; complexity should appear only when the map actually contains ambiguous overlapping objects.

**Decision:** Right-click ordinary removal remains confirmation-free.

**Reason:** Repeated confirmation dialogs would undermine the product's speed.

**Decision:** Undo/Redo is required in Stage 1.

**Reason:** Fast confirmation-free editing is only safe when mistakes are immediately reversible.

**Decision:** New environment/construction objects can still be placed in a locked room and inherit that room's locked state after placement.

**Reason:** Room lock protects existing layout from accidental movement; it must not prevent the DM from adding a later prop, hazard, or surprise.

### Cost Impact

None.

This work changed documentation/product contracts only. No dependency, hosted service, asset, or application code was added.

### Result

The manual editor now has a complete simple mental model:

> Pick a thing → see its ghost → click to place → keep clicking for more → Select/Done when finished.

And:

> Click an unlocked thing in Select mode → pick it up → click where it belongs → Escape to cancel.

Vertical building does not require a separate editor:

> floor = place here; top = stack above; side = place beside; height control = exact override.

No application code has been written.

### Open Questions / Blockers

1. Tiny creature placement.
2. MVP authentication/join model.
3. Persistence/recovery implementation behind Undo/Redo.
4. Shared-wall editing if simple duplicate prevention proves insufficient.
5. Three.js vs Babylon.js final choice.
6. Exact art/asset production approach.
7. Player-side interaction beyond basic movement.

### Exact Next Step

Stay in design mode.

Resolve the **player/join and creature-control contract** next, including:

- whether players need accounts or can join by code/name
- how a DM assigns a character piece
- what a player can click/interact with
- what happens when a player's movement is locked
- how DM override works
- how Tiny creature representation should behave on a 5-foot grid

Do not write application code yet.
