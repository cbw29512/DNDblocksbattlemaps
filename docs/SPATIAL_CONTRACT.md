# Spatial Contract

> Status: Stage 0 product contract.
>
> This document defines the physical/grid meaning of rooms and blocks before implementation. It exists so room generation, placement, doors, locking, and later multiplayer all use the same spatial rules.

## Core Unit

The board uses one universal spatial unit:

**1 grid cell = 5 feet × 5 feet**

For the initial voxel/block presentation, one full vertical block level also represents:

**5 feet of height**

Therefore the base logical voxel is:

**5 ft × 5 ft × 5 ft**

The UI should speak in D&D-friendly feet first, not internal X/Y/Z coordinates.

## Room Dimension Inputs

The DM enters:

- Length
- Width
- Height

All three values are entered in **feet**.

For MVP, values snap to 5-foot increments.

Examples:

- 20 ft = 4 grid cells
- 40 ft = 8 grid cells
- 10 ft height = 2 vertical block levels
- 15 ft height = 3 vertical block levels

The UI may show the derived block count as a helper, for example:

> 40 ft × 20 ft × 10 ft  
> 8 × 4 squares, walls 2 blocks high

The DM should not need to think in engine units.

## Room Dimensions Mean Usable Interior Space

Room Length and Width describe the **usable playable interior**.

Example:

**40 ft × 20 ft room**

creates:

- 8 × 4 interior playable squares
- wall blocks around the outside perimeter
- no ceiling

The wall thickness does not subtract from the requested playable room size.

This is the canonical room-dimension interpretation.

## Height Means Wall Height

Room Height describes the wall height.

Example:

**Height = 10 ft**

creates walls two full block levels high.

Height does not create a ceiling.

Height does not describe creature elevation.

## Vertical Coordinate Convention

Conceptual convention:

- `z = 0`: terrain/floor support layer
- `z = 1`: first above-floor block/entity layer
- `z = 2`: second above-floor block layer
- etc.

A floor/terrain block occupies the support layer.

Objects, creatures, and the first wall block sit above that support layer.

This convention is conceptual and may be adapted to renderer internals later, but the user-facing meaning must remain stable.

## Terrain and Room Floors

The selected terrain provides the starting base layer.

When a generated room requires a different floor material, the room floor **replaces or changes the base surface cells for that room interior** rather than stacking an extra 5-foot floor cube on top.

This avoids accidentally raising every room five feet above the surrounding terrain.

Example:

- Field theme starts as grass
- Castle room changes its interior floor cells to castle/stone floor
- those cells remain at the same ground elevation

## Walls

Walls occupy perimeter cells outside the requested playable interior.

Walls are generated to the requested wall height.

A wall is ordinary world-object/block data.

No separate wall engine should exist if ordinary block behavior can represent it.

### Duplicate structural occupancy

The generator should not create duplicate solid structural blocks at the same X/Y/Z position.

If a valid structural block already occupies a generated position, room generation should preserve/reuse that position rather than stacking an identical block into the same cell.

Exact shared-wall editing behavior between adjacent generated rooms can be refined later.

## Doors

A door occupies a wall position.

Placing a door on a valid wall location **replaces the ground-level wall block at that position**.

No separate adjacent door cell is created.

For a wall more than 5 feet high:

- the door occupies the lowest wall level
- wall blocks above it remain

Example:

10-foot wall:

```text
upper level: WALL
lower level: DOOR
```

The door block does not require rotation. Its art must make it recognizable from all useful viewing sides.

Door state is universal state:

- closed
- open

The door remains anchored in the same grid position.

Opening the door changes its interactive/passability state; it does not physically swing into another grid cell.

## DM-Authoritative Overlap

Manual BUILD placement may put multiple WorldObjects in the same X/Y cell and, when useful, at the same elevation.

The board must support combinations such as:

- creature + pit
- creature + hidden trap
- rug + pressure plate
- table + trigger
- chest + hidden creature identity
- multiple triggers in one cell

Even objects normally considered solid may be deliberately overlapped by the DM.

The editor may show a non-blocking overlap indicator, but it must not reject the placement.

Generated tools such as room builders should still avoid accidental duplicate identical structural blocks unless the DM explicitly creates them.

## Occupancy and Movement Behavior

