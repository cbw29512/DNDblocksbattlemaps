# DND Blocks Battle Maps — Consolidated Project Handoff

**Updated:** 2026-10-08  
**Repository:** https://github.com/cbw29512/DNDblocksbattlemaps  
**Website:** https://cbw29512.github.io/DNDblocksbattlemaps/  
**Purpose:** One convenient reference for decisions from the October 2026 implementation conversations. This is a **summary/index**, not a replacement for locked contracts in `SOUL.md`, `docs/ANTI_DRIFT.md`, `docs/CAMPAIGN_MAP_LIBRARY_PLAN.md`, `docs/COMBAT_AREA_AND_LOG_PLAN.md`, or evidence in `PROJECT_STATE.md`. If status conflicts, inspect current code, PRs and CI and correct the stale document.

## 1. Locked identity and rules

- **The signature of DND Blocks is perfect five-foot cubes.** Every player, monster, building material, prop, terrain representation, spell preview, breath weapon, status/target marker and visual effect must preserve an unmistakable cube/grid aesthetic. Never replace spell previews with smooth sphere or cone meshes. Face art can portray a barrel, wooden floor or wall, but its containing object remains a cube.
- Small/Medium/Tiny = **1×1×1**, Large = **2×2×2**, Huge = **3×3×3**, Gargantuan = **4×4×4** cubes. A large monster is **one** selected/movable creature with one identity, not separately acting little blocks; its complete occupied 3D space matters for collision, movement, range, targeting, and printing.
- **RAW first** for combat, with separate recorded **2014 versus 2024** values wherever different. Do not guess spell sizes, saving throws, attack values, character/monster capabilities or grid intersection behavior. Store traceable source/edition, size, range, geometry, save, duration and rule review status for each registered ability. Distinguish visualization approximation from certified RAW hit adjudication.
- All affected areas display **whole 5-foot cubes**; either a cube is affected or it is not. No partial cube rendering or damage prorated according to how much of a square is covered. The edition-correct grid rules, cover/line of effect, 3D elevation and occupied monster volumes decide inclusion—**not** a blanket "any sliver touched" shortcut.
- Universal shared primitives for effects, conditions, placement and geometry. No unique Fireball/dragon/homebrew rendering engine merely because an ability has a different name.
- Existing saved maps and Party data must never be silently overwritten or discarded. Avoid changing art assets owned by parallel collaborators.

## 2. Campaigns, maps and libraries — approved architecture

**DM → Campaign Manager → Campaign maps / Party / active map**, plus a personal **My Map Library** independent of any one campaign.

- DM can run multiple **isolated** campaigns, each with its own party, characters, conditions, maps, active map and session data. Never leak character/Party changes from Campaign A into Campaign B.
- **Map Manager:** create from scratch or template, search/list, open/switch, rename, duplicate, archive and delete with confirmation. Party appears when DM switches maps, while per-map creature positions persist. In future multiplayer, changing the DM's active map changes the connected players' current view.
- **My Map Library:** a separate personal collection of custom buildings/maps. Copy a library map into any campaign to obtain a distinct editable instance. Edits to a campaign copy never mutate its library master or a different campaign.
- Start with local browser storage and **export/import backups**, then cloud accounts/server multiplayer after permissions and synchronization exist. Current Join Game is a nonfunctional placeholder.
- Migration must preserve five original terrain map slots, existing custom map IDs, Party records and map positions. Create an idempotent **Default Campaign**, keep original legacy keys intact until recovery is proven, handle corrupt saves, interrupted writes and storage quota.
- Existing baseline: five environments **Castle, Inn, Field, Sea, Volcano**; eight copyable editable starters **Roadside Inn, Castle Keep, Starter Dungeon, Forest Camp, Harbor Dock, Goblin Cave, Ancient Temple, Ruined Outpost**.

