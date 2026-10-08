# Initial Block Catalog

> Status: Stage 1 implementation contract.
>
> This catalog records the first obvious block families discussed for DND Blocks Battle Maps. It is not yet an asset list or implementation commitment.

## Catalog Rule

A block should be understandable at a glance.

The visual should communicate the thing itself from the useful viewing sides.

Examples:

- grass looks like grass
- a door looks like a door
- a torch looks like a torch
- an orc looks like an orc

Do not require ordinary object rotation just to identify or use the block.

## Terrain / World Themes

Initial hero-page terrain/theme choices:

- Castle
- Inn
- Field
- Sea
- Volcano

These choices may determine:

- base ground appearance
- suggested room/block palette
- suggested props
- suggested environmental blocks

A terrain theme is not a separate game engine.

It is data/configuration that selects appropriate ordinary blocks and defaults.

## Broader Catalog Families

Minecraft's creative inventory is being used only as a usability reference for the idea of grouping many blocks into obvious families. We are not copying Minecraft assets or reproducing its inventory.

As the catalog grows, favor a few kid-readable families:

- Terrain
- Construction
- Furniture / Room Objects
- Lights / Utility
- Hazards / Secrets
- Creatures

Within those families, use original art and our own data definitions for generic concepts such as grass, dirt, stone, wood, water, lava, walls, doors, stairs, fences, tables, beds, chests, torches, pits, traps, trees, rocks, players, NPCs, and monsters.

Theme selection should filter these families to the most relevant blocks rather than exposing hundreds of choices at once.

## Live Searchable Catalog

The live Stage 1 catalog is now a real working library rather than a tiny starter strip.

Current total: **108 cube types**.

- **Build — 36**
- **Props — 51**
- **Characters — 12**
- **Monsters — 9**

The sidebar stays kid-readable through four top-level tabs plus a simple **Find a block** search field.

### Build — implemented

Stone, Stone Wall, Wood Floor, Wood Wall, Dirt, Grass, Sand, Water, Lava, Snow, Mud, Cobblestone, Dungeon Tile, Brick Floor, Brick Wall, Castle Wall, Cave Wall, Metal Wall, Cell Bars, Pillar, Window, Archway, Closed Door, Open Doorway, Secret Door, Portcullis, Stairs, Ladder, Bridge, Fence, Dock, Ship Deck, Obsidian, Ice, Open Pit, Trapdoor.

### Props / Hazards / Outdoor — implemented

Table, Chair, Bed, Chest, Barrel, Crate, Torch, Bookshelf, Throne, Desk, Cabinet, Shelf, Altar, Statue, Sarcophagus, Fountain, Well, Fireplace, Rug, Campfire, Brazier, Banner, Lantern, Cauldron, Anvil, Forge, Tombstone, Cage, Shackles, Lever, Switch, Pressure Plate, Hidden Trigger, Spike Trap, Snare Trap, Spring Trap, Flame Jet, Dart Trap, Falling Block, Collapsing Floor, Web Trap, Acid Pool, Poison Cloud, Alarm Rune, Tree, Rock, Bush, Log, Tent, Wagon, Boat.

### Characters — implemented

Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard.

These use local copies of the approved Iron Pit 2024 hero portrait art.

### Monsters — current starter set

Goblin, Skeleton, Zombie, Wolf, Mimic, Ghoul, Kobold, Bandit, Orc.

These use local copies of approved Iron Pit monster art. The full Iron Pit monster inventory is the next monster-catalog expansion lane.

### Ordinary block face-art system

Build/Prop pieces do **not** require individual mesh code or hand-maintained image files.

Each catalog record supplies:

- name
- category
- cube color
- simple face-icon key
- search tags

The universal face generator creates one cohesive DND Blocks SVG face card from that data.

That generated picture is used:

- in the sidebar thumbnail
- on all six faces of the cube
- in fallback rendering
- in Print Map output

This means a Barrel is still a perfect cube; the generated barrel picture tells the user it represents a barrel.

The renderer remains generic: no BarrelRenderer, DoorRenderer, TrapRenderer, FighterRenderer, GoblinRenderer, etc.

## Room Construction Blocks

Initial construction concepts:

- floor
- wall
- door

Future likely additions can include:

- stairs
- gate
- bridge
- fence
- column

Do not add them to MVP merely because they seem useful; validate against actual first-use needs.

## Room Objects

Initial requested objects:

- table
- torch
- pit
- trap
- door

Possible later objects:

- chair
- chest
- barrel
- crate
- bed
- bookshelf
- altar
- fireplace
- statue

Continue catalog growth through the same data-driven/searchable system rather than adding one-off UI or renderers.

## Trap and Hazard Families

Examples are intentionally broader than a single pit/spring trap.

Useful visual/data families include:

- hidden pit
- spiked pit
- pressure plate
- trip wire
- spring/hunting trap
- falling net
- dart/arrow launcher
- poisoned needle
- falling block/collapsing roof
- rolling stone/object
- fire/statue emitter
- blade/scything hazard
- flooding/water hazard
- web/restraint hazard
- difficult terrain
- magical glyph/rune
- alarm trigger
- secret door/trigger
- linked switch/lever
- moving hazard
- transform/disguise object

These are catalog examples, not separate engines.

They should be composed from universal triggers/effects documented in `TRAPS_AND_EFFECTS.md`.

## Transforming / Surprise Objects

Examples:

- chest → mimic
- statue → gargoyle
- armor → animated armor
- bones → skeleton
- sarcophagus → undead creature
- egg/cocoon → creature
- dormant construct → active creature
- ordinary scenery → hazard

The initial appearance and transformed result are data.

The universal behavior is trigger + transform/replace.

