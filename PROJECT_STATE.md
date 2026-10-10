# PROJECT_STATE.md

> **READ THIS FIRST.**
>
> This is the live handoff/resume document for DND Blocks Battle Maps.
> Any AI or human continuing this project must read this file, `SOUL.md`, and the current relevant design documents before making changes.
> This file must be updated and pushed to GitHub at the end of every meaningful work session.

## 2026-10-10 — User-authorized production UI test release
- User explicitly prefers testing in production, not separate preview branches. Publish only tested frontend room/catalog split, elevation positioning, flying-creature visibility and non-creature block hover to main; do not ship unfinished multiplayer/auth migrations from PR #89.
- Deployment to main authorized for this consolidated UI test. Inspect actual published result; GitHub CI on earlier PR passed; production integration still requires verification.

## 2026-10-10 — Production builder elevation placement correction
- User clarified Height/Elevation must be at the TOP of Catalog, not at the bottom.
- Moved persistent elevation controls immediately ABOVE the separate collapsible Catalog panel (after Room Builder) in source and compiled browser files; the height controls remain visible when Catalog is closed.
- Updated sidebar layout regression to require height before Catalog; changed browser cache query in index.html and web/main.js.
- Production main source was updated on user request; hosting deployment and browser QA remain unverified. No DM/player backend was shipped in this change.
- Next: verify automatic build/deploy and browser layout; ensure regression check passes.

## 2026-10-10 — Catalog-scoped Height/Elevation
- Corrected placement to be INSIDE the collapsible Catalog details, directly under the Catalog heading and before catalog entries. It is hidden when Catalog collapses. Room Builder remains separate.
- Updated src/app/builder.ts and web/app/builder.js, regression layout assertions, and browser import cache-bust on main at user's explicit production test preference.
- No multiplayer or server changes. Production hosting/render verification pending.
- Next: confirm CI and verify browser accordion hide/show plus +/- placement.

## 2026-10-10 — Hover label preview occlusion fix
- User screenshot showed Water label over a white-outlined placement preview on another block. Cause: hover raycast ignored ghost preview while detecting a placed block behind it.
- 3D hover now hides labels when the ray intersects the active placement ghost, while preserving normal names for genuinely hovered placed blocks. Source and compiled browser JS updated; regression assertion added.
- Production main updated on explicit user preference; browser observation and deploy status not yet verified. No multiplayer/backend changes.
- Next: verify GitHub checks and reproduce screenshot with Water underlying a different selected cube, confirm no false Water label.

## 2026-10-10 — Inspect Mode first implementation pushed to main
- User approved top-toolbar Inspect toggle (click on/off) separate from Build/Combat; Inspect is read-only and may be active in either.
- Added Inspect toolbar button, object details card, hover names only while inspecting, 3D and fallback selection paths; click inspection does not place, move, mark, cast, or remove blocks, and right click is guarded.
- Player-safe *starter* observations: no AC, HP, saves, resistances, attacks, or class/level displayed; mimic and secret-door labels are masked in Inspect as Old Chest / Stone Wall. This is not yet a role-authenticated DM/player information system: private DM notes, DM-controlled reveal workflows, and persisted custom descriptions are pending and must not be claimed complete.
- Browser JS and TS sources updated; new tests/inspect-mode.test.mjs added, CSS card styling and browser cache keys updated. Browser JavaScript modules passed standalone parse checks; exact-head CI, hosted deployment, and live interaction smoke test remain UNVERIFIED.
- Next: verify exact-head typecheck, Node regressions, browser smoke; then verify hosted top toolbar, toggle, card, secrets, placement safety on production. Batch fixes if needed.

## 2026-10-10 — Build/Combat/Inspect mode interactions on main
- Approved interactions implemented in TS source and checked-in browser JS: pointer drag from placed blocks (3D), HTML drag/drop (fallback); Build accepts all blocks, Combat only Characters and Monsters, Inspect disables drag, placement, removal, marking and menus.
- Right-click invokes a contextual menu rather than direct deletion: Build has Duplicate/Remove, plus door Open/Close, traps Trigger/Reset, lever/switch Activate/Reset; Combat shows only appropriate gameplay interactions. Door opening is stored on the object and marked OPEN over its 3D cube, without changing cube geometry.
- Creature movement across trigger squares marks matching trap objects activated and reports the trigger for DM adjudication; does NOT apply invented damage, saves, automation for hidden DM reveal, movement budget, or obstacle collision. Those and full role permissions remain future requirements.
- Added `tests/mode-interactions.test.mjs`; compiled JavaScript syntax checks pending final execution; full TS/Node/Chromium CI and live production verification NOT claimed.
- Browser cache query keys updated. User explicitly prefers direct main/production testing to development preview branches. Minimize unnecessary Netlify builds.
- Next: exact-head CI, live pointer drag and trap/door interaction acceptance test, refine movement trace and trap engine, validate mobile touch behavior.

## Locked Deployment and Credit Policy — 2026-10-09

**User decision: Netlify is production; avoid consuming Netlify build credits through frequent development pushes.**

1. Build DM login, player joining, backend persistence, permissions, reconnection, and the supporting frontend in a development branch. Validate as much as possible locally and in CI.
2. Use GitHub Pages for frontend/browser integration testing. A Pages deployment does **not** prove Netlify services work: mock or locally test backend dependencies and identify what still requires production validation.
3. **Do not trigger Netlify production deployments for ordinary GitHub pushes or intermediate PRs.** Before wiring any repo, confirm the actual Netlify site's Git auto-build and deploy settings; don't assume pushes are free or don't publish.
4. Netlify production should receive **one consolidated, intentionally authorized release candidate**, only after typechecks, unit tests, Playwright smoke tests, security/config review, and documented acceptance checks pass.
5. Test Netlify-specific authentication, functions, database, game-code joining, permissions, and reconnection together on that release. Fix issues locally and batch changes; deploy another build only if needed and after notifying the user.
6. Never claim an end-to-end authentication/backend test passed when only static GitHub Pages tests ran. Do not expose production credentials, change production Netlify settings, or initiate deployment without express release approval.
7. Record release gate status, deployed version, remaining blockers, and test results in PROJECT_STATE.md.

This policy supersedes any older wording implying that every push should publish to Netlify. GitHub source checkpoints and GitHub Pages tests may continue independently.

