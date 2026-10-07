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

**Planning / architecture only. No application code yet.**

The current priority is defining the product, interaction model, state model, permissions, MVP boundary, cost constraints, and anti-drift rules before choosing a technology stack.

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

## Development rule

Documentation is part of implementation.

Every meaningful work session must start by reading the live project state and end by updating and pushing it to GitHub.

## MVP principle

The DM is the game engine.

The first release focuses on building, visibility, locking, player ownership, real-time movement, persistence, and simple interaction—not automated RPG rules.
