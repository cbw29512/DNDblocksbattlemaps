# DND Blocks Battle Maps

A simple browser-based battle-map builder and multiplayer virtual tabletop built from grid-snapped blocks.

## Resume here

**Anyone continuing this project should read [PROJECT_STATE.md](PROJECT_STATE.md) first.**

It is the canonical live handoff document and records the current state, decisions, cost constraints, unresolved questions, and exact next step.

## Core idea

The DM selects a block and places it on a 5-foot grid.

Grass is a grass block.  
Stone is a stone block.  
A door is a door block.  
A torch is a torch block.  
An orc is an orc block.  
A Large creature is one entity with a multi-square footprint.

The goal is to make encounter setup feel like placing physical magnetic terrain on a tabletop.

## Status

**Stage 1 prototype underway. The first website-to-builder vertical slice is implemented; browser interaction testing is pending on the manual GitHub Pages test surface.**

The product contracts remain authoritative. Stage 1 began only after the user explicitly authorized implementation. Netlify remains the production host; GitHub Pages is test-only.

## Project contracts

- [PROJECT_STATE.md](PROJECT_STATE.md) — live resume/handoff state; read first
- [SOUL.md](SOUL.md) — product philosophy, cost discipline, and anti-drift rules
- [Data Schema](docs/DATA_SCHEMA.md) — conceptual world/state model
- [Roadmap](docs/ROADMAP.md) — staged product plan
- [Interaction Spec](docs/INTERACTION_SPEC.md) — kid-simple DM/player UI and room interaction contract
- [Block Catalog](docs/BLOCK_CATALOG.md) — initial terrain, room-object, creature, and behavior catalog
- [Competitor Research](docs/COMPETITOR_RESEARCH.md) — voxel/3D VTT landscape and differentiation
- [Open-Source Reuse](docs/OPEN_SOURCE_REUSE.md) — Minecraft reference policy, license gate, and reusable engine candidates
- [Technology Stack Candidates](docs/TECH_STACK_CANDIDATES.md) — web-first, open-source-first, low-cost architecture options
- [Spatial Contract](docs/SPATIAL_CONTRACT.md) — authoritative room dimensions, wall/door placement, occupancy, and room-lock rules
- [Camera Contract](docs/CAMERA_CONTRACT.md) — fixed tabletop angle, orbit, pan, zoom, and view-recovery rules
- [Traps & Effects](docs/TRAPS_AND_EFFECTS.md) — universal trigger/effect, hazard, overlap, and transforming-object contract
- [Placement Contract](docs/PLACEMENT_CONTRACT.md) — select-once/place-many, stacking, elevation, overlap selection, moving, and undo rules
- [Player Join Contract](docs/PLAYER_JOIN_CONTRACT.md) — player entry, identity, assignment, movement, interaction, override, and Tiny creature rules
- [Persistence & Recovery](docs/PERSISTENCE_UNDO_CONTRACT.md) — autosave, Undo/Redo, revisions, deduplication, crash recovery, and reconnect rules
- [Visual Language](docs/VISUAL_LANGUAGE.md) — original block style, placement/hidden/ownership/lock/Tiny visual feedback
- [Website Experience](docs/WEBSITE_EXPERIENCE.md) — public landing, quick-start, conversion, mobile, SEO, and Netlify release contract
- [MVP Stack ADR](docs/ADR_001_MVP_WEB_STACK.md) — accepted TypeScript/Vite/Three.js/Supabase/Netlify architecture
- [Dependency Register](docs/DEPENDENCY_REGISTER.md) — required dependency/license/provenance ledger before third-party imports
- [Implementation Rules](docs/IMPLEMENTATION_RULES.md) — mandatory state-first, testable, anti-drift coding rules
- [Pre-Implementation Checklist](docs/PRE_IMPLEMENTATION_CHECKLIST.md) — Stage 0 closure gate and Stage 1 Definition of Done

## Development rule

Documentation is part of implementation.

Every meaningful work session must start by reading the live project state and end by updating and pushing it to GitHub.

## MVP principle

The DM is the game engine.

The first release focuses on building, visibility, locking, player ownership, real-time movement, persistence, and simple interaction—not automated RPG rules.


## Local Stage 1 prototype

The first slice currently includes:

- polished public homepage
- Build a Map / Join a Game entry points
- Castle / Inn / Field / Sea / Volcano quick-start
- 20×20 five-foot grid
- fixed-angle Three.js camera with orbit/zoom/reset controls
- block palette and persistent selection
- placement ghost and click-to-place
- intentional overlap
- right-click remove
- elevation control
- place/remove Undo/Redo
- browser-local prototype autosave

Normal network-connected development commands:

```bash
npm install
npm run check
npm run dev
```

The current execution sandbox cannot access npm or navigate a browser to localhost, so source compilation and domain tests were run locally there, while the manual GitHub Pages test is used for real browser interaction verification.

## GitHub Pages test

GitHub Pages is a temporary static **test surface only**. Netlify remains production.

The workflow `.github/workflows/pages-test.yml` runs only when manually dispatched; normal pushes do not publish the test site.

One-time repository setup before the first test:

1. GitHub repository **Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Open **Actions → Deploy GitHub Pages Test**
4. Choose **Run workflow**

Do not connect production user data or treat Pages as the commercial host.