## 2026-10-09 — DM/Player implementation started (development only)
- Selected supported Netlify Identity for DM, secure guest player session for joining with game code, Netlify Functions and Database for authoritative game state. Read docs/DM_PLAYER_IMPLEMENTATION.md. Added typed game-code/name/role primitives and unit tests. These primitives are not a live authentication backend; no Netlify deployment or resource provisioning occurred. Next implement authenticated DM API and Postgres migration, then join/reconnect API and interface. Preserve locked release policy.\n\n## Current Status

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


## 2026-10-08 — Creature labels and team rings

- User requested names above Characters and Monsters, universal red rings under Monsters, and player-choice ring colors excluding red.
- Implemented billboarded name sprites and flat base rings as decoration children of each cube, preserving cube shape and underlying object identity.
- Player color selector supports blue, green, yellow, purple, orange and white. Color is saved on each newly placed character WorldObject; old characters default blue. Monsters are always rendered red, independent of stored ringColor.
- Build/Props receive neither label nor ring. Source and checked-in browser code both updated; CSS and persistence regression added.
- Pending: CI tests, GitHub Pages deployment and browser inspection; labels are catalog class/monster names rather than custom per-character names.

## 2026-10-08 — Drag-and-drop creature rings and D&D status markers

- **User request:** Drag one colored ring onto a character, bind the exclusive color and remove it from available choices; allow status rings on Characters and Monsters.
- **Contracts read:** current WorldObject, EditCommand/Undo, renderer + fallback handlers, catalog art/creature categories and source/web parity. Official 2014/2024 conditions checked before adding any status vocabulary.
- **Changes:** Six non-red player ring tokens with exclusive per-map assignment. Red reserved for Monsters. Character assignment/changes persisted per WorldObject; old duplicate ringColor values normalized on load; unused colors return to palette after reassignment/deletion/Undo. Fifteen official condition tokens can be dragged onto either creature category; repeat drop toggles non-Exhaustion, Exhaustion cycles 1–6 then 0. Up to four status rings shown with a status label. Domain update command is undoable; no separate marker objects. Source TS + browser JS and fallback rendering updated.
- **Scope/decision:** Display-only status tracking. No combat/RAW mechanical automation, no new runtime dependencies, no changes to Build/Props/cube geometry. Ordinary existing clicking still places cubes; ring dragging is separate.
- **Tests:** Added domain regressions for uniqueness/release, prohibited red, toggle, exhaustion progression, undo/redo, and old duplicate color migration. Full npm check and browser tests not yet run.
- **Cost:** No new dependencies or hosting costs.
- **Next:** Run `npm run check`, deploy Pages test build; place two Fighters + a Goblin, drag Blue to the first and Green to the second, confirm colors disappear from palette, Poisoned/Stunned markers can be added/removed on both creatures, and Undo/Redo plus reload preserve state. Verify other palette placement still works.

- **Follow-up design check:** applied an explicit reusable CONDITION_COLORS mapping for the 15 official condition tokens; the status ring color no longer depends on assignment order. Old saved duplicate colors normalize to exclusive assignments at builder startup; test coverage includes this case. No changes to combat mechanics.


## 2026-10-08 — Creature click-to-move

- **Starting State:** Characters/Monsters could be placed, named, assigned rings/statuses but not moved after placement; Build/Props must remain immobile by ordinary selection.
- **Changes Made:** Three.js and fallback renderer now detect clicks on existing Character/Monster cubes, arm a pick-up, and accept next map click as the destination; Escape cancels. Builder commits the move as a reversible single WorldObject `update`, retaining identity/ringColor/conditions/exhaustion. Build/Props continue existing placement behavior. Rendering contracts and checked-in browser JS synchronized, movement regression added.
- **Limitations:** This move retains existing elevation; DM-authoritative simple pick/place without pathfinding, obstacle rules, turn enforcement or realtime multiplayer. Browser check and CI pending.
- **Next:** Verify npm test and Pages deployment; click Fighter, click empty grid, check image/rings/conditions moved, Undo returns old location; click wall and ensure it does not arm a move.


## 2026-10-08 — Explicit Move Creatures mode

- User reported two-click creature movement is difficult, requested mode that ignores Build/Props scenery.
- Added toolbar Move Creatures toggle, excludes scenery meshes from selection raycast while move mode active, blocks ordinary placement, preserves one-creature Undo/Redo movement, and cancels movement when switching mode. Both 3D and fallback renderers updated with source/browser parity.
- Build/Props remain visible but are not selectable for movement; red monster rings, character rings and statuses stay attached.
- CI and actual browser usability pending; do not claim certified.


## 2026-10-08 — Build/Combat tool visibility; single shared active map

- User rule: Build Mode offers all blocks, props, characters, monsters, and status/identity rings. Combat Mode locks the scenery and exposes only status-ring tools. DM always retains control over every creature and status; a player may move/status only an owned character at any time.
- Implementation: rename Move Creatures UI toggle to Combat Mode/Build Mode; wrap Build/catalog and identity-ring sections and hide in Combat; keep status ring toolbox available in both modes. Existing creature movement and marker authority remain DM prototype. No credentials/player ownership, network sync or per-role view yet; do not imply those work.
- Campaign contract: **Never split the party**: exactly one DM-selected active map for all connected players. On map switch, clients follow DM automatically and player characters retain identities/ownership/colors/statuses; DM prep maps are private. Map Manager and multiplayer sync not implemented yet.
- Pending full CI and browser checks.


## 2026-10-08 — Monster CR filters and SRD expansion audit

- Current monster catalog has nine starter monsters, all represented as Medium-sized single 1x1 cubes; no valid Large/Huge footprint support in Three.js geometry or placement; don't claim larger creatures have been tried.
- Added 2014 edition and exact challengeRating metadata to the nine existing catalog entries, CR/edition selectors in Monsters tab, input change wiring, UI cache refresh, and metadata regression test.
- Known coverage: Iron Pit 2024 certification manifest enumerates 330 catalog monsters, 141 public-ready and 189 blocked as recorded in that manifest; these counts relate to Iron Pit engine readiness, not DND Blocks visual asset coverage. Art inventory records 294 approved silhouettes. Avoid assuming all monsters have images or mechanical certification.
- Required next slices: import source-backed full 2014 and 2024 SRD catalogs with CR/size/edition; map source artwork with fallbacks and provenance; build one logical multi-cube creature footprint based on grid squares; certify Large and Huge placement, movement, clicks and render before bulk catalog import; keep Gargantuan in the same generic primitive.
- CI/browser checks remain pending; this PR does not certify full SRD, large or huge creatures.


## 2026-10-08 — Campaign party across existing maps