**Campaign sequence / tracker:** see `docs/CAMPAIGN_MAP_LIBRARY_PLAN.md`.
- **G0a** read-only legacy inventory and JSON backup: implemented/merged as PR #22; backup restores/imports are **not** yet implemented. The encompassing G0 migration gate is incomplete.
- **G0b** safe import preview, backup validation, idempotent Default Campaign migration + rollback: next unfinished storage work.
- **G1** real campaign-specific canonical Party/character data and Campaign Manager: not done.
- **G2** per-campaign Map Manager operations and active-map state: not done.
- **G3** personal reusable My Map Library: not done.
- **G4** browser QA, material-face and multi-cube placement/printing improvements: incomplete.
- **G5** cloud/multiplayer synchronization and permissions: future phase.

## 3. Combat spells, weapons and monster abilities

**Desired player/DM interaction:**
1. Open a weapon/spell/ability list. Select a weapon for reach/range visualization, or select a spell/monster ability to load its RAW **edition-specific** origin/range/AoE and effect type.
2. Show a temporary **approximately 50%-opacity cluster of full 5-foot cubes** for affected spaces, shaped as a RAW sphere/cone/line/cube/cylinder on the grid. Fire red, lightning pale white, cold blue, necrotic dark violet/black with visible outline, poison green; nonphysical/Charm-like effects use a neutral translucent indicator or brief announcement rather than invented AoE size.
3. While positioning, indicate who would be affected, **including allies** and each Large/Huge/Gargantuan creature's entire occupied volume. Show distance/range and out-of-range feedback. A creature is listed **once**, even if many cubes overlap.
4. **Left-click** a target cell or tap the **Cast** button to confirm; log `<caster/player name> casts <spell or ability>` exactly once with coordinates/targets. Add rolls/saves/damage only when actually resolved; never fabricate results.
5. **Escape, right-click or an always-visible, phone-usable Cancel button** ends preview without casting, changing the board, or creating a combat-log entry. Right-click cancellation must not trigger delete-block.
6. Temporary previews do not become permanent physical map blocks. Persistent area spells eventually use encounter effect state/duration; combat log belongs to the campaign encounter. In multiplayer, participants see synchronized authorized overlays and logs.

**RAW examples:** Fireball is a **20-foot-radius sphere** (40 feet diameter, about eight 5-foot cells across), *not* a solid 8×8×8 box nor a 2×2×4 cube. Its affected cubic cells approximate a sphere according to certified grid rules. Dragon breath depends on the specific creature: cone or line and source-defined measurements, not one universal guessed size. Other physical AoEs need reviewed 2014/2024 entries. Caster position, elevation, source point, origin rules and line of effect must be verified.

