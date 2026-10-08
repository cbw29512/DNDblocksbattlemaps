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
4. **Stage 1 code is active.** Product contracts remain authoritative; implementation must follow them and update the live handoff.
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
61. **Iron Pit monster silhouettes are the default monster face art.** Reuse the Chris-approved assets at `D20-ironpit/frontend/assets/portraits/monsters/{id}.webp` on monster cube faces, keyed by catalog/art ID rather than monster-specific rendering code.
62. **Preserve silhouette identity discipline.** Do not substitute related creature art when Iron Pit already distinguishes variants, sizes, ages, or renamed edition creatures.
63. **Vertical build cap is 8 blocks / 40 ft.** Taller stacks leave the useful tabletop view; room height and manual elevation share this cap.
64. **Placement shadow is authoritative feedback.** The landing footprint/shadow must sit on the exact destination surface/cell so stacking and side placement remain obvious.
65. **Zoom remains simple but farther.** Keep fixed camera elevation; allow more zoom-out so the 8th block can remain inspectable.
66. **Room Builder labels are plain-language and readable.** Use full Length/Width/Height labels, vertically stacked fields, high contrast, and a large Build Room action; do not compress core dimensions into tiny L/W/H controls.
67. **Build Room arms a reusable room stamp.** The DM chooses dimensions, clicks Build Room, then clicks a grid square that becomes the room's outside wall corner. The stamp can grow in any of four grid directions, auto-flips to stay on the map, and remains active for rapid multiple-room placement until a normal block is selected.
68. **Room preview is explicit.** Gold outline/corner means the room fits; red means it would leave the board or exceed the vertical cap. One stamped room is one Undo/Redo action.
69. **Exact shared structural positions are reused.** Generated rooms do not create duplicate wall blocks at the same X/Z/elevation.
70. **Room stamps choose direction automatically.** From the clicked outside-wall corner, test all four grid directions, reject out-of-bounds directions, and prefer a valid direction with less existing construction overlap. The preview must show the exact chosen direction before click.
71. **Room stamp has an explicit cancel path.** While active, Build Room becomes Cancel Room; clicking it or pressing Escape exits room mode, removes the room preview, and restores the previously selected block.
72. **Catalog UI uses four kid-readable groups.** Build / Props / Characters / Monsters are tabs; do not expose the future full library as one giant inventory.
73. **Catalog rendering stays generic and cube-only.** Items are data: category, cube footprint, color, optional face art. Every board object renders from exact 5-ft cubes; do not create item-specific meshes or renderers.
74. **Visual cohesion is a release gate.** The board should read as one premium physical dungeon-toy set; mechanically correct but visually mismatched work does not pass a milestone.
75. **Open-source art is a parts shelf, not our identity.** KayKit/Kenney CC0 resources are vetted candidates, but only selectively imported after camera/style testing and provenance recording.
76. **Starter combatant art is bundled locally.** Initial hero/monster art is copied from pinned Iron Pit commit `24810df2a379b01a5dd63fa312dfd58426572efb`; no runtime hot-link.
77. **Perfect 5-ft cubes are the hard geometry invariant.** Props, doors, characters, monsters, and construction pieces differ by face art/state, not arbitrary mesh shape. Player/Small/Medium=1 cube; Large=2×2; Huge=3×3; Gargantuan=4×4, all as one logical entity.
78. **Board starts 30×30 and grows by side.** Building on an outer edge expands only that side by 10 squares; existing coordinates never move.
79. **Board hard cap is 100×100.** Width and depth independently stop at 100 squares as a Stage 1 safety limit.
80. **Board bounds are authoritative persisted state.** Renderer ground/grid geometry derives from state and does not own map size.
81. **Print Map bridges digital and physical play.** Print a derived top-down map at 1 physical inch per 5-ft square, tiled as 8×10-square Letter pages, using built-content bounds plus one-square padding.
82. **Browser bundle parity is a release gate.** Because the current Pages test can serve checked-in `web/` files, `web/` must be regenerated from `src/` before a browser-test checkpoint is considered complete. Source-green alone is insufficient.
83. **Pages browser modules are revision-stamped.** The checked-in browser module graph and CSS entry URLs carry a unique build revision so GitHub Pages/CDN/browser caches cannot keep serving an older module graph after a successful deployment.
84. **Ordinary block art is generated from catalog data.** Build/Prop cubes use one original face-card generator (color + pictogram + label) rather than custom mesh geometry or one-off image files. The generated art is painted on all six cube faces.
85. **Large catalogs stay searchable.** The four kid-readable tabs remain, with a simple category-aware Find a block field instead of adding more navigation complexity.
86. **All 12 2024 player classes are available as one-cube character blocks.** Their face art reuses the local Iron Pit 2024 class portraits.

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

