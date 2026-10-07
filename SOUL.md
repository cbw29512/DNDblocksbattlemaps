# DND Blocks Battle Maps — SOUL.md

## Purpose

DND Blocks Battle Maps is a browser-based virtual tabletop built around one idea:

> The DM builds the world from simple, grid-snapped blocks and remains the final authority over the game.

It should feel like using a box of magnetic dungeon terrain on a physical table, not configuring a complicated VTT.

## Prime Directives

1. **Simple first.** The fastest path from an idea to a playable encounter wins.
2. **Kid-simple UI.** A child should be able to understand the basic build/play flow without reading a manual.
3. **Cheap first.** Prefer reliable free or near-free infrastructure until the product proves it needs more.
4. **The DM is the game engine.** Rules automation is optional and must never be required to use the board.
5. **Everything is data-driven.** Terrain, furniture, doors, traps, players, monsters, and decorations share universal object behavior wherever possible.
6. **One square represents 5 feet.** The visual grid follows standard tabletop battle-map scale.
7. **No unnecessary rotation.** Blocks should identify themselves clearly from all useful viewing sides.
8. **Placed construction can be locked.** Once locked, a block does not move until the DM unlocks it.
9. **The DM controls visibility.** Objects such as traps, secret doors, creatures, treasure, and encounter elements can be hidden from players and revealed later.
10. **Players control only what they are assigned.** The DM retains authority over every object.
11. **Templates create normal blocks.** Prefab rooms/buildings/encounters are recipes that place ordinary blocks; generated blocks never become a separate engine.
12. **Never add complexity just because another VTT has it.**
13. **Documentation is part of implementation.** Work is not complete until the live project state is updated and pushed to GitHub.

## Mandatory Resume/Handoff Contract

`PROJECT_STATE.md` is the canonical live resume document.

Every work session must begin by reading:

1. `PROJECT_STATE.md`
2. `SOUL.md`
3. the current relevant schema/specification/roadmap documents
4. the actual repository state

Do not rely on chat memory when the repository documents can answer the question.

Every meaningful work session must end by updating and pushing `PROJECT_STATE.md` with:

- Starting State
- Changes Made
- Decisions Made
- Cost Impact
- Result
- Open Questions / Blockers
- Exact Next Step

This rule exists so another AI or human can resume after a crash, context loss, or new chat without reconstructing the project from conversation history.

If code changes but the live handoff document was not updated and pushed, the work session is incomplete.

## Cost Discipline

The project should be built as cheaply as practical during early development.

Before adopting a paid service, hosted dependency, API, database, asset source, or infrastructure component, document:

- what requirement it solves
- free or lower-cost alternatives considered
- expected current cost
- the usage threshold at which cost materially changes
- migration or replacement risk

Do not pay for infrastructure merely for convenience when a dependable free or near-free option satisfies the current requirement.

## Product Experience

The basic DM workflow is:

1. Create or open a map.
2. Select a block type.
3. Click a grid location.
4. The block snaps into place.
5. Lock construction when desired.
6. Place creatures, objects, traps, and player pieces.
7. Hide anything players should not see.
8. Share a join link/code.
9. Play.

The player workflow should be smaller:

1. Join.
2. Receive control of a character.
3. Move that character.
4. Interact with objects the DM permits.
5. See updates from everyone in real time.

## Scale

- 1 grid square = 5 feet.
- Small and Medium creatures: 1×1 squares.
- Large creatures: 2×2.
- Huge creatures: 3×3.
- Gargantuan creatures: 4×4.
- Tiny creature handling is intentionally deferred until its interaction model is designed.

A multi-square creature is one entity with a footprint, not several independent creature blocks.

## Universal Object Principle

Before implementing an object-specific feature, ask:

> What does this object actually do?

Then represent it with existing universal properties or behaviors whenever possible.

Examples:

- Door and chest → openable.
- Trap and hidden monster → hidden/revealable.
- Torch and lamp → toggleable.
- Player, monster, NPC → movable.
- Terrain, wall, furniture → lockable.

Do not create a DoorEngine, TorchEngine, OrcEngine, etc. when a universal mechanic already describes the behavior.

Only introduce a new universal primitive when existing mechanics cannot accurately represent the required behavior.

## Core Object Concepts

Every placed world object should be describable with data such as:

- identity
- type
- appearance reference
- grid position
- vertical position
- footprint
- state
- visibility
- locked/unlocked state
- permissions
- interaction capabilities

Cards/assets/data describe what an object is.

Universal behavior describes what it can do.

## Building

Initial building interaction:

**Left-click a block/tool in the sidebar → left-click the map to place → right-click a placed block to remove.**

The exact repeated-placement behavior after one placement remains to be decided.

Blocks snap to the grid.

Future convenience tools may include:

- click-drag lines
- rectangles
- fill
- duplicate
- copy/paste
- multi-select
- saved groups
- room templates
- building templates
- encounter templates

All convenience tools must produce the same ordinary world objects as manual placement.

Room generation must not automatically create ceilings at the current design stage. Rooms must remain open from above until roof/ceiling behavior is deliberately revisited.

Room dimensions are entered in feet, snap to 5-foot increments, and describe usable interior Length × Width. Height means wall height. See `docs/SPATIAL_CONTRACT.md`.

## Locked Construction

