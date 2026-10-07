# Interaction Specification

> Status: Stage 0 product contract. No application code should be written from this document until the remaining open decisions are resolved.
>
> Primary usability requirement: **the UI must be simple enough that a child can understand the basic workflow without reading a manual.**

## First-Use Goal

A first-time DM should be able to:

1. understand what the site does from the hero page
2. choose a terrain with one obvious button
3. immediately see a gridded map
4. create a room by entering dimensions
5. add obvious blocks such as a table, torch, door, pit, trap, or monster
6. hide something from players
7. lock the room so accidental movement stops
8. invite players and begin using the map

The interface should teach through obvious controls rather than instructions.

## Hero Page

The hero page should explain the product in one short, plain-language statement.

Conceptually:

> Build a D&D battle map from simple blocks, invite your players, and play in the browser.

The primary question is:

> **What terrain do you want?**

Large, obvious terrain buttons should be presented.

Initial examples:

- Castle
- Inn
- Field
- Sea
- Volcano

Additional terrain themes can be added later, but the first screen must remain visually simple.

Selecting a terrain should take the DM directly to a usable map.

Do not require the DM to configure a project, campaign, scene hierarchy, asset pack, lighting profile, or ruleset before seeing the board.

## Map Appearance

After terrain selection:

- the map appears immediately
- the map has visible grid squares
- 1 grid square represents 5 feet
- the selected terrain determines the base visual theme
- the map remains simple and readable

The camera model is now defined in `CAMERA_CONTRACT.md`: default elevation near 30° above the board plane, horizontal orbit around the focus point, pan, zoom, and Reset/Home. Vertical tilt/free-fly is not part of MVP.

## Camera Controls

Camera behavior must remain child-readable:

- fixed tabletop elevation near 30°
- rotate/orbit left and right around the focus point
- pan across the board
- zoom in/out
- Reset/Home to recover the view

Visible controls should exist so mouse gestures are conveniences rather than required knowledge.

Candidate shortcuts:

- mouse wheel = zoom
- right-drag = orbit
- right-click without a meaningful drag = remove in DM BUILD mode
- middle-drag = pan when available

Right-click remove and right-drag orbit must use a drag threshold so orbiting cannot accidentally delete an object.

See `CAMERA_CONTRACT.md`.

## Primary DM Controls

The core mouse interaction is:

- **Left click in the sidebar:** select a block/tool
- **Left click on the map:** place the selected block/tool result
- **Right click a placed block:** remove it

This is the preferred interaction contract because it is easy to explain and easy to remember.

Resolved behavior:

- selected palette item remains active after placement
- keep clicking to place additional copies
- choosing another palette item changes the active item
- Select/Done or Escape clears placement mode
- touch devices must have a visible Select/Done control

Do not add drag handles, rotation widgets, nested object inspectors, or complex context menus unless a real requirement later demands them.

See `PLACEMENT_CONTRACT.md`.

## Permissive Placement

DM BUILD placement is permissive.

- clicking a destination places the selected object even when another object already occupies that cell
- stacking and overlap are allowed
- game pieces may be placed inside/over hazards
- hidden triggers may share cells with visible objects
- the UI may indicate overlap, but must not reject it as "invalid"

Placement preview should therefore communicate **where the object will go**, not enforce a physics validator.

PLAY movement/blocking behavior is separate and may still use object properties such as `blocks_movement`.

## Manual Elevation and Stacking

Natural placement follows the surface under the pointer:

- floor/ground → place on that surface
- top face → place one 5-foot block level above
- side face → place in the adjacent grid position at the clicked block's base level

A small visible elevation control in feet provides exact manual height selection when needed.

Unsupported/floating placement is allowed.

The DM may intentionally place creatures, objects, hazards, or scenery at elevated positions without a support block.

## Moving Existing Objects

When no palette item is active:

- left-click an unlocked movable object to pick it up
- a ghost follows the pointer using the same placement rules
- left-click drops it
- Escape cancels and restores its original position

Locked construction cannot be picked up until unlocked.

## Overlap Selection

When a click clearly identifies one visible object, target it directly.

When several objects overlap ambiguously, show a tiny **What's Here?** chooser listing only the objects at that location with minimal actions such as Select/Move, Hide/Reveal, and Remove.

Do not open a full property inspector merely because objects overlap.

## Undo/Redo

Undo/Redo is required in the first builder prototype, not deferred to a later convenience phase.

Fast actions should remain confirmation-free when safely reversible.

At minimum, Undo should cover placement, removal, move, hide/reveal, lock/unlock, room generation, and other major board edits.

## Transforming Object Interaction

Objects may change identity when triggered.

Example:

- player touches/interacts with a chest-looking block
- the chest transforms/replaces itself with a mimic creature block
- the creature remains at the same map position
- its category/capabilities change from prop-like object to creature/game piece

This must use the generic transform/replace effect described in `TRAPS_AND_EFFECTS.md`.

## Room Builder

The main sidebar should provide a room builder.

The DM enters:

- Length
- Width
- Height

Then chooses the room/build action.

The room is generated from ordinary blocks.

### Room generation rules