The user directed the project to work on the full block catalog rather than keep a tiny prototype palette.

### Changes Made

- Added a first-party generated face-art system for ordinary Build/Prop cubes.
- Expanded the live catalog to **108 cube types**:
  - Build: 36
  - Props/Hazards/Outdoor: 51
  - Characters: 12
  - Monsters: 9 starter monsters
- Added all 12 2024 player classes using local Iron Pit portrait art.
- Added Orc silhouette art.
- Added category-aware **Find a block** search.
- Identity art now appears on all six cube faces.
- Added safe unknown-catalog fallback so scalable string IDs do not crash old/stale saves.
- Updated dependency/provenance, visual language, catalog contract, and browser bundle synchronization rules.
- Updated Sync Browser Bundle to react to relevant `src/**` and `public/**` changes without retriggering from generated `web/**` commits.
- Netlify remains untouched.

### Verification

Catalog source checkpoint:

- `a630d5789adcb9d677e1af283a855061aceeb9a3`

Strict follow-up corrections:

- safe catalog lookup: `b56464fbf372a7197c5ef6126118c71c96aa94fc`
- builder/panel/print/fallback/preview/renderer lookup corrections through `953b316d548150a032f7e26683681cf11ee4a97c`
- stale import cleanup: `3a6fd8f850b09b1cc599b8e07abbe77481989da3`

Generated browser bundle:

- `795c9e103194609791b87e21c85d71ec2217bd48`

Connected verification:

- Sync Browser Bundle #12: **SUCCESS**
- GitHub Pages build/deployment #45 on exact generated bundle: **SUCCESS**
- TypeScript: passed
- unit tests: passed
- Vite/static build: passed
- browser bundle regeneration/cache-bust: passed

Verified generated browser files contain:

- generated cube-face art
- Open Pit and expanded Build/Prop catalog
- all 12 classes
- Find a block search

### Decisions Made

**Ordinary object identity is generated face art, not custom geometry.**

A Barrel, Door, Pit, Table, Tree, Trap, etc. is always a cube. The catalog supplies color/icon/name data; one universal generator creates its face art.

**Catalog scale must not make the UI complicated.**

Keep Build / Props / Characters / Monsters plus search.

**Monster expansion now moves to a manifest, not manual additions.**

Iron Pit will be used as the source of truth for monster art identity and creature size. Multi-cube footprints must remain one logical entity.

### Cost Impact

None.

No new external package, service, hosted asset source, or production Netlify deployment.

### Result

The 108-type ordinary/player catalog checkpoint is green and live on the Pages test surface.

### Exact Next Step

1. Build an Iron Pit monster manifest instead of hand-entering creatures.
2. Map RAW size to cube footprint:
   - Tiny / Small / Medium = 1×1 board footprint under current contracts
   - Large = 2×2
   - Huge = 3×3
   - Gargantuan = 4×4
3. Implement one logical multi-cube creature renderer/occupancy path.
4. Add monster search without placing hundreds of buttons onscreen at once.
5. Preserve Iron Pit's exact creature/art identity mapping.


## 2026-10-07 — Cube-face refinement branch

- **Starting State:** 108 catalog entries (36 Build, 51 Props, 12 Characters, 9 Monsters) with one generic SVG face generator. Some prop icons were indistinguishable and long labels used fixed-size text.
- **Changes Made:** On `catalog-face-art-oct07`, added distinct Lantern versus Torch face art and proportional label sizing in `src/domain/faceArt.ts` and matching checked-in `web/domain/faceArt.js`. Added a regression test for icon distinction and long labels; documented the work in `docs/BLOCK_CATALOG.md`.
- **Decisions Made:** Preserve cubes, shared art logic, existing IDs, WorldObject state, and 1×1 footprints. Do not add large monsters or pretend missing assets exist without verified rendering and provenance.
- **Cost Impact:** Zero new packages, hosted services, or asset purchases. No Netlify deployment.
- **Result:** Source and browser bundle edits committed to a review branch. Build/test and browser appearance not yet verified in this execution environment; do not describe these edits as deployed or tested.
- **Open Questions / Blockers:** Source checkout/network unavailable in execution container; CI and browser validation are required before merge. The monster expansion needs asset inspection and multi-cube renderer certification.
- **Exact Next Step:** Run full repository check on this branch, inspect the actual barrel/chest/lantern/map visual at GitHub Pages test surface, merge only if green, then implement and certify coherent 2×2 large-monster cubes from existing art.


## 2026-10-07 follow-up — Tagged light-block glow

