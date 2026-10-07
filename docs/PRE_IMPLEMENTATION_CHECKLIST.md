# Pre-Implementation Checklist

> Status: Stage 1 underway. The explicit coding gate was satisfied by the user's 2026-10-07 instruction to build and test the prototype.
>
> No application code should begin until this checklist is reviewed against the repository and the user explicitly directs implementation to begin.

## Product Contracts Present

Required authoritative documents:

- [x] `PROJECT_STATE.md`
- [x] `SOUL.md`
- [x] `docs/DATA_SCHEMA.md`
- [x] `docs/ROADMAP.md`
- [x] `docs/INTERACTION_SPEC.md`
- [x] `docs/SPATIAL_CONTRACT.md`
- [x] `docs/CAMERA_CONTRACT.md`
- [x] `docs/PLACEMENT_CONTRACT.md`
- [x] `docs/TRAPS_AND_EFFECTS.md`
- [x] `docs/PLAYER_JOIN_CONTRACT.md`
- [x] `docs/PERSISTENCE_UNDO_CONTRACT.md`
- [x] `docs/VISUAL_LANGUAGE.md`
- [x] `docs/WEBSITE_EXPERIENCE.md`
- [x] `docs/OPEN_SOURCE_REUSE.md`
- [x] `docs/TECH_STACK_CANDIDATES.md`
- [x] `docs/ADR_001_MVP_WEB_STACK.md`
- [x] `docs/DEPENDENCY_REGISTER.md`
- [x] `docs/IMPLEMENTATION_RULES.md`

## Locked Product Decisions

- [x] kid-simple UI
- [x] browser-first
- [x] cheap/open-source/reuse-first
- [x] DM is authoritative
- [x] 5-foot visible grid
- [x] room dimensions use feet
- [x] Length × Width = usable interior
- [x] Height = wall height
- [x] no automatic ceilings
- [x] fixed ~30° camera elevation
- [x] horizontal orbit + pan + zoom + Reset/Home
- [x] DM placement may overlap/stack/floating-place anything
- [x] select once/place many
- [x] placement ghost
- [x] surface-based stacking + explicit elevation fallback
- [x] pick-up/put-down object movement
- [x] room construction lock
- [x] shared walls reuse one WorldObject
- [x] universal trigger/effect model
- [x] universal transform/replace
- [x] low-friction player join
- [x] DM assigns pieces
- [x] movement lock + DM override
- [x] Tiny creatures share 5-foot squares without global subgrid
- [x] autosave
- [x] Undo/Redo in Stage 1
- [x] canonical current state separate from bounded history
- [x] revision + action-ID realtime recovery
- [x] hidden information must not leak to player UI/data
- [x] visual feedback does not rely on color alone
- [x] public website is part of the product, not a separate brochure
- [x] local-first testing; Netlify production deploys are deliberate milestones

## Accepted MVP Architecture

- [x] TypeScript
- [x] Vite
- [x] Three.js
- [x] native HTML/CSS first
- [x] Supabase
- [x] Netlify
- [x] GitHub source/docs
- [x] no custom application server initially
- [x] no Docker requirement initially
- [x] no React/Vue/Svelte requirement initially
- [x] no CRDT/Yjs initially

## Dependency Gate

Before the first package installation:

- [x] record exact package versions
- [x] recheck direct dependency licenses
- [x] update `DEPENDENCY_REGISTER.md`
- [x] retain direct third-party license notices; generate transitive inventory after first connected install

These remain unchecked until actual packages are selected/installed.

## Stage 1 — Single-User Builder Definition of Done

The first implementation stage should prove the core editor without multiplayer feature creep.

Required:

- [x] polished public hero explains product simply
- [x] Build a Map and Join a Game are obvious above the fold
- [x] terrain quick-start cards open the builder
- [ ] real product visual/showcase
- [x] homepage works on mobile
- [x] basic SEO/Open Graph/favicon metadata
- [ ] local tests pass before any Netlify production deploy
- [x] terrain/theme selection
- [x] visible 5-foot grid
- [x] default ~30° camera
- [x] orbit/pan/zoom/reset
- [x] sidebar block palette
- [x] select once/place many
- [x] placement ghost
- [x] right-click/remove behavior on desktop
- [ ] visible remove path for touch
- [x] permissive overlap
- [ ] ground/top/side surface placement
- [x] explicit elevation control in 5-foot increments
- [ ] floating placement
- [ ] pick-up/put-down move
- [ ] ambiguous overlap chooser
- [ ] room generator in feet
- [ ] walls/floor/no ceiling
- [ ] shared wall reuse
- [ ] door replacement
- [ ] construction lock/unlock
- [ ] creature footprints including Tiny visual behavior
- [ ] hidden/DM-only visual state
- [x] Undo/Redo
- [x] autosave/reload recovery
- [ ] original/approved-license placeholder assets only
- [x] unit tests for implemented state/placement/undo primitives (room primitives not implemented yet)
- [ ] no combat/rules engine

## Stage 1 Architecture Tests

Before calling Stage 1 complete:

- [ ] renderer can be rebuilt from authoritative state
- [ ] no core world state exists only inside Three.js objects
- [ ] placing overlapping objects preserves all records
- [ ] room generation is reversible as one Undo
- [ ] shared walls are not duplicated
- [ ] door replacement preserves shared room membership
- [ ] hidden object is visually distinct for DM
- [ ] Tiny pieces auto-offset without changing the global grid
- [ ] browser refresh restores saved builder state
- [ ] no dependency entered repo without license record

## Explicit Do-Not-Build List

During Stage 1 do not add:

- multiplayer implementation
- automated D&D combat
- initiative
- character sheets
- spell automation
- dynamic lighting
- advanced line of sight
- first-person mode
- free-fly camera
- physics
- procedural infinite worlds
- Minecraft assets
- marketplace
- campaign management
- voice/video
- custom server unless a documented blocker proves it is required

## Ready-to-Code Condition

The project is ready to begin Stage 1 only when:

1. repository docs remain internally consistent
2. dependency versions/licenses are recorded immediately before installation
3. implementation follows `IMPLEMENTATION_RULES.md`
4. the user explicitly says to begin coding

Until then, remain in design/audit mode.


### First-Slice Verification Note — 2026-10-07

Completed locally in the available execution environment:

- TypeScript compile: PASS using available local compiler against the source/shims
- domain state/command tests: 4/4 PASS
- every TypeScript source module reviewed back under the ~150-line guideline
- source supports an interactive DOM fallback if Three.js cannot initialize

Environment limitation:

- sandbox browser navigation to localhost is blocked by administrator policy, so a real browser click-through could not be completed inside the sandbox
- the manually triggered GitHub Pages test deployment is therefore the first external browser-interaction gate
- Netlify remains untouched until a locally/source-tested milestone is ready for production review

Still open for Stage 1:

- full browser visual/interaction verification
- natural top/side surface placement
- touch remove path
- pick-up/put-down move
- overlap chooser
- room generation/shared walls/door replacement
- construction locking
- creature footprint/Tiny visuals
- hidden object visual
- full Stage 1 persistence layer beyond localStorage prototype
