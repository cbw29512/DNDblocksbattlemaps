# Implementation Rules

> Status: mandatory when application code begins.
>
> These rules exist to keep the codebase small, testable, recoverable, and aligned with the documented product contracts.

## Before Writing Code

Every coding session must:

1. read `PROJECT_STATE.md`
2. read `SOUL.md`
3. read the relevant product contracts
4. read `ADR_001_MVP_WEB_STACK.md`
5. read `DEPENDENCY_REGISTER.md`
6. inspect the current repository state
7. identify the exact Stage/Definition of Done item being implemented
8. confirm the data/state contract before writing behavior

Do not implement from memory or feature names alone.

## State Before Behavior

Define or confirm state/schema before writing functions that operate on it.

Examples:

- placement state before placement handlers
- WorldObject shape before renderer adapters
- EditCommand shape before Undo/Redo functions
- player assignment state before permission checks
- trigger/effect data before trap-specific examples

The code should operate on documented state rather than inventing state ad hoc inside UI handlers.

## Renderer Is an Adapter

Three.js is a rendering/input adapter, not the game-state database.

Required direction:

```text
authoritative state
    -> render adapter
    -> Three.js scene

input
    -> command
    -> validated state change
    -> render update
```

Never recover game state by inspecting Three.js meshes later.

Every render object must be traceable back to a WorldObject/catalog identity.

## Universal Behavior First

Before adding code for a named block/object:

1. describe what it does
2. search existing universal capabilities/triggers/effects
3. reuse the existing primitive when behavior matches
4. add a new primitive only when necessary

Do not create:

- MimicEngine
- PitTrapEngine
- TorchEngine
- OrcEngine
- DoorEngine

when universal state/trigger/effect behavior already represents the action.

## Error-First Code

External boundaries and failure-prone operations must fail clearly.

Examples:

- Supabase reads/writes
- auth/session restore
- realtime subscriptions
- asset loading
- parsing persisted state
- room generation validation
- command application

Requirements:

- handle expected errors explicitly
- log useful context
- do not silently swallow failures
- surface simple user-facing messages when needed
- preserve enough diagnostic information for debugging without exposing secrets

## Logging

Use structured, purposeful logging.

Useful categories may include:

- state
- persistence
- realtime
- auth
- placement
- renderer
- interaction
- recovery

Avoid noisy per-frame logs.

Never log passwords, secret keys, private tokens, or hidden player-inaccessible game data into public/client-visible logs.

## File Size / Responsibility

Prefer small modules with one clear responsibility.

If a source file grows beyond roughly **150 lines**, review whether it should be split.

Do not split mechanically if doing so damages cohesion, but large multi-responsibility files are a design warning.

Examples of likely separate modules:

- world state/types
- catalog data
- command/edit application
- undo/recovery
- placement calculations
- room generation
- renderer adapter
- camera adapter
- input adapter
- Supabase persistence adapter
- realtime adapter
- permission/visibility filters

## Dependency Discipline

Do not install a package until:

- exact need is known
- browser/native solution was considered
- source/license/version is recorded in `DEPENDENCY_REGISTER.md`
- bundle/runtime/hosting impact is acceptable

No dependency is added merely because it is familiar.

## UI Discipline

UI logic should call application commands; it should not directly mutate world state.

Examples:

Good:

```text
Place button/click
  -> PlaceObject command
  -> state update
  -> persistence
  -> render
```

Bad:

```text
click handler
  -> mutate Three.js mesh
  -> later guess what changed
```

## Command Discipline

Meaningful state changes should have explicit command/action identities.

Examples:

- PlaceObject
- RemoveObject
- MoveObject
- GenerateRoom
- SetVisibility
- SetLock
- AssignEntity
- SetObjectState
- ApplyEffect
- ClearEffect
- TransformObject

Names may change, but the architecture should remain explicit.

## Testing Workflow

For each meaningful implementation unit:

### Objective

State exactly what behavior is being implemented.

### Logic Flow

Write the intended flow/pseudocode before implementation when the behavior is non-trivial.

### Implementation

Add the smallest code needed.

### Unit / Behavior Test

Test the behavior independent of the 3D renderer whenever possible.

Examples:

- room dimensions convert to correct cells
- shared walls reuse objects
- door replacement preserves memberships
- placement permits overlaps
- top-face placement increments elevation
- transform preserves position
- player cannot move unassigned piece
- DM can override movement lock
- undo inverse restores prior state
- duplicate action ID is ignored

Renderer/browser tests should then verify the adapter reflects the already-tested state behavior.

## Stage Boundaries

Do not pull later-stage features forward unless they are required by the current Definition of Done.

Examples:

- no rules automation during builder prototype
- no dynamic lighting because a 3D engine supports it
- no character sheets because Supabase can store them
- no CRDT just because collaboration libraries exist
- no asset marketplace
- no first-person movement

## Security / Hidden State

Player-visible state must be filtered by authorization/visibility rules.

Do not rely solely on making hidden objects transparent/invisible in the renderer.

If players should not know an object exists, the player-facing data path must not expose it unnecessarily.

## Secrets

Never commit:

- Supabase secret/service keys
- Cloudflare secrets/tokens
- private credentials
- local environment secrets

Browser code may only use credentials explicitly designed for public client use and must still rely on correct backend authorization/RLS.

## Browser Bundle Parity Gate

The current repository keeps generated browser JavaScript under `web/` while authoritative TypeScript lives under `src/`.

For any browser-visible checkpoint:

1. regenerate `web/` from `src/` using `npm run compile:web`
2. verify the generated `web/` diff is included in the checkpoint
3. verify the browser bundle contains the new behavior
4. do not report a Pages feature as live merely because TypeScript/tests/build passed in an isolated CI workspace
5. verify Pages on the exact commit containing the synchronized browser bundle

The `Sync Browser Bundle` workflow exists as a safeguard, not as a substitute for coherent local-first checkpoints.

## Documentation Completion Gate

A code task is not complete until:

- relevant tests pass
- docs/contracts are updated if behavior changed
- `PROJECT_STATE.md` records the result and exact next step
- changes are pushed to GitHub

## No-Drift Stop Rule

If implementation pressure suggests violating a locked product contract:

**stop implementation and update/reconcile the contract first.**

Do not silently make code the new source of truth.
