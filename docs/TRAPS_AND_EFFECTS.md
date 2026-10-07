# Traps, Hazards, and Transforming Objects

> Status: Stage 0 product contract.
>
> Purpose: support broad D&D-style traps, environmental hazards, ambush objects, and transforming objects without creating a separate engine for every named example.

## Core Rule

A named trap or surprise object is **data**, not a dedicated engine.

The universal pattern is:

**Trigger → Target → Effect(s) → Duration/End → Optional Detect/Disarm**

Examples can look completely different while sharing the same underlying behavior.

## D&D Reference Patterns

The 2024 D&D Free Rules/SRD trap examples include patterns such as:

- collapsing roof
- falling net
- fire-casting statue
- hidden pit
- poisoned darts
- poisoned needle
- rolling stone
- spiked pit

Common trigger patterns include:

- entering an area
- moving onto a pressure plate
- crossing a trip wire
- touching/interacting with an object
- opening something
- using the wrong key

Common outcomes include:

- damage
- falling
- Restrained/Poisoned/Prone-style condition effects
- difficult terrain
- moving hazards
- effects that remain until ended
- one-shot effects
- detection/disarm interactions

The 2014 Basic Rules/SRD likewise include mechanical and magical traps such as pits, arrows/darts, falling blocks, flooded rooms, blades, and spell-triggered traps.

The project should learn from these structures without hardcoding individual official trap names or text.

## DM Placement Authority

**The DM may place anything anywhere.**

Manual BUILD placement is not rejected because another object occupies the same cell or because the arrangement is unusual.

Required examples:

- monster inside an open pit
- monster standing on a hidden trap
- trap beneath a table
- pressure plate beneath a rug
- creature in fire/lava/hazard space
- several hidden triggers in one cell
- treasure inside a trapped chest
- monster in a doorway
- hazard under another visible prop

The interface may show an overlap preview or warning, but it must not prevent the DM from placing the object.

The DM is the authority.

## BUILD Placement vs PLAY Movement

These are intentionally separate concepts.

### BUILD placement

DM may:

- overlap objects
- stack objects
- place game pieces on hazards
- place objects at supported elevations
- create combinations that would be physically strange in real life
- override ordinary occupancy expectations

There is no red "invalid because occupied" placement rule for the DM.

### PLAY movement

Objects may still expose board behaviors such as:

- blocks movement
- movement lock
- difficult terrain
- trigger on enter
- trigger on cross

These affect play interaction but do not restrict DM map creation.

The DM can override the board.

## Universal Trigger Vocabulary

Start small and reusable.

Candidate trigger types:

- manual
- enter_cell
- start_turn_in_cell
- leave_cell
- cross_boundary
- interact
- touch
- open
- close
- timer
- object_state_changed
- linked_trigger

Future rules automation may add more only when necessary.

## Universal Effect Vocabulary

Candidate effects:

- reveal
- hide
- transform/replace
- spawn/reveal linked object
- remove object
- move object
- forced movement
- change elevation
- fall/drop
- movement lock
- movement unlock
- apply status/condition marker
- remove status/condition marker
- damage marker/value
- healing marker/value
- change terrain
- create difficult terrain
- change movement blocking
- open/close/toggle
- alarm/notify DM
- activate/deactivate
- repeat/rearm

The first version does not need to automate every D&D saving throw, DC, attack, damage die, or escape check. The board can expose the trigger/effect while the DM resolves rules manually.

## Duration / End Conditions

Candidate duration/end forms:

- instantaneous
- until DM clears
- until object destroyed
- until object disabled
- until next turn
- until end of turn
- timed duration
- persistent
- one-shot
- rearming/repeating

Keep these generic.

## Detection / Disarm

Detection and disarm can remain mostly DM-controlled for MVP.

Possible data later:

- detectable: true/false
- detection label or DC
- disarmable: true/false
- disarm label or DC
- disarmed state

The app does not need to enforce skill checks initially.

The DM can reveal/disarm manually.

## Mimic / Transforming Chest Example

A chest-looking block can secretly be a transforming object.

Example behavior:

**appearance: chest**  
**trigger: interact/touch**  
**effect: transform_into mimic creature**  
**position: unchanged**

When the player touches/interacts with the chest using their assigned character:

1. the chest appearance disappears
2. the object transforms/replaces itself with the mimic creature form
3. it remains in the same grid location
4. its capabilities/interaction category change from prop/container-like object to creature/game piece
5. the DM can then run the mimic normally

This should be a **universal transform/replace effect**, not a MimicEngine.

## Why Transform/Replace Must Be Generic

The same mechanism can support:

- chest → mimic
- statue → gargoyle
- suit of armor → animated armor
- pile of bones → skeleton
- sarcophagus → undead creature
- cocoon/egg → creature
- ordinary door → monster/portal state
- dormant construct → active creature
- scenery prop → hazard
- illusion/disguise → revealed true form

The name/art determines what the object looks like.

The universal behavior is:

**on trigger → replace/transform catalog identity while preserving placement context**

## Transform Data Concept

A transformable object may need data such as:

- current_catalog_object_id
- transform_trigger
- transform_target_catalog_object_id
- preserve_position: true
- preserve_visibility_context
- preserve_owner/DM authority
- one_way or reversible
- transformed: true/false

Exact implementation remains undecided.

The important contract is that a transform can change:

- visual asset
- category
- capabilities
- footprint
- interaction behavior

while preserving the intended location/relationship to the map.

## Trap/Hazard Examples

### Hidden Pit

- visible form: ordinary floor
- trigger: enter_cell
- effects:
  - reveal/change floor state
  - change elevation/fall
  - optional damage marker
- end: persistent open pit

### Spring/Hunting Trap

- visible form: hidden or visible trap
- trigger: enter_cell
- effects:
  - movement lock
  - optional damage/status marker
- end: DM release/disarm

### Falling Net

- trigger: cross_boundary or enter_cell
- effects:
  - reveal net
  - movement lock/status marker
- end: DM clear/cut/free

### Poisoned Dart Wall

- trigger: pressure plate / enter_cell
- effects:
  - optional attack/damage marker
  - optional poison status marker
- duration: instantaneous or one-shot

### Collapsing Roof

- trigger: cross_boundary
- effects:
  - reveal/move rubble objects
  - optional damage marker
  - change terrain to difficult terrain
- duration: persistent terrain change

### Fire Statue

- trigger: enter/interact/linked trigger
- effects:
  - area effect marker
  - optional damage
- duration: instantaneous or repeating

### Rolling Stone

- trigger: enter/cross/manual
- effects:
  - move object along linked path
  - optional forced movement/damage
- duration: until end of path/stopped

### Chest Mimic

- visible form: chest
- trigger: interact/touch
- effect: transform_into mimic
- duration: permanent until DM changes it

## Design Guardrail

When a new trap, monster surprise, or environmental gimmick is proposed:

1. identify what actually triggers it
2. identify what changes
3. map those changes to existing universal effects
4. add a new universal primitive only if the effect truly cannot be represented
5. do not create a new engine merely because the name is new

This is the same anti-drift principle used across the rest of the project.