- **User goal:** DM adds a Character, checks Party, and character automatically appears on all maps without duplication. One shared party, DM-controlled active map, preserved identity, colors, statuses and ownership when multiplayer arrives.
- **Implemented current local prototype:** Each Character gets a Party checkbox in Build Mode. Checked characters saved to one browser-local campaign roster by stable UUID and copied to the five existing theme maps (Castle, Inn, Field, Sea, Volcano), preserving per-map x/z/elevation. The same identity is mirrored in all map saves; status and ring changes update roster; unchecking/deleting releases party membership/copies without removing original. Added map tabs to switch among existing maps, and pure-domain regression tests.
- **Limits:** This is localStorage, not cloud/shared multiplayer and not arbitrary create-new-map infrastructure. Party checkbox belongs to DM-only prototype UI; no secure player ownership or auto-switch synchronization to other browsers. A robust map-manager/session backend and entry-marker placement are still planned.
- **Cost:** No new npm package, hosting or service costs. GitHub Pages build/browser CI not yet verified.


## 2026-10-08 — Canonical monster blocks, full cube volumes, silhouette panels

- **Priority:** Visual monster blocks; edition is metadata, not a user-facing decision. Imported 330 canonical SRD 5.2.1 monster entries sourced from Iron Pit's 328 base rows plus three correction rows (one replacement and two additions). Each has name, CR, size and a stable visual catalog ID. Inventory matching found artwork for 279; the other 51 use clearly visible generated cube-face art. Nine original starter monsters stay available.
- **Rendering architecture:** 5-foot **perfect cubes** throughout. Medium/Small/Tiny creatures use 1×1×1. Large: 2×2×2 solid cubes; Huge: 3×3×3; Gargantuan: 4×4×4. One WorldObject/one selection target per monster; every segment carries its parent object identity. Full portrait/silhouette visual spans five exterior panels with grid lines at cube seams, not repeated as a separate monster on each cube. Red ring and label attach to the whole assemblage.
- **Status:** source TypeScript and checked-in browser JS updated, browser cache chain changed. Catalog test asserts 330 unique monster blocks, CR/size/edition and footprints. Browser screenshot, tests and deployment **not yet verified**. This is block visualization, *not* Iron Pit mechanics.
- **Known followups:** placement and collision validation for full 3D footprint, pointer selection at various elevations, top face mapping, artwork failures and GPU performance, print/fallback multi-cube parity, art provenance audit and server multiplayer.


## 2026-10-08 — Emergency browser startup syntax repair

- User screenshot showed the GitHub Pages builder stuck indefinitely on the initial Loading the battle map screen after PR #17.
- Root cause isolated: checked-in `web/render/threeObjects.js` accidentally included TypeScript-only `: void` on `function monsterExterior(THREE, root, item, n): void`, preventing the entire browser module graph from parsing.
- Removed invalid annotation and bumped entrypoint/import cache keys. Syntax parsing checks on affected core browser modules passed. No changes to the monster roster or cube geometry.
- Browser deployment/reload and full npm gate remain unverified; the DM should hard-refresh after the Pages workflow publishes this fix.


## 2026-10-08 — Starter maps, safe copies, and clickable status rings
- Added eight editable block-built map templates: Roadside Inn, Castle Keep, Starter Dungeon, Forest Camp, Harbor Dock, Goblin Cave, Ancient Temple, Ruined Outpost.
- Each template is an array of actual approved 5-ft catalog cube IDs, with a stable generated map ID; a new map has its own saved object list and terrain. Existing five base maps are never overwritten by creating a template; independently created Inns have different IDs and storage keys.
- Inn includes floor, surrounding walls, room partitions, genuinely open doorways, bar/tables/chairs, kitchen/rooms, beds, hearth, stairs, storage, and party entrance marker. Party checked characters populate new copies at the entrance and retain their original IDs, colors, and statuses.
- Custom map list and map switching added to sidebar. Campaign Party propagation now loops over saved template maps too, not only five terrain maps. Clear Map targets the current map slot.
- Status ring UX fixed: click status button to select (visual highlight, aria-pressed), then click creatures to apply/remove; clicking selected status or Escape clears. Previous drag-and-drop remains available. Applies in both 3D and fallback through a common handler.
- A visible How to Play link and static public instructions page explain features and local browser storage limitations. Implementation rules updated to require instructions changes with user-facing features.
- Added domain regressions for all eight templates, Inn openings, no duplicate objects, Party entrance and identity preservation, multiple Inns and non-destructive base-map storage.
- **Validation:** GitHub connector used to edit; npm/TypeScript/browser tests **not executed locally** because execution environment cannot resolve github.com for checkout; do not report tests passed or deployment verified. PR review and Actions remain required.
- **Limits:** local browser prototype, not multiplayer. Templates are visual blocks; they do not instantiate D&D mechanics or automatically spawn enemies.

- **Area-prioritized catalogs (2026-10-08):** All Build/Props/Characters/Monsters catalog items remain accessible in their categories. For each open map, tags matching its area (Inn, Castle, Field, Sea, Volcano) or named starter template (Dungeon, Cave, Temple, Harbor, Forest, Ruins) come first, alphabetically; all other blocks remain below them alphabetically. No forced filter and no extra heading. Source/browser sorting helper, catalog panel, builder wiring, and regression tests updated. Browser/CI verification pending.

## 2026-10-08 — Multi-campaign architecture and migration plan (documented, NOT implemented)
- User approved: DM Campaign Manager → per-campaign Map Manager → independent My Map Library. Campaign characters/party/active map isolated per campaign; library originals copied into campaigns. Preserve 5 legacy maps and previously created custom maps.
- Full source-of-truth gates and explicit completion tracker: `docs/CAMPAIGN_MAP_LIBRARY_PLAN.md`. G0 legacy backup + idempotent Default Campaign migration; G1 campaign isolation; G2 Map Manager; G3 My Map Library; G4 browser certification and block material face improvements; G5 future server multiplayer.
- **Next concrete task:** G0a read-only legacy save inventory and versioned downloadable backup, with tests, then G0b migration. Do not write campaign records before validating backup/rollback and schema contracts. This is documentation, not a shipped feature.

## 2026-10-08 — Anti-drift governance documented
- `docs/ANTI_DRIFT.md` now defines source-of-truth precedence, locked 5-foot cube and isolated-campaign invariants, one-work-unit PR scope, non-destructive legacy migration, exact-head CI and live-verification distinction, named status vocabulary, and hourly checkpoint/report requirements.
- `SOUL.md`, `docs/IMPLEMENTATION_RULES.md`, and the campaign implementation plan reference the same mandatory process. No runtime behavior changed. Next implementation remains G0a legacy inventory + export backup.

