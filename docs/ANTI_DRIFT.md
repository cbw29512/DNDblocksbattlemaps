# Anti-Drift and Change-Control Contract

**Status: mandatory project policy.** Read this before every DND Blocks implementation run, including hourly automation. Update it only through a reviewed, documented decision.

## Source-of-truth hierarchy
1. `SOUL.md`: locked product principles and non-negotiable behavior.
2. `docs/ANTI_DRIFT.md`: this workflow, completion gates, proof standards.
3. `docs/CAMPAIGN_MAP_LIBRARY_PLAN.md`: current ordered campaign/map/library implementation gates.
4. `docs/IMPLEMENTATION_RULES.md` and specific contracts: implementation and API rules.
5. `PROJECT_STATE.md`: verified operational facts, PRs, last completed step and next step.
6. GitHub source and tests: what *actually* exists; code contradicting contracts is a defect, not automatic permission to change the contract.
7. Conversations/automation summaries: context, not authoritative completion evidence.

When documents disagree, **stop and reconcile** in one targeted change; do not invent an interpretation or silently replace a locked requirement.

## Non-negotiable invariants
- Every physical block is a **perfect five-foot cube**. Small/Medium/Tiny 1×1×1, Large 2×2×2, Huge 3×3×3, Gargantuan 4×4×4. Multi-cube monsters remain one movable logical creature.
- Only reuse existing universal object/interaction primitives unless a capability is demonstrably missing; do not duplicate mechanics under new names.
- Campaigns isolate their character and Party identities, active maps and state. Library maps are reusable masters; imports into a campaign are independent copies.
- Creation, import, duplication and migration must never overwrite existing maps or erase legacy keys without explicit consent and a verified recovery path.
- Area-relevant catalog items appear first in alphabetical order; unrelated items remain accessible below in alphabetical order.
- Build and Combat permissions stay distinct. DM authoring rights are not player movement rights.
- Browser-local saves are not cloud accounts or multiplayer. Never claim features, tests or deployment are complete without evidence.
- Avoid unrelated changes to art files owned by parallel collaborators.

## Required first five minutes of EACH work session
1. Read this file, `SOUL.md`, `PROJECT_STATE.md`, the applicable plan, and current PR/CI status.
2. Check whether the immediately prior task already has an open PR or failed exact-head CI; finish that before starting a duplicate branch.
3. Select **one** unchecked implementation gate and name its expected user-visible outcome.
4. Check the existing domain/storage/render primitives and reuse what already exists.
5. Identify a focused test, affected documentation and the exact rollback/recovery behavior.

Do not repeatedly scan all JSON, all blocks, or all monsters for work already recorded in inventories. Update inventories incrementally when a capability changes.

## One feature = one verifiable work unit
For each PR, record:
- Work ID / gate and problem; scope and **explicit non-goals**.
- Existing primitive and contract reused; any new state field/schema or reason for new primitive.
- Files changed; migration/backward-compatibility impact; user data at risk.
- Tests added and exact CI run/commit conclusion; browser interaction/deployment evidence (or **not verified**).
- Docs changed: `PROJECT_STATE.md`, relevant plan/tracker, and `public/how-to-play.html` for user-facing changes.
- Outcome: merged, open, blocked, or reverted; precise next step.

No unrelated cleanup, new settings or speculative features inside a tightly scoped PR. Prefer a small repair to a restart.

## Stop / merge / publish gates
- **Fail closed** on unexpected schema, data overwrite, quota, malformed import, missing primitives, or uncertain RAW/world behavior.
- Never merge around failing relevant tests. Check CI **for the final head SHA** after the last edit.
- A green build is **not** live-browser proof. Verify published revision and core browser interactions before marking deployment verified.
- If a task times out or automation is interrupted, leave a concise, durable checkpoint rather than restarting investigation.
- Preserve a working deployment while testing risky updates on a branch and using a separate test deployment where possible.

## Persistent trackers and status vocabulary
Keep the active gate checklist in `docs/CAMPAIGN_MAP_LIBRARY_PLAN.md`; do not create a competing master to-do list. For catalog/monster-specific inventories, record stable IDs, relevant mechanic/asset, owner, implementation PR and test proof. Remove or mark complete an item only after exact-head verification. Use exactly:
- `NOT STARTED`: approved but untouched.
- `IN PROGRESS`: branch/PR exists.
- `BLOCKED`: named missing dependency or failing check.
- `CI VERIFIED`: exact-head checks passed, not deployed.
- `LIVE VERIFIED`: deployment revision and browser interaction confirmed.

Each hourly report: **last completed / current work ID / branch or PR / test evidence / blocker / next action**. Never report progress from a plan or stale task summary as shipped.

## Change-request discipline
New user requirements go into the appropriate contract and tracker before implementation if they change data model, scope, ownership or permissions. Update existing sections rather than spawning disconnected planning documents. Mark decisions with date and reason; never reinterpret prior decisions because a fresh assistant lacks context.

## Next gate
`G0a` — read-only legacy-save inventory and versioned export backup; do not modify existing storage until migration and rollback certification passes.

## Combat overlay work lane (2026-10-08)
See `docs/COMBAT_AREA_AND_LOG_PLAN.md` for the separate A0-A5 source-of-truth gates. Do not represent a generic dimension/geometry primitive as an implemented per-spell visualization, certified RAW adjudication or combat log. Bind 2014/2024 spell dimensions from verified sources before claiming full coverage.
