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

The project remained in Stage 0 with no application code.

Minecraft/open-source reuse boundaries were already documented. The user then explicitly required that the eventual technology stack be web-friendly and that the project reuse open-source/free solutions wherever practical to simplify development and keep costs low.

### Changes Made

- Read the live project state, SOUL, open-source reuse policy, and roadmap before making changes.
- Researched current web-friendly open-source/free candidates and current hosted free-tier limits.
- Created `docs/TECH_STACK_CANDIDATES.md`.
- Added the permanent web-first/reuse-first architecture rule to `SOUL.md`.
- Updated the open-source reuse policy to prefer the smallest browser architecture.
- Linked the technology-candidate document from README.
- Documented a current $0/month MVP candidate architecture without adopting any dependency.

### Decisions Made

**Decision:** The technology stack must be web-first.

**Reason:** DM and players should open a browser and use the product without installing a game client.

**Decision:** Reuse mature open-source/free components whenever they reduce code and complexity.

**Reason:** Custom code should be reserved for the product-specific battle-map experience, not commodity infrastructure.

**Decision:** Do not assume a custom FastAPI/Node backend is required for MVP.

**Reason:** A static browser app plus a hosted open-source backend/realtime service may provide persistence, auth, and multiplayer at lower cost and with fewer failure surfaces.

**Decision:** Current leading candidate shape is TypeScript + Vite + Three.js, with Babylon.js as the rendering alternative, Supabase Free as the leading persistence/auth/realtime candidate, and Cloudflare Pages as the leading static host.

**Reason:** These are browser-focused, broadly open-source/permissively licensed, and can plausibly support an early prototype at $0/month within current free-tier limits.

**Decision:** GitHub Pages is not the planned production host.

**Reason:** GitHub's current Pages documentation says it is not intended/allowed as free hosting for an online business or SaaS product.

**Decision:** Do not add Yjs/CRDT, Docker, a UI framework, or a custom backend until a concrete requirement proves they simplify the product.

**Reason:** Each would otherwise add architecture before the need exists.

### Cost Impact

No cost incurred and no dependency adopted.

Current researched free-tier candidate:

- Cloudflare Pages static assets: free/unlimited under current Pages pricing
- Supabase Free: $0 with current quotas including 500 MB database, 5 GB egress, 1 GB file storage, 50,000 MAU, and 2 million Realtime messages/month
- Vite/Three.js/TypeScript: open-source toolchain

Potential early infrastructure cost remains **$0/month** if usage stays within current free tiers.

### Result

The project now has a documented web-first technology strategy and concrete low-cost candidates.

No technology is final yet.

No application code has been written.

### Open Questions / Blockers

1. Room spatial contract remains unresolved.
2. Exact camera/view model remains unresolved.
3. Three.js vs Babylon.js remains to be compared against the finished interaction requirements.
4. Supabase vs another persistence/realtime approach remains to be validated after the data/permission model is finalized.
5. Exact asset/art production approach remains open.

### Exact Next Step

Stay in design mode.

Resolve the room spatial contract and remaining interaction rules first.

After those requirements are stable, perform a small written architecture decision comparing the minimum viable stack, with **reuse, browser compatibility, license safety, $0 starting cost, and low code volume** as explicit scoring criteria.

Do not write application code yet.
