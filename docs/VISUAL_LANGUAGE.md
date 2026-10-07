# Visual Language and Feedback Contract

> Status: Stage 0 product contract.
>
> Goal: every important board state should be understandable at a glance, including by a child, without requiring detailed menus or relying on color alone.

## Overall Style

The visual direction is:

- simple block/voxel forms
- original artwork
- strong silhouettes
- readable at the fixed tabletop camera angle
- low visual noise
- clear icons/labels only when useful
- no attempt at photorealism
- no Minecraft textures/art/look copying

Clarity matters more than realism.

## Visual Cohesion Is a Release Gate

The visual presentation is part of the product value, not optional polish.

A feature can be mechanically correct and still fail a milestone if it makes the board look cheap, inconsistent, unreadable, or like a collection of unrelated asset packs.

Target feel:

> a premium physical dungeon-building toy set viewed on a tabletop

All imported or original pieces should be normalized toward the same visual language:

- chunky readable proportions
- restrained low-poly detail
- consistent material saturation and roughness
- warm tabletop lighting
- strong silhouettes
- clear grid readability
- consistent scale
- consistent catalog thumbnail treatment
- no sudden photorealistic/high-detail asset beside simple blocks

Open-source/CC0 assets are raw material, not the product identity. Imported geometry may be recolored, simplified, rescaled, or selectively used so the set reads as one system.

## Block Identity

A block should identify what it is from all useful viewing directions.

Examples:

- door imagery/shape readable from multiple sides
- torch/light marker visible from multiple sides
- creature silhouette/image repeated or represented so orbiting the camera does not make identity disappear
- material surfaces remain easy to distinguish at normal zoom

Object rotation should not be necessary for identification.

## Terrain

Terrain should use simple original material families such as:

- grass
- dirt
- sand
- stone
- water
- lava
- snow/ice
- swamp/mud
- cave/rock
- wood/plank

Do not make terrain textures so detailed that the grid becomes difficult to read.

Grid lines must remain visible enough for play.

## Builder Form Readability

Primary builder controls must use plain-language labels and readable type.

For the Room Builder:

- write **Length**, **Width**, and **Height** rather than relying on L/W/H abbreviations
- stack the fields vertically in the desktop sidebar rather than squeezing three numeric controls into one row
- show feet clearly beside each value
- use high-contrast input text and labels
- keep helper/limit text readable but visually secondary
- primary actions such as **Build Room** use a full-width, easy-to-hit button

A user should not have to squint or infer what an abbreviation means.

## Placement Ghost

The placement ghost shows:

- selected object's approximate final geometry
- exact grid footprint
- intended elevation
- footprint cells for multi-square creatures
- overlap count/badge only when useful

Visual behavior:

- semi-transparent/ghosted
- clearly different from already-placed objects
- no red invalid placement merely because another object overlaps
- unsupported/floating placement may have a subtle indicator, never a prohibition

The ghost communicates location, not permission.

## Selected Object

A selected object should have a simple high-contrast outline/base treatment.

Do not rely on color alone.

Possible combination:

- outline
- small selection marker
- subtle base ring
- name label only when needed

Avoid large floating property panels by default.

## Player-Owned Piece

A player must immediately know which piece is theirs.

Use at least two cues:

- ownership/base ring or outline
- "YOU" or player-name label

Do not rely on ring color alone.

Other players' names may be visible if the DM/game allows normal name labels.

## DM-Controlled / Unassigned Creature

DM-controlled monsters/NPCs do not need permanent ownership decoration.

DM may see a small control/ownership hint when selecting them.

Players should not see DM-only control metadata.

## Hidden / DM-Only Object

A hidden object is visible to the DM but absent from the player's view.

DM visual treatment should be unmistakable:

- ghosted/translucent form or outline
- small hidden/eye-slash style marker
- optional "HIDDEN" label on hover/selection

Do not rely on transparency alone.

Examples:

- trap
- secret door
- hidden monster
- concealed treasure
- trigger tile

Player view shows none of these hidden indicators.

## Locked Construction

Locked construction should not permanently cover the board in padlock icons.

