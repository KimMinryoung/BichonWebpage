-- 001_webauthn.sql
-- Migrate admins table → generalized users table + passkey credentials.
-- Idempotent: safe to re-run.

BEGIN;

CREATE TABLE IF NOT EXISTS users (
    id           BIGSERIAL PRIMARY KEY,
    username     TEXT NOT NULL UNIQUE,
    is_admin     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_passkeys (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    credential_id   TEXT NOT NULL UNIQUE,
    public_key      BYTEA NOT NULL,
    counter         BIGINT NOT NULL DEFAULT 0,
    transports      TEXT[] NOT NULL DEFAULT '{}',
    device_name     TEXT,
    backed_up       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS user_passkeys_user_id_idx ON user_passkeys(user_id);

-- Migrate existing admin rows (without passwords — passkey-only going forward).
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admins') THEN
        INSERT INTO users (username, is_admin)
        SELECT username, TRUE FROM admins
        ON CONFLICT (username) DO NOTHING;
    END IF;
END $$;

-- Drop old admins table (password auth is gone).
DROP TABLE IF EXISTS admins;

COMMIT;
