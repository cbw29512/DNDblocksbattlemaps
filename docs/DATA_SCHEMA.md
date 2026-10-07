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
- occupancy_mode
- blocks_movement
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

### occupancy_mode

Candidate values:

- solid
- overlay

These values describe PLAY behavior only. They do not restrict DM BUILD placement.

Multiple WorldObjects may share the same X/Y/Z coordinates when the DM intentionally overlaps them.

Examples:

- wall: solid
- closed door: solid
- table: solid
- hidden trap trigger: overlay

### blocks_movement

Generic boolean behavior used only for obvious board-space blocking.

Examples:

- wall: true
- closed door: true
- open door: false
- trap trigger: false

This is not a D&D movement-rules engine and never acts as a BUILD-mode placement prohibition.

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

## InteractionRule

Triggers/effects should be data-driven and reusable.

Candidate fields:

- id
- source_object_id
- trigger_type
- target_scope
- active
- one_shot
- duration_mode
- detect_data
- disarm_data
- effects
- metadata

Candidate trigger types:

- manual
- enter_cell
- start_turn_in_cell
- leave_cell
- cross_boundary
- interact
- touch
- open
- close
- timer
- object_state_changed
- linked_trigger

Candidate effect types:

- reveal
- hide
- transform_replace
- spawn_reveal
- remove
- move
- forced_move
- change_elevation
- fall_drop
- movement_lock
- movement_unlock
- apply_status
- remove_status
- damage_marker
- healing_marker
- change_terrain
- difficult_terrain
- change_movement_blocking
- open_close_toggle
- alarm_notify_dm
- activate_deactivate
- repeat_rearm

A named trap or surprise should be represented by data combining these primitives.

### Transform / Replace

Transforming objects may switch catalog identity while retaining placement context.

Candidate transform data:

- target_catalog_object_id
- preserve_position
- preserve_visibility_context
- reversible
- transformed

A transform may change appearance, category, capabilities, footprint, and interaction behavior.

Example: chest-looking object → mimic creature in the same grid location.

## RoomRegion

A room/region is organizational state for room generation and bulk locking. It does not create a separate block engine.

Candidate fields:

- id
- map_id
- name
- origin_x
- origin_y
- length_feet
- width_feet
- wall_height_feet
- dimension_unit: feet
- dimension_mode: interior_playable
- locked
- created_at
- updated_at

WorldObjects generated into a room may reference `room_region_id`.

The room-lock operation protects the position/removal of room construction/environment objects associated with that region. Player, monster, and NPC pieces are not frozen by the room construction lock. Allowed state changes such as opening a door or triggering a trap remain possible while position is locked.

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

1. How should vertical placement/elevation be represented visually and selected by the DM outside generated room walls?
2. What is the simplest useful player interaction model beyond movement?
3. How should Tiny creature positioning work?
4. What identity/authentication level is required for MVP?
5. What persistence granularity is needed for undo/redo and recovery?
6. How should shared walls between adjacent generated rooms be edited if the simple no-duplicate rule proves insufficient?
