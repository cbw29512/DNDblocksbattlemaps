# Manual Placement and Object Selection Contract

> Status: Stage 0 product contract.
>
> Goal: manual building should feel like handling physical dungeon blocks, while preserving full DM authority and avoiding hidden editor modes.

## Core Placement Loop

The default DM BUILD interaction is:

1. Select a block/object from the sidebar.
2. A placement ghost appears under the pointer.
3. Left-click to place it.
4. The selected palette item stays selected.
5. Continue left-clicking to place more copies.
6. Choose another sidebar item, press Escape, or choose a simple Done/Pointer tool to stop placing that item.

This supports fast repetitive building without forcing the DM to return to the sidebar after every wall, torch, chair, or monster.

## Selected Item Persists

A palette selection remains active until the DM deliberately changes or clears it.

Examples:

- select Stone Wall once
- click eight positions
- eight Stone Wall objects are placed

This is the default because repeated placement is common in physical terrain building.

## Placement Ghost

Before placement, show a semi-transparent/outlined ghost of the selected object.

The ghost:

- snaps to the grid
- shows the exact X/Y footprint
- shows the intended elevation
- shows the object's footprint for Large/Huge/Gargantuan entities
- does not become red/invalid merely because another object occupies that location
- may show a small overlap/count indicator when other objects already occupy the same position

The ghost communicates **where the object will go**, not whether the DM is "allowed" to put it there.

## Natural Surface Placement

The pointer uses the surface being hovered as the intuitive placement anchor.

### Hover ground/floor

Place the object on that floor/surface level.

### Hover the top of a block

Place the object one supported block level above that block.

Example:

- hover top of a 5-foot stone block
- ghost appears at the next 5-foot elevation
- click places the selected object there

This is the simplest manual stacking behavior.

### Hover the side of a block

Place the selected block in the adjacent grid position on that side, aligned to the clicked block's base level.

This allows wall/tower construction without exposing X/Y/Z coordinates.

## Explicit Elevation Control

Natural surface placement handles the normal case.

A small visible elevation control should also exist for cases where the DM wants an exact level without a convenient visible support surface.

Conceptually:

**Elevation: Ground | +5 ft | +10 ft | +15 ft | ...**

or a compact:

**Height: −  10 ft  +**

Requirements:

- user-facing units are feet
- values move in 5-foot increments
- the control changes the placement ghost's elevation
- it never exposes raw Z coordinates

This is an escape hatch, not the primary placement method.

## Unsupported/Floating Placement

The DM may deliberately place an object at an elevation without a supporting block beneath it.

Do not prohibit this.

Examples:

- flying creature
- levitating object
- magical platform
- suspended cage
- chandelier
- floating eye/monster
- falling object staged before trigger
- elevated hazard marker

The app is not a physics engine.

If useful, the ghost may subtly indicate that the placement is unsupported, but the DM can still place it.

## Overlap

Exact overlap is allowed.

The world data may contain multiple objects at the same X/Y/Z.

The renderer should make reasonable visual choices, but the data model must preserve all objects.

Typical overlap examples:

- hidden trigger + rug
- hidden trap + creature
- effect marker + creature
- chest appearance + linked transformation data
- multiple triggers in one square

No automatic deletion or replacement should occur merely because coordinates match unless the selected tool explicitly requests replacement, such as placing a door into a wall position.

## Replacement Is Explicit

Some actions intentionally replace an existing object.

Examples:

- door replaces the lowest wall block in that wall position
- transform/replace changes chest → mimic
- terrain paint changes grass → stone floor
- hidden pit may change ordinary floor → open pit state

These are explicit behaviors.

Ordinary placement does not silently replace existing objects.

## Moving an Existing Object

When no palette-placement item is active:

1. Left-click an unlocked movable object.
2. The object becomes the active picked-up object.
3. Its original location remains remembered.
4. A ghost/outline follows the pointer using the same grid/elevation placement rules.
5. Left-click places it at the new location.
6. Escape cancels the move and returns it to the original location.

This is conceptually:

**pick it up → put it down**

No drag handles or transform gizmos are required for MVP.

## Locked Objects

Clicking a locked construction/environment object does not pick it up.

The UI should give a simple visible response such as a lock icon/brief label.

Do not open a complex properties panel just to explain the lock.

The DM unlocks the room/object, then moves it.

Game pieces remain governed by their own movement permissions rather than room construction locks.

## New Placement in a Locked Room

The DM may still place a new object in a locked room.

The room lock protects existing locked construction from accidental movement/removal; it does not make the room an untouchable zone.

If the new object is an environment/construction object and is associated with that room, it inherits the room's locked state after placement.

Game pieces remain movable.

This preserves:

- DM authority
- ability to add a surprise/hazard during play
- ability to add monsters/props later
- protection of previously locked construction

## Right-Click Remove

In DM BUILD mode:

- right-click a clearly targeted unlocked object removes that object
- locked construction is not removed
- right-drag remains camera orbit and must use a movement threshold so orbiting does not delete

Right-click removal does not require a confirmation dialog for ordinary unlocked objects because Undo is the safer, faster recovery mechanism.

## Overlapping Object Selection

When one pointer location maps cleanly to one visible object, select/remove it directly.

When several selectable objects overlap and the hit is ambiguous, show a tiny contextual **What's Here?** chooser.

The chooser should display only the objects at that location, using:

- icon/thumbnail
- plain object name
- hidden/visible indicator if relevant
- lock indicator if relevant

Actions can remain minimal:

- Select/Move
- Hide/Reveal when applicable
- Remove

Do not open a full inspector unless later requirements justify it.

The ambiguity UI should appear only when needed.

## Hidden Objects in DM View

DM-only/hidden objects remain targetable by the DM.

They should have a distinct DM-only visual treatment such as transparency, outline, or marker so the DM can select them without players seeing them.

A player client receives/uses only the visibility state appropriate to that player.

## Placement and Room Tools

Generated room tools and fast-building tools use the same placement model internally.

Room builder, line tool, rectangle tool, fill tool, saved prefab, and manual click placement all create ordinary WorldObjects.

Do not create a second class of "generated" objects.

## Undo/Redo Becomes MVP-Safety Infrastructure

Because placement/removal should be fast and confirmation-free, Undo/Redo must move earlier in priority.

At minimum, future implementation should support undo for:

- place object
- remove object
- move object
- hide/reveal
- lock/unlock
- door/open state change when appropriate
- room generation
- bulk room lock
- transform/replace when DM-triggered

The exact persistence model is still unresolved, but the interaction contract assumes a reliable Undo control exists.

## Pointer / Done Tool

There should be one obvious way to exit placement mode.

Candidate label/icon:

- Pointer
- Select
- Done

Escape is a keyboard shortcut, not the only way.

On touch devices, the visible control is required.

## Touch Equivalents

Desktop mouse interaction must not be the only path.

Touch should map conceptually to:

- tap palette item = select
- tap board = place
- tap existing unlocked object in Select mode = pick up/select
- tap destination = drop
- visible Remove button or contextual remove = delete
- visible camera controls = orbit/pan/zoom fallback

Long-press/right-click equivalence can be evaluated later, but basic actions must remain available through visible controls.

## Usability Test

A child should be able to discover:

> "Pick a thing. You see where it will go. Tap/click to put it down. Keep clicking to make more. Hit Select/Done when you're finished. Click something loose to pick it up and put it somewhere else."

If ordinary placement requires understanding layers, coordinates, object inspectors, physics, modifiers, or keyboard shortcuts, simplify it.
