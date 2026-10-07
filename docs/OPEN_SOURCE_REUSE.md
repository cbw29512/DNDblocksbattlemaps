# Open-Source Reuse and Minecraft Reference Policy

> Research snapshot: 2026-10-07
>
> Purpose: define what DND Blocks Battle Maps may learn from, reuse, or avoid before any implementation begins.

## Core Decision

Minecraft may be used as a **design and catalog reference**.

Minecraft code, textures, sounds, models, game files, and recognizable proprietary block artwork must **not** be copied into this project.

Open-source engines/libraries may be reused only after their licenses are verified and recorded.

## Minecraft

Official sources reviewed:

- Minecraft EULA: https://www.minecraft.net/en-us/eula
- Minecraft Usage Guidelines: https://www.minecraft.net/en-us/usage-guidelines
- Microsoft Minecraft creator documentation for inventory/category concepts

The Minecraft EULA says users may not distribute or commercially use Mojang/Microsoft game software or content without permission. It also specifically states that a Minecraft block, including its textures and its "look and feel," is owned by them.

Therefore:

### Allowed as inspiration

We can learn from broad interaction ideas such as:

- block-based construction
- grid/voxel placement
- obvious material families
- creative-inventory organization
- grouping similar building materials
- left-click/right-click simplicity as our own chosen interaction
- broad concepts such as natural, construction, functional, colored/decorative, or utility groupings

We can build original equivalents such as:

- grass terrain
- dirt terrain
- stone wall
- wood wall
- stairs
- door
- trapdoor
- fence
- torch/light
- chest/container
- table
- bed
- fireplace
- water
- lava
- tree
- rock

These are ordinary real-world/fantasy concepts and should use **our own names where appropriate, original art, and our own behavior/data definitions**.

### Do not copy

Do not copy or extract:

- Minecraft source code
- Minecraft client/server code
- Minecraft textures
- Minecraft models
- Minecraft sounds
- Minecraft logos
- Minecraft UI art
- Minecraft game files
- Minecraft-specific proprietary block art/look
- downloadable Minecraft assets merely because they can be found online

Do not make the product appear official, endorsed by, or affiliated with Minecraft/Mojang/Microsoft.

## Minecraft Catalog Lesson

Minecraft's creator/creative-inventory documentation demonstrates an important usability principle: large catalogs are easier to use when grouped into a few obvious families.

DND Blocks Battle Maps should use this lesson without reproducing Minecraft's inventory.

Candidate top-level families for our product:

### Terrain

- grass
- dirt
- sand
- stone
- snow/ice
- water
- lava
- mud/swamp
- cave/rock
- wood/forest ground

### Construction

- floors
- walls
- stairs
- doors
- gates
- fences
- columns
- bridges
- windows/openings

### Furniture / Room Objects

- table
- chair
- bed
- chest
- barrel
- crate
- bookshelf
- altar
- fireplace
- statue
- rug

### Lights / Utility

- torch
- lantern
- brazier
- campfire
- magical light marker

### Hazards / Secrets

- pit
- trap
- hidden door
- difficult terrain marker
- web/restraint source
- pressure/trigger tile

### Creatures

- player
- NPC
- monster

The visible palette should remain contextual. A child should not have to browse hundreds of blocks at once.

Example:

- Castle -> stone walls, doors, torch, table, chest, banners/props
- Inn -> wood walls, door, table, chair, bed, fireplace, barrel
- Field -> grass, dirt, tree, rock, bush, water
- Sea -> water, dock, boat/ship-related blocks, rock
- Volcano -> dark rock, lava, bridge, fire/light hazards

## Open-Source Candidates

### Three.js

Source: https://github.com/mrdoob/three.js

License: MIT.

Why it is relevant:

- browser-native 3D rendering
- mature
- permissive commercial license
- scene picking/raycasting can support click-to-place behavior
- cubes/meshes/instancing can support a simple block board
- does not force a full game architecture on us

Current view:

**Strong candidate for the rendering layer.**

Do not select it permanently until the architecture decision stage.

