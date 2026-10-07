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
6. How right-click removal behaves when multiple overlapping objects occupy the exact same visible location.
7. Shared-wall editing behavior between adjacent generated rooms if the simple no-duplicate rule is insufficient.
8. Technology stack final selection and hosting/persistence providers.
9. Exact asset/art production approach.

## Latest Work Record

### Date

2026-10-07

### Starting State

The project was in Stage 0 with no application code.

The camera contract had been resolved. The next design topic was manual placement behavior.

The user clarified that the DM should be able to place **whatever block wherever they want**, including creatures inside pits, creatures on traps, and other overlapping combinations. The user also asked for broader D&D trap thinking rather than treating pit/spring traps as the complete design space.

During the discussion, the user provided a further example: a chest-looking block that transforms into a mimic creature when the player's character touches/interacts with it.

### Research

Reviewed current official/free D&D trap examples and trap structure.

2024 Free Rules/SRD trap patterns include:

- collapsing roof
- falling net
- fire-casting statue
- hidden pit
- poisoned darts
- poisoned needle
- rolling stone
- spiked pit

The 2024 rules describe traps through reusable concepts including **Trigger**, **Duration**, effects, and optional detection/disarm procedures.

Reviewed 2014 Basic Rules/SRD trap guidance, which includes mechanical and magical traps such as pits, arrows/darts, falling blocks, flooded rooms, blades, and spell traps.

Reviewed the 2014 Basic Rules Mimic as an example of an object-form creature: it can appear as an ordinary object and adheres to creatures that touch it. The project is not copying the monster mechanics into the map engine; the reference validates the need for generic object→creature transformation/reveal behavior.

### Changes Made

- Read the live project state, SOUL, interaction spec, spatial contract, data schema, and block catalog before changes.
- Researched D&D trap patterns using current official/free D&D sources.
- Created `docs/TRAPS_AND_EFFECTS.md`.
- Updated `SOUL.md` with DM-authoritative placement and universal trigger/effect/transform principles.
- Updated `docs/SPATIAL_CONTRACT.md` so occupancy describes PLAY behavior but never blocks DM BUILD placement.
- Updated `docs/DATA_SCHEMA.md` with generic InteractionRule and transform/replace concepts.
- Expanded `docs/BLOCK_CATALOG.md` with broad trap/hazard families and transforming surprise objects.
- Updated `docs/INTERACTION_SPEC.md` with permissive overlap and chest→mimic-style transform interaction.
- Updated `docs/ROADMAP.md` with permissive placement, generic trigger/effect behavior, and transform/replace support.
- Linked the new traps/effects contract from README.

### Decisions Made

**Decision:** The DM may place any object anywhere in BUILD mode, including intentional overlap.

**Reason:** The board must enable creativity rather than enforce physics or assumptions about what belongs in a cell.

**Decision:** Occupancy and movement-blocking properties describe PLAY behavior only.

**Reason:** A wall may block ordinary player movement, but that must not prevent the DM from placing a monster in that location if desired.

**Decision:** The editor may warn about overlap but may not reject the placement.

**Reason:** The DM is authoritative.

**Decision:** Traps and hazards are composed from reusable triggers and effects.

**Reason:** D&D examples vary widely—pressure plates, trip wires, pits, nets, darts, falling objects, magical effects, moving hazards—but share reusable structural concepts.

**Decision:** Transform/replace is a universal effect.

**Reason:** A chest becoming a mimic is the same underlying behavior class as statue→gargoyle, armor→animated armor, bones→skeleton, sarcophagus→undead, or scenery→hazard.

**Decision:** A transform should be able to preserve map placement while changing appearance, category, capabilities, footprint, and interaction behavior.

**Reason:** The surprise should happen in place rather than requiring a special-case engine.

### Cost Impact

None.

This session added documentation and research only. No dependency, service, asset, hosting cost, or application code was added.

### Result

The placement/hazard architecture is now substantially broader:

> BUILD mode permits any DM placement. PLAY behavior comes from reusable object properties and trigger/effect rules.

And:

> A chest can be placed as an ordinary-looking object, then on touch/interact transform in place into a mimic creature block.

The same primitives cover a much wider set of D&D-style hazards, ambushes, and environmental surprises.

No application code has been written.

### Open Questions / Blockers

1. Exact manual vertical placement/elevation interaction.
2. Tiny creature placement.
3. MVP authentication/join identity model.
4. Persistence and undo/redo strategy.
5. Repeated-placement behavior after selecting a block.
6. Right-click removal behavior when several overlapping objects share the same visible location.
7. Shared-wall editing if needed.
8. Three.js vs Babylon.js final choice.
9. Exact art/asset production approach.

### Exact Next Step

Stay in design mode.

Resolve **manual placement and object-selection behavior** next:

- how clicking the top/side of a block chooses elevation
- whether the selected palette block remains active for repeated placement
- placement ghost/preview appearance
- how overlapping objects are selected/removed without making the UI complicated
- how an unlocked existing block is picked up and moved

Do not write application code yet.
