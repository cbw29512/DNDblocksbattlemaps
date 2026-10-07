# PROJECT_STATE.md

> **READ THIS FIRST.**
>
> This is the live handoff/resume document for DND Blocks Battle Maps.
> Any AI or human continuing this project must read this file, `SOUL.md`, and the current relevant design documents before making changes.
> This file must be updated and pushed to GitHub at the end of every meaningful work session.

## Current Status

**Phase:** Stage 1 — Single-User Builder Prototype — room stamping and core placement usability in active browser verification  
**Application code:** Yes. Stage 1 began after explicit user authorization on 2026-10-07.  
**Repository:** `cbw29512/DNDblocksbattlemaps`  
**Primary goal:** Make fast multi-room construction work cleanly, then move into the real block/character/monster catalog. Netlify remains production and is not used for routine testing.

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
34. **Face-aware block placement.** Empty grid places at the current elevation; top face builds one level up; side face builds one grid cell outward at the clicked block's base elevation. The placement preview must show the exact resulting destination before click.
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
48. **Accepted MVP stack.** TypeScript + Vite + Three.js + native HTML/CSS first + Supabase + Netlify; no custom app server initially.
49. **Renderer is an adapter.** Authoritative world state drives Three.js; renderer objects are never the canonical state.
50. **Shared walls are one object.** Adjacent generated rooms reuse one compatible wall WorldObject with membership in multiple RoomRegions; it is effectively locked if any associated room is locked.
51. **Visual feedback is kid-readable and original.** Placement/ownership/hidden/lock/Tiny states use shape/icon/text/opacity cues and never rely on color alone; no copied Minecraft/VTT art.
52. **Implementation rules are mandatory.** Coding must be state-first, universal-behavior-first, testable, error-aware, and documentation-complete.
53. **Dependency/license register is mandatory.** No third-party code or asset enters the repo before source/version/license/purpose/provenance are recorded.
54. **Explicit coding gate.** Stage 1 application code does not begin until the pre-implementation checklist is satisfied and the user explicitly directs implementation.
55. **Public website is part of the product.** The homepage must look polished, explain the product immediately, and make Build a Map / Join a Game obvious.
56. **Terrain quick-start is a conversion path.** Castle/Inn/Field/Sea/Volcano-style cards can open a temporary builder immediately; durable sign-in is required when saving/sharing a persistent game.
57. **One Vite product surface.** Marketing site and app remain in the same repo/project unless a real requirement later justifies separation.
58. **Local-first release discipline.** Normal development/testing is local; GitHub pushes are coherent checkpoints; Netlify production deploys are deliberate milestone releases.
59. **GitHub Pages is test-only.** It may host temporary static prototype builds for browser testing, but Netlify remains the production/commercial host.
60. **Pages deploys are manual-only.** Normal GitHub pushes do not automatically publish the test site.
61. **Iron Pit monster silhouettes are the default monster face art.** Reuse the Chris-approved assets at `D20-ironpit/frontend/assets/portraits/monsters/{id}.webp` on monster blocks/standees, keyed by catalog/art ID rather than monster-specific rendering code.
62. **Preserve silhouette identity discipline.** Do not substitute related creature art when Iron Pit already distinguishes variants, sizes, ages, or renamed edition creatures.
63. **Vertical build cap is 8 blocks / 40 ft.** Taller stacks leave the useful tabletop view; room height and manual elevation share this cap.
64. **Placement shadow is authoritative feedback.** The landing footprint/shadow must sit on the exact destination surface/cell so stacking and side placement remain obvious.
65. **Zoom remains simple but farther.** Keep fixed camera elevation; allow more zoom-out so the 8th block can remain inspectable.
66. **Room Builder labels are plain-language and readable.** Use full Length/Width/Height labels, vertically stacked fields, high contrast, and a large Build Room action; do not compress core dimensions into tiny L/W/H controls.
67. **Build Room arms a reusable room stamp.** The DM chooses dimensions, clicks Build Room, then clicks a grid square that becomes the room's outside wall corner. The stamp remains active for rapid multiple-room placement until a normal block is selected.
68. **Room preview is explicit.** Gold outline/corner means the room fits; red means it would leave the board or exceed the vertical cap. One stamped room is one Undo/Redo action.
69. **Exact shared structural positions are reused.** Generated rooms do not create duplicate wall blocks at the same X/Z/elevation.

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
- `docs/WEBSITE_EXPERIENCE.md` — authoritative public landing, quick-start, conversion, mobile, SEO, and Netlify release contract.
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

The readable Room Builder, face-aware block placement, 8-block height cap, and stronger placement shadow were green.

Browser testing exposed the next room-building usability gap: clicking **Build Room** immediately created a centered room, which made rapid multi-room layouts awkward.

The user requested a placeable corner so multiple rooms can be positioned quickly.

### Changes Made

- Converted Build Room from immediate centered generation into a **room-stamp mode**.
- The DM still enters Length × Width × Height first.
- Clicking Build Room now arms the room stamp.
- The selected room gets a 3D preview:
  - gold footprint
  - gold outside-corner marker
  - wireframe showing full room extent and wall height
- The grid square under the corner marker is the room's **outside wall corner**.
- Red preview means the room would leave the board or exceed the height cap.
- Clicking a valid corner stamps the room there.
- After placement, the same room stamp remains armed so another identical room can be placed immediately.
- Selecting Stone/Wall/Door/etc. exits room-stamp mode.
- Added equivalent corner/perimeter feedback to the fallback renderer.
- Added anchored room-domain primitives:
  - room outer size
  - fit validation
  - wall positions from a clicked corner
- Existing identical wall blocks at the same X/Z/elevation are reused rather than duplicated.
- Each stamped room remains one Undo/Redo edit.
- Added tests for:
  - exact clicked-corner anchoring
  - board-edge rejection
  - vertical-limit rejection
  - shared-wall overlap between adjacent room stamps
- Updated interaction, spatial, visual, and live-state contracts.
- Netlify remains untouched.

### Decisions Made

**The clicked grid square is the room's outside wall corner.**

Reason: it is literal, visible, and easy to explain: “move the room outline, stick this corner where you want it, click.”

**Room stamp stays active after placement.**

Reason: the user specifically wants to create multiple rooms quickly. Selecting a normal block is the simple exit action.

**Invalid room footprints are shown, not guessed around.**

Reason: predictable placement is more important than automatic repositioning. Gold means it fits; red means move the corner.

### Cost Impact

None.

No new dependency or hosted service.

### Result

The reusable room-stamp implementation and browser snapshot are ready for strict verification.

### Exact Next Step

1. Push this checkpoint with a temporary verification trigger.
2. Require TypeScript, tests, static build, and Pages deployment to pass.
3. Fix any real gate failure without suppressing strict checks.
4. Restore Pages workflow to manual-only after green.
5. Browser-test:
   - Build Room
   - move gold room preview
   - click a corner
   - stamp several rooms quickly
   - snap a second room onto an existing wall
   - Undo one stamped room
   - select a normal block and confirm room mode exits
6. Then continue into construction/prop/character/monster catalog work.