**Existing combat work:** `src/domain/areaTemplates.ts` provides generic five-foot-grid sphere, cone, line, cube, cylinder point/range primitives with illustrative starter presets (PR #24). PR #25 locks cube visual identity and whole-cell binary inclusion. PR #26 adds a prototype editor action selector, temporary 3D translucent cubic preview/2D fallback highlights, Cast/Cancel/Escape/right-click behavior and an **in-memory cast announcement**. PR #27 adds `creatureOccupiedCells` and `previewAffectedCreatures`: all occupied cubes are checked and each intersecting creature counted once, with provisional target names/counts. PR #27 CI passed and was merged.

**Not yet RAW certified or fully functional:** A0 cell-center inclusion is provisional; 2014/2024 sizes and rules require a reviewed source registry; cube inclusion, origin geometry, directional cones/lines, cover, elevation, walls, line of effect, whole-creature hit tests, automatic saves/damage, affected-creature visual outlines, explicit caster selection, permanent per-campaign combat logs and multiuser synchronization require further work. The prototype currently picks a first available creature as a provisional origin, not necessarily the actual caster. Do not report candidates as adjudicated hits. Browser deployment verification was not established by passing CI.

**Combat lane / tracker:** `docs/COMBAT_AREA_AND_LOG_PLAN.md`: A0 geometry foundation; A1 complete visible overlays + target highlights; A2 bounded encounter-scoped event/log; A3 edition-verified data-driven spell/monster ability registry; A4 RAW targeting/collision/elevation/line-of-effect certification; A5 multiplayer sync. Current priorities: **A1 visible creature highlights + A4 RAW area inclusion** before claiming true automatic hits.

## 4. Existing map, monster and visual work

- PR #19 merged eight editable map templates, independent custom map saves, Party entrance placement, clickable status rings, map switching, area-relevant **alphabetical-first** catalogs (remaining blocks still visible alphabetically), and `public/how-to-play.html`.
- PR #20 for separate clearly labeled **Build** and **Combat** buttons was **open at the latest observed query**; check actual status before reworking. Combat must lock scenery editing but permit creature movement/status; phone-friendly interaction required.
- Approx. **330 SRD 2024 monster visual catalog entries** (PR #17) and larger-size cubic assemblies were implemented. Visual presence is not proof of full 3D movement/collision/raycast/printing certification. Large/Huge/Gargantuan creature selection, whole-volume boundaries, elevations, stable identity, GPU/performance and print fidelity need regression/browser verification.
- **Building-face audit:** many walls/floors/terrain cubes still display generic illustrated icons/text on all six faces. Replace common building materials (wood floor/wall, stone/cobblestone/brick, dirt, grass etc.) with appropriately oriented tileable faces, while keeping exact cube silhouettes. Doors/barrels/props can retain recognizable illustrative cube faces. Review sample art before bulk replacement; no copied proprietary Minecraft assets.
- User prefers premade buildings and monsters as an ongoing content lane, but not at the expense of fixing data isolation or core encounter functionality.

## 5. Anti-drift development procedure

**Required each work session/hourly run:**
1. Read `SOUL.md`, `docs/ANTI_DRIFT.md`, `PROJECT_STATE.md`, and the relevant campaign/combat plan plus current PR/CI. This handoff is a navigational overview only.
2. Check current main, existing branches and open PRs before starting; finish a prior failed gate rather than duplicate it. Preserve `src/` TypeScript and checked-in `web/` JavaScript parity (do not ship TypeScript syntax inside browser JS).
3. Pick **one** smallest unfinished tracked gate, state non-goals, reuse universal primitives, add focused unit/browser regression and data-safety tests.
4. Verify exact-head CI: typecheck, tests, production build. Record commit/PR and check outcome. **CI VERIFIED ≠ LIVE VERIFIED**; independently check the deployed revision and interactive browser before claiming live.
5. Update relevant contract/tracker, `PROJECT_STATE.md`, and `public/how-to-play.html` for user-visible features in the same PR. Record next exact action, known blockers and rollback path.
6. Never interpret a roadmap as proof of shipped behavior; never auto-merge failures or destroy legacy data. Status vocabulary: NOT STARTED, IN PROGRESS, BLOCKED, CI VERIFIED, LIVE VERIFIED.

**Hourly automation:** `DND Blocks Content Builder` was enabled on an hourly schedule and instructed to follow both project plans and the anti-drift contract. Check the actual task state before asserting current cadence or success.

## 6. Known PRs and references

- #17 SRD monster cube visual library: https://github.com/cbw29512/DNDblocksbattlemaps/pull/17
- #19 editable starter maps: https://github.com/cbw29512/DNDblocksbattlemaps/pull/19
- #20 Build/Combat buttons: https://github.com/cbw29512/DNDblocksbattlemaps/pull/20
- #21 campaign/map/library architecture docs: https://github.com/cbw29512/DNDblocksbattlemaps/pull/21
- #22 backup export: https://github.com/cbw29512/DNDblocksbattlemaps/pull/22
- #24 AoE foundation: https://github.com/cbw29512/DNDblocksbattlemaps/pull/24
- #25 cube identity: https://github.com/cbw29512/DNDblocksbattlemaps/pull/25
- #26 cube AoE preview: https://github.com/cbw29512/DNDblocksbattlemaps/pull/26
- #27 full creature-volume provisional AoE candidates: https://github.com/cbw29512/DNDblocksbattlemaps/pull/27

**Immediate engineering priorities:** Confirm live build and outstanding PRs; certify usable preview/target highlight and whole-cell RAW rules; continue safe campaign backup/import/migration; finish multi-cube monster movement/printing; redesign building material faces. Keep these separate PR lanes and update canonical trackers as work completes.
