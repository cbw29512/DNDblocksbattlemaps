# Combat Measurement, Spell Templates, and Combat Log

Status: **foundation in progress**; visual placement and combat log UI are NOT implemented by this PR. Approved feature request: Oct 8 2026.

## Locked intent
- DM and players select spells/monster abilities and see an understandable temporary translucent grid/AoE overlay; visible to connected participants once actual multiplayer exists.
- One universal template service drives spheres, cones, lines, cubes, cylinders and future custom shapes. Do not invent a separate engine for Fireball, dragon breath or homebrew. Never turn an AoE outline into physical terrain cubes.
- All dimensions are in feet converted using GRID_FEET (5 feet/cell). 3D matters for flying creatures and vertical areas. Show range separately from effect size. A caster must be in valid casting/ability range; a cone/line needs origin and direction.
- Example Fireball: 150-foot target range, **20-foot-radius sphere**, translucent red area. Dragon breath: monster-defined size/shape, cone or line; never assume all dragons use the same breath profile.
- Generic colors: fire red/orange; lightning pale white; cold blue; necrotic black/violet with visible outline; radiant gold; poison green; acid lime; other nonphysical manifestations translucent gray.
- Non-AoE/nonphysical effects (e.g. Charm) should show a short-lived announcement and a transparent neutral targeting indicator, **not** a falsely sized sphere or cube.
- One visible combat log records caster/source, ability label, targets/coordinates, declared range/AoE, timestamp/turn, actual dice/modifiers/save outcomes (only when supplied by a trusted roller/engine). Never invent rolls or damage.
- Overlays disappear on commit, cancellation or explicit duration/time-out; persistent spell zones belong to encounter state rather than permanent map geometry. No unbounded scene objects.
- Existing Build vs Combat, creature statuses, monster footprint rules, and campaign storage remain unchanged. Multiplayer is future work. Existing spell/rule data must be checked against **2014 vs 2024** editions before binding exact effects.

## Architecture and small independent gates
- **A0** domain measurement foundation: shared shapes in `src/domain/areaTemplates.ts`, grid feet, range and generic geometry predicates. Initial *illustrative* presets only. Current point-in-cell model uses center approximation, not an authoritative RAW overlap/cover adjudicator or line-of-effect test.
- **A1** renderer integration: a translucent non-pickable overlay grouped in Three.js, fallback 2D square highlights, on-hover placement, origin/direction/range marker and affected-creature outline; no mutation to saved map. Test 3D height, board boundaries, mobile touch.
- **A2** combat log: bounded append-only encounter events, caster/actor, ability, area placement and identified targets; render visible panel and announce actions, with log persistence scoped to eventual campaign encounter only.
- **A3** data-driven spells/monster ability registry: bulk ingest *legally sourced* rule dimensions separately by edition (2014, 2024), physical vs narrative classification, caster/target range, duration/shape/color; review every entry against authoritative rules. Include homebrew form later using same primitives.
- **A4** RAW certification: grid-square intersection rules, vertical shapes, directional angles and cover/line of effect, occupants' entire multi-cube footprints, originating square, move/recenter, creature hit lists, spell save/damage/log integration; browser QA.
- **A5** real-time shared overlays and per-player permissions after multiplayer sessions exist.

## No drift / proof
Do not mark A1-A5 done just because A0 is merged. Keep `PROJECT_STATE.md`, `docs/ANTI_DRIFT.md` and `public/how-to-play.html` consistent with what is *actually live*. Status has to distinguish code committed, exact-head CI, and live browser interaction.

**Next:** A1 render previews for A0 geometry; then A2 combat log. G0 migration remains the next campaign-storage task and may proceed independently, but don't combine it with AoE PRs.

## LOCKED visual shape projection
All previews and active effect markers must render **5-foot cubic cells**, never smooth geometries. Preserve discrete cell outlines and partial transparency (default 50%). RAW area geometry, creature footprint and coverage tests determine cells; the visual is a cube overlay and does not turn the area into a physical terrain object. Fireball remains a 20-foot-radius sphere in the rules, displayed as a voxel/cube approximation based on verified affected spaces; dragon breath uses creature-defined cone/line. Left-click or touch Cast commits the declared spell and adds exactly one caster/action combat-log entry; Escape, right-click and a touch-friendly Cancel control end the preview without casting or logging. Source dimensions require per-edition verification before certification.

## Whole-cell binary area contract
Rendering is **all-or-nothing per 5-foot cube**, not partial/smooth shapes. Do not prorate damage for partial cell overlap. Determine cells using edition-correct tabletop grid/template rules and line-of-effect, then display the resulting full cubic cells at ~50% opacity. Do **not** substitute naive any-overlap/any-touched-cell logic without RAW verification. Evaluate Large/Huge/Gargantuan creature volumes, not one anchor cell. The current A0 cell-center approximation is provisional and must be replaced/certified in A4 before claiming RAW-complete.

