-- DND Blocks initial authoritative multiplayer schema. Applied only on approved Netlify deploy.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE dnd_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_identity_id text NOT NULL,
  name varchar(100) NOT NULL,
  map_id text,
  revision bigint NOT NULL DEFAULT 0 CHECK(revision>=0),
  status text NOT NULL DEFAULT 'open' CHECK(status IN ('open','closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX dnd_games_owner_idx ON dnd_games(owner_identity_id);
CREATE TABLE dnd_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES dnd_games(id) ON DELETE CASCADE,
  code_hash char(64) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX dnd_invitations_game_idx ON dnd_invitations(game_id);
CREATE TABLE dnd_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES dnd_games(id) ON DELETE CASCADE,
  display_name varchar(40) NOT NULL,
  session_hash char(64) NOT NULL UNIQUE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);
CREATE INDEX dnd_players_game_idx ON dnd_players(game_id);
CREATE TABLE dnd_assignments (
  game_id uuid NOT NULL REFERENCES dnd_games(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES dnd_players(id) ON DELETE CASCADE,
  entity_id text NOT NULL,
  PRIMARY KEY(game_id,entity_id)
);
CREATE TABLE dnd_board_snapshots (
  game_id uuid PRIMARY KEY REFERENCES dnd_games(id) ON DELETE CASCADE,
  revision bigint NOT NULL DEFAULT 0 CHECK(revision>=0),
  state jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE dnd_actions (
  game_id uuid NOT NULL REFERENCES dnd_games(id) ON DELETE CASCADE,
  action_id uuid NOT NULL,
  actor_identity text NOT NULL,
  expected_revision bigint NOT NULL CHECK(expected_revision>=0),
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(game_id,action_id)
);
