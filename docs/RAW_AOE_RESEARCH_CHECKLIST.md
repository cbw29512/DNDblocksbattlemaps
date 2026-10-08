# DND Blocks — Researched RAW Area-of-Effect Rules and Work Checklist

**Research date:** October 8, 2026  
**Status:** Living checklist. Research findings are not equivalent to code or browser certification.  
**Canonical contracts:** SOUL.md, docs/COMBAT_AREA_AND_LOG_PLAN.md, docs/ANTI_DRIFT.md, PROJECT_STATE.md.  
**Product rule:** Visuals use complete 5-foot cubes, generally 50% opacity for previews. The edition-specific rules decide which cubes are affected; fractional overlap never means fractional damage.

## Research findings and sources

| ID | Rules area | 2014 vs 2024 evidence | Current status |
|---|---|---|---|
| R01 | Basic shapes | **2014:** cone, cube, cylinder, line, sphere. **2024:** additionally emanation, which can move with its creature/object origin. Sources: [2014 Spellcasting](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting), [2024 Rules Glossary](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary/). | Five shapes present; 2024 emanation missing. |
| R02 | Area origin | Shape governs origin. Cone, line and cube may exclude origin; sphere and cylinder include it; cube origin is on a *face*, cylinder on top/bottom center. Sources: [2014 Spellcasting](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting), [2024 Glossary](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary/). | Partial; Self sample anchored, cube-face and cylinder origin placement missing. |
| R03 | Clear path and Total Cover | Both editions block parts of AoEs if no unblocked straight line from origin reaches them. Unseen point behind a wall can cause origin to manifest on near side. Sources: [2014 Basic Rules](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting), [2024 Rules Glossary](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary/). | **Missing; P0** wall/door/cover and origin correction. |
| R04 | Area shapes and measurements | A cone widens with distance; a line has actual length and width; spheres specify **radius**; cylinders have radius and height; cube size specifies a side. Do not confuse diameter/radius or point vs face origin. Sources: [2014 Shapes](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting), [2024 Shapes](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary/). | Partial, unverified cubical grid projection especially diagonal/vertical cases. |
| R05 | Half-square grid coverage | 2014 DMG miniature guidance addresses **circular** AoEs; 2024 DMG generalizes the half-square-or-hex test to areas. Origins use grid intersections as specified. Primary references: [2014 DMG Areas of Effect](https://www.dndbeyond.com/sources/dmg/running-the-game#AreasofEffect), [2024 DMG Areas of Effect](https://www.dndbeyond.com/sources/dnd/dmg-2024/running-the-game#AreasofEffect). Some DMG access requires a subscription. Secondary corroboration: [2024 discussion quoting text](https://www.dndbeyond.com/forums/dungeons-dragons-discussion/rules-game-mechanics/226559-15-feet-cone-from-above), [edition comparison and alternative template method](https://www.dndbeyond.com/forums/dungeons-dragons-discussion/rules-game-mechanics/205820-rules-clarifications). | Circle/square horizontal implementation exists; 3D cube-volume accuracy and shapes other than circles **not certified**. |
| R06 | Optional template variants | Some alternative rule methods (e.g. the Xanathar's template method) have **different square-inclusion thresholds**. Do not silently mix with DMG edition policy. Secondary summary: [Rules Clarifications](https://www.dndbeyond.com/forums/dungeons-dragons-discussion/rules-game-mechanics/205820-rules-clarifications). | Unresolved: record source and chosen method if optional modes are added. |
| R07 | 2024 Lightning Bolt | **Self**, **100-ft length, 5-ft width line**, Dex save, **8d6 lightning** base, half on success, +1d6 per slot level above third. Source: [2024 spell text](https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions/), [spell entry](https://www.dndbeyond.com/spells/2618999-lightning-bolt). | Current 100-ft sample remains labeled **unverified** until an actual source-specific record, tests, exception/target and save integration are completed. The 60-ft line is an *example*, not a Lightning Bolt value. |
| R08 | Individual ability data | Same-name 2014/2024 spells or different dragon ages/colors/individual monster actions may have different parameters. Always use actual source monster/action/spell, not a generic breath proxy. See each individual official spell/monster source and the project SOUL contract. | Registry distinguishes editions, but sample records are **illustrative**, with no authoritative monster-specific rule values. |
| R09 | Large creatures | Each 2×2×2, 3×3×3, or 4×4×4 cube assembly is one creature. Use its **entire volume** for candidate targeting and a verified legal origin for Self effects. Source: project visual/gameplay contract; official origin subtleties need review. | Full-volume candidate intersection and cardinal forward-origin helper exist; arbitrary angles and exact legal origins incomplete. |
| R10 | 2024 Emanation | Origin is a creature/object; area radiates outward, commonly moving with it; origin inclusion selectable by creator where allowed. Source: [2024 Glossary — Emanation](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary/). | Missing primitive; must not approximate automatically as a caster-centered sphere. |
| R11 | Spell exceptions | Specific description overrides general geometry, such as spread around corners, movable zones, duration and target eligibility. Sources: [2014 spell descriptions](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells), [2024 spell descriptions](https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions/). | Missing source-verified exception records and execution. |

## Prioritized engineering checklist

- [ ] **AOER-001 P0 — Source-backed ability registry:** Store edition, source identifier/book, action, exact shape, radius/diameter/length/width/height, origin/range, target eligibility, cover exceptions, save/damage/duration, source URL/page, review date and certification status. No certified label for illustrative samples.
- [ ] **AOER-002 P0 — Self/point/face/emanation origins:** Self effects anchor to the selected caster and change **direction only**; check actual occupied-space origin for large creatures. Targeted point areas can move within legal range. Implement cube-face origins, cylinder top/bottom and 2024 moving Emanations.
- [ ] **AOER-003 P0 — Correct area/grid geometry:** Certify diagonal line width and square coverage for both editions (not merely eight corner-touching cells), cones, cubes, cylinders, emanations and spheres. Distinguish diagonal movement metrics from AoE occupancy. Validate 3D cubic volumes and elevation.
- [ ] **AOER-004 P0 — Total Cover / line of effect:** Block through solid walls, floors, closed doors and obstacles where applicable. Test cover at corners, openings and high elevations, near-side origin relocation and exceptions for specific abilities.
- [ ] **AOER-005 P0 — Multi-cube creature resolution:** 1, 2, 3 and 4 cube footprints checked in full, each creature counted once, friendlies included if the ability affects them, source inclusion selectable according to rules, targets vs candidates clearly distinguished.
- [ ] **AOER-006 P1 — Verify edition and creature content:** Research named 2014 and 2024 spell entries independently and each dragon age/color breath action, then bind immutable verified values to universal renderer; no guessed sizes.
- [ ] **AOER-007 P1 — Dice and effect engine:** Dice, DC, saves, damage, resistance, immunity and spell-specific exceptions derived from actual engine data; no invented hit events.
- [ ] **AOER-008 P1 — Phone-safe placement:** Accessible Preview / Cast / Cancel, Escape and right-click cancel without log or terrain mutation, group rotation, hover/pointer and touch interactions.
- [ ] **AOER-009 P1 — Renderer performance:** Reuse 50%-opacity physical-looking but nonpersistent cubes; target outlines and disposal/instancing, no raycast capture, renderer parity with fallback.
- [ ] **AOER-010 P1 — Persistent combat log:** Bounded, encounter-scoped log, one event per confirmed cast, exact actor/action/coordinates/targets, saved within campaign, later multiplayer.
- [ ] **AOER-011 P2 — Regression and deployment:** Add focused source tests, typecheck, browser test, src/web JS parity, exact-head CI and live Pages verification. Update How to Play and project tracker with completed/blocked state.

## Important implementation warnings

**Eight-direction 60-foot line preview is not RAW-certified.** A diagonal sequence of eight cells is a useful grouped-cube illustration, not proof those and only those cells meet the half-square inclusion criterion. Evaluate real line width against each grid cell under the edition's chosen grid policy.

**A sphere's horizontal half-square slice is not a validated 3D-volume overlap test.** Spell height, origin elevation, full cube intersections, and line of effect must be tested independently.

**The shape name does not determine the action's numbers.** 2024 Lightning Bolt is a 100-ft-long, 5-ft-wide Self line in the linked source. A monster's 60-ft breath and a customized 60-ft line are different entries.

**Rule-source status:** Basic Rules / Rules Glossary pages above were reviewed; DMG grid text is cross-referenced by section links and corroborating forum quotations but needs direct access verification for formal sign-off. Do not label every finding fully certified by this research alone.

## Progress recording template

When closing a checkbox add: **date; edition(s); verified source URL/book/page; reviewed values; code paths; tests; exact PR/head/CI; live browser proof; remaining exceptions**. Update this file as the work progresses, without rescanning the whole roster each time.

**Checkpoint through PR #38:** Cube-only visuals and initial preview/cast controls implemented; ability registry keyed by edition but examples unverified; whole-creature candidate scanning, cardinal and eight-direction line previews are provisional; no full RAW target/damage, occlusion, 3D or live browser certification.

## Latest clarification — 2026-10-08: geometry continues through hidden/off-map space

User instruction supersedes the earlier request to stop AoE visualization at walls: sphere/other AoE *geometric projection* continues through floors, walls and beyond the visible viewport or map; clipping the camera does not truncate the effect. Full 5-foot cubes light up on any positive volume overlap; no partial cubes. Do not mistake unseen cubes for absent geometry. **Rules distinction:** published 2014/2024 AoE mechanics may still block spell effects at Total Cover; the user has approved geometry that visually continues through barriers, which is a DND Blocks custom presentation/house rule and must not be marked edition RAW. Keep geometric candidates separate from any future actual target/effect adjudication. This clarification overrides the wall-stop wording of open PR #40, which must be reconciled before merging.

Implemented in current sphere-preview branch: exact 3D sphere vs axis-aligned 5-foot cube positive-intersection test; generated candidate cells are still bounded by the caller's limits. Renderer clipping/auto-expansion, other shapes, live browser proof and actual effect resolution remain outstanding.
