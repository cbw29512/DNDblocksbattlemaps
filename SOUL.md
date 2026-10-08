# DND Blocks Battle Maps — SOUL.md

## Purpose

DND Blocks Battle Maps is a browser-based virtual tabletop built around one idea:

> The DM builds the world from simple, grid-snapped blocks and remains the final authority over the game.

It should feel like using a box of magnetic dungeon terrain on a physical table, not configuring a complicated VTT.

## Cube-Only World

The board is built from perfect 5-foot cubes.

- every player character is one 5-ft cube
- Small/Medium creatures use one cube
- Large creatures use a 2×2 cube footprint
- Huge creatures use a 3×3 cube footprint
- Gargantuan creatures use a 4×4 cube footprint
- multi-cube creatures remain one logical entity
- props, doors, traps, furniture, monsters, and characters are identified by face artwork/state, not custom 3D mesh shape
- a barrel is a cube with barrel art on its faces
- a door is a cube with door art on its faces
- no cylinders, standees, thin doors, rectangular furniture meshes, or arbitrary board models

This cube language is the core product identity.

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

## Public Website Is Part of the Product

The public website is not a separate brochure. It is the front door to the product.

It must:

- look polished and trustworthy
- explain the product immediately
- make **Build a Map** and **Join a Game** obvious
- show the actual block-map product prominently
- let a visitor reach a usable map with minimal friction
- keep marketing and application in one coherent experience

A visitor should not have to understand VTT terminology before starting.

See `docs/WEBSITE_EXPERIENCE.md`.

## Deployment Discipline

Development and testing are local-first.

- run normal development locally
- run automated tests locally
- visually inspect locally
- GitHub pushes are coherent checkpoints
- Netlify production deploys are deliberate milestones, not every experiment
- verify the live Netlify site after a production release
- preserve rollback to a known-good release

The user has an existing paid/Plus Netlify plan, but plan capacity is not an excuse for wasteful deploys.

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
- Tiny creatures share a 5-foot square; up to four are auto-offset visually by default rather than introducing a permanent 2.5-foot subgrid.

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

**Left-click a block/tool in the sidebar → a placement ghost appears → left-click the map to place → keep clicking to place more copies → choose another tool/Select/Done/Escape to stop.**

Palette selection persists until deliberately changed or cleared.

Blocks snap to the grid.

Natural manual stacking uses the hovered surface: floor places on the floor level, top face places one 5-foot level above, and side face places adjacent at the clicked block's base elevation. A visible elevation control in feet provides an exact-height escape hatch. Unsupported/floating placement remains allowed because the DM is authoritative.

Unlocked movable objects use a pick-up/put-down model rather than transform gizmos. Ambiguous overlapping objects use a tiny contextual "What's Here?" chooser only when needed.

Undo/Redo is required safety infrastructure for fast confirmation-free editing. See `docs/PLACEMENT_CONTRACT.md`.

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

Camera stays at a fixed tabletop-style elevation near 30° above the board plane for MVP, with horizontal orbit, pan, zoom, and an obvious Reset/Home control. Do not allow free vertical tilt or first-person/free-fly camera in MVP. See `docs/CAMERA_CONTRACT.md`.

## DM Placement Authority

The DM may place any block, object, creature, hazard, or trigger in any grid location or supported elevation.

BUILD mode must not reject placement merely because the destination is occupied or the combination is unusual.

Examples that must be possible include:

- monster in an open pit
- creature standing on a hidden trap
- pressure plate beneath a rug
- trap beneath a table
- creature in fire/lava/hazard space
- several triggers sharing a cell
- treasure inside a trapped chest
- monster in a doorway

The interface may warn about overlap, but the DM remains authoritative.

Placement rules and PLAY movement/blocking rules are separate concepts.

## Universal Trigger / Effect Rule

Traps, hazards, surprise objects, and transforming objects should be assembled from reusable behavior:

**Trigger → Target → Effect(s) → Duration/End → optional Detect/Disarm**

Do not build a separate engine for each named trap.

A universal transform/replace effect must support object-to-creature or object-to-object surprises such as chest → mimic, statue → gargoyle, armor → animated armor, or bones → skeleton.

See `docs/TRAPS_AND_EFFECTS.md`.

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