Normal view:

- looks like ordinary construction

When DM hovers/selects/tries to move:

- show small lock icon/label
- refuse movement/removal
- allow permitted state changes such as opening a door

Room-level lock state should be visible in the room/sidebar control.

## Interactable Object

Player-interactable objects should not constantly glow or clutter the map.

When relevant/hovered/selected:

- show a small hand/use icon or simple "Interact" action
- keep the action near the object or in a small contextual control

Examples:

- door
- chest
- lever
- switch
- mysterious object

A disguised object can expose only the interaction appropriate to its current visible identity.

## Transform / Surprise

Transform/replace should be visually immediate and clear.

Example chest -> mimic:

1. chest form disappears
2. mimic creature form appears in the same position
3. ownership/category cues update
4. any hidden/reveal cue updates
5. footprint updates if needed

A short lightweight visual transition may be added later, but animation is not required for MVP.

State correctness matters more than animation.

## Triggered Trap / Hazard

When a hidden hazard triggers:

- reveal it if its configured effect says to reveal
- show affected player state clearly
- use simple markers such as "STUCK", lock, restrained/web icon, open-pit visual, etc.
- DM retains the control to clear/override

Do not turn trap resolution into a cinematic effects system.

## Movement Lock

A movement-locked player's piece should show:

- small lock/restriction marker
- plain-language state such as "STUCK" where appropriate

The player should understand immediately why movement is not working.

The DM should have a direct Clear/Unlock action when the piece is selected.

## Tiny Creatures

The grid remains 5-foot.

For Tiny pieces sharing one square:

- render each Tiny piece smaller than Small/Medium
- auto-place the first four into four visual sub-positions within the 5-foot square
- these are visual offsets, not a new global grid
- if DM intentionally overlaps more, preserve all entities and use overlap selection as needed

Do not make players manually choose 2.5-foot coordinates.

## Large/Huge/Gargantuan Creatures

Their base/footprint treatment should make the occupied grid area obvious.

- Large = 2x2
- Huge = 3x3
- Gargantuan = 4x4

The creature remains one entity.

The selection/ownership outline should wrap the complete footprint.

## Overlap Indicator

When multiple objects occupy the same target location and selection is ambiguous:

- show a small stack/count indicator on hover/selection
- clicking opens the minimal "What's Here?" chooser

Do not permanently display overlap counts across the entire map.

## Room Preview

Room generation preview should show:

- a bright **corner marker** on the exact anchor square
- full room footprint
- wall perimeter / outer bounds
- wall height indication
- no ceiling
- existing shared walls that will be reused
- any overlap with existing objects/rooms as information, not a hard rejection

Preview state:

- gold/amber = room fits and can be stamped
- red = room would leave the board or exceed the build-height cap
- the room is not created until the DM clicks a valid corner

After a valid click, the stamp stays active so the DM can place another room with the same dimensions quickly.

## Shared Wall Visual

A shared wall looks like one normal wall.

Do not double-thicken or visually duplicate it.

When selected in BUILD mode, the DM may see that it belongs to multiple rooms.

If a shared wall is locked because one associated room is locked, show the lock source in simple language on selection.

Example:

> Locked by: Castle Room

## Camera and Readability

All important board visuals must be tested at:

- default ~30 degree elevation
- several horizontal orbit angles
- normal play zoom
- moderately zoomed-out room view

An asset that only makes sense from one camera side fails the product requirement.

## Accessibility

Do not rely only on color to communicate:

- selected
- owned
- hidden
- locked
- movement-locked
- interactable
- error/warning
- active placement

Use combinations of shape, outline, icon, pattern, opacity, and/or text.

## Performance Rule

Visual feedback should use cheap renderer-native techniques where practical:

- outlines/highlights
- simple sprites/icons
- simple text labels
- instancing/reused geometry
- lightweight transparency

Avoid expensive post-processing merely for decoration until performance testing proves it safe.

## Asset Provenance

Every non-original visual asset must pass the project's dependency/license gate.

Record:

- source
- license
- attribution
- files used
- modifications

No Minecraft assets or copied proprietary VTT assets.
