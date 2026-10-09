-- Limit brute-force game joins by Netlify-observed client IP (hashed with a deployment secret).
CREATE TABLE dnd_join_attempts (
  actor_hash char(64) PRIMARY KEY,
  window_started timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 0 CHECK(attempts>=0)
);
CREATE INDEX dnd_join_attempts_window_idx ON dnd_join_attempts(window_started);