### Babylon.js

Sources:

- https://www.babylonjs.com/
- https://github.com/BabylonJS/Babylon.js

License: Apache-2.0 for core packages.

Why it is relevant:

- designed for web 3D
- scene picking
- cameras
- meshes
- WebGL/WebGPU
- GUI and interaction systems
- active project

Current view:

**Strong alternative to Three.js.**

It provides more built-in engine behavior than we may need. Simplicity and bundle/architecture cost should be compared before selection.

### Luanti (formerly Minetest)

Source: https://www.luanti.org/

License: LGPL 2.1+ for the engine; artwork has separate Creative Commons licensing.

Why it is relevant:

- mature voxel engine
- useful architectural reference for voxel/block worlds
- low-end hardware experience can inform performance thinking

Why it is probably not the base for this project:

- not browser-first in the way our product requires
- much larger game-engine scope
- LGPL obligations are more involved than MIT/Apache
- would likely pull the project toward a Minecraft-like game rather than a simple battle-map application

Current view:

**Research/reference source, not preferred foundation.**

### Terasology

Source: https://github.com/MovingBlocks/Terasology

License:

- code: Apache-2.0
- artwork: generally CC BY 4.0, with credits/exceptions requiring review

Why it is relevant:

- open-source voxel-world architecture
- permissive code license
- useful examples of block/world systems

Why it is probably not the base:

- Java/full game engine
- large architecture
- desktop/game-world focus instead of a small browser VTT

Current view:

**Useful reference; not preferred foundation.**

### Small Browser Voxel Projects

Examples found:

- VoxelCraft: TypeScript + Three.js, MIT
- Minecraft-Like-Voxel-Game: JavaScript, MIT
- voxel-engine/voxel.js lineage: JavaScript + Three.js, open source

Potential value:

These projects may provide small, inspectable examples for:

- block picking
- voxel storage
- chunking
- mesh generation
- block placement/removal
- browser performance strategies

Policy:

Do not copy code from any repository until:

1. the exact repository is identified
2. its current license is read
3. the specific code we want is understood
4. attribution/notice requirements are recorded
5. reuse is actually simpler than implementing the small behavior ourselves

## Preferred Reuse Strategy

Do **not** start by forking a Minecraft clone or large voxel game engine.

Our product does not need:

- infinite procedural worlds
- crafting
- survival
- first-person movement
- mining
- physics-heavy gameplay
- biome simulation
- day/night cycles
- redstone-like systems
- game AI

The likely cheapest and least-drifty path is:

1. use a mature permissively licensed browser 3D renderer
2. implement our small board/world state ourselves
3. borrow only proven generic techniques from open-source voxel projects when they materially save work
4. create original block art/assets
5. keep multiplayer/persistence separate from rendering

This preserves our simple data model and avoids inheriting thousands of lines of unrelated game-engine code.

## License Gate

Before importing any external code or asset into the repository, record:

- project/repository name
- exact URL
- exact version/commit if applicable
- license
- attribution requirements
- whether modification/distribution is allowed
- whether commercial use is allowed
- copied files/components
- reason reuse is better than a small original implementation

No external code or art enters the project without this check.

## Current Recommendation

For the eventual architecture comparison, start with:

1. **Three.js** — preferred first candidate because it is browser-focused, MIT licensed, and leaves us in control of the small architecture.
2. **Babylon.js** — compare as the more batteries-included browser alternative.
3. **Small MIT-licensed voxel examples** — use only as reference or selective reusable algorithms after license/code review.
4. **Luanti/Terasology** — study concepts but avoid using them as the main product foundation unless a future requirement changes dramatically.

No technology selection is final yet.


## Web-First Architecture Rule

All future reuse decisions should prioritize browser compatibility and the smallest deployable architecture.

Current default preference:

- static browser frontend
- mature permissive 3D library
- hosted open-source backend/realtime service on a free tier
- no custom application server unless a proven requirement needs one

See `TECH_STACK_CANDIDATES.md` for the current candidate stack and pricing snapshot.