Locking is a universal editing control.

Typical terrain, walls, furniture, traps, lights, and decorations can be protected by a room construction lock.

Locked means their **position/removal is protected** from accidental editing during ordinary play. Allowed object state changes may still occur.

The DM can unlock them at any time.

Player, monster, and NPC pieces remain movable; they are game pieces rather than room construction.

## Hidden Objects

The DM must be able to see objects that players cannot.

Possible hidden objects include:

- traps
- monsters
- secret doors
- treasure
- NPCs
- ambushes
- encounter elements

The DM can reveal them manually.

Advanced line of sight and dynamic lighting are not required for MVP.

A requested first trap behavior is: when an assigned player piece enters the trap cell, the piece receives a reusable movement-lock effect until the DM releases it. Do not create trap-specific movement code when the same effect can be reused by pits, webs, cages, or other sources.

## Prefabricated Rooms

Prefab rooms are an important future feature.

A prefab is a recipe for placing standard blocks.

Example:

**Castle Room — 40 ft × 20 ft**

With a 5-foot grid, the requested playable area can derive an 8×4-square interior if the room-dimension contract defines dimensions as interior space.

The exact meaning of entered dimensions—interior playable size versus exterior wall-to-wall footprint—must be explicitly defined before prefab implementation.

Possible templates:

- Castle Room
- Dungeon Chamber
- Corridor
- Tavern
- House
- Cave
- Forest Clearing
- Temple
- Crypt
- Camp
- Throne Room

After generation, every block can be edited normally.

## Multiplayer Authority

- The DM owns the world state.
- Players control assigned entities.
- The DM can move any entity.
- The DM can change visibility.
- The DM can lock/unlock construction.
- The DM can freeze/unfreeze player movement.
- Board changes synchronize in real time.
- Maps persist across reloads.

## MVP Definition of Done

The MVP is complete when:

- A DM can create a game/map.
- The board uses 5-foot grid squares.
- The DM can place basic terrain.
- The DM can place walls and doors.
- The DM can place basic furniture/objects.
- The DM can place creatures and player pieces.
- Creature footprints support Small/Medium/Large/Huge/Gargantuan sizes.
- Placement snaps to the grid.
- Vertical block placement is possible.
- Objects can be locked/unlocked.
- Objects can be deleted.
- Objects can be hidden from players.
- Hidden objects can be revealed.
- The DM can create/share a join link or code.
- Multiple players can join in a browser.
- Each player can control an assigned character.
- Everyone sees synchronized movement.
- The DM can control all entities.
- The DM can freeze player movement.
- The map saves persistently.
- Reloading restores the board.

## Explicit MVP Non-Goals

Do not add these merely because traditional VTTs have them:

- automated combat
- character sheets
- hit points
- initiative automation
- spell automation
- rules enforcement
- automatic movement allowances
- dynamic lighting
- advanced line of sight
- physics simulation
- animated doors
- detailed 3D models
- free-angle object rotation
- asset marketplace
- procedural dungeon generation
- campaign-management suite
- voice/video chat
- complex macros
- modding/plugin system

## Future Rules Integration

Rules automation may eventually exist, but it must remain modular and optional.

A DM must always be able to say:

> I decide what happens.

Automation assists the DM; it does not replace the DM.

## Anti-Drift Contract

Before implementing any feature:

1. Read `PROJECT_STATE.md`.
2. Read this file.
3. Read the current data schema.
4. Read the current architecture and interaction documentation.
5. Check the actual repository state.
6. Identify the real behavior being requested.
7. Search for an existing universal mechanic that already represents it.
8. Reuse existing mechanics whenever behavior is equivalent.
9. Add a new primitive only when necessary.
10. Keep source-specific appearance/data separate from universal behavior.
11. Update documentation when a product-level decision changes.
12. Update and push `PROJECT_STATE.md` before ending the work session.
13. If implementation and this document disagree, stop and reconcile them before continuing.

## Web-First Reuse Rule

The implementation stack must be web-friendly.

Prefer:

- browser-native technologies
- permissively licensed open-source libraries
- hosted free tiers with open-source/self-host escape paths
- static frontend deployment when possible
- direct browser-to-service architectures when they safely eliminate unnecessary custom servers

Do not build a custom backend, container stack, realtime engine, auth system, renderer, or asset pipeline if a mature open-source/free solution satisfies the actual requirement with less code and less cost.

The project should reuse commodity technology and reserve custom code for the product-specific value: the kid-simple block battle-map experience, data model, permissions, and DM/player interaction.

See `docs/TECH_STACK_CANDIDATES.md`.

## External Reuse Gate

Minecraft may be used as a design/catalog reference only. Do not copy Minecraft code, textures, sounds, models, UI art, game files, or proprietary block artwork/look into this project.

Before importing any external open-source code or asset:

1. identify the exact source/repository
2. read and record its license
3. confirm commercial reuse is allowed
4. record attribution/notice obligations
5. record the exact files/components reused
6. confirm reuse is simpler than a small original implementation

Prefer permissive browser-focused dependencies over adopting a full voxel game engine when the project only needs a small subset of behavior.

See `docs/OPEN_SOURCE_REUSE.md`.

## Current Guiding Image

> A digital box of magnetic dungeon blocks that a DM can dump onto a virtual table and immediately start building with.
