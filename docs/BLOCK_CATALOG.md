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

## Live Starter Catalog

The first live catalog is deliberately bounded and grouped into four kid-readable tabs.

**Build:** Stone, Stone Wall, Wood, Wood Wall, Door, Pillar.

**Props:** Table, Chair, Bed, Chest, Barrel, Crate, Torch.

**Characters:** Fighter, Cleric, Rogue, Wizard. These use local copies of the approved Iron Pit 2024 hero portrait art.

**Monsters:** Goblin, Skeleton, Zombie, Wolf, Mimic, Ghoul, Kobold, Bandit, plus the legacy generic Orc so existing saved prototype maps remain readable.

The catalog schema carries category, cube footprint, color, optional face art reference, and optional tags.

**Hard geometry rule:** every board object is rendered from 5-ft cubes. A barrel, door, table, torch, character, and monster all remain cube-based; identity is communicated by face artwork/material.

Small/Medium/player pieces use one cube. Large/Huge/Gargantuan creatures use 2×2 / 3×3 / 4×4 cube footprints while remaining one logical entity.

Rendering remains generic: no FighterRenderer, GoblinRenderer, ChestRenderer, etc.

The first combatant art is bundled locally in DND Blocks; the browser does not hot-link Iron Pit.

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

Keep the initial library small.

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
- the monster block/standee references a silhouette asset by creature/art ID
- do not write monster-specific rendering code
- use the silhouette on the visible face/standee surface
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