\n## 2026-10-08 — G0a read-only browser backup (IN PROGRESS)\n- Added versioned read-only DND Blocks localStorage inventory and JSON export under `src/domain/browserBackup.ts` + checked-in JS, with Backup Maps in builder. Includes legacy terrain/custom-map/Party keys and malformed JSON verbatim; unrelated browser storage excluded.\n- Added tests for non-destructive export, duplicate/version rejection, corrupted data, empty saves. Migration/import/cloud remain unimplemented; G0 not complete. Exact-head CI pending.\n- Next: review PR CI, merge G0a if green, then G0b import preview and idempotent Default Campaign migration with rollback tests.\n
## 2026-10-08 — Combat area measurement foundation A0 (IN PROGRESS)
- User requested shared visible measured spell/monster AoE overlays and a combat log, with effect colors, explicit casting range and shared participant display eventually.
- Detailed phased source-of-truth: `docs/COMBAT_AREA_AND_LOG_PLAN.md`. A0 domain-only universal sphere/cone/line/cube/cylinder grid predicates + illustrative Fireball, Lightning Bolt and dragon breath presets, with unit tests. This is a **center-point geometry approximation**, not RAW overlap/cover or live visual effects.
- A1 clickable overlays, A2 combat log, A3 edition-checked spell/monster registry, A4 target intersection/RAW, A5 multiplayer remain NOT STARTED; do not call them completed. No map storage changes.
- Next A1 once A0 CI verified; G0b remains separate campaign migration work.

## 2026-10-08 — A1 initial voxel overlay + A2 cast announcement (IN PROGRESS)
- Wires AREA_PRESETS into editor via spell selector, caster input, Preview Area, touch-friendly Cast/Cancel controls. Renderer displays 50%-opacity whole 5-foot cube previews; fallback grid highlights affected cells. First character/monster in current map is provisional caster origin. Cast logs one announcement; Escape/right-click/Cancel produces no entry. Does not change persisted map or resolve dice/targets.
- **Not RAW certified**: preview uses A0 center-point inclusion, line of effect/partial squares/2014-vs-2024 spell dimensions not verified, Large+ footprint intersection not implemented. Log ephemeral per editor session. Browser/live verification pending; next focused gate enforce correct origin/geometry, proper fallback touch positioning and target highlights.

## 2026-10-08 — A4 partial multi-cube preview target intersection (IN PROGRESS)
- Added reusable `creatureOccupiedCells` and `previewAffectedCreatures` to match an entire 1/2/3/4-cube creature volume against whole affected 5-foot cells, returning each creature only once. Fireball preview status reports candidate creatures and confirmed-cast log records provisional counts. Tests exercise Large/Huge/Gargantuan intersection and ignoring scenery.
- **NOT RAW CERTIFIED:** uses provisional A0 center-cell AoE masks, no cover/line-of-effect, no edition-verified spell geometry, no save/damage rolls, no persistent log or target-outline visuals. Do not confuse candidate targets with actual hits. Next: exact-head CI, then renderer outlining and RAW inclusion certification.

## 2026-10-08 — A1 candidate creature cube outlines (IN PROGRESS)
- Adds renderer `setAreaTargets(ids)` to draw yellow visible edge outlines on each 5-foot cube of a provisional AoE-intersecting creature, including 2×2×2, 3×3×3 and 4×4×4 monsters. Fallback grid highlights their occupied cells. Preview changes refresh IDs; cancel/commit clears outlines. AoE is still provisional and not RAW-certified; no saves/damage and no persistent log.
- Exact-head CI and live browser validation pending. Next: certify RAW area-cell inclusion/edition-specific rules, then actual selected-caster origin and combat log persistence.

## 2026-10-08 — Explicit AoE caster selection (IN PROGRESS)
- Replaces guessed first-creature spell origin with required caster selection from characters/monsters on current board. Range and origin now use the chosen creature; cast announcement uses the selected creature name. Does not certify RAW area-cell rules. CI pending.

## 2026-10-08 — Fireball half-square grid coverage (IN PROGRESS)
- Replaced center-point inclusion for sphere AoE cube previews with deterministic circle/square area coverage >= 50% per horizontal slice. Regression: 20-foot-radius Fireball spans 52 squares at a grid intersection on ground-level slice (not a full 8×8 box). Reuses 5-foot full-cube rendering; no save mutations.
- 2014 DMG p.251 circular AoE and 2024 DMG Miniatures AoE half-square guidance recorded in `docs/COMBAT_AREA_AND_LOG_PLAN.md`. Height slices are provisional and true 3D volume, walls/cover/line of effect, cones/lines/cylinders, caster origin and total edition certification remain incomplete. Tests and browser checks pending.

## 2026-10-08 — Website How to Play grid-spell notice
- Added explicit guidance that AoE spells with a radius/sphere/cone display as full 5-foot squares/cubes on DND Blocks; RAW measurements, saves and damage remain unchanged. Linked this documentation requirement into the combat plan. Documentation-only; no renderer or rules change.

## 2026-10-08 — A3 initial edition-keyed ability registry (IN PROGRESS)
- New source and browser registry keys existing sample effects by `edition:source entity:action` for 2014 and 2024; every sample explicitly labeled `illustrative` and without source verification. Editor lists its edition and unverified label, resolving by stable key. This is *not* a verified 2014/2024 spell library and sample sizes are not certified. Tests ensure keys remain distinct and no sample passes RAW certification. Pending CI/browser QA.

## 2026-10-08 — Cardinal cube line preview checkpoint (IN PROGRESS)
- Updated the shared line inclusion predicate for horizontal one-square-wide cardinal rows: 60-foot sample = twelve whole 5-foot cubes; 100-foot existing Lightning Bolt sample = twenty. Both 3D rendering and candidate-target scans now take the caster's origin into account when computing bounds. Focused unit tests added; final-head CI/browser QA pending. Diagonal/vertical aiming and complete RAW line rules remain unverified.

## 2026-10-08 — Self-origin area contract implementation (IN PROGRESS)
- Explicit `originMode` distinguishes Self-starting line/cone samples from point-targeted AoEs. Self examples remain anchored to the selected caster, and pointer position supplies aim only; existing projected cardinal line geometry draws from caster. Focused unit tests added. Large caster footprint origin, unrestricted angles and certified RAW geometry remain future gates. CI/browser verification pending.

