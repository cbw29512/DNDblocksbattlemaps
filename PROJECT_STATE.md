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
2. **Cheap first.** Initial hosting, persistence, assets, services, and infrastructure should use reliable free or near-free options whenever practical.
3. **No code yet.** Product, interaction, state, cost, and architecture decisions come first.
4. **Documentation is part of the work.** A task is not complete until this live state has been updated and pushed.
5. **Resume-first workflow.** Before making changes, read this file and the governing docs.
6. **One square = 5 feet.**
7. Small/Medium = 1x1, Large = 2x2, Huge = 3x3, Gargantuan = 4x4. Multi-square creatures remain one entity.
8. **Everything is data-driven.** Reuse universal object behaviors instead of object-specific engines.
9. **DM controls the world.** Players only control assigned pieces and allowed interactions.
10. **Blocks snap to the grid.**
11. **No ordinary object rotation is required.** Art should identify a block from all useful sides.
12. **Construction can be locked** to prevent accidental movement.
13. **DM-only/hidden objects** are required; the DM can reveal them.
14. **Prefab rooms are recipes for normal blocks**, not a separate runtime system.
15. Future prefab rooms should accept real-world dimensions such as 40x20 feet.
16. The board should have a simple BUILD mode and PLAY mode concept.
17. Rules automation, if ever added, remains optional. The DM must always be able to decide what happens.

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
- `SOUL.md` — permanent product philosophy and anti-drift rules.
- `README.md` — public project overview.
- `docs/DATA_SCHEMA.md` — conceptual state model.
- `docs/ROADMAP.md` — staged product plan.

Planned next documentation:

- `docs/INTERACTION_SPEC.md` — exact DM/player building and play interactions.
- `docs/BLOCK_CATALOG.md` — first block library and object defaults.
- Architecture/cost decision record after product interactions are stable.

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

The repository already contained:

- `SOUL.md`
- `README.md`
- `docs/DATA_SCHEMA.md`
- `docs/ROADMAP.md`

The project was intentionally documentation-only with no application code.

The user clarified that continuity is a hard requirement: another AI must be able to open the repository after a crash or new session and immediately determine what has happened, what was decided, and what to do next.

### Changes Made

- Added this root-level live project-state document.
- Defined a mandatory read-before-work and update-before-stop protocol.
- Formalized the cheap-first infrastructure rule.
- Defined the information every handoff must contain.
- Identified the next two planning documents: interaction specification and initial block catalog.

### Decisions Made

**Decision:** `PROJECT_STATE.md` is the canonical live resume document.

**Reason:** It gives a new AI or human one obvious entry point and prevents dependence on chat history or memory.

**Decision:** The live state must be checked at the beginning of every work session and updated/pushed at the end of every meaningful work session.

**Reason:** Documentation is part of implementation, not an afterthought.

**Decision:** GitHub remains the authoritative continuity source.

**Reason:** Chat sessions can end, crash, or lose context; repository state persists and is independently readable.

**Decision:** Initial development must optimize for the lowest practical cost.

**Reason:** The MVP should validate the product before creating recurring infrastructure expenses.

### Cost Impact

None. This change is documentation-only and introduces no new service, dependency, hosting, database, API, storage, or license cost.

### Result

The project now has a single canonical file designed specifically for crash recovery, AI handoff, and cross-session continuity.

No application code has been written.

### Open Questions / Blockers

No blocker prevents continued product design.

The product interaction contract still needs to be documented before any technology stack is selected.

### Exact Next Step

Create and agree on `docs/INTERACTION_SPEC.md` describing the simplest possible DM and player experience:

- BUILD vs PLAY
- selecting and placing blocks
- locking/unlocking
- moving pieces
- hiding/revealing
- deleting
- vertical placement
- basic door interaction
- undo/redo expectations
- player permissions

Do not write application code while doing this.
