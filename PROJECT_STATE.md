# PROJECT_STATE.md

> **READ THIS FIRST.**
>
> This is the live handoff/resume document for DND Blocks Battle Maps.
> Any AI or human continuing this project must read this file, `SOUL.md`, and the current relevant design documents before making changes.
> This file must be updated and pushed to GitHub at the end of every meaningful work session.

## Current Status

**Phase:** Stage 0 — Product/Architecture Contract — substantially complete; pre-implementation gate  
**Application code:** None. Do not begin coding until the user explicitly directs Stage 1 implementation.  
**Repository:** `cbw29512/DNDblocksbattlemaps`  
**Primary goal:** Keep the documented contracts internally consistent and preserve a clean handoff boundary before Stage 1. The MVP technology stack is selected; package versions/licenses are recorded immediately before installation.

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
48. **Accepted MVP stack.** TypeScript + Vite + Three.js + native HTML/CSS first + Supabase + Cloudflare Pages; no custom app server initially.
49. **Renderer is an adapter.** Authoritative world state drives Three.js; renderer objects are never the canonical state.
50. **Shared walls are one object.** Adjacent generated rooms reuse one compatible wall WorldObject with membership in multiple RoomRegions; it is effectively locked if any associated room is locked.
51. **Visual feedback is kid-readable and original.** Placement/ownership/hidden/lock/Tiny states use shape/icon/text/opacity cues and never rely on color alone; no copied Minecraft/VTT art.
52. **Implementation rules are mandatory.** Coding must be state-first, universal-behavior-first, testable, error-aware, and documentation-complete.
53. **Dependency/license register is mandatory.** No third-party code or asset enters the repo before source/version/license/purpose/provenance are recorded.
54. **Explicit coding gate.** Stage 1 application code does not begin until the pre-implementation checklist is satisfied and the user explicitly directs implementation.

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
- `docs/VISUAL_LANGUAGE.md` — authoritative original block style and visual feedback for placement, hidden state, ownership, locks, overlaps, and Tiny pieces.
- `docs/ADR_001_MVP_WEB_STACK.md` — accepted MVP architecture decision and fallback/revisit triggers.
- `docs/DEPENDENCY_REGISTER.md` — required dependency/license/provenance ledger.
- `docs/IMPLEMENTATION_RULES.md` — mandatory coding architecture, testing, error/logging, dependency, and no-drift rules.
- `docs/PRE_IMPLEMENTATION_CHECKLIST.md` — Stage 0 closure gate and Stage 1 Definition of Done.

No additional product-contract document is currently required before Stage 1.

Before the first package installation, update the Dependency Register with exact versions/licenses and recheck provider/library terms.

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

## Remaining Implementation-Time Decisions

These are intentionally deferred until implementation/testing provides evidence. They are **not product-design blockers** for Stage 1.

1. Exact package versions and transitive license notices immediately before installation.
2. Exact Supabase authentication/session implementation details within the locked durable-DM/lightweight-player contract.
3. Exact original/CC0 placeholder asset production pipeline.
4. Numeric bounded Undo/Redo history retention after real usage/storage testing.
5. Performance thresholds and tuning based on target browser/device testing.

## Latest Work Record

### Date

2026-10-07

### Starting State

The project had no application code.

The product interaction, placement, player join, traps/effects, camera, spatial, and persistence contracts were documented. Persistence/recovery had just been resolved, and the remaining Stage 0 work was to choose the MVP architecture, close shared-wall/visual gaps, and create a hard pre-code implementation gate.

### Changes Made

- Compared the smallest viable browser-first architecture against the now-complete product requirements.
- Accepted `docs/ADR_001_MVP_WEB_STACK.md`.
- Selected TypeScript + Vite + Three.js + native HTML/CSS first + Supabase + Cloudflare Pages for the MVP.
- Retained Babylon.js and PocketBase as documented fallbacks/revisit options.
- Created `docs/DEPENDENCY_REGISTER.md`; no packages have been installed yet.
- Updated the technology-candidate research to point to the accepted ADR.
- Created `docs/VISUAL_LANGUAGE.md` covering placement ghosts, player ownership, hidden DM-only objects, locks, interactables, traps/effects, creature footprints, Tiny auto-offset, overlap indicators, shared walls, accessibility, and asset provenance.
- Resolved shared-wall behavior in `docs/SPATIAL_CONTRACT.md`: compatible adjacent walls are one shared WorldObject, not duplicates.
- Updated `docs/DATA_SCHEMA.md` from single room ownership to many-to-many RoomObjectMembership so shared walls/doors can belong to multiple rooms.
- Reconciled stale planning language in SOUL, Spatial Contract, README, and Roadmap after those decisions.
- Created `docs/IMPLEMENTATION_RULES.md` to lock state-first architecture, renderer boundaries, universal behavior reuse, error/logging discipline, testing workflow, dependency discipline, security, and documentation completion.
- Created `docs/PRE_IMPLEMENTATION_CHECKLIST.md` as the Stage 0 closure gate and Stage 1 Definition of Done.
- Updated README so a new AI/human can immediately locate every authoritative contract and pre-code rule.