## A1 initial preview status (2026-10-08)
- **IN PROGRESS** on dedicated branch: editor selector and 3D full-cube translucent overlay, 2D highlighted full cells, Cast/Cancel/Escape/right click; A2 preliminary local in-memory cast announcement. Preview examples only and first creature used as provisional origin. This is not complete A1 or complete A2; requires exact-head CI, real-browser validation, explicit user caster selection, RAW geometry, target highlighting and persistent campaign-scoped event records. Do not claim RAW-complete.

## A4 partial candidate-target footprint helper (IN PROGRESS)
- New generic `creatureOccupiedCells` and `previewAffectedCreatures` operate on full occupied cubic volumes and report each logical creature once. UI announces provisional intersected creature count/name during preview; cast announcement records count but no save or damage. This **does not** complete A4 RAW geometry or A1 graphical creature highlighting; A0's cell-center approximation remains provisional.

## A1 provisional target visualization (2026-10-08)
- IN PROGRESS: `setAreaTargets` renderer method highlights each cube of candidate targets as a visible yellow outline in 3D and affected occupied cells in fallback mode; clears on cancel/cast. This is a **preview only**, not guaranteed RAW hit adjudication. Do not mark A1/A4 complete without browser and edition-specific rule certification.

## Explicit caster origin checkpoint (2026-10-08)
- Caster must be explicitly chosen from current-map creature IDs before preview; first-unit fallback is forbidden. Selected creature anchor is provisional source origin pending edition-specific RAW origin/footprint certification. Check updates to caster selection after board edits and interactions on mobile.

## RAW grid audit — circle/sphere coverage checkpoint (2026-10-08)
- 2014 Dungeon Master's Guide p.251 *Using Miniatures / Areas of Effect*: place origins at grid intersections and circular AoEs affect squares at least half covered. 2024 Dungeon Master's Guide *Running Combat / Miniatures / Areas of Effect*: half-covered criterion stated generally for squares/hexes. Cross-check rule text against owned licensed references before labeling edition-complete. Research links: https://rpg.stackexchange.com/questions/166385/how-do-we-determine-circular-aoe-areas-on-grid and https://www.dndbeyond.com/forums/dungeons-dragons-discussion/rules-game-mechanics/215700-2024-aoe-changes .
- New `circularSquareCoverage` measures actual area of intersection on each 5-foot cell (numerical quadrature), then selects the **entire** cube only if coverage >= 50%; horizontal Fireball radius 20 ft at grid intersection gives 52 squares rather than 64. A0 sphere uses this rule per horizontal cross-section at each height. **Not yet fully RAW-certified in 3D**: creature vertical occupied volumes/vertical intersections, elevation conventions and walls/line of effect still need separate review. Preview remains advisory.

## Required public explanation — cube-adapted AoE (2026-10-08)
- Keep a plainly visible section in `public/how-to-play.html`: DND Blocks represents spells with full 5-foot squares/cubes, including spells described as a radius, sphere or cone. Stepped/cubic **visualization** does not alter RAW listed measurements, saves, damage or other effects. Determine qualifying cubes using verified edition-specific grid rules; no fraction-of-square damage. Update this notice if the measurement renderer or grid rules change.

## LOCKED ability measurement registry — edition-specific (2026-10-08)
- Use stable composite identity `edition + source entity ID + action ID` (and source book/version as appropriate), **not the displayed name**. Record shape; whether size is radius, diameter, length, width or height; exact feet values; range and origin; area placement restrictions; target/save/damage/duration/other rule changes; authoritative rule citation/source; verification status and reviewer/date. Do not derive an adult dragon's breath from a young dragon or reuse a 2014 Fireball definition for 2024 without independent checks.
- Shared universal math/rendering primitives consume those records. The visible output is always complete 5-foot cubes; edition-correct AoE coverage and the creature's entire occupied space determine *candidate* targets. Never change damage because a cell's border is partially covered.
- Registry must fail closed for missing/uncertified rules: clearly mark `illustrative / unverified` and do not allow an authoritative hit/save/damage claim. Separate verified values from visual-only sample presets in `AREA_PRESETS`. Provide distinct ability choices when editions/monster variants differ; do not silently switch data.
- Required acceptance tests: 2014/2024 same-name abilities remain distinct; cone vs line and radius vs diameter cannot be confused; individual monster variants preserve their sizes; unverified entries cannot be resolved as RAW-certified; mobile preview/cancel does not log a cast.

## A3 first implementation checkpoint (2026-10-08)
- `areaAbilityRegistry` introduces distinct edition+source+action keys and a `verification`/`sourceReference` fail-closed predicate. The editor displays 2014 and 2024 sample previews as explicitly **unverified** and uses the registry instead of a name-based lookup. Existing examples have identical placeholder values in both editions until individually checked; no RAW hit/damage auto-resolution. Later gate: source-review genuine spells and individual monster abilities with size/range/save/damage provenance, then prevent production auto-cast of unverified actions.