## Creature Blocks

Creature blocks represent creatures rather than becoming independent world-building systems.

Initial categories:

- player
- monster
- NPC

Specific monster art/data can be expanded later.

## Monster Face-Art Reuse

DND Blocks should reuse the **Chris-approved Iron Pit monster silhouettes** as the default face/standee artwork for matching monsters rather than creating a second monster-art system.

Authoritative Iron Pit source:

- repository: `cbw29512/D20-ironpit`
- processed monster art: `frontend/assets/portraits/monsters/{id}.webp`
- inventory: `docs/artifacts/card-art/REAL_ART_INVENTORY.md`
- mapping/provenance: `frontend/combatant-art.js`

Current Iron Pit inventory records **294 approved monster silhouettes**.

Processed monster assets are already:

- 3:4 WebP
- 480×640
- under 20 KB each
- mapped across matching 2014/2024 creature IDs when the creature is genuinely the same

DND Blocks rendering rule:

- monster identity/data remains catalog-driven
- the monster cube references a silhouette asset by creature/art ID
- do not write monster-specific rendering code
- use the silhouette on the cube faces
- preserve distinct artwork for distinct creatures/variants where Iron Pit already does so
- do not silently substitute a related creature image merely because the name is similar
- creature footprint comes from size data, not image dimensions
- missing art falls back to a generic approved creature marker until proper art exists

The Iron Pit asset inventory/mapping should be treated as the source of truth for which silhouette belongs to which monster.

Before copying or packaging the assets into a public release, record the asset provenance/license in the DND Blocks dependency/asset register.

Creature footprints:

- Small: 1x1
- Medium: 1x1
- Large: 2x2
- Huge: 3x3
- Gargantuan: 4x4
- Tiny: shares a 5-foot square using the current Tiny visual-offset contract

A multi-square creature remains one entity.

## Hidden/Interactive Blocks

Initial relevant behaviors:

- hidden from players
- revealable
- trigger on entry
- movement-lock effect
- openable
- toggleable
- movable
- lockable

These are universal behaviors.

A trap is not a special engine.

For the requested first trap:

- appearance/source = trap
- visibility = DM-only until revealed/triggered
- trigger = entity enters cell
- effect = movement lock
- release authority = DM

## Room Context

The room/theme may influence which blocks appear first in the sidebar.

Example:

An Inn may prioritize:

- table
- chair
- barrel
- fireplace
- door

A Castle may prioritize:

- stone wall
- door
- torch
- table
- chest

A Field may prioritize:

- grass
- tree
- rock
- bush
- creature

This is a UI filtering/convenience feature.

The same underlying catalog object can be reused in multiple themes.

## Deferred Idea

The earlier "date" entry was a typo and is not part of the initial catalog.

A calendar/date-display block is a possible future idea only. Do not add it to MVP unless a concrete use case justifies it.


## Creature labels and base rings (2026-10-08)

Characters and Monsters display camera-facing name text above their existing perfect cubes. Monsters always have a red ground ring. Players select a non-red ring color before placing a Character: blue, green, yellow, purple, orange or white; the selected ring color is persisted per WorldObject. Existing characters default blue. Build and Props are unaffected. These are visual components and not separate map objects or game effects.

## Creature identity rings and official condition markers — October 2026

**Identity:** Six draggable player rings (blue, green, yellow, purple, orange, white) can be dropped onto an existing Character cube. One color belongs to one character across a map. The assigned color disappears from the available palette; changing colors releases the old one, and removing that character releases the color. Previously saved duplicate/default colors are normalized on map load. Monsters always display a **red** identity ring and cannot receive player rings. Unassigned characters have no identity ring. Build/Props are unaffected.

**Condition rings:** The DM can drag one of the 15 official 5e conditions onto any Character or Monster. Dropping the same non-Exhaustion condition again removes it. Several conditions can coexist; the renderer uses up to four concentric outer status rings and a camera-facing text indicator. The stored record retains **all** applied conditions even if more than four are active. Exhaustion cycles through levels 1–6 and then clears; it is a level, not a Boolean. The 15 conditions, shared by 2014 and 2024, are Blinded, Charmed, Deafened, Exhaustion, Frightened, Grappled, Incapacitated, Invisible, Paralyzed, Petrified, Poisoned, Prone, Restrained, Stunned, and Unconscious.

Source: D&D Beyond 2024 Basic Rules, https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game and D&D Beyond 2014 Appendix A, https://www.dndbeyond.com/sources/dnd/basic-rules-2014/appendix-a-conditions.

**Rules boundary:** These are **visual, persistent DM markers only**. They do not automatically apply advantage, speed, concentration, saves, etc. Mechanical differences between 2014 and 2024 remain the DM's responsibility, not a hidden shared rules engine.

All marker changes edit one WorldObject through the existing Undo/Redo system. The logical creature is never duplicated. HTML drag-and-drop is a desktop interaction; a touch-compatible mode should follow in a later usability pass. Source and checked-in browser modules updated together. Browser validation pending.

Each condition now has a **stable distinct ring color** (the same color in the draggable status token and the outer cube indicator). Red remains reserved for monster identity. Old saved maps with duplicate or disallowed player colors are normalized on load without deleting any creatures.


### Click-to-move creatures (2026-10-08)

After placing a Character or Monster, click its cube to pick up the logical piece, then click a grid square to put it down. Escape cancels. This is an undoable coordinate update, not remove/recreate: the creature keeps its identity, name (from catalog), ring color, conditions and exhaustion. Build and Props cannot be picked up via this interaction. Destination is DM-authoritative and uses the current square at the creature's existing elevation; no automatic pathfinding/rules. Works in 3D and fallback board. Verification pending.