## 2026-10-08 — Self-range caster edge origin (IN PROGRESS)
- Scoped checkpoint: selected 2×2×2, 3×3×3, 4×4×4 caster self-line/cone origin moves to forward occupied cube along dominant cardinal aim; previews and target scans use the same placement. Tests written. Diagonal/3D RAW certification and actual browser verification pending.

## 2026-10-08 — Eight-direction grouped line preview (IN PROGRESS)
- Horizontal 5-foot line samples use cardinal + diagonal aim and physical Euclidean distances for diagonal steps; focused 60-foot cardinal-vs-diagonal tests. No smooth shapes or terrain mutation. Eight-direction raster is provisional; official RAW diagonal-area occupancy and 3D/cover rules still require independent certification and browser QA. CI pending.

## 2026-10-08 — Any-overlap 3D sphere checkpoint (IN PROGRESS)
- Latest user decision: preview geometry extends above/below floors, through walls and beyond visible map; full cube if any positive 3D overlap. This supersedes the earlier stop-at-walls preview interpretation. Spell effect/target adjudication remains independent and not claimed RAW; 2014/2024 total-cover mechanics must be kept distinguishable from the custom display policy.
- Updated TypeScript + web JavaScript sphere geometry to compare sphere and full cell volumes rather than 50% horizontal slices; added focused 3D/below-floor tests. Caller-provided areaCells limits and camera viewport may still clip displayed cubes; off-map/viewport rendering not yet complete. Other shapes not migrated. No live proof claimed.
- NEXT: inspect caller preview bounds and render policy so off-map/unseen cubes are preserved without allocating infinite meshes; certify tests and browser preview before merging.

## 2026-10-08 — Remove finite map/elevation preview clipping (IN PROGRESS)
- Builder target scan and Three.js 3D overlay bounds now extend to the template's finite geometric bounds regardless of map edges, floor zero or arbitrary elevation eight. Source and browser JS changed together. The 2D fallback intentionally displays only current viewport slice; it is not a complete volumetric viewer. No cover blocking occurs in the pure geometric preview. CI and interactive proof outstanding.

## 2026-10-08 — Fireball blank preview root-cause fix (IN PROGRESS)
- User reported selecting Fireball but no overlay appears. Traced event gate: renderer sends onAreaPoint only when activeArea is non-null, while Preview Area previously called setAreaPreview(null,null); no pointermove/click could reach choosePoint. Fixed source and browser JS by arming setAreaPreview(activeSpell,{origin:casterOrigin,center:casterOrigin}) on Preview Area, allowing pointer to update area. Cancel still sets null. Exact-head CI/live browser confirmation pending; do not label publicly validated until verified.

- Additional placement UX correction: clicking the target cell leaves Fireball preview visible for inspection; explicit Cast confirms it and Cancel clears it. This prevents the old click -> immediate cast -> clear sequence from appearing as though no spell rendered. Source and web JS updated together. Browser/live verification pending.

## 2026-10-08 — Fireball cast target visibility (IN PROGRESS)
- Root cause: Cast wrote a provisional creature count to combat log and called cancelArea, clearing the AoE and target outlines immediately. Changed builder Cast flow to retain affected-creature yellow outlines after removing transient red AoE, and to display the affected creature names in status and the existing log. Three.js target outlines no longer require a still-active AoE to render. The existing fallback outlines already support this condition. Target detection uses the current full-volume candidate intersection and remains PREVIEW-ONLY; no RAW saves, damage or actual hit adjudication. Verify exact-head tests and live browser before claiming corrected.

## 2026-10-08 — Fireball one-click casting (IN PROGRESS)
- User identified that map click must finish Fireball without requiring a separate Cast button. Changed choosePoint: pointer movement previews; left click/tap sets exact center and immediately calls castArea, keeping affected-creature outlines and combat log; right click/Escape/Cancel cancels without cast. Existing Cast control remains for pointer/touch accessibility. Source and checked-in browser JS updated together. Validate tests, CI and live browser. No damage/saves are automatically resolved.

## 2026-10-08 — Direct dropdown spell casting interaction
- User finalized UX: choose spell from dropdown => immediately arm area preview, mouse moves projected full-cube template, left click/tap casts at hovered cell, right click/Escape cancels. Removed separate Preview Area activation button. Caster remains necessary for origin/range; if exactly one creature exists it auto-selects, otherwise selecting caster arms the already-selected spell. A blank Choose a spell dropdown option prevents unintended default casting. Keep Cast/Cancel controls as accessibility fallback. Source and web JS aligned. Browser QA and CI still required; no dice/damage execution claimed.

## 2026-10-08 — Explicit area-hit names in combat log
- User wants a simple report of which creatures each spell hits. Updated cast log and status to say '<spell> hits (area): <creature name> [short ID], ...' or '<spell> hits no creatures.' Short IDs disambiguate multiple monsters of the same kind. The phrase means covered by the area, not a successful damage roll; saves/damage remain pending. Source and checked-in browser JS updated in parity. Await PR exact-head CI and deployment.

