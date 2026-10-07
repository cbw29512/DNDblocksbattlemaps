# Web-First Technology Stack Candidates

> Research snapshot: 2026-10-07
>
> Status: candidate architecture only. No application code has been written and no dependency has been adopted.
>
> Goal: use as much reliable open-source/free infrastructure as practical while keeping the browser experience simple and the architecture small.

## Hard Technology Rules

1. **Web-first.** DM and players should use a normal modern browser.
2. **No required installation for players.**
3. **Open-source-first.** Prefer permissively licensed libraries and services with open-source escape paths.
4. **Reuse-first.** Do not implement generic rendering, realtime, auth, storage, or build tooling if a mature open-source component solves it cleanly.
5. **Cost-first.** Avoid recurring infrastructure cost until real usage requires it.
6. **Small architecture.** Do not adopt a full game engine or custom server merely because we can.
7. **No framework loyalty.** Select only what materially simplifies this product.
8. **License gate applies.** Every adopted dependency must be recorded in the reuse/license documentation.

## Current Best-Fit MVP Shape

The current leading architecture is:

```text
Browser
  |
  +-- TypeScript
  +-- Vite
  +-- Three.js (or Babylon.js after comparison)
  +-- Native HTML/CSS UI first
  |
  +---- Supabase hosted free tier
          |
          +-- Postgres: saved maps/games/world objects
          +-- Auth: DM/player identity if required
          +-- Realtime: board movement/state events
          +-- Storage: original project assets if required
```

Static frontend hosting:

```text
Cloudflare Pages
```

This eliminates the need for a dedicated FastAPI/Node backend in the MVP unless the product requirements later prove one is necessary.

## Frontend Language — TypeScript

Current recommendation: **TypeScript**.

Why:

- browser-native ecosystem
- strongest compatibility with Three.js/Babylon.js/Vite/Supabase
- type checking is valuable for grid/state contracts
- no browser-to-server language boundary for basic MVP interactions
- large open-source ecosystem
- easy static deployment

Use plain JavaScript only if TypeScript proves to add more friction than value. Current expectation is that TypeScript will reduce state/schema errors.

## Build Tool — Vite

Source:

- https://github.com/vitejs/vite

License:

- MIT for Vite core

Why it fits:

- lightweight browser development/build tooling
- excellent TypeScript support
- static production output
- no server runtime required
- can generate dependency license reports during builds

Current recommendation:

**Preferred build tool candidate.**

## 3D Rendering — Three.js

Source:

- https://github.com/mrdoob/three.js

License:

- MIT

Why it fits:

- browser-native 3D
- mature ecosystem
- raycasting/picking for click targets
- instancing for many repeated blocks
- camera/pan/zoom support
- keeps application/world architecture under our control
- no requirement to adopt a full game engine

Current recommendation:

**Preferred rendering candidate to evaluate first.**

## 3D Rendering Alternative — Babylon.js

Source:

- https://github.com/BabylonJS/Babylon.js

License:

- Apache-2.0 for the core project/packages; bundled notices/dependencies must be preserved as required

Why it fits:

- browser-native 3D engine
- strong picking/camera/mesh systems
- built-in GUI/engine features
- WebGL/WebGPU support
- active TypeScript project

Tradeoff:

Babylon.js provides more built-in engine functionality. That can save time, but it may also introduce more concepts than this intentionally tiny VTT needs.

Current recommendation:

**Compare directly with Three.js before implementation.**

Decision metric is not "which engine has more features?"

Decision metric is:

> Which engine lets us build our small grid/block interaction with the least custom code and least long-term complexity?

## UI Framework

Current recommendation:

**Do not adopt React/Vue/Svelte/another UI framework automatically.**

The first UI is deliberately small:

- hero page
- terrain buttons
- sidebar
- room dimension inputs
- block buttons
- lock/unlock
- hide/reveal
- join controls

Native HTML/CSS + TypeScript may be enough.

If the UI state becomes difficult to manage, evaluate a small permissively licensed component framework later.

Do not add a framework because it is popular.

## Persistence / Auth / Realtime — Supabase

Sources:

- https://github.com/supabase/supabase
- https://supabase.com/pricing
- https://supabase.com/docs/

Licensing:

- main Supabase repository: Apache-2.0
- Supabase architecture is composed largely of open-source components
- Auth/GoTrue: MIT
- Realtime: Apache-2.0
- PostgREST: MIT

Useful capabilities:

- Postgres persistence
- browser client libraries
- authentication
- Row Level Security
- realtime WebSocket broadcast/presence/database changes
- storage
- edge functions if later needed

Current hosted Free plan snapshot:

- $0/month
- up to 2 active free projects
- 500 MB database per project
- 5 GB egress
- 5 GB cached egress
- 1 GB file storage
- 50,000 monthly active users
- 2 million Realtime messages/month
- 500,000 Edge Function invocations
- free projects may pause after 1 week of inactivity

Why this is attractive:

