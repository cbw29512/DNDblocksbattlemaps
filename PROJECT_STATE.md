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


## 2026-10-07 — Placement hotfix (isolated)

- **Starting State:** User repeatedly reports that clicking the map after selecting any cube produces no visible block. Earlier defensive patches live only in unmerged catalog PR #1.
- **Changes Made:** In an independent branch based on main, empty-grid placement now uses direct Three.js camera-ray intersection with the selected elevation's mathematical plane. Removed dependency on an invisible placement mesh for the empty-grid hit. Added explicit invalid-click feedback and successful-place feedback. Updated authoritative TypeScript and checked-in web JavaScript together.
- **Decisions Made:** No catalog, monster, lighting, or schema changes. Preserve the command/state workflow. Do not assert browser success without real testing.
- **Cost Impact:** none; no dependencies or production deployment.
- **Result:** Isolated hotfix committed on `fix-placement-click-oct07`, verification pending; not live until merged and test site redeployed.
- **Open Questions / Blockers:** root cause not conclusively reproduced in a browser; check whether success feedback appears and object renders. GitHub Pages manual action still needed for public test.
- **Exact Next Step:** review and build-test this isolated PR, merge if green, dispatch Pages test deploy, reproduce Stone placement; if placement success is reported but cube invisible, inspect WebGL materials and camera rather than further modifying input.


## 2026-10-07 — Invisible cube material hotfix

- **Starting State:** User confirms clicks stack blocks, so placement state and mesh raycasting work, but cubes are visually invisible.
- **Changes Made:** On isolated branch `fix-invisible-cube-materials-oct07`, textured cube MeshStandardMaterial now uses opaque rendering with catalog base color instead of transparent mode; source TypeScript and checked-in browser JavaScript synchronized.
- **Decision:** Fix rendering, not placement; do not add more catalog items. Do not claim root-cause certainty without browser reproduction.
- **Cost Impact:** zero dependencies/services; no Netlify release.
- **Result:** code committed, pending live visual verification.
- **Exact Next Step:** run build checks; publish Pages test; place Stone and confirm visibly colored cubes and readable art. If still absent, inspect GPU shader/scene and browser errors rather than changing placement again.


## 2026-10-07 — Black cube texture hotfix

- **Starting State:** user confirms cubes now appear and stack, but all look black; placement itself works.
- **Changes Made:** renderer starts each cube material opaque with catalog color and attaches face texture only after the load-success callback. Failed loads preserve visible color; per-catalog materials share updates. Synchronized source and checked-in JS, added focused fallback test.
- **Decision:** fix material lifecycle only, no new blocks/placement rewrite; visual/browser verification still needed.
- **Cost Impact:** zero dependencies or hosting changes.
- **Result:** isolated black-material fix branch. Full npm/browser tests not yet run.
- **Next Step:** deploy tested Pages build and visually confirm Stone, Barrel, Fighter; if any stay black after load, inspect SVG GPU upload/texture format before adding features.


## 2026-10-08 — Black textured faces reproduced via user screenshot

- **Starting State:** screenshot shows black opaque placed cubes while catalog image previews are colored; placement and geometry render successfully.
- **Changes Made:** changed shared cube face texture loading to use browser Image → 256×256 Canvas 2D rasterization → Three.js CanvasTexture rather than uploading SVG data image directly. Keep solid catalog color until rasterization succeeds; failures stay colored and log warnings. Source + browser JS synchronized; unit test updated.
- **Decisions:** Rendering-only fix, no changes to placement, geometry or catalog. The screenshot demonstrates the previous renderer problem but does not yet verify this correction.
- **Cost:** no dependencies or hosting change.
- **Result:** isolated code fix pending browser certification.
- **Exact Next Step:** deploy current main to Pages test and verify Stone, Wood Floor, Barrel, hero cube each shows face art. Inspect Console if all remain dark.


## 2026-10-08 — Black cubes: stale browser bundle and unlit materials

- **User evidence:** repeated black cube faces; palette art loads and cubes place correctly.
- **Identified issue:** `index.html` and nested checked-in `web/` imports continued using cache query `b60b427fbe81` (the pre-rasterization renderer). A browser may therefore retain stale modules despite new backend commits.
- **Changes:** switched only catalog cube face material to unlit `MeshBasicMaterial`, avoiding light/shadow-related darkening; disabled receiveShadow on cubes. Updated the cached module import chain through index → main → builder → renderer → threeObjects to a new cache key. Kept previous image → canvas → texture loader and solid-color fallback. Updated test mock for MeshBasicMaterial.
- **Scope:** targeted rendering and cache invalidation; no placement, catalog, or room logic changed.
- **Verification:** changes committed; browser behavior not yet confirmed; deployment state must be checked. The static site build may regenerate version query strings.
- **Next:** verify exact deployed page source and that Wood Floor renders a recognizably brown cube with its face art; if not, inspect Console/WebGL errors and actual generated network module URLs rather than iterating blindly.


## 2026-10-08 — GitHub Pages test compiler failure

- **Observed:** manual `build-and-deploy` failed at `npm test`: 25 tests passed, test 26 failed with `ERR_MODULE_NOT_FOUND` for `.test-build/src/render/threeObjects.js`.
- **Cause:** `tsconfig.test.json` included only `src/domain/**/*.ts`, but the new rendering test directly imports `src/render/threeObjects.ts`.
- **Fix:** extend test compilation to `src/render/threeObjects.ts` and its browser asset URL helper. No runtime cube code changed.
- **Verification:** rerun GitHub Pages workflow; full test and visual deploy pending.


## 2026-10-08 — Wire existing Iron Pit character/monster art

- **Starting State:** Build/Props face art works, but 12 Characters and 9 Monsters refer to nonexistent `assets/catalog/heroes/` and `assets/catalog/monsters/` local paths in DND Blocks.
- **Evidence:** Iron Pit inventory explicitly identifies 12 2024 class portraits and matching named monster WebPs; fetched binary portrait files through GitHub API reached binary decoding failure rather than missing-file response (proof the paths exist). Exact variant identity remains important (2014 kobold vs 2024 kobold warrior; Orc art unregistered in runtime but processed).
- **Changes Made:** point hero/monster catalog image URLs at user's Iron Pit raw asset locations, set image.crossOrigin=anonymous for canvas painting, update tests for external paths and browser import cache versions, record dependency/source rights notes.
- **Decisions Made:** temporary remote image references for browser test, not a permanent mirrored asset strategy; no geometry, movement, or builder changes. No claim that user has granted third-party redistribution rights. Production should vendor only verified/licensed art.
- **Cost Impact:** no new package; one public network request per distinct art type; potential GitHub Raw availability dependency.
- **Result:** source/web changes committed to branch; CI and real-browser character/monster portrait display not yet verified.
- **Exact Next Step:** verify PR checks, merge and deploy Pages test; place Fighter, Goblin, Orc and confirm art appears (not flat colored cubes). If cross-origin fetch fails, copy verified WebPs through a binary-safe route and update paths.
