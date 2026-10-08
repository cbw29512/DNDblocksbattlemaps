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