Occupancy/movement properties describe PLAY behavior; they do **not** restrict BUILD placement.

Candidate descriptive properties:

- `occupancy_mode = solid | overlay`
- `blocks_movement = true | false`

Examples:

- wall: solid / blocks movement
- closed door: solid / blocks movement
- open door: solid appearance but does not block movement
- hidden trap trigger: overlay / does not block movement

These properties let the board provide useful play interaction while preserving full DM placement authority.

The DM can override movement/blocking behavior.

## Lock Room

**Lock Room is an editing lock, not a combat/game-state freeze.**

When the DM locks a room:

Locked by the room:

- floor/terrain changes belonging to the room
- wall blocks
- doors in their positions
- furniture
- props
- lights
- traps
- pits/hazards
- decorative room objects
- other construction/environment blocks assigned to that room

Not frozen by the room construction lock:

- player pieces
- monster pieces
- NPC pieces

Reason:

Players and creatures must remain movable during play.

A creature is visually a block/standee-like object, but it is a **game piece**, not locked construction.

### State can still change while position is locked

Locking a room prevents accidental:

- repositioning
- removal
- restructuring

It does **not** prevent allowed state changes.

Examples:

- a locked-position door can still open/close
- a locked-position trap can still trigger
- a locked-position torch can still toggle if that behavior exists

This is critical: **position lock and interaction state are different concepts.**

## Unlock Room

Unlock Room restores DM editing of the room's construction/environment objects.

The DM can then:

- move furniture
- remove a wall
- reposition a door
- change props
- alter terrain/floor cells
- rebuild the room

Player/monster/NPC movement remains governed separately.

## Right-Click Remove

Right-click remove is a DM BUILD-mode action.

If an object is protected by a room lock:

- right-click remove does not delete it
- the UI should make it obvious that the room/object is locked
- the DM unlocks the room before restructuring it

Game pieces are not protected by the room construction lock.

Exact creature-removal controls in PLAY mode remain separate.

## Room Placement

When generating a room:

1. DM selects room type/theme if applicable.
2. DM enters Length × Width × Height in feet.
3. Values snap to 5-foot increments.
4. A placement preview should eventually show the footprint.
5. DM selects the location.
6. Room generates ordinary floor/wall blocks.
7. No ceiling is generated.
8. DM adds furniture, hazards, doors, creatures, etc.
9. DM locks the room when satisfied.

The exact preview/click flow can be refined during UI mockup design.

## Adjacent Rooms and Shared Walls

Adjacent rooms are expected.

When a generated room perimeter lands on an existing compatible wall block at the same X/Y/Z:

- reuse the existing wall object
- do not create a duplicate wall
- associate the same wall object with both RoomRegions

A shared wall is still one ordinary WorldObject.

### Locking shared walls

A shared construction object is effectively locked if **any associated room is locked**.

To reposition/remove/replace shared construction in BUILD mode, all room locks protecting that object must be unlocked.

This prevents editing one side of a wall while another locked room still depends on it.

### Opening rooms into each other

When all relevant room locks are open:

- removing the shared wall opens the rooms into each other
- placing a door replaces the lowest shared wall block
- the resulting door retains membership in the associated rooms
- taller wall blocks above the door remain

No separate shared-wall engine is created.

### Intentional room overlap

The DM may still deliberately overlap rooms/objects.

Generated room previews should inform the DM about reused/shared structure and overlaps, but the DM remains authoritative.

## Creature Footprints

Creature footprints remain:

- Small: 1×1
- Medium: 1×1
- Large: 2×2
- Huge: 3×3
- Gargantuan: 4×4
- Tiny: deferred

A multi-square creature is one entity.

Its footprint occupies multiple playable X/Y cells but moves as one object.

## Current Non-Goals

This spatial contract does not introduce:

- ceilings
- roofs
- physics
- gravity simulation
- jumping
- climbing rules
- fall damage
- automatic D&D movement allowances
- diagonal movement rules
- line of sight
- advanced collision physics

Those require separate product decisions if they ever become necessary.

## Usability Test

A child should be able to understand:

> "A square is five feet. Type the room size in feet. Pick where it goes. Add stuff. Lock the room when you're done."

If the spatial UI requires understanding X/Y/Z coordinates, voxel terminology, or renderer concepts, the UI has failed the product requirement.
