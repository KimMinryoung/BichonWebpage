-- 002_user_fingerprints.sql
-- Bind anonymous chat fingerprints to user accounts.
-- A user can have many fingerprints (different browsers / devices).
-- A fingerprint is claimed by the first user to bind it.

BEGIN;

CREATE TABLE IF NOT EXISTS user_fingerprints (
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fingerprint TEXT   NOT NULL,
    bound_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, fingerprint)
);

CREATE UNIQUE INDEX IF NOT EXISTS user_fingerprints_fingerprint_uidx
    ON user_fingerprints(fingerprint);

COMMIT;
