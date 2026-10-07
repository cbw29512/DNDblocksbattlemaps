# Data Schema

> Conceptual schema only. This document defines state before implementation. It is not tied to a database or framework yet.

## Design Rule

Everything placed on the board should share a small universal object model. Object-specific data describes appearance and defaults; reusable capabilities describe behavior.

## Game

- id
- name
- join_code
- dm_user_id
- active_map_id
- player_movement_frozen
- created_at
- updated_at

## User

- id
- display_name

Authentication details are intentionally undecided.

## GameMember

- game_id
- user_id
- role: dm | player
- assigned_entity_ids

## Map

- id
- game_id
- name
- terrain_theme
- width_cells
- height_cells
- max_z
- grid_scale_feet: 5
- created_at
- updated_at

## WorldObject

All placed things derive from this conceptual record.

- id
- map_id
- catalog_object_id
- room_region_id
- display_name
- category
- x
- y
- z
- footprint_width
- footprint_depth
- footprint_height
- state
- visibility
- locked
- owner_user_id
- capabilities
- metadata

### visibility

Initial states:

- visible
- dm_only

Do not add complicated visibility states until a real requirement demands them.

### state

State is object-specific data interpreted through universal capabilities.

Examples:

- closed / open
- lit / extinguished
- armed / triggered
- active / inactive

## CatalogObject

Defines reusable block/entity types available in the placement palette.

- id
- name
- category
- appearance_reference
- default_footprint
- default_state
- default_visibility
- default_locked
- capabilities
- tags

Examples:

- grass
- stone_floor
- stone_wall
- door
- torch
- table
- chest
- trap
- orc
- fighter

## Capabilities

Capabilities are universal behaviors attached by data.

Initial candidates:

- movable
- lockable
- openable
- toggleable
- hideable
- revealable
- player_controllable
- stackable
- trigger_on_enter
- applies_movement_lock

These are candidates, not an implementation commitment. Each must be validated against actual MVP interactions before code is written.

The requested first trap behavior should use generic trigger/effect data: an entity entering a cell may receive a movement lock that only the DM can clear. This behavior should remain reusable by other sources.

## RoomRegion

A room/region is organizational state for room generation and bulk locking. It does not create a separate block engine.

Candidate fields:

- id
- map_id
- name
- origin_x
- origin_y
- length_value
- width_value
- height_value
- dimension_unit
- dimension_mode
- locked
- created_at
- updated_at

WorldObjects generated into a room may reference `room_region_id`.

The room-lock operation applies a bulk lock policy to the current objects associated with that region. The exact treatment of creature/player pieces remains an explicit interaction decision before implementation.

Rooms currently generate **no ceiling**.

## Movement Lock

Movement restriction should be generic state/effect data rather than trap-specific code.

Candidate data:

- entity_id
- source_object_id
- effect_type: movement_lock
- active
- cleared_by_dm

Potential sources later include traps, pits, webs, cages, or magical restraints.

## Creature Footprints

- Tiny: deferred
- Small: 1×1
- Medium: 1×1
- Large: 2×2
- Huge: 3×3
- Gargantuan: 4×4

Multi-square creatures remain one WorldObject.

## Template

Future prefab rooms and structures should be data recipes.

- id
- name
- category
- theme
- dimension_mode
- default_width_feet
- default_depth_feet
- generation_recipe
- allowed_parameters
- tags

A template generates ordinary WorldObjects. Generated blocks do not use a separate runtime type.

## Open Schema Decisions

These must be resolved before implementation where relevant:

1. Are prefab room dimensions interior playable dimensions or exterior footprint dimensions?
2. How should vertical placement be represented visually and selected by the DM?
3. Do doors occupy the same cell as a wall or their own grid cell?
4. What is the simplest useful player interaction model beyond movement?
5. How should Tiny creature positioning work?
6. What identity/authentication level is required for MVP?
7. What persistence granularity is needed for undo/redo and recovery?
8. When a room is locked, which creature/player pieces, if any, are included in that bulk lock?