## 2026-10-08 — Combat-log sidebar declutter (PR pending)
- Moved the existing accessible combat log (same #combat-log target and live entries) out of the left tools palette into a collapsible board-side floating panel. Kept the 3D battlefield unobstructed when collapsed; phone/tablet panel constrained in size. Collapsed/expandable Spells & Areas controls in left panel; other tools remain unchanged. TS and checked-in browser JS plus CSS updated. Need CI and manual mobile visual QA before claiming layout certified.

## 2026-10-08 — Toolbar organization
- After combat log was moved to board-side panel (PR #48 merged), grouped Party, Maps & Themes, Starter Maps, Build & Blocks, and Creature Markers into native HTML details sections. Build & Blocks stays open by default; other groups start collapsed to reduce sidebar crowding. Kept existing element IDs/event listeners; source and browser JS parity; responsive CSS. Pending exact-head CI and manual desktop/touch usability check.

## 2026-10-08 — Close out post-cast markers and mobile confirmation (pending CI)
- On current main after sidebar/log consolidation, added Clear Markers to the collapsible Spells & Areas group: only the yellow affected-creature outlines clear, while objects and recorded combat log remain. Phone/tablet pointer click positions an AoE and requires explicit Cast; mouse left-click casts directly and right-click cancels. Added optional touch classification through Three and fallback rendering handlers. Corrected outdated Preview Area cancel instruction. Source and compiled browser JavaScript were changed in parity. Need exact-head CI and actual desktop/touch browser QA; damage and saving throws still out of scope.

## 2026-10-08 — Post-merge audit (PRs #48–#50) and repeat-cast fix
- Verified from GitHub: #48 combat log beside board, #49 left toolbar grouping, #50 touch confirmation and Clear Markers are merged with exact-head CI success. The old #45/#47 remain open but their intended controls are superseded by merged #50; do not reimplement duplicate branches. Identified: after Cast or Cancel, the ability dropdown retained the same choice and its `change` event would not retrigger on reselecting that same spell. Fixed reset to placeholder in both source TS and compiled browser JS. Remaining QA: phone/tablet actual touch testing, CSS log overlay occlusion, different creature footprints, same-name monster hit log, geometry versus RAW adjudication. No unsupported claim of live deployment or damage automation.

## 2026-10-08 — Touch spell action dock (pending CI)
- Audit revealed Cast/Cancel controls were inside a horizontally scrollable 170px mobile toolbar and could be out of reach while aiming on the board. Added a separate touch-width battlefield dock using the same castArea/cancelArea handlers, only shown while an area ability is armed and disabled for Cast until a valid target center is positioned. Desktop one-click remains unchanged. Updated TS, checked-in browser JS, and CSS. Remaining gates: exact-head CI, true phone/tablet pointer/browser checks, check button visibility across device widths and zoom. No saves/damage implemented.

## 2026-10-08 — Mobile spell dock post-merge audit and instruction fix
- Confirmed PR #52 exact-head CI succeeded and merged as `bc84cff504a50a2b47d181bde48dd313c5b4a3a5`. Verified versioned `index.html` CSS/main imports and `web/main.js`/builder imports reference the same 12-character revision token on current main, so there is no source-evident stale asset cache key. Mobile spell dock state is armed-only, Cast disabled until target placement, and hidden after Cast/Cancel in source. Found mouse-only instructions still displayed on phone/tablet; clarified both mouse and touch controls in source/browser JS. Still requires actual mouse/touch browser certification and viewport testing. Avoid claiming deployed website verified from repository state alone.

## 2026-10-08 — Spell cancel highlight cleanup
- PR #53 instruction correction passed exact-head CI and merged. Audit found cancelArea cleared the area cubes but not renderer areaTargetIds, leaving provisional yellow highlights after right-click/Escape/Cancel. Updated TypeScript and checked-in browser JS to clear provisional targets on cancellation without changing objects or combat log. Await current PR CI and interactive browser tests.

## 2026-10-08 — AoE friendly-fire regression
- Verified PR #54 succeeded and merged; cancellation clears projected red area and provisional yellow target highlights without mutating combat log/world state. Added domain regression that Fireball's geometric affected creature list includes the selected caster, an allied player, and an enemy monster, excludes scenery/out-of-area creatures, and counts a Large monster once. No saves/damage or RAW line-of-effect adjudication added. Focused test PR pending CI.

## 2026-10-08 — Mobile combat log visibility audit
- Verified PR #55 exact-head CI success and merge; friendly-fire and footprint regression tests now part of main. Identified mobile log overlay was open on every load and covered the right side of the usable map on <=720px devices. Keep the right-side log accessible via its summary but initialize it collapsed on phone-sized viewports. Leave desktop expanded by default. Source/browser JavaScript parity; real-device QA still outstanding. CI pending on this fix.

## 2026-10-08 — Pointer provenance touch safety
- PR #56 mobile combat log default collapse passed exact-head CI and merged. Audit found area casting inferred touch from `click.pointerType`, which may be absent on compatibility mouse clicks generated by touch. Updated Three.js and 2D fallback renderers to capture `pointerdown.pointerType` and use it on subsequent board click, with source/browser JS parity. This mitigates accidental auto-casting from touchscreen clicks. Current branch pending CI and actual touch-device testing; no claim that mobile UX is fully certified.

## 2026-10-08 — Rescoped building block face overhaul
- Older PR #58 diverged from main and its latest head did not expose passing CI; transferred the audited build/prop faceArt, catalog and lit/aspect-preserving cube renderer changes to a fresh current-main branch. Includes specialty terrain, doors, props and traps; does not modify character or monster artwork. Added coverage regression and material-mock change. Old PR #58 remains open pending safe closure once replacement validation succeeds. Current PR needs exact-head CI and browser visual QA; do not claim deployed or hand-painted art quality.

## 2026-10-08 — PR #59 exact-head CI correction
- First CI failed TypeScript TS2345: `catalog.ts` passes a general CatalogCategory to generatedCubeArt which accepted only Build/Props. Widened the optional parameter to string while keeping the conditional treatment exclusive to Build/Props; Characters and Monsters continue through their existing portrait/placeholder route. Await rerun on corrected head before merge. Do not treat procedural face decorations as final art acceptance without screenshot review.

## 2026-10-08 — Storage block face details
- PR #59 passed exact-head CI and merged: all Build and Props cubes use square face textures, with character/monster artwork untouched. Closed older #58 as superseded. Next incremental visual pass adds dedicated detailed barrel, crate and chest face compositions instead of common generic framed symbols. Each remains a perfect 5-ft cube, with updated source and browser JS. Requires exact-head CI and actual browser visual review before merge.

## 2026-10-08 — Placeable local light sources
- Previous storage-face PR #60 passed CI and merged. Implemented local point lights for torch, lantern, campfire, brazier, fireplace, forge and lava cubes in the Three.js arena; 12 maximum, no per-light shadows, deterministic closest-to-camera selection during board render. Removes light group on dispose; both source and web JS updated. No geometry change or character/monster art change. Note: fallback 2D intentionally does not simulate physical lighting; camera movements do not yet rebalance light source selection until board rerender; flicker not included in this initial pass. Exact-head CI and real-device visual/performance checks pending.

- PR #61 first CI failed TS2488 because strict indexed lookup of `lightSpecs` may be undefined. Guarded lookup before destructuring; rerun required. No feature broadening while validation is red.

## 2026-10-08 — Combat-only area controls
- PR #61 light emitting blocks passed exact-head CI and merged. Audited builder and found spell controls always visible in Build Mode. Changed TS/browser JS so spell selector panel is initially hidden, appears on Combat Mode, and is hidden again with targeting canceled when returning to Build Mode. Adds defensive guard against spell arming in Build Mode. Existing cast markers and log semantics unchanged beyond cancellation of active preview. CI pending.

## 2026-10-08 — Combat-only AoE PR #62 audit
- Exact-head CI initially passed, but manual source/browser parity inspection revealed invalid TypeScript generic syntax in checked-in `web/app/builder.js` (`querySelector<HTMLDetailsElement>`). Corrected it and added `node --check web/app/builder.js` to npm test so future copied TS syntax fails CI. Audited mode switch: area tool section is hidden initially, opened in Combat Mode, and canceled/hidden on return to Build Mode. Revalidate updated head before merge; browser acceptance remains pending.

## 2026-10-08 — Build Mode spell controls visibly leaking
- User screenshot from GitHub Pages clearly shows Spells & Areas in Build Mode despite PR #62 merged, CI green and HTML `hidden` attribute. Audited main's builder markup and identified probable CSS conflict: responsive sidebar rules set display:flex on `.builder-tool-group`, overriding UA default `[hidden]`. Added explicit `#combat-spells-panel[hidden] { display: none !important; }` to the CSS. CI and actual published-site refresh verification required; do not claim fixed on the live page until confirmed.

## 2026-10-08 — Live website audit and publication gap
- User screenshot showed `Spells & Areas` visibly rendered in Build Mode. PR #63 explicit `[hidden]` CSS rule passed CI and merged; main repository now has that rule. Confirmed published HTML entrypoint links for source CSS and module JS are versioned, but a browser-independent live-site check is blocked because the website could not be retrieved from this audit environment; not certified deployed. Added an explicit cache-key refresh to `index.html` so GitHub Pages receives new asset URLs when this patch publishes. Do not claim visual success based only on GitHub Actions; verify Build/Combat toggle against the actual published page in a browser. Browser-only remaining checks: desktop/touch AoE preview, arena controls, block textures, illuminated cubes, console errors, and responsive overlay occlusion.

## 2026-10-08 — Torch and lantern artwork upgrade
- User screenshot demonstrated torch cube looked like a sign instead of a torch. Added distinct detailed square artwork for torch and lantern blocks: stone backing, shaft/bands and illustrated flame on torch; framed glass and lit flame on lantern. All six faces remain cube textures; mesh shape unchanged. Existing local PointLight mechanics retained. PR #64 website cache refresh passed CI and merged. CI and published browser screenshot for this artwork still pending. Flame flicker not yet included.

## 2026-10-08 — Creature marker controls restricted to Combat Mode
- Hid Creature Markers section on initial Build Mode and toggled full section on Combat Mode entry/exit. Corrected child identity-ring-tools visibility in Combat Mode. Added specific hidden CSS to defeat sidebar flex override. TS/checked-in JS parity, no marker state erasure; awaiting CI and real UI validation.

## 2026-10-08 — Follow-up Creature Markers PR #66 audit
- Exact-head initial CI passed, but behavioral audit found an armed status selection persisted after returning to Build Mode. Fixed by clearing the transient status selection and visual pressed state on exit. Added `moveMode` guards to condition click and marker drag/drop handlers to prevent Build Mode mutations through hidden controls. Existing condition/ring data stays intact; browser JS parity updated. New CI required before merge.

## 2026-10-08 — Homepage conversion and visual preview
- Removed duplicate header Build a Map button (hero CTA remains), replaced duplicate bottom Build button with a link to terrain choices, added optional Buy Me a Coffee support link based on existing verified portfolio URL https://buymeacoffee.com/divclass016. Replaced abstract floating cubes / O and H placeholder preview with a recognizable SVG medieval inn showing an assembled structure (roof, walls, doors, windows, stone foundation) in a block-built style. Desktop/mobile sizing and asset cache refresh included. No art or source on the actual editable battlefield touched. Browser acceptance pending.

## 2026-10-09 — Reject inaccurate homepage inn artwork
- User reviewed the illustrated medieval inn and rejected it because slopes/structure do not accurately depict actual perfect-cube construction. Removed the invented illustration entirely; replaced with honest product features and direct functional launch into the real editor. An authentic screenshot of a user-built, 5-foot-cube-only room remains a separate acceptance task and must only be added after capturing it from the actual application. CSS responsive and cache version updated.

## 2026-10-09 — Actual screenshot homepage hero
- Replaced temporary feature panel with user-supplied screenshot of a real dungeon built in editor, cropped to omit the Combat Log and major empty space, optimized and bundled as SVG-embedded WebP (`assets/home-dungeon.svg`) to preserve pixel content in a text-commit-capable GitHub workflow. Updated header copy to describe 5-foot cubes and Build/Combat mode. Maintains CTA and BMC link, source/JS parity, responsive styling, and cache-busting. Note screenshot is compressed for page weight and remains subject to user visual acceptance after deploy.

## 2026-10-09 — Homepage duplicate-content cleanup
- Removed duplicated hero Join a Game button (kept header Join), redundant final terrain CTA (kept functional terrain cards), and stale style rules from unused illustrated mockups. Kept main Build a Map hero CTA, BMC header link, actual dungeon screenshot, terrain cards, and how-it-works section. Source and checked-in browser JS matched. Requires exact-head CI and deployed visual review.

## 2026-10-09 — Compact homepage footer
- Added a restrained footer with brand/tagline, Home, Choose Terrain, repository GitHub and verified Buy Me a Coffee URLs, and 2026 attribution. No additional oversized primary CTA. Responsive wrapping, keyboard hover/focus styling, TS/JS parity and new asset cache key. PR #69 homepage duplicate cleanup passed exact-head CI and merged before this branch.

## 2026-10-09 — Broken published homepage layout
- User screenshot showed narrow near-one-word-per-line headline and blurry screenshot. Corrected desktop hero grid with constrained `minmax(0,...)` tracks, explicitly min-width:0 for both children, reduced responsive headline size, gave screenshot full allocated width. Asset remains a severely downsampled screenshot (`assets/home-dungeon.svg` with a small embedded WebP) and requires separate replacement using full source bytes. New CSS cache key; verify the published page in desktop and mobile screenshots; do not claim image sharpness fixed by CSS.

## 2026-10-09 — Root cause of broken desktop/phone homepage layout
- Found a missing closing `}` in `src/styles/home.css` on the `@media (max-width:620px)` line. This improperly nested every subsequent rule (including `@media(min-width:901px)` desktop hero grid) under the mobile query; browser silently ignored desktop sizing, causing narrow headline. Closed the brace, added two CI regression tests for CSS brace balance and proper top-level desktop hero query, and bumped index CSS/JS cache key. This corrects responsive stylesheet structure; very low-resolution `assets/home-dungeon.svg` embedded screenshot remains a separate unresolved issue. Must verify the published page on desktop and phone before claiming visual acceptance.

## 2026-10-09 — How to Play 404 / publishing gate
- User reported builder's How to Play button returns 404 on GitHub Pages. Verified source link `./how-to-play.html` and source document `public/how-to-play.html` both exist. Pages publishes `dist` using a workflow that previously ran only on manual dispatch; changed it to auto-publish when site files are merged to main, retained manual run, and added a required check that `dist/how-to-play.html` exists and contains How to Play before deploy. Live site route requires verification after first deploy; do not claim verified from CI alone.

## 2026-10-09 — Homepage How to Play
- Added a secondary How to Play link directly beside Build a Map in the homepage hero, pointing to the shared `./how-to-play.html` help route. Main source and checked-in browser JS parity. PR #73 added a Pages deployment check for the help route and was merged before this change; live route still requires verification.

## 2026-10-09 — Cross-page visual consistency
- PR #74 (homepage How to Play) exact-head CI succeeded and merged. Compared homepage, How to Play and builder. Help page used independent colors, header and button/link styles; aligned shared dark/gold theme, brand mark, accessible navigation, responsive spacing and 44px tappable primary action. Help page stays a self-contained static HTML file because Vite does not guarantee `src/styles/base.css` on the copied static route. Corrected outdated prose placing identity rings in Build Mode; Creature Markers and Spells & Areas are Combat Mode only. Builder retains its deliberately dense workspace toolbar. Live browser desktop/tablet/phone verification remains pending.

## 2026-10-09 — Installed Castle, Inn, Field, Sea, Volcano terrain illustrations
- Homepage card placeholders replaced with distinct generated marketing artwork for all five themes. Optimized to 256×144 WebP, embedded inside SVG wrapper assets and published from `public/assets/terrain-*.svg` to ensure Vite copies them to GitHub Pages. Cards stay clickable, have responsive 16:9 image crops, keyboard focus and reduced-motion controls. Artwork illustrates terrain types, not literal screenshots of what the current editor can produce. Source/checked-in browser JS parity preserved. Reapplied on current main to avoid conflict with simultaneous updates; await exact-head CI and live browser verification.

## 2026-10-09 — Homepage rendered unstyled after terrain cards merge
- User's published screenshot shows all homepage CSS missing, with browser-default links/buttons and terrain art in white cards. Corrected build contract: CSS is now imported through the actual Vite module entrypoint `web/main.js` (and `src/main.ts` source parity), making it part of the bundled build; removed fragile direct `src/styles/*.css?v=` HTML links. Pages deployment now explicitly fails if `dist/index.html` lacks a generated CSS asset or if no nonempty CSS artifact exists. Await exact-head CI and deployed browser visual validation; actual 404 source remains unconfirmed because live page inaccessible from audit tools.

## 2026-10-09 — Campfire not visibly lighting the terrain
- Screenshot shows placed campfire cube with no discernible light around it. Raised campfire warm point-light intensity/range and added a soft transparent orange radial pool on the base ground grid, avoiding dependence on high ambient sunlight obscuring point-light shading. Glow geometry is a noninteractive flat visual effect only, not a building block; it never intercepts raycasts, and is disposed on redraw/reset. Existing cube-only catalog/building unchanged. Source/checked-in browser JS parity. Visual verification in deployed 3D renderer required, especially the campfire and nearby lit raised floors.

## 2026-10-09 — Homepage hero image 404 fix
- User screenshot confirmed broken real dungeon image while terrain previews loaded. Root cause: homepage referenced `./assets/home-dungeon.svg` but asset existed only in repository-root `assets/`, not `public/assets/` and hence not copied to `dist/assets/` during Vite publish. Copied existing hero asset into `public/assets/`; added Pages deployment checks for hero and all terrain image files. Existing screenshot is low-quality due to previous overcompression and still needs separate resolution improvement. Require live deployed check after merging.

## 2026-10-09 — Broken terrain thumbnails
- Screenshot showed five broken image icons while CSS layout rendered normally. Each terrain used a stand-alone SVG wrapper around a minified base64 WebP. To avoid image decoding/serving issues, extracted the original WebP bytes and embedded them directly as `data:image/webp;base64,...` source URLs in the homepage TS and browser JS; this avoids external asset paths and SVG nested raster decoding. Cards remain functional, no art changes, not real-game screenshots. Pending exact-head CI and live verification. Note: hero still blurry pending high-res replacement.

## 2026-10-09 — Replace blurry homepage room preview
- Removed the unreadable compressed dungeon screenshot from homepage hero. Replaced with a crisp CSS/HTML illustrative block-combat concept showing four one-cube party members (Barbarian, Fighter, Mage, Cleric) opposite a larger dragon monster block on a square cave grid. This is explicitly a conceptual visual rather than a real-editor screenshot; no image asset requests or fake in-game captures. Kept real terrain choices below and existing Build/How to Play actions. Includes mobile sizing and accessibility label; actual editor monster art and behavior untouched. Await exact-head CI plus browser QA before claiming deployed visual acceptance.

## 2026-10-09 — How to Play persistent 404
- User still receives 404 at `./how-to-play.html` despite the existing public source and previous build checks. Added an identical root-level `how-to-play.html` alongside `public/how-to-play.html` so both branch-root and dist-based GitHub Pages publishing include the help route. Pages workflow now watches root help file edits and checks root/public parity plus dist output. Links remain consistent. Need confirm live Pages deployment source and direct HTTP 200 after publish; previous live endpoint inaccessible from web checker.

## 2026-10-09 — SEO, accessibility and performance baseline
- Home and How to Play now have accurate page-specific titles, descriptions, canonicals, OG metadata, and the homepage Twitter summary card. Added public robots.txt and sitemap.xml for homepage and guide only (not transient ?view=build/join states). Added visible keyboard skip link and main target on Home, Build, Join and Help; reduced-motion overrides. Help root/public parity preserved. Added CI regression tests. This is a baseline improvement, not a WCAG AA or 100 Lighthouse certification; full browser keyboard, screen reader, contrast, performance and responsive audits remain necessary.

## 2026-10-09 — Browser-level release gate
- Added a visible startup failure message with reload action for route initialization exceptions instead of indefinite Loading. Added Playwright Chromium smoke checks in both PR and Pages workflow: mobile 390px and desktop 1366px homepage, five decoded terrain images, no horizontal overflow, navigation into builder, Combat-only spell panel hidden during Build, zero page errors, and direct How to Play 200. Browser smoke runs against the production Vite build in preview server. This gates deploy rather than relying on typecheck/build alone. Remaining: test actual GitHub Pages URL after deployment, separate renderer/light performance profiling, licensing provenance and broader keyboard/screen-reader review.
