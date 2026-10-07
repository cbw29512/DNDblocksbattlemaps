# Persistence, Undo/Redo, and Recovery Contract

> Status: Stage 0 product contract.
>
> Goal: maps should feel continuously saved, mistakes should be reversible, and a browser crash/reconnect should not require reconstructing the game from chat memory or a long event replay.

## Core Persistence Rule

Store **current authoritative board state** separately from **recent edit history**.

Current state answers:

> What does the board look like right now?

Edit history answers:

> What did the DM/player recently change, and how can it be undone?

Do not require replaying the full history to load a map.

## Current Board State

The authoritative persisted game/map state includes the current records needed to render/play the board:

- Game
- Map
- RoomRegion
- WorldObjects
- current object states
- visibility
- lock states
- ownership/assignments
- active movement-lock/effect state
- relevant interaction rules
- current game revision

Loading a map should primarily load this current state directly.

## Edit Command Model

Every meaningful board mutation should be represented as one logical edit command.

Candidate fields:

- action_id
- game_id
- map_id
- actor_id
- actor_role
- base_revision
- committed_revision
- action_type
- forward_payload
- inverse_payload
- grouped_action_id
- created_at

Examples:

- place object
- remove object
- move object
- change visibility
- lock/unlock
- change object state
- assign/reassign player
- generate room
- bulk room lock
- transform/replace
- clear movement lock

The renderer must not be the source of truth for undo.

## Atomic Edits

A user action should commit as one logical operation whenever possible.

Examples:

- placing one block = one edit
- moving one object = one edit
- generating one room = one grouped/bulk edit
- locking one room = one grouped/bulk edit
- chest → mimic transform = one edit

Undoing room generation should remove/reverse the generated room as one user action rather than requiring dozens of individual Undo presses.

## Undo

Undo applies the inverse of the most recent undoable DM edit.

Do **not** delete history to pretend the edit never happened.

Conceptually:

1. original edit remains recorded
2. Undo commits a compensating inverse edit
3. current state changes back
4. the history remains explainable

This works better for multiplayer and crash recovery than mutating/deleting past records.

## Redo

Redo reapplies the most recently undone edit when it is still safe to do so.

If the DM makes a new unrelated edit after Undo, the ordinary redo chain may be cleared.

Do not build branching version-control UI for MVP.

## Who Gets Undo

General board Undo/Redo is a **DM tool**.

Players do not receive a global Undo button for the shared board.

A player who moves incorrectly can:

- move again if allowed
- ask the DM
- DM corrects/overrides the state

This keeps multiplayer authority simple.

## History Scope

MVP needs a bounded recent edit history, not infinite version control.

Initial implementation may choose a practical recent-history limit based on storage/cost testing.

Requirements:

- enough history for normal accidental edits during a session
- bulk operations remain one logical history step
- history can be pruned without damaging current board state
- current state remains valid even if old history is deleted

The exact numeric history limit is a technology/performance decision, not a product requirement.

## Autosave

There should be no required manual Save button for ordinary work.

Every committed board edit should enter the autosave pipeline.

User-visible save status can remain tiny:

- Saving…
- Saved
- Reconnecting / Offline

The app should not rely on browser close/unload events as its only save mechanism.

## Local Immediate State

The browser updates its local in-memory board immediately after an accepted edit so interaction feels instant.

Persistence happens as part of committing the edit.

The exact optimistic-vs-confirmed UI technique remains an implementation choice.

## Optional Local Recovery Cache

A browser-local recovery cache is encouraged if it can be implemented simply using native browser storage or a tiny verified open-source helper.

Purpose:

- protect against a tab/browser crash while a cloud write is still pending
- make re-opening a recent map faster
- provide a last-known local recovery point

Rules:

- local cache is a recovery aid, not the multiplayer authority
- server/cloud canonical state wins when there is a confirmed newer revision
- do not create a complex offline-first sync engine for MVP

## Game Revision

