-- 006_user_password_auth.sql
-- Add optional password login for regular users.

BEGIN;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS password_hash TEXT,
    ADD COLUMN IF NOT EXISTS password_updated_at TIMESTAMPTZ;

COMMIT;