- **Starting State:** ordinary cubes used non-emissive textured materials.
- **Changes Made:** six existing catalog entries now carry `light-source` tag; universal Three.js cube material enables subtle warm emissive appearance for tagged blocks. Source and checked-in browser JavaScript updated together; catalog tags regression added.
- **Decisions Made:** purely visual glow, no dynamic point lights or real-time light/shadow calculations, no new mesh shapes and no effects engine.
- **Cost Impact:** zero dependencies or service costs; no production deployment.
- **Result:** committed to the existing draft PR branch; runtime/browser checks remain unverified.
- **Open Questions / Blockers:** confirm visual strength in actual browser, and run npm check before merge.
- **Exact Next Step:** validate this branch, then continue improving core Build and Props distinct face art before broadening creature footprints.


## 2026-10-07 — Distinct door and hazard art continuation

- **Starting State:** many specialized Build/Props blocks re-used identical generic icons despite different purposes.
- **Changes Made:** universal SVG icon vocabulary extended with open doorway, secret door, trapdoor, spikes, darts and mimic; catalog entries for five existing objects now reference distinct icons. Synced TypeScript and checked-in browser JavaScript. Added cube/identity regression.
- **Decisions Made:** retain existing IDs, cube footprints and universal renderer; no behavior engines or gameplay changes.
- **Cost Impact:** none; no dependencies or Netlify deploy.
- **Result:** changes committed to `catalog-face-art-oct07`; not verified in browser or automated tests.
- **Open Questions / Blockers:** pending npm check and visual check; 2×2 creature logic needs separate coordinated work.
- **Exact Next Step:** run check; fix any findings and validate browser visuals before merging PR #1, then proceed to monster footprint and approved art inventory.


## 2026-10-07 — Multi-cube domain foundation

- **Starting State:** each WorldObject renders as exactly one unit cube; no verified Ogre asset in DND Blocks; distinct icon/glow PR pending.
- **Changes Made:** added `cubeFootprint` pure domain function for 1×1 through 4×4 contiguous cells and regression coverage; documentation updated.
- **Decisions Made:** one logical creature must remain one WorldObject; multi-cube rendering must not duplicate creatures, and silhouettes need coherent subdivision instead of cloned faces.
- **Cost Impact:** no dependencies or deployment.
- **Result:** committed foundation; **not** a working large-monster renderer. npm/browser verification still pending because GitHub connector cannot invoke build and container cannot reach GitHub.
- **Open Questions / Blockers:** missing verified Ogre art; coherent tiling and pointer/removal behavior must be implemented next. Existing draft PR unmerged.
- **Exact Next Step:** check PR on a clone with `npm run check`, correct any regressions, implement mesh tiling and raycast as one creature, copy provenance-verified Ogre art, then manually verify Pages test preview before merging.


## 2026-10-07 — Multi-cube renderer progress

- **Starting State:** domain footprint model existed but renderer drew only one cube per WorldObject.
- **Changes Made:** generic `meshesFor` adapter now expands creature catalog footprint sizes into contiguous unit cubes in Three.js. Every mesh retains the same WorldObject ID for removing the logical creature. Both src and checked-in web modules updated. A mocked renderer unit test checks 2×2 cube positions and identity.
- **Decisions Made:** retain one logical WorldObject per monster, cube geometry, generic drawing path and no new dependencies.
- **Cost Impact:** zero. No Netlify deployment.
- **Result:** 2×2 mesh expansion committed to draft PR #1, tests/browser checks unverified. No Large monster was added to the palette.
- **Open Questions / Blockers:** individual subcubes currently repeat the full illustration instead of composing a single creature silhouette. Need coherent tiled art, creature footprint state/placement selection verification and verified Ogre asset.
- **Exact Next Step:** fix coherent multi-cube face textures, run `npm run check`, visually inspect 2×2 Ogre on Pages test deployment, and merge only after green checks.


## 2026-10-07 — Placement click defect report

- **Starting State:** user reports choosing a catalog block and clicking the map does nothing.
- **Changes Made:** Three.js placement ray now retries the visible ground mesh when invisible placement-plane raycasting misses; if no valid placement is found, a clear board-status message replaces silent failure. Authoritative source and checked-in browser module updated in the draft PR branch.
- **Decisions Made:** no changes to WorldObject, command pipeline, cube geometry, or room placement rules. This is a defensive fix and diagnostic; root cause has not been reproduced in a real browser.
- **Cost Impact:** zero new packages, services or deploys.
- **Result:** fix pushed to PR #1, not merged/deployed/tested. Current production and Pages may still contain old code.
- **Blockers:** run browser reproduction, validate palette click activates tool and hover ghost, inspect console and click status. Review CSS overlays and script caching if it persists.
- **Exact Next Step:** reproduce on Pages test, run npm check and compare served browser revision to source before merging/releasing.
