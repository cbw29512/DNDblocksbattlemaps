# Dependency and License Register

> Status: pre-implementation.
>
> No application dependencies have been installed yet.
>
> This file must be updated **before** importing new third-party code/assets and whenever versions/licenses materially change.

## Selected MVP Dependencies / Services

### TypeScript

Status: selected, not yet installed.

Purpose:

- application language/type checking

License/source to record at installation time:

- exact installed package/version
- upstream package license

Notes:

No runtime service cost.

### Vite

Status: selected, not yet installed.

Repository:

- https://github.com/vitejs/vite

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

### Three.js

Status: selected, not yet installed.

Repository:

- https://github.com/mrdoob/three.js

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

### Supabase JavaScript Client

Status: selected architecture; exact package/version not yet installed.

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

Status: selected deployment target; not yet configured.

Purpose:

- static frontend hosting/CDN
- Git-based production deploys and previews

Current pricing note (2026-10-07):

- Free plan: $0/month
- 300 credits/month hard limit
- production deploy: currently 15 credits
- bandwidth: currently 20 credits/GB
- web requests: currently 2 credits per 10,000 requests
- Free plan has no overage charge; projects pause when the credit limit is reached

Cost-control rule:

- avoid unnecessary production deploys
- recheck pricing/credit rules before public launch
- keep the frontend portable so another static host remains an exit path

### Original / CC0 Assets

Status: selected asset policy.

Purpose:

- block textures/icons/visuals

Rule:

Every non-original asset must have source/license/provenance recorded before inclusion.

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
