# Roadmap

This roadmap is intentionally product-first. Do not begin implementation until the current stage's decisions are stable.

## Stage 0 — Product Contract

Current stage.

Goals:

- lock product philosophy
- lock MVP boundary
- define state/schema
- collect VTT pain points
- define DM/player permissions
- resolve open spatial rules
- choose visual interaction model
- choose technology stack only after requirements are stable

No application code.

## Stage 1 — Single-User Builder Prototype

Goal: prove the placement experience.

Required concepts:

- kid-simple first-use flow
- hero-page terrain/theme choice
- 5-foot grid
- block palette
- click-to-place
- right-click remove for DM build mode
- room generator: Length × Width × Height in feet, 5-foot increments, interior-playable dimensions
- no automatic ceilings
- door replaces a wall position
- 5-foot vertical block levels
- room/region bulk position lock for construction/environment only
- snapping
- delete
- lock/unlock
- pan/zoom
- basic vertical placement
- creature footprints
- save/load locally or through the eventual persistence layer

No multiplayer rules automation.

## Stage 2 — Multiplayer Table

Goal: DM and players can share one live board.

- create game
- join link/code
- DM authority
- assigned player pieces
- real-time movement
- player movement freeze
- persistent map state
- reconnect/reload recovery

## Stage 3 — Visibility and Interaction

- DM-only objects
- reveal
- door open/close
- basic toggle interactions
- hidden monsters/traps/secret objects

Keep behavior universal and data-driven.

## Stage 4 — Faster Building

- line placement
- rectangle placement
- area fill
- duplicate
- copy/paste
- multi-select
- saved block groups
- undo/redo

## Stage 5 — Prefabricated Rooms

Templates generate ordinary blocks.

Initial candidates:

- castle room
- dungeon room
- corridor
- tavern
- house
- cave
- forest clearing
- temple
- crypt
- camp

Support parameterized dimensions such as 40×20 feet after the dimension contract is explicitly resolved.

## Stage 6 — Larger Templates

- buildings
- encounter layouts
- reusable map sections
- full small maps
- community/user templates, if later justified

## Stage 7 — Optional Game Assistance

Only after the tabletop itself is strong.

Potential modules:

- simple measuring
- dice
- initiative
- HP/status display
- optional rules helpers

The DM-controlled map must continue to work with every rules module disabled.

## Permanent Constraint

Do not turn this project into a traditional feature-heavy VTT by accumulation.

Every new feature must justify itself by making preparation or play meaningfully faster, clearer, or easier.