Each game/map should have a monotonically increasing revision/version.

Every committed edit receives the resulting revision.

Uses:

- know whether client state is current
- detect missed realtime updates
- prevent duplicate/out-of-order application
- simplify reconnect

The UI never exposes revision numbers to ordinary users.

## Unique Action IDs

Every edit command receives a unique action ID.

If a client/realtime reconnect delivers the same action twice, the duplicate is ignored.

This prevents duplicate placement/movement caused by retries or reconnect delivery.

## Initial Load

When a DM/player opens a game:

1. load canonical current board state
2. load current revision
3. apply visibility/permission filtering for that user
4. connect to realtime updates
5. process only updates after the loaded revision

Do not replay the entire lifetime edit log.

## Reconnect

On reconnect:

1. fetch/check current canonical revision
2. compare with client's last confirmed revision
3. obtain missing current state/updates as needed
4. deduplicate by action ID
5. resume realtime updates

If the client detects an unexplained revision gap, the safe behavior is to refresh the affected current state rather than guess.

## Multiplayer Conflicts

MVP should avoid complicated collaborative-edit merge logic.

The DM is authoritative.

Useful rules:

- construction editing is primarily DM-controlled
- players move only assigned entities
- object locks/ownership reduce competing edits
- server/database commit ordering determines final revision
- duplicate action IDs are ignored
- stale clients refresh when necessary

Do not introduce CRDT complexity unless real testing proves these rules insufficient.

## Hidden Information

Canonical game state may include DM-only objects.

Player loads/realtime updates must respect visibility and authorization.

Hidden objects must not leak through:

- object payloads
- history payloads available to players
- overlap lists
- labels
- realtime events
- recovery cache shared across roles

The exact Row Level Security/view/filter implementation depends on the final backend choice.

## Generated/Bulk Operations

Bulk actions should remain compact logical edits.

Examples:

### Generate Room

One command can describe:

- room parameters
- objects created
- prior terrain values replaced
- inverse information required for Undo

### Lock Room

One command can record:

- room ID
- objects whose locked state changed
- previous lock states

Do not emit dozens of unrelated user-visible history steps for one button click.

## Transform/Replace Recovery

A transform such as chest → mimic must be reversible by the DM when included in Undo history.

The inverse must know enough to restore:

- prior catalog identity
- prior category
- prior capabilities
- prior footprint
- prior visibility/state as appropriate

Transform data must not rely solely on what is currently rendered.

## Movement Lock Recovery

Applying or clearing a movement lock is persisted board state.

If the browser crashes while a player is trapped:

- reconnect should still show the piece as movement-locked
- DM should still be able to clear it

Do not keep important effect state only in memory.

## Crash Recovery

After a browser/tab crash:

DM should be able to reopen the game and recover:

- current map
- object positions
- hidden/revealed state
- room locks
- assignments
- movement locks/effects
- current transformed objects
- recent Undo history as supported

Players should rejoin/reconnect to the current canonical state.

## Cost Discipline

Persistence must remain compatible with the cheap browser-first architecture.

Preferred pattern:

- static frontend
- hosted open-source database/realtime service on free tier
- no custom always-on application server unless needed
- current-state records + bounded edit history
- realtime messages only for meaningful committed changes

Avoid:

- high-frequency position streaming
- frame-by-frame synchronization
- storing renderer snapshots/images for every edit
- unlimited event history
- duplicating full map JSON for every minor action

## Movement Synchronization

Pieces move grid-position to grid-position.

Network synchronization should transmit the committed logical move, not animation frames.

Clients may animate locally after receiving the new position.

This greatly reduces realtime traffic and preserves deterministic board state.

## Save/Recovery Usability Test

A DM should be able to:

1. place several blocks
2. accidentally remove one
3. click Undo
4. refresh the page
5. see the same recovered map
6. invite/reconnect a player
7. see the same assignments/effects

without using a Save As dialog, downloading files, or understanding revisions/history.