For the MVP, the browser may be able to talk directly to Supabase with Row Level Security. That gives us saved maps, users, joins, and realtime updates without operating a custom backend server.

Current recommendation:

**Leading MVP backend/service candidate.**

Important:

Do not lock business logic irreversibly into hosted-only APIs. Keep the authoritative world schema portable so Supabase can be self-hosted or replaced later.

## Supabase Alternative — PocketBase

Source:

- https://github.com/pocketbase/pocketbase

License:

- MIT

Capabilities:

- SQLite-backed persistence
- realtime subscriptions
- built-in users
- file management
- REST-style API
- single executable

Advantages:

- extremely small
- open source
- easy local/self hosting
- no platform lock-in

Current caution:

PocketBase is still pre-1.0 and its own documentation warns that full backward compatibility is not guaranteed yet.

It also requires us to operate a persistent server somewhere.

Current recommendation:

**Excellent fallback/self-host option, but hosted Supabase is currently easier for a $0 browser MVP.**

## Collaborative-State Library — Yjs

Source:

- https://github.com/yjs/yjs

License:

- MIT

Purpose:

Yjs is a CRDT/shared-data library for collaborative applications.

Current decision:

**Do not add Yjs to MVP yet.**

Reason:

Our world has a strong DM authority model and mostly discrete grid actions. Supabase Realtime/event synchronization may be sufficient.

Only add a CRDT layer if actual concurrent editing conflicts prove it necessary.

This follows the project's "do not add complexity before the requirement exists" rule.

## Static Hosting — Cloudflare Pages

Sources:

- https://developers.cloudflare.com/pages/
- https://developers.cloudflare.com/pages/functions/pricing/

Current Free-plan observations:

- static asset requests are free and unlimited
- Pages Functions share the Workers Free quota
- Workers Free currently provides 100,000 requests/day across relevant Workers/Pages Functions usage

Why it fits:

- static Vite output
- CDN distribution
- no required application server
- no static-bandwidth charge for ordinary Pages assets under the current pricing model
- Functions remain available later if a tiny server-side endpoint becomes necessary

Current recommendation:

**Preferred first hosting candidate.**

## Why Not GitHub Pages for the Product

GitHub Pages is useful for demos and documentation, but GitHub's current documentation explicitly says Pages is not intended or allowed to be used as a free hosting service for an online business, e-commerce site, or SaaS product.

Therefore:

- GitHub Pages can remain useful for private tests/documentation/prototypes where appropriate
- do not plan the actual product business around GitHub Pages

This is a policy/terms reason, not merely a technical limitation.

## Why Not a Custom FastAPI Backend Initially

A custom FastAPI service would require:

- server hosting
- deployment
- process monitoring
- auth integration
- WebSocket/realtime implementation or another service
- database connection management
- another failure surface

There is currently no proven MVP requirement that needs this.

Therefore:

> **No custom backend server until a requirement proves it necessary.**

If we later need trusted server-side game logic, billing, protected asset processing, complex moderation, or custom realtime behavior, FastAPI remains an option.

## Why Not Docker Initially

Docker is useful for reproducibility and self-hosting, but a static frontend plus hosted Supabase does not require Docker for deployment.

Do not containerize the project just to say it is containerized.

Add Docker when:

- local services need reproducible orchestration
- we self-host Supabase/PocketBase/backend infrastructure
- CI/deployment materially benefits from it

## Asset Strategy

Prefer:

1. original simple assets
2. public-domain/CC0 assets
3. permissively licensed assets with attribution when appropriate
4. programmatically generated simple textures/icons where licensing is clear

Do not adopt an asset pack until its exact license is documented.

Do not copy Minecraft artwork.

## Dependency Policy

Before adding a dependency, answer:

1. What requirement does it satisfy?
2. Can the browser/platform already do this without a dependency?
3. Is the project actively maintained?
4. Is the license commercially compatible?
5. What notices/attribution are required?
6. Does it reduce more code than it introduces?
7. Can we remove/replace it later?
8. Does it increase hosting/runtime cost?

If the answers are not favorable, do not add it.

## Current $0 MVP Candidate

At current published free-tier limits, a prototype/MVP could potentially run with:

- **TypeScript** — free/open source toolchain
- **Vite** — MIT
- **Three.js** — MIT
- **Cloudflare Pages** — $0 static hosting
- **Supabase Free** — $0 database/auth/realtime/storage within quotas
- **Original/CC0 block assets** — $0 licensing cost

Potential recurring infrastructure cost at early prototype usage:

**$0/month**, provided usage remains within the providers' free limits.

The first obvious upgrade pressure would likely be backend usage/availability rather than static frontend hosting.

Supabase Free currently pauses inactive projects after one week; that is acceptable for early development/testing but should be revisited before a public production launch.

## Not Yet Selected

None of these dependencies/services are final.

Before code starts, we still need to finish the product/spatial contracts and then make a written architecture decision comparing the smallest realistic alternatives.

The goal is not to invent technology.

The goal is to assemble a small amount of proven technology into a product whose simplicity comes from **our interaction design and data model**.
