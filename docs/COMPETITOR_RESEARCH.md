# Competitor Research

> Research snapshot: 2026-10-07
>
> Purpose: identify products close to the DND Blocks Battle Maps concept and record where this project should deliberately differ. This is product research, not an implementation specification.

## Summary

The core idea is **not unique**. Several products already provide 3D or voxel-style virtual tabletops.

The closest current competitor found is **Terrablox**, which explicitly describes itself as a 3D voxel VTT where the GM builds the map from blocks and places tokens.

The closest browser-based product found is **VOXEL Tabletop**, an HTML5 prototype that converts uploaded maps into voxel-style 3D environments and includes VTT features.

However, the intended DND Blocks Battle Maps product can still occupy a narrower position:

> **A deliberately simple, browser-first digital box of magnetic-style D&D battle-map blocks where the DM can build a playable encounter in minutes without learning a 3D world-building application.**

The competitive advantage should be **setup speed and simplicity**, not visual fidelity or feature count.

## Closest Products

### Terrablox

Sources:

- Steam: https://store.steampowered.com/app/4842910/Terrablox/
- itch.io developer page: https://hillhand.itch.io/terrablox

Observed features:

- Explicitly markets itself as a 3D voxel virtual tabletop.
- GM builds maps with voxels.
- Paint-style placement and drag-to-fill tools.
- Supports shapes such as walls, ramps, pyramids, and hills.
- Tokens and standees.
- 3D fog of war and player vision.
- Dice and turn tracking.
- Custom measurement units.
- Multiplayer is peer-to-peer.
- Downloadable application rather than browser-first.
- Current 2026 development activity is visible on itch.io.

Why it matters:

Terrablox is the **closest direct conceptual competitor** found so far.

Where DND Blocks Battle Maps should differ:

- Browser-first/no-install experience.
- Strong fixed 5-foot tabletop scale by default.
- Named semantic blocks such as grass, wall, door, torch, table, orc, etc., rather than primarily generic voxel construction.
- Extremely limited initial controls.
- DM-controlled visibility without requiring full 3D lighting/vision simulation.
- BUILD and PLAY as the main mental model.
- Parametric prefab rooms optimized for encounter setup.
- Optional rules instead of becoming a feature-heavy game engine.

### VOXEL Tabletop

Source:

- https://duckpublishing.itch.io/voxel

Observed features:

- HTML5/browser prototype.
- Converts uploaded image/PDF maps into flat or voxel-style 3D boards.
- Token/miniature support.
- D&D Beyond character link support.
- Initiative, measuring, fog, effects, music, and other VTT features.
- Its published guide states the static itch.io build did not include live online multiplayer at that snapshot, although development logs mention multiplayer work.

Why it matters:

This is the closest browser-based voxel VTT found.

Where DND Blocks Battle Maps should differ:

- Building directly from simple tabletop blocks is the primary workflow.
- An uploaded 2D map should not be required.
- Multiplayer is a core product goal rather than an optional later layer.
- Avoid character-sheet integrations and feature accumulation in the MVP.
- Optimize for a DM creating a room/encounter from nothing very quickly.

### TaleSpire

Source:

- https://talespire.com/
- https://talespire.com/faq
- https://store.steampowered.com/app/720620/TaleSpire/

Observed features:

- 3D VTT with tile-based building.
- Persistent shared boards.
- Real-time synchronization.
- Community slabs/premade structures.
- Minis, dice, rulers, effects, vision systems, mods, and more.
- Distributed as an application rather than a simple browser-first board.

Important lesson:

TaleSpire validates the appeal of physical-looking digital terrain, but its breadth and detailed construction also create prep-time and learning-curve complaints.

DND Blocks Battle Maps should not attempt to match TaleSpire's visual richness.

### The RPG Engine

Source:

- https://store.steampowered.com/app/1818180/The_RPG_Engine/

Observed features:

- Full 3D VTT/world builder.
- Terrain sculpting and painting.
- Interactive props.
- Character creation.
- Imported assets.
- Online play.
- Workshop sharing.
- Large feature surface.
- Steam application with paid builder/GM editions beyond the free base version.

Important lesson:

Feature richness is not our target. The product should avoid becoming a general-purpose 3D world-building suite.

### RPG Stories

Source:

- https://www.bravealice.com/rpgstoriesvtt

Observed features:

- 3D world-builder and multiplayer VTT.
- Thousands of 3D models.
- Click-and-draw building.
- Auto-build profiles for rooms, dungeons, outdoor scenes, and larger environments.
- Steam-oriented application.

Important lesson:

Fast auto-building and reusable profiles are valuable. Our prefab-room concept should pursue the same time-saving goal while remaining much simpler and block-based.

## Repeated Pain Points Found in User Discussions

Community discussions around 3D VTTs repeatedly mention:

- excessive DM preparation time
- complicated interfaces
- learning curves
- the temptation to overbuild/detail every scene
- hardware requirements
- installation/application requirements
- players needing to learn another tool
- 3D presentation becoming more work than the encounter is worth

This reinforces the current product philosophy.

## Competitive Position

Do **not** compete on:

- maximum 3D realism
- huge asset counts
- dynamic lighting sophistication
- automated rules
- character creators
- animation
- detailed terrain sculpting
- hundreds of settings

Compete on:

1. **Open browser and play.**
2. **Build a usable encounter in minutes.**
3. **One 5-foot square means one obvious tabletop unit.**
4. **Blocks visually say what they are.**
5. **Minimal configuration.**
6. **DM remains in control.**
7. **Players get an extremely small interface.**
8. **Hide/reveal is simple and manual first.**
9. **Prefab rooms reduce repetitive construction.**
10. **Cheap infrastructure and broad hardware accessibility.**

## Product Test

A future prototype should be judged against this question:

> Can a DM who has never used the product create a simple dungeon room, add a door, table, torch, hidden trap, two monsters, assign player pieces, share the game, and begin play without reading a manual?

If not, simplify before adding features.

## Current Conclusion

There is real competition in voxel/3D VTTs.

That does **not** invalidate the project.

It changes the product thesis from:

> "No one has made a block VTT."

to:

> "Existing 3D/voxel VTTs prove demand, but DND Blocks Battle Maps will try to make this experience radically simpler, cheaper, browser-first, and faster to prepare."

The closest product to watch is **Terrablox**.

The closest browser product to watch is **VOXEL Tabletop**.

This research should be revisited before major product milestones because these competitors are actively changing.
