# ADR-001 — MVP Web Stack

> Decision date: 2026-10-07
>
> Status: **Accepted for MVP implementation**
>
> This is an architecture decision, not application code.

## Context

DND Blocks Battle Maps now has sufficiently defined product contracts to choose an MVP stack.

The implementation must support:

- normal modern browsers
- no required player installation
- simple 3D block rendering
- fixed ~30° tabletop camera
- orbit/pan/zoom/reset
- ray/click picking
- grid-snapped placement
- repeated block rendering
- permissive overlap
- realtime shared board state
- durable DM identity
- lightweight player sessions
- hidden DM-only state
- autosave
- revisions/action deduplication
- Undo/Redo
- low initial cost
- open-source/permissive dependencies
- no custom always-on application server unless later proven necessary

## Decision

Use the following MVP stack:

### Language

**TypeScript**

Reason:

- native fit for the browser ecosystem
- compile-time checks help protect shared state/schema contracts
- direct support across Three.js, Vite, and Supabase clients
- no separate backend language needed for MVP

### Build Tool

**Vite**

License: MIT.

Source:

- https://github.com/vitejs/vite

Reasons:

- small development/build layer
- excellent TypeScript support
- produces static browser assets
- no application server required
- can generate dependency license reports during builds

### 3D Renderer

**Three.js**

License: MIT.

Source:

- https://github.com/mrdoob/three.js
- https://threejs.org/

Reasons:

- browser-focused rendering library
- sufficient scene/camera/mesh functionality without imposing a large game architecture
- OrbitControls already supports orbit, zoom/dolly, pan, reset, distance limits, and constrained angles
- raycasting/picking fits block placement and object selection
- instanced/repeated meshes can support many similar blocks
- mature ecosystem
- permissive license
- keeps the product-specific world state outside the renderer

### UI

**Native HTML + CSS + TypeScript first**

No React/Vue/Svelte framework for MVP unless implementation proves native UI state becomes a real maintenance problem.

Reasons:

- hero page and sidebars are intentionally small
- fewer dependencies
- less bundle/runtime complexity
- easier to preserve the "kid-simple" UI
- framework can be introduced later if actual UI complexity justifies it

### Persistence / Auth / Realtime

**Supabase hosted Free plan for MVP**

Open-source project:

- https://github.com/supabase/supabase

Hosted service:

- https://supabase.com/

Reasons:

- managed Postgres
- browser client
- authentication
- Row Level Security
- Realtime Broadcast
- Presence
- database change subscriptions
- storage if later required
- Edge Functions if a small trusted endpoint later becomes necessary
- current free tier is sufficient for prototype/early MVP testing
- self-host/open-source escape path exists
- removes the need for a custom FastAPI/Node server at MVP stage

Realtime policy:

- committed logical board changes are persisted to Postgres
- use realtime notifications/broadcast for meaningful game events
- use Presence only for slow-changing online/session state, not movement frames
- never stream animation frames
- revision/action-ID rules remain authoritative for reconnect/deduplication

### Static Hosting

**Cloudflare Pages**

Sources:

- https://developers.cloudflare.com/pages/
- https://developers.cloudflare.com/pages/functions/pricing/

Reasons:

- static frontend hosting
- current Pages pricing makes static asset requests free/unlimited
- global delivery
- connects cleanly to Git-based deployment
- optional Functions/Workers capacity exists later without requiring it now
- no dedicated application server

### Source Control / Documentation

**GitHub**

Use for:

- source repository
- issue/PR workflow
- live project documentation
- architecture decisions
- dependency/license records
- CI when implementation begins

Do not use GitHub Pages as the planned production SaaS/business host.

### Assets

Use:

1. original assets
2. CC0/public-domain assets
3. permissively licensed assets only after license review
4. generated simple geometry/textures when appropriate

Do not copy Minecraft code/assets/look.

## Three.js vs Babylon.js

### Three.js — selected

Strengths for this project:

- MIT
- smaller conceptual surface
- renderer/library rather than full game-engine mindset
- OrbitControls matches the camera contract directly
- enough picking/mesh functionality for the block editor
- lets our own data model remain authoritative

Risks:

- some editor/game conveniences must be assembled by us
- we must keep application architecture disciplined rather than letting render objects become world state

Mitigation:

- current-state/data contracts already exist
- renderer is explicitly not the source of truth