- rooms generate floors
- rooms generate walls
- rooms **do not generate ceilings**
- ceilings are explicitly deferred because the board must remain visible and easy to use
- generated blocks remain ordinary editable blocks
- the generated room can later be modified by the DM
- the room is associated with a room/region identity so it can be locked or unlocked as a group

### Room dimension contract

The room spatial contract is now defined:

- Length is entered in feet.
- Width is entered in feet.
- Height is entered in feet.
- Values snap to 5-foot increments.
- Length × Width describe **usable interior playable space**.
- Height describes **wall height**.
- One vertical block level represents 5 feet.
- The UI may show the derived grid/block count as a helper.

Example:

**40 ft × 20 ft × 10 ft** = **8 × 4 playable interior squares with 2-block-high walls**.

See `SPATIAL_CONTRACT.md`.

## No Ceiling Rule

At the current design stage:

> **Never automatically place a ceiling on a room.**

The player/DM must be able to look into the room.

Ceiling/roof behavior can be researched later if needed, but it is not part of the current room model.

## Room Block Palette

Once a room exists, the sidebar should present blocks that make sense to add to that room.

Examples already requested:

- Table
- Torch
- Pit
- Trap
- Monsters
- Door

Other sensible room objects can be added later.

The palette should favor obvious names and recognizable icons/images.

Do not expose implementation terminology to the DM.

## Room Lock

The DM can lock the room.

The intent is:

> Once the DM is satisfied with the room, the current placed blocks stop moving accidentally.

Unlocking the room allows the DM to reposition or remove those blocks again.

The room-lock operation should be a simple bulk control, not a complicated permissions system.

### Room lock scope

Lock Room is an **editing/position lock** for room construction and environment objects.

It protects:

- floors/terrain belonging to the room
- walls
- doors in position
- furniture and props
- lights
- traps and hazards
- decorative/environment objects

It does **not** freeze:

- player pieces
- monster pieces
- NPC pieces

Allowed state changes remain possible while position is locked. A locked-position door can still open/close and a locked-position trap can still trigger.

See `SPATIAL_CONTRACT.md`.

## Door Placement Contract

A door replaces the lowest wall block at a selected wall position.

It does not occupy a separate adjacent grid square.

For walls taller than 5 feet, wall blocks above the door remain.

The door stays anchored to its wall position and changes state between open/closed rather than physically rotating into another square.

## Hidden Blocks

The DM can mark appropriate objects invisible to players.

The DM must continue to see hidden objects in DM view.

The player should see nothing in that location until the object is revealed or triggered, depending on its behavior.

Possible hidden objects include:

- traps
- monsters
- secret doors
- treasure
- pits
- encounter surprises

This remains a simple manual visibility system first.

Do not require dynamic lighting or line-of-sight calculations for MVP.

## Trap Interaction

The first requested interactive trap behavior is deliberately simple.

A trap can be hidden from players.

When a player piece enters a trap's grid location:

1. the trap can trigger
2. the affected player piece becomes unable to move
3. the DM decides when to release/unlock that movement restriction

This must be implemented later as reusable board behavior, not as a one-off TrapEngine.

Conceptually:

**on entity enters cell -> apply movement lock -> DM may clear movement lock**

This same universal behavior may later be reusable by webs, pits, cages, magical restraints, or other board objects.

The trap's name/art/data describes the source.

The board behavior remains generic.

## Player Interaction

The player interface should be even simpler than the DM interface.

A player should primarily:

- join the game
- see the map and visible objects
- identify their piece
- move their assigned piece
- interact only with objects the DM permits

Players should not see build controls.

Players should not accidentally move room construction.

## Simplicity Rules

The interface should follow these constraints:

- favor large obvious buttons
- favor icons plus plain labels
- keep the number of visible choices small
- avoid nested menus where possible
- avoid settings screens before play
- avoid object rotation unless later proven necessary
- avoid precise freeform positioning; snap to grid
- avoid requiring a tutorial for basic map creation
- avoid exposing technical terms
- one action should have one obvious control

If a child cannot identify the basic next action by looking at the screen, simplify it.

## First-Use Usability Test

A future prototype should pass this test without coaching:

1. Open the site.
2. Understand that it builds battle maps.
3. Choose Castle.
4. See a gridded map.
5. Create a room.
6. Add a table.
7. Add a torch.
8. Add a door.
9. Add a hidden trap.
10. Add a monster.
11. Lock the room.
12. Invite a player.
13. Move a player piece.
14. Trigger the trap.
15. DM releases the trapped player.

If this flow requires reading documentation, the UI is too complicated.

## Explicitly Deferred

Do not add these while solving the first-use experience:

- ceilings
- complex roof systems
- free-angle object rotation
- dynamic lighting
- advanced line of sight
- character sheets
- combat automation
- spell automation
- physics
- complex trap rules
- detailed object property panels
- multi-level nested menus

## Future Idea — Calendar/Date Block

The earlier word "date" in the room-object list was a typo and is **not** a required object.

A calendar/date-display block was mentioned afterward as a possible future decorative or utility block, but no product decision has been made to include it.

It is not part of the MVP catalog.