With a 5-foot grid, **40 ft × 20 ft** means an **8×4-square usable interior**. Room dimensions are entered in feet and describe interior playable space; wall thickness is outside that requested interior.

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

## Player Join and Ownership

MVP player flow is deliberately low-friction:

- DM has a durable signed-in identity because the DM owns/saves games.
- Player uses **Join as Player** with a game link/code and display name.
- A permanent standalone player account is not required for MVP.
- DM assigns one or more game pieces to a joined player, optimized around one primary character.
- Players move only assigned pieces and interact only with permitted objects.
- Movement locks stop player movement but never remove DM override.
- DM can always move, reassign, reveal, unlock, or correct state.

See `docs/PLAYER_JOIN_CONTRACT.md`.

## Multiplayer Authority

- The DM owns the world state.
- Players control assigned entities.
- The DM can move any entity.
- The DM can change visibility.
- The DM can lock/unlock construction.
- The DM can freeze/unfreeze player movement.
- Board changes synchronize in real time.
- Maps persist across reloads.

## Persistence and Recovery

Current authoritative board state must be stored separately from bounded recent edit history.

- opening a map loads current state directly
- every committed board edit autosaves
- there is no required manual Save button for ordinary work
- Undo commits an inverse/compensating edit rather than deleting history
- Redo reapplies an undone edit when still safe
- every edit has a unique action ID
- each game/map has a monotonically increasing revision
- reconnect deduplicates actions and refreshes current state if a revision gap is detected
- realtime movement sends logical grid moves, not animation frames
- important state such as hidden/revealed objects, transforms, ownership, and movement locks must survive crashes/reconnects
- do not build CRDT/offline-first complexity unless testing proves it necessary

See `docs/PERSISTENCE_UNDO_CONTRACT.md`.

## MVP Definition of Done

The MVP is complete when:

- A DM can create a game/map.
- The board uses 5-foot grid squares.
- The DM can place basic terrain.
- The DM can place walls and doors.
- The DM can place basic furniture/objects.
- The DM can place creatures and player pieces.
- Creature footprints support Tiny/Small/Medium/Large/Huge/Gargantuan behavior, with Tiny pieces sharing a 5-foot square and auto-offset visually.
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

## Selected MVP Architecture

The accepted MVP architecture is:

- TypeScript
- Vite
- Three.js
- native HTML/CSS UI first
- Supabase hosted service for Postgres/Auth/Realtime in MVP
- Netlify for static frontend hosting
- no custom application server initially
- no React/Vue/Svelte unless real UI complexity justifies one
- no CRDT layer unless real concurrent-edit testing proves necessary

The renderer is never canonical state. Data/state drives rendering.

See `docs/ADR_001_MVP_WEB_STACK.md` and `docs/DEPENDENCY_REGISTER.md`.

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

## Multi-campaign product direction (2026-10-08)
- DM manages multiple campaigns; each campaign owns its characters, Party, saved maps and active-map choice. No accidental cross-campaign data sharing.
- My Map Library contains reusable master maps; inserting one into a campaign produces an independent editable copy.
- Before creating campaign features, follow the idempotent non-destructive legacy save/backup migration and staged completion gates in `docs/CAMPAIGN_MAP_LIBRARY_PLAN.md`. Never destroy existing maps or misrepresent local browser storage as cloud sync.

## Mandatory anti-drift rule
Before every manual or hourly work session, read and obey `docs/ANTI_DRIFT.md`. One checked gate at a time, no duplicate investigations, no silent contract changes, no data destruction, exact-head CI evidence and live proof separately.

## LOCKED: Recognizable cube-first visual identity (2026-10-08)
**DND Blocks must look like DND Blocks.** All visible battlefield assets and game effects are represented as exact 5-foot cube units or assemblies of those cubes. No smooth-sphere fireball mesh, smooth cone breath weapon, conventional circular spell template or non-cube creature model replaces the cube presentation. Terrain, flooring, walls, furniture, players, monsters, visual status indicators, range previews, and damage areas must preserve visible cube/grid language. Render a RAW 20-foot-radius Fireball as the affected translucent red cube cells (not an eight-cube-wide solid box); cone, line, cylinder and other effects similarly occupy the RAW-affected cells, with visible 5-foot seams and roughly 50% opacity while previewing. Shape math can be continuous internally for RAW resolution, but display always projects to cubes. Every creature is one logical entity; Large=2×2×2, Huge=3×3×3, Gargantuan=4×4×4. This recognizable cube aesthetic is a product invariant; changing it requires explicit user approval.