### Decisions Made

**Decision:** Three.js is the MVP renderer; Babylon.js remains a fallback.

**Reason:** The product needs a deliberately small browser 3D layer, not a broad game-engine architecture. Three.js covers the locked camera, picking, meshes, and repeated-block needs while keeping world state/application architecture under our control.

**Decision:** Supabase is the MVP persistence/auth/realtime service; PocketBase remains a fallback.

**Reason:** It can provide hosted Postgres/Auth/Realtime without operating a custom server during early development, while preserving an open-source/self-host escape path.

**Decision:** Native HTML/CSS + TypeScript is the initial UI layer.

**Reason:** The locked UI is intentionally small. React/Vue/Svelte should only be introduced if actual implementation complexity proves they reduce code.

**Decision:** Cloudflare Pages is the selected static frontend host.

**Reason:** It supports the static-browser architecture without requiring a custom app server and is compatible with the cheap-first strategy.

**Decision:** Three.js render objects are never canonical state.

**Reason:** The authoritative state/schema must remain testable, persistent, recoverable, and renderer-independent.

**Decision:** Shared walls are one WorldObject with multiple RoomRegion memberships.

**Reason:** Adjacent rooms should not double-render/double-thicken the same physical wall. Shared construction is protected when any associated room remains locked.

**Decision:** Visual state must use multiple cues rather than color alone.

**Reason:** Ownership, hidden state, locking, placement, and movement restrictions must remain obvious and accessible without clutter.

**Decision:** No application dependency enters the repository before the Dependency Register records its exact source/version/license/purpose.

**Reason:** Open-source reuse must simplify the project without creating licensing or provenance debt.

**Decision:** The implementation rules and pre-implementation checklist are mandatory.

**Reason:** Another AI/session must not be able to resume the project and silently choose a different architecture, bypass state/schema, or reintroduce feature drift.

**Decision:** Stage 0 is substantially complete.

**Reason:** The product contract, data model, interaction model, camera, placement, hazards, multiplayer ownership, persistence/recovery, visuals, architecture, licensing policy, implementation rules, and Stage 1 DoD are all now documented.

### Cost Impact

No cost incurred.

No application code has been written and no npm/package dependency has been installed.

The selected MVP architecture is intended to begin at approximately **$0 infrastructure cost while usage stays within current free-tier limits**, but all provider limits/pricing and exact package licenses must be rechecked before public production and exact package installation.

### Result

The repository is now designed to be resumable by another AI or human without relying on chat history.

Stage 0 has a clean implementation boundary:

> **Product/architecture contracts are substantially complete. Application code remains zero.**

The selected Stage 1 stack is:

> **TypeScript + Vite + Three.js + native HTML/CSS + Supabase + Cloudflare Pages.**

Stage 1 has an explicit Definition of Done and architecture tests in `docs/PRE_IMPLEMENTATION_CHECKLIST.md`.

### Remaining Implementation-Time Decisions

These are not blockers to beginning Stage 1 once the user explicitly directs it:

1. exact dependency versions and transitive license notices
2. exact Supabase auth/session implementation details within the locked contract
3. original/CC0 placeholder asset production pipeline
4. numeric bounded Undo/Redo retention after testing
5. performance tuning based on real browser/device tests

### Exact Next Step

**Do not write application code unless the user explicitly directs Stage 1 implementation.**

When that direction arrives:

1. reread `PROJECT_STATE.md`, `SOUL.md`, the Stage 1 contracts, ADR-001, implementation rules, and pre-implementation checklist
2. recheck exact package versions/licenses and update `DEPENDENCY_REGISTER.md`
3. implement only the first Stage 1 vertical slice from authoritative state outward
4. test the state behavior independently of Three.js where possible
5. update/push the live handoff before stopping

Until explicit coding direction is given, remain in design/audit mode.
