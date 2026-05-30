-- 005_commulingo_progress.sql
-- Store logged-in users' CommuLingo lesson progress.

BEGIN;

CREATE TABLE IF NOT EXISTS commulingo_progress (
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id       TEXT NOT NULL,
    completed       BOOLEAN NOT NULL DEFAULT FALSE,
    score           INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, lesson_id),
    CHECK (score >= 0),
    CHECK (total_questions >= 0),
    CHECK (score <= total_questions OR total_questions = 0)
);

CREATE INDEX IF NOT EXISTS commulingo_progress_user_updated_idx
    ON commulingo_progress(user_id, updated_at DESC);

COMMIT;