## LOCKED: whole-cell AoE display and discrete resolution
A 5-foot grid cell is displayed as either affected (a full translucent cube) or unaffected (no overlay). Never show fractional cubes or prorate spell damage by fractional square coverage. The inclusion predicate must be audited against the selected 2014/2024 grid/area rules; a geometric sliver is not automatically proof of RAW inclusion. Larger creatures are evaluated over their full occupied space. Normal saving throws, damage, resistances and immunity still apply.

## LOCKED: per-edition, per-ability RAW measurements (2026-10-08)
Never infer area dimensions from a shared effect name, a generic color, a similar spell or a creature family. Every selectable spell, weapon or monster action is keyed by its source entity and **rules edition (2014 or 2024)**, with independently verified shape, dimensions (radius vs diameter vs length/width/height), range, origin, target restrictions, saving throw, damage and any special text. The same name can map to different edition-specific definitions. Dragon breath must bind the actual monster/age/color/action instead of a guessed generic cone or line. Store rule source and verification status with each definition; unverified entries may be labeled illustrative previews but cannot claim RAW targeting or automatic damage. A campaign's preferred edition does not erase an action's source edition; any edition mixing requires explicit designation rather than silently substituting values.

## Locked: Self-origin effects begin at caster (2026-10-08)
For any spell or monster ability with a rules-defined range/origin of **Self**, the area starts at the explicitly selected caster's occupied space; pointer motion selects only its **direction**, not a new starting point. Grid placement must not detach the line/cone from the source. The source creature's complete footprint and the edition/ability-specific origin rule still require RAW certification. Point-targeted/ranged area effects remain independently positionable within their legal range.

## Spell placement interaction and audit contract (2026-10-08)
- Desktop: choosing an area ability in the dropdown arms preview (when a caster is selected); pointer motion positions the effect, left-click records the cast, right-click/Escape cancels. After Cast or Cancel, reset the selected ability option so the *same* ability can be selected again immediately. Touch: select ability, tap board to position, then use explicit Cast or Cancel to avoid accidental casts. Target visuals/log include all creatures inside area, including allies and the caster, not only enemies. Clear Markers only removes temporary yellow post-cast outlines and must not erase the combat log or world objects. Keep the combat log in the collapsible board-side panel and the left toolbar in collapsible logical groups. Keep browser JS parity and verify CI before merging; browser/touch appearance requires actual interactive QA. Damage and saves are separate from geometric coverage.

## Mobile cast control availability (2026-10-08)
The touch workflow must never depend on horizontal scrolling to locate Cast/Cancel while aiming. Show reachable map-side Cast and Cancel actions only while a spell is armed, using the same underlying cast/cancel handlers; enable Cast only after valid positioning. Desktop left-click casts and right-click cancels. Verify on real touch devices before declaring certified.

## Spell cancellation must clear provisional targeting (2026-10-08)
When an area preview is canceled by right-click, Escape, or Cancel, clear both the projected area cubes and provisional creature target outlines, while preserving existing combat-log entries and world objects. Cast is the only action that records a new area-hit log entry or retains the confirmed cast markers. Re-arming another spell clears old markers.

## Cube art legibility and appearance (2026-10-08)
Preserve every exact 5-foot cube and the current multi-cube creature footprint; visual improvements must be done with face artwork, material response, lighting, and overlays, never non-cube meshes. Keep face art aspect ratio when rasterizing and letterbox it over its catalog color rather than stretching portraits/icons. Cube faces should respond to scene illumination so players can distinguish their visible planes. Do not remove identifying creature labels or status rings. Keep GPU/material caching and image-load fallbacks intact. Actual visual acceptance requires desktop/touch screenshots and a check for overexposure.

## Building block visual scope (2026-10-08)
All catalog Build and Props cubes must receive square face artwork; do not silently leave generic icon/name placards. Surface materials get distinctive patterned faces; remaining structural and prop blocks get inset themed illustration faces. Use the same exact cube geometry and 5-foot footprint. Keep Characters and Monsters portrait logic untouched. Document exceptions and verify full catalog with automated coverage tests.
