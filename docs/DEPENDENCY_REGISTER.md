# Dependency and License Register

> Status: pre-implementation.
>
> No application dependencies have been installed yet.
>
> This file must be updated **before** importing new third-party code/assets and whenever versions/licenses materially change.

## Selected MVP Dependencies / Services

### TypeScript 7.0.2

Status: pinned for Stage 1; first connected install will occur in the manual GitHub Pages test workflow or a normal network-connected dev environment.

Source:

- https://github.com/microsoft/TypeScript
- npm package: typescript@7.0.2

License:

- Apache-2.0

Purpose:

- application language/type checking
- compile-time state/schema protection

Notes:

- development/compiler dependency only
- no runtime service cost

### Vite 8.3.3

Status: pinned for Stage 1; first connected install will occur in the manual GitHub Pages test workflow or a normal network-connected dev environment.

Repository:

- https://github.com/vitejs/vite
- npm package: vite@8.3.3

License:

- MIT

Purpose:

- development/build tooling
- static production build
- dependency license report generation

Commercial use:

- permitted under MIT terms

Attribution/notice:

- retain required license notices

### Three.js 0.186.1

Status: pinned direct runtime dependency for Stage 1.

Repository:

- https://github.com/mrdoob/three.js
- npm package: three@0.186.1

License:

- MIT

Purpose:

- 3D rendering
- camera
- raycasting/picking
- meshes/instancing
- OrbitControls

Commercial use:

- permitted under MIT terms

Attribution/notice:

- retain required license notices

### Node.js 22.16.0

Status: GitHub Pages test workflow runtime.

Purpose:

- install/build/typecheck/test the static prototype in GitHub Actions

Notes:

- application runtime remains the browser
- Vite 8 requires Node 20.19+ or 22.12+, so 22.16.0 satisfies the requirement

### GitHub Pages — Test Surface Only

Status: temporary/manual prototype test surface, not production hosting.

Purpose:

- browser-interaction testing of locally checked Stage 1 milestones before Netlify release

Rules:

- manual GitHub Actions workflow only
- normal pushes do not publish Pages
- no commercial/SaaS production reliance
- no Supabase/private user data required for this Stage 1 test
- Netlify remains the selected production host

### Supabase JavaScript Client

Status: selected architecture; not used or installed in the first Stage 1 vertical slice.

Ecosystem:

- https://github.com/supabase/supabase

Purpose:

- hosted Postgres access
- authentication/session
- realtime
- storage if required

License:

- verify exact client package license/version before installation

Hosted-service cost:

- Free plan intended for prototype/early MVP within current quotas
- pricing must be rechecked before production launch

### Netlify

Status: selected deployment target; not yet configured for this project.

Purpose:

- public static frontend hosting/CDN
- Git-based milestone deploys
- deploy previews/rollback when useful

Account note:

- user reports an existing paid/Plus Netlify plan
- Netlify has changed public plan names/pricing over time and legacy accounts may retain older plans
- exact limits/costs for this account must be checked in the user's Netlify dashboard when deployment begins

Deployment rule:

- normal development/testing is local
- avoid unnecessary production deploys
- push coherent source checkpoints to GitHub
- publish to Netlify when a milestone is locally tested and worth reviewing live
- verify live release and preserve rollback path

### Original / CC0 Assets

Status: selected asset policy.

Purpose:

- block textures/icons/visuals

Rule:

Every non-original asset must have source/license/provenance recorded before inclusion.

### Iron Pit Internal Art Reuse

Status: approved for Stage 1 by the owner/user of both repositories.

Pinned source:

- repository: `cbw29512/D20-ironpit`
- commit: `24810df2a379b01a5dd63fa312dfd58426572efb`

Copied assets:

- 2024 Fighter, Cleric, Rogue, Wizard hero portraits
- Goblin, Skeleton, Zombie, Wolf, Mimic, Ghoul, Kobold, Bandit monster silhouettes

Destination:

- `public/assets/catalog/heroes/`
- `public/assets/catalog/monsters/`

Purpose:

- lightweight character/monster face art
- reuse the existing approved identity mapping instead of creating a duplicate art system

Runtime/infrastructure cost:

- none
- bundled locally; no cross-repository runtime requests

Replacement path:

- art is optional catalog data and can be replaced without changing placement/state mechanics

Commercial-release note:

- before public commercial launch, recheck and retain the underlying art-generation/source provenance and any required notices.

## Explicitly Not Selected for MVP

### Babylon.js

Status: fallback only.

License:

- Apache-2.0

Reason not selected:

- broader engine surface than current MVP requires

Revisit if:

- Three.js creates materially more custom code than expected

### PocketBase

Status: fallback only.

License:

- MIT

Reason not selected:

- requires operating a persistent server
- currently pre-1.0

Revisit if:

- self-hosting becomes preferable
- Supabase economics/constraints become unfavorable

### React / Vue / Svelte

Status: not selected.

Reason:

- current UI is small enough to start with native HTML/CSS/TypeScript

Revisit if:

- actual UI state complexity becomes a maintenance problem

### Yjs / CRDT

Status: not selected.

Reason:

- DM authority + ownership + revision/action IDs should handle MVP concurrency

Revisit if:

- real concurrent-edit testing demonstrates conflicts that cannot be handled simply

### FastAPI / Node Application Server

Status: not selected.

Reason:

- no proven MVP requirement for a custom always-on backend

Revisit if:

- privileged business/server behavior becomes necessary

### Docker

Status: not selected for MVP deployment.

Reason:

- static frontend + hosted Supabase does not require containers

Revisit if:

- self-hosting or multi-service local orchestration becomes necessary

## Import Checklist

Before adding any new dependency or asset:

1. exact name
2. exact version/commit
3. exact source URL
4. license
5. commercial-use status
6. attribution/notice requirement
7. purpose
8. why browser/native platform cannot do it simply enough
9. estimated bundle/runtime cost
10. estimated infrastructure cost
11. replacement/exit path

No third-party dependency or asset is considered approved until this register is updated.

## Stage 1 First-Slice License Record

Direct package versions pinned in `package.json`:

- three 0.186.1 — MIT — runtime
- vite 8.3.3 — MIT — development/build
- typescript 7.0.2 — Apache-2.0 — development/compiler

`THIRD_PARTY_NOTICES.md` retains the Three.js MIT notice and direct dependency license references.

The current execution sandbox could not reach npm, so no local package installation was performed. A package lock and transitive-license inventory should be generated/retained from the first normal network-connected install before a production Netlify milestone.
