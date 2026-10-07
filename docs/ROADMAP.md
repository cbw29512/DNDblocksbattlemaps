# Roadmap

This roadmap is intentionally product-first. Do not begin implementation until the current stage's decisions are stable.

## Stage 0 — Product Contract

Current stage, substantially complete. Final activity is pre-implementation consistency/audit rather than new feature design.

Goals:

- lock product philosophy
- lock MVP boundary
- define state/schema
- collect VTT pain points
- define DM/player permissions
- resolve open spatial rules
- choose visual interaction model
- visual feedback contract for placement/hidden/ownership/locks/Tiny
- dependency/license register
- technology stack selected in ADR-001 after requirements stabilized

No application code.

## Stage 1 — Single-User Builder Prototype

Goal: prove the placement experience.

Required concepts:

- kid-simple first-use flow
- hero-page terrain/theme choice
- 5-foot grid
- block palette
- persistent select-once/place-many palette behavior
- placement ghost preview
- click-to-place
- permissive overlap/stack placement
- right-click remove for DM build mode
- room generator: Length × Width × Height in feet, 5-foot increments, interior-playable dimensions
- no automatic ceilings
- door replaces a wall position
- 5-foot vertical block levels
- room/region bulk position lock for construction/environment only
- snapping
- delete
- lock/unlock
- fixed ~30° tabletop camera elevation
- horizontal orbit
- pan/zoom
- Reset/Home camera recovery
- surface-based vertical placement
- visible elevation control in 5-foot increments
- unsupported/floating placement allowed
- pick-up/put-down move interaction
- overlap chooser when object selection is ambiguous
- undo/redo safety for core edits
- autosave every committed board edit
- current-state persistence separate from recent history
- unique action IDs and board revision
- refresh/crash recovery
- creature footprints
- save/load locally or through the eventual persistence layer

No multiplayer rules automation.

## Stage 2 — Multiplayer Table

Goal: DM and players can share one live board.

- create game
- durable DM identity
- Join as Player via link/code + display name
- player reconnect/session recovery
- DM authority
- assigned player pieces
- obvious player-owned-piece indicator
- Tiny creature auto-offset within shared 5-foot square
- real-time movement
- logical move events only; no animation-frame streaming
- realtime deduplication/revision-gap recovery
- player movement freeze
- persistent map state
- reconnect/reload recovery

## Stage 3 — Visibility and Interaction

- DM-only objects
- reveal
- door open/close
- basic toggle interactions
- hidden monsters/traps/secret objects
- generic trigger/effect system
- transform/replace objects (for example chest → creature)
- manual DM trigger/release controls

Keep behavior universal and data-driven.

## Stage 4 — Faster Building

- line placement
- rectangle placement
- area fill
- duplicate
- copy/paste
- multi-select
- saved block groups

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
