# Campaign Manager, Map Manager, and Map Library — Implementation Contract

Status: **Approved product direction; implementation not started**. Last audit 2026-10-08.
Repository source of truth: this document plus SOUL.md, PROJECT_STATE.md and docs/IMPLEMENTATION_RULES.md. Avoid redesign or rescan on every work session: select the first unfinished gate below.

## Locked product behavior
- Hierarchy: **DM → Campaigns → Campaign Maps → active map**, alongside **DM → My Map Library**.
- A DM can create/run multiple campaigns. Each campaign owns its own party/character state, maps, active map selection and session metadata. No character, position, condition or party membership crosses campaigns unless explicitly copied/imported.
- Personal library stores independent reusable map masters. Using a library map creates a new editable campaign copy; edits never mutate the library master or another campaign.
- Each object is made from perfect 5-foot cubes; larger creatures remain one entity with size-specific multi-cube footprints. Reuse catalog IDs and universal primitives.
- DM active-map selection will be broadcast to players only once server-side multiplayer exists; currently all editing/storage is **single browser, localStorage only**. No implication of account/cloud save.
- Prioritize map building and monster blocks after protecting campaign data, without overwriting known art owned by other collaborators.

## Current baseline / known gaps
- Main holds five legacy terrain slots keyed `dndblocks:stage1:<terrain>` and saved custom maps keyed `dndblocks:custom-map:v1:<id>`; the custom-map index is `dndblocks:custom-maps:v1`.
- Campaign Party is *currently global* at `dndblocks:campaign-party:v1`, and edits can rewrite every saved map. This MUST be isolated before multi-campaign editing.
- Eight starter templates and area-first alphabetical catalogs are merged; character Party propagation exists locally. No Campaign Manager, library index, backups, map rename/duplicate/archive/delete UI, cloud accounts, live join, or player permissions.
- PR #20 for independent Build/Combat buttons was open at audit; check current PR state rather than assuming merged.
- Building-material cube faces still use icon-style art; texture replacement needs dedicated review.

## Storage model, v2 (contract before code)
- `Campaign`: stable ID, name, createdAt/updatedAt, archivedAt?, activeMapId?, ordered mapIds[]; no serialized full map objects in campaign index.
- `CampaignCharacter`: stable character ID, catalogId, party membership, color, conditions, exhaustion and canonical character properties; scoped to campaign ID.
- `CampaignMap`: stable map ID, campaignId, name, terrain/theme, independent editable objects/terrain and per-character positions; templates copied, never referenced as mutable shared source.
- `LibraryMap`: stable ID, name, copyable immutable-to-campaign snapshot, origin metadata/version; changing personal library master is an explicit library edit, never propagated into existing campaign maps.
- Storage schema version + validation on read; reject invalid/cross-campaign IDs. Avoid unbounded massive indexes. Treat write failures/quota exhaustion visibly.
- On future backend implementation: enforce owner access, campaign permissions and an authoritative active map on the server. Don't falsely imply that client-only namespace equals security.

## Ordered implementation gates (one small PR per gate)
### G0 — Preserve current work, migration design (P0)
- Enumerate existing keys, make a local export-backup operation (download JSON) with schema/version/checksum or validation, and import preview/rejection (invalid/cross-version input).
- Define a *non-destructive*, repeatable migration from legacy slots and global Party roster into a named **Default Campaign**; preserve legacy bytes. No erase/overwrite of unknown keys.
- Create migration/rollback behavior for interrupted writes and quota failures. Test empty data, partially corrupt data, 5 legacy maps, multiple custom maps, duplicate names, and repeated migration.
- **Exit**: old maps and positions are accessible in Default Campaign; backups can round-trip; second migration creates no duplicates; original keys remain intact.

### G1 — Separate campaigns (P0)
- Create/list/rename/archive/switch campaign in an explicit Campaign Manager. Campaign IDs namespace all rosters/maps/active selection. No global Party mutation when switching.
- Store campaign characters once; map-local positions independently. Keep display and interaction compatible with legacy current editor during migration.
- **Exit**: editing Party/conditions in Campaign A cannot change B, even when objects have similar names; switching/restoring persists.

### G2 — Map Manager (P1)
- List/search/open/rename/duplicate/archive/delete (with confirmation) maps *inside the selected campaign*; create blank or starter maps without overwriting prior maps.
- Set active campaign map; switching preserves each map's positions and uses canonical campaign Party. Add map entrance placement behavior and collision/footprint checks.
- Prefer manager interface to unlimited sidebar tabs.
- **Exit**: duplicate is deep copied with new IDs; removing a map never removes the campaign Party or a library original; switching does not leak into another campaign.

### G3 — Personal Map Library (P1)
- Save a chosen campaign map as an independent library snapshot; browse/search/rename/duplicate/import/export library maps.
- Insert library map into Campaign A or B as a *new* campaign map; same library snapshot may be reused unlimited times.
- **Exit**: edits to inserted copy in Campaign A cannot change Campaign B or library source.

### G4 — Quality and UX (P1/P2)
- Run end-to-end browser tests: cold start, legacy migration, corrupted keys, save/reload, two campaigns, one library map used twice, Party identity/conditions, Build/Combat movement, template doors and entrances, large-creature footprints, Print Map, no lost data.
- Upgrade material cube art (wood, stone, cobblestone, dirt, grass etc.) with per-face/seamless material rendering; maintain perfect cube rule and do not confuse icon props with material surfaces.
- Keep `public/how-to-play.html`, PROJECT_STATE.md and this checklist synchronized with shipped features.
- **Exit**: exact-head typecheck/test/build + interactive browser verification before claiming production/live.

### G5 — Multiplayer/server later (not part of local v2)
- DM ownership, player permissions limited to assigned PCs, shared campaign session and server-authoritative active map; data isolation enforced server-side; account cloud backups.
- Do not present Join Game as working until real cross-browser certification.

## Verification policy / small-step work
1. Before implementing: read SOUL.md, this plan, relevant source/PRs; identify next unchecked gate. Do **not** re-audit every file or implement an unrelated subsystem.
2. Preserve source TypeScript ↔ checked-in browser JS parity; avoid TS syntax in shipped JS.
3. Add regressions of safety contracts plus browser startup/movement. CI green on exact head, then merge; Pages deploy and live browser verification are separate gates.
4. Update instructions and PROJECT_STATE.md *in the same PR*. Report changes, test/run IDs, deployment proof, blockers and precise next step. Never claim functionality merely from a merged PR.

## Completion tracker
- [ ] G0 backup, schema validation and idempotent Default Campaign migration
- [ ] G1 canonical campaign/party namespace and Campaign Manager
- [ ] G2 active campaign Map Manager and map operations
- [ ] G3 independent reusable My Map Library
- [ ] G4 browser certification, cube faces and multi-cube rendering/printing improvements
- [ ] G5 eventual synchronized player sessions

**Next task:** G0a — implement a read-only legacy-key inventory + downloadable, versioned backup and regression tests *without changing existing save behavior*. Audit migration in G0b before writing any converted keys.

## Anti-drift governance
`docs/ANTI_DRIFT.md` is mandatory for each session and hourly run. Use the single completion tracker above. Work on G0a next; record checkpoint, PR, CI and backward-compatibility evidence, and do not mark completion solely because implementation was pushed.
