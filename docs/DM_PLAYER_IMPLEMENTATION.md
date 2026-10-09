# DM and Player Authentication Implementation — 2026-10-09

Status: **Development specification locked; implementation must remain non-production until approved.**

## Existing confirmed contracts
- DM has durable identity, owns games, creates invitations and assigns pieces.
- Player joins via game code/link and display name; permanent player account is **optional**, not a prerequisite.
- Server must enforce all DM/player permissions, regardless of disabled client controls.
- Reconnect restores the same membership and piece assignments where session identity survives.
- No anonymous access to hidden DM state.
- Build Mode belongs to DM; player view has no Build actions.
- The Netlify production deployment cost policy in SOUL.md is mandatory.

## Selected implementation
- Netlify Identity via the supported `@netlify/identity` package for **DM authentication**. Do not use the older identity widget.
- Netlify Functions for authoritative create-game, get-game, issue/join-code, join-player, assign-piece, and apply-action endpoints.
- Netlify Database/Postgres for durable game and membership state, with migrations. Do not use Blobs as mutable concurrent game state.
- Lightweight player session tokens generated on server, with only a hash stored in the database; HTTPS-only secure HttpOnly SameSite cookies for browser identity and reconnect.
- Never trust a client-supplied user ID or role; verify each DM Identity session on every privileged request, then verify owner_id for that game.
- Join codes should be random, time-limited/revocable, collision-checked, rate-limited, and excluded from logs.
- Player session cookies must bind to an individual game and player membership. Player API must not return hidden entities or DM-only fields.
- Use revision numbers, action IDs and deduplication for authoritative committed board updates. Never stream per-frame animation.

## Required backend data model (minimum)
- games(id UUID, owner_identity_id, name, map_id, revision, status, created_at)
- invitations(id UUID, game_id, code_hash, expires_at, revoked_at, created_at)
- players(id UUID, game_id, display_name, session_hash, joined_at, last_seen_at, revoked_at)
- assignments(game_id, player_id, entity_id; unique entity ownership per game)
- actions(game_id, action_id unique, actor_identity, expected_revision, payload, created_at)
- board_snapshots(game_id, revision, state JSONB, updated_at)

All schema definitions must have constrained foreign keys, uniqueness, safe ownership lookups, and migration tests. Don't expose session_hash, invite hash, or private game state to client responses.

## Board authorization schema reconciliation — 2026-10-09
The current browser `src/domain/types.ts` `WorldObject` includes id, catalogId, grid position, and visual/combat metadata, **not** visibility, lock, movement lock, or capabilities. The conceptual `docs/DATA_SCHEMA.md` includes those properties, but they are not currently persisted on browser objects. Therefore existing local maps must not be treated as authorized player snapshots.

Before implementing an authoritative move or player board-read endpoint, define and version the normalized **server** WorldObject schema with explicit `visibility: visible | dm_only`, `locked: boolean`, `movementLocked: boolean`, and validated `capabilities: string[]`. Assignments reference stable entity IDs within the game; validate existence on the server before assignment. Convert historical local board data only in a reviewed migration/import, with safe defaults, backup, and tests. Do not implicitly map absent fields to permission grants.

The pure `game-permissions.mjs` helper rejects missing player permission fields. It is not yet called by `game-api.mjs`, and its top-level visibility filter cannot safely serialize arbitrary nested snapshots, history, trigger data, or metadata. A player snapshot endpoint must use an explicit allowlist schema and server-derived membership before network output. DM override applies only after server verification of ownership.

## Release sequence
1. Create typed API contracts and validation tests for game codes, roles, and state mutation authorization.
2. Implement Netlify Function authentication and Postgres migrations without provisioning production resources.
3. Wire DM sign-up/sign-in/out and session management; show explicit unavailable states outside Netlify.
4. Add Create Game, share link/code, player join/reconnect and DM player list.
5. Add assignment, move/interact authorization and board update sync/revision testing.
6. Run local and CI tests against mocked backend; test frontend on GitHub Pages.
7. Complete one reviewed/authorized Netlify release candidate. Netlify Identity flow requires an actual Netlify deploy to test; GitHub Pages cannot certify it.
8. Verify live account creation, token/session handling, invited player join, DM-only controls, rejoin, and migration/rollback. No routine Netlify deploy loops.

## Immediate out-of-scope
- A permanent account requirement for players.
- Global 'DM' or 'Player' labels as an authorization source; permissions are scoped to game membership.
- Netlify Functions containing hardcoded credentials or fake authentication.
- UI that claims a player joined when no backend confirmed it.
- New production Netlify site or database provisioning without approval.