### Babylon.js — rejected for MVP, retained as fallback

License: Apache-2.0.

Source:

- https://github.com/BabylonJS/Babylon.js

Strengths:

- powerful browser 3D engine
- ArcRotateCamera and extensive engine features
- strong TypeScript orientation
- many built-in systems

Why not selected:

The project deliberately does not need most engine-level features.

The risk is not license or capability; the risk is importing more concepts, APIs, and architectural surface than this small battle-map product needs.

Fallback condition:

Reconsider Babylon.js if implementation proves that Three.js requires substantial custom infrastructure that Babylon already solves cleanly with less overall code.

## Supabase vs PocketBase

### Supabase — selected for MVP

Reasons:

- hosted free option
- no server to operate initially
- Postgres data model fits current normalized schema
- auth + RLS + realtime already integrated
- suitable for durable DM plus lightweight player-session architecture
- current Realtime supports game-event use cases
- open-source/self-host path exists

### PocketBase — fallback

License: MIT.

Source:

- https://github.com/pocketbase/pocketbase

Strengths:

- very small
- SQLite
- realtime
- built-in user/files APIs
- single executable
- easy self-hosting

Why not selected now:

- requires operating a persistent server
- project is still pre-1.0 and its own repository warns full backward compatibility is not guaranteed before 1.0
- creates deployment/backup/uptime responsibility that hosted Supabase currently removes

Fallback condition:

Reconsider PocketBase if:

- Supabase cost becomes unfavorable
- self-hosting becomes a priority
- realtime/auth requirements remain simple
- PocketBase reaches a stability level appropriate for production use

## Custom Backend

**Not selected for MVP.**

No FastAPI/Node/Express application server initially.

Add a custom backend only if a concrete requirement appears, such as:

- trusted billing/business logic
- privileged asset processing
- server-only rules
- moderation/admin operations
- backend behavior not safely expressible through Postgres/RLS/functions
- realtime requirements that hosted services cannot satisfy economically/reliably

## Docker

**Not required for MVP deployment.**

Use later if:

- self-hosting services
- local multi-service development
- reproducible infrastructure requires it
- CI/deployment materially benefits

## CRDT / Yjs

**Not selected.**

Strong DM authority + assigned player pieces + revisions + unique action IDs + locks + refresh-on-gap are expected to handle the MVP.

Add CRDT collaboration only if real concurrent-edit testing proves necessary.

## Cost Snapshot

Expected prototype/early MVP infrastructure:

- TypeScript: $0
- Vite: $0
- Three.js: $0
- native HTML/CSS: $0
- Cloudflare Pages static hosting: $0 under current static-asset pricing
- Supabase Free: $0 within current plan quotas
- original/CC0 assets: $0 licensing cost

Current Supabase pricing includes 2 million Realtime messages/month on the Free tier at the time of this decision.

Current Cloudflare Pages pricing states static asset requests are free and unlimited on free and paid plans.

The stack must be re-audited before public production launch because provider pricing/limits can change.

## Architecture Shape

```text
GitHub
  |
  v
Vite build
  |
  v
Cloudflare Pages
  |
  v
Browser
  |
  +-- TypeScript application state
  +-- Native HTML/CSS UI
  +-- Three.js rendering
  +-- Placement/camera/input adapters
  |
  v
Supabase
  |
  +-- Postgres current board state
  +-- bounded EditHistory
  +-- Auth / player session identity
  +-- Row Level Security
  +-- Realtime
  +-- optional Storage
```

## Architecture Boundary

The renderer must never become the canonical game state.

Correct direction:

```text
Data/state -> renderer
Input -> command -> state -> renderer
```

Incorrect direction:

```text
Three.js meshes -> inspect them later to guess game state
```

This boundary is mandatory.

## Dependency Rule

Before implementation installs any package:

- confirm exact package/repository
- record version
- record license
- record why it is needed
- record whether it is direct or transitive
- enable/build a dependency license report where practical

## Revisit Triggers

Revisit this ADR if:

- Three.js requires materially more code than Babylon.js for the locked interaction contracts
- Supabase free/paid economics change materially
- a custom trusted server becomes necessary
- Cloudflare Pages pricing/terms change
- browser performance tests fail on target hardware
- realtime tests reveal a need for different synchronization architecture

Until one of those occurs, this is the selected MVP stack.
