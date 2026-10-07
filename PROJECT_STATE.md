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

Stage 0 was substantially complete with no application code.

Netlify had been selected as the frontend host. The user clarified two additional product/release requirements:

- the user already has a paid/Plus Netlify plan, but unnecessary deploys should still be avoided
- all normal testing should be local and Netlify should receive only locally tested milestone releases
- the project needs a polished public website that looks excellent, is extremely easy to use, and is designed to attract people who will actually use the product

### Research

Reviewed current VTT public positioning and onboarding patterns.

- Owlbear Rodeo explicitly emphasizes browser use, intuitive battle-map experience, and a player flow where players can open the GM link and join.
- Roll20's current homepage puts a strong start/account CTA above the fold and explicitly markets no-download browser play, but also illustrates the feature-density direction this project intends to avoid.
- Foundry VTT emphasizes a powerful, feature-rich platform and self-hosted control, reinforcing the opportunity for DND Blocks Battle Maps to differentiate through simplicity and immediate use.
- TaleSpire quickly explains the core digital-tabletop promise and lets the product visual carry much of the message.

### Changes Made

- Created `docs/WEBSITE_EXPERIENCE.md`.
- Defined the public website as part of the product rather than a separate marketing brochure.
- Defined the homepage primary actions as **Build a Map** and **Join a Game**.
- Defined immediate terrain quick-start cards such as Castle, Inn, Field, Sea, and Volcano.
- Defined a recommended low-friction guest/temporary builder path, with durable DM sign-in required for Save/Share/persistent games.
- Defined initial routes: `/`, `/build`, `/join`, `/game/:code`, `/maps`, and `/login`.
- Defined the marketing site and application as one Vite project/repository for simplicity and deployment efficiency.
- Defined the homepage structure, visual direction, accessibility, performance, mobile, SEO/shareability, and trust requirements.
- Updated `SOUL.md` so the public website and local-first Netlify deployment policy are permanent project rules.
- Updated ADR-001 and the Dependency Register to stop assuming a Netlify Free plan; the user reports a paid/Plus plan and exact account-specific limits will be read from the Netlify dashboard when deployment begins.
- Updated `docs/ROADMAP.md` and `docs/PRE_IMPLEMENTATION_CHECKLIST.md` so the public website/quick-start experience is part of Stage 1.
- Updated README with the website contract.

### Decisions Made

**Decision:** The public website is part of the actual product experience.

**Reason:** The goal is not merely to host an editor; people must arrive, understand it, trust it, and immediately know how to start building or join a game.

**Decision:** Above-the-fold primary actions are **Build a Map** and **Join a Game**.

**Reason:** These are the two user intents that matter most and should not be hidden behind feature pages or navigation.

**Decision:** The homepage uses an immediate terrain quick-start.

**Reason:** Asking "What terrain do you want?" converts the product explanation directly into the first useful action.

**Decision:** A visitor should be able to try the builder with minimal friction before durable sign-in; Save/Share/persistent game ownership requires the durable DM identity.

**Reason:** This preserves the authenticated persistence model while reducing acquisition friction.

**Decision:** Website and application remain one Vite project/repository.

**Reason:** One deployment, one visual system, shared assets, less drift, and fewer moving parts align with the cheap/simple architecture.

**Decision:** Normal development/testing happens locally.

**Reason:** Local testing is faster, cheaper, and prevents production hosting from becoming the test environment.

**Decision:** Netlify production deploys are milestone releases only.

**Reason:** Even with the user's paid/Plus plan, unnecessary deploys create noise and consumption without improving the product.

**Decision:** GitHub pushes remain meaningful source checkpoints and do not automatically imply a Netlify production release.

**Reason:** Source continuity and public releases serve different purposes.

### Cost Impact

No new cost incurred.

The user reports an existing paid/Plus Netlify plan.

Because Netlify has changed public plan names/pricing and older accounts can retain legacy plans, exact account-specific limits/costs are intentionally **not guessed**. They should be read from the user's Netlify dashboard when the project is configured.

The local-first/milestone-deploy policy reduces unnecessary hosting/build usage regardless of plan.

### Result

The Stage 1 product boundary now includes both:

> **a polished public front door that gets people into the product quickly**

and

> **the single-user 3D block builder itself.**

The intended homepage flow is:

> Understand product -> Build a Map / Join a Game -> choose terrain -> see/use the actual board.

No application code has been written.

No npm/application dependencies have been installed.

### Remaining Implementation-Time Decisions

These are not product-design blockers:

1. exact package versions and transitive license notices
2. exact Supabase auth/session implementation details
3. exact original/CC0 placeholder asset production pipeline
4. final brand/logo/color/type choices during visual implementation
5. numeric bounded Undo/Redo retention after testing
6. exact Netlify project/site configuration and account-specific limits when deployment begins
7. performance tuning based on real browser/device tests

### Exact Next Step

The project remains at the explicit coding gate.

When the user explicitly directs Stage 1 implementation:

1. reread the live contracts, ADR, implementation rules, website experience, and Stage 1 checklist
2. recheck exact dependency versions/licenses and update the dependency register
3. build/test locally only
4. start with the smallest website-to-builder vertical slice: public hero/terrain quick-start -> real 5-foot grid -> fixed-angle camera -> placement ghost -> place one block
5. do not deploy to Netlify until that slice is locally tested and worth reviewing live
6. update/push the live handoff before stopping
