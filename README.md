# DND Blocks Battle Maps

A simple browser-based battle-map builder and multiplayer virtual tabletop built from grid-snapped blocks.

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

The current priority is defining the product, state model, permissions, MVP boundary, and anti-drift rules before choosing a technology stack.

## Project contracts

- [SOUL.md](SOUL.md) — product philosophy and anti-drift rules
- [Data Schema](docs/DATA_SCHEMA.md) — conceptual world/state model
- [Roadmap](docs/ROADMAP.md) — staged product plan

## MVP principle

The DM is the game engine.

The first release focuses on building, visibility, locking, player ownership, real-time movement, persistence, and simple interaction—not automated RPG rules.
