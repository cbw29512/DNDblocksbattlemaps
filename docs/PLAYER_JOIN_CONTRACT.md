# Player Join, Ownership, and Control Contract

> Status: Stage 0 product contract.
>
> Goal: players should get into a game and control their piece with almost no setup, while the DM remains authoritative.

## Core Roles

There are two user-facing roles:

- **DM**
- **Player**

The UI should use those plain words.

Do not expose technical permission terminology to ordinary users.

## DM Identity

The DM needs a durable identity because the DM owns/saves games and maps.

MVP product requirement:

- DM signs in
- DM can create/open saved games
- DM is authoritative owner/controller of the game session
- DM can generate a join link/code

Exact authentication provider is a technology decision, not part of this product contract.

## Player Join

The player uses a dedicated **Join as Player** flow.

MVP flow:

1. Open join link or enter game code.
2. Enter/select a display name.
3. Join the active game as a Player.
4. Wait for/receive assigned character piece.
5. Play.

A permanent standalone player account is **not required for MVP**.

The join flow still creates a player session identity so permissions and assignments remain clear.

This minimizes friction and infrastructure while preserving the explicit Player role.

## Join Link and Code

Every active game can expose:

- shareable join link
- short join code

The join link may carry the game code automatically.

The player should not need to understand server names, campaign IDs, database IDs, or room UUIDs.

## Reconnection

The browser should remember the current player session for the active game when practical.

On refresh/reconnect:

- return the player to the same game
- restore the same display identity
- restore assigned character control

If the session identity cannot be recovered, the player can rejoin and the DM can reassign the piece.

Do not require a heavy account-recovery system for MVP.

## DM Player List

The DM sees a simple list of joined players.

Example:

- Alex
- Sam
- Jordan

The list can show whether each player currently has an assigned piece.

No complex user-management dashboard is required.

## Assigning Character Pieces

The DM assigns game pieces to players.

Simple interaction candidates:

- select character piece → **Assign Player** → choose joined player
- or select player → **Assign Piece** → click a character piece

The final visual implementation can choose the clearer version during prototype testing.

Data rule:

- one player may control one or more assigned entities
- MVP UI should optimize for one primary character per player
- DM may reassign at any time

## Player-Owned Piece

A player should be able to identify their controlled piece instantly.

Use a clear visual cue such as:

- name label
- simple ownership ring/outline
- small "You" label when appropriate

Do not require the player to open a character panel just to identify their piece.

## Player Movement

Players can move only entities assigned to them.

Player movement uses the same simple pick-up/put-down mental model:

1. select/tap owned piece
2. placement ghost/target appears
3. click/tap destination
4. piece moves

Exact movement-range enforcement is not part of MVP.

The DM remains responsible for game rules.

## Player Interaction With Objects

Players do not receive BUILD controls.

Players may interact only with objects whose capabilities/permissions allow player interaction.

Candidate player interactions include:

- open/close door
- open chest
- touch/use object
- toggle switch/lever
- trigger a visible interactable
- interact with a disguised/transforming object
- activate another explicitly player-interactable object

Interaction may invoke universal triggers/effects.

Example:

**player interacts with chest → trigger interact → transform/replace chest with mimic**

The app does not need to calculate every D&D action, reach rule, skill check, save, attack, or damage roll for MVP.

## Enter-Cell Triggers

Moving a controlled player entity into a cell may activate universal entry triggers.

Examples:

- hidden pit
- pressure plate
- spring trap
- web
- alarm
- transformation/reveal event

The board can trigger the configured effect while the DM resolves any tabletop rules not automated by the board.

## Movement Lock

A player entity may have a movement-lock effect.

When movement is locked:

- player cannot move that entity
- player receives a simple visible cue such as **Stuck** / lock icon
- other allowed interactions may still work
- DM can clear the movement lock
- DM can override/move the entity regardless

This supports traps, nets, webs, cages, restraints, pits, or other sources without separate movement systems.

## DM Override

The DM always has authority to:

- move any entity
- assign/reassign ownership
- clear movement locks
- trigger effects manually
- reveal/hide objects
- change object state
- override movement blocking
- unlock construction
- remove objects
- correct mistakes

No player permission can permanently block the DM.

## Player View Simplicity

The player UI should be dramatically smaller than the DM UI.

Player should primarily see:

- map
- their piece
- other visible pieces/objects
- camera controls
- simple interact action when relevant
- basic session/player name
- perhaps a minimal help/home control

Player should **not** see:

- room builder
- block palette
- construction locks
- hidden object list
- DM-only triggers
- architecture controls
- object catalog editor

## Hidden Information

DM-only objects/effects must not be exposed through the player UI.

This includes avoiding accidental leakage through:

- labels
- hover text
- object lists
- selection outlines
- network payloads where practical
- overlap chooser
- accessibility text that identifies hidden objects

Implementation details will depend on the final realtime architecture, but the product contract is simple:

> If the player is not supposed to know it exists, the player interface must not reveal it.

## Tiny Creature Representation

D&D SRD 5.2.1 defines Tiny creature space as 2½ × 2½ feet, or four Tiny creatures per 5-foot square.

For this product:

- keep the universal visible grid at 5-foot squares
- do **not** introduce a permanent 2.5-foot subgrid
- Tiny creatures share a normal 5-foot square
- up to four Tiny pieces can be visually auto-offset within one square by default
- manual overlap remains allowed beyond normal expectations because the DM is authoritative
- movement remains square-to-square for the simple map UI
- Tiny visual size can be smaller than Small/Medium pieces

This preserves D&D-scale meaning without making every map twice as fine-grained.

Reference:

- D&D SRD 5.2.1 Creature Size and Space: https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf

## Player Usability Test

A new player should be able to:

1. open a link
2. type a name
3. join
4. immediately see which piece is theirs
5. click/tap that piece
6. move it
7. click/tap an obvious interactable object
8. understand a simple locked/stuck state if movement is blocked

without reading a manual.

If a player needs to configure a sheet, token, ruleset, camera profile, permissions, or account before moving a piece, simplify it.
