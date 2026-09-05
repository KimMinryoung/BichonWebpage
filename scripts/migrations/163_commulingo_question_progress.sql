-- 163_commulingo_question_progress.sql
-- Per-question answer history for logged-in learners, mirroring the
-- browser's commulingo-answers-v1 store so the review queue follows the
-- account across devices. One row per (user, lesson, question); the client
-- owns the schedule (streak, due_at) and the server keeps the newer record.

BEGIN;

CREATE TABLE IF NOT EXISTS commulingo_question_progress (
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id    TEXT NOT NULL,
    question_id  TEXT NOT NULL,
    right_count  INTEGER NOT NULL DEFAULT 0,
    wrong_count  INTEGER NOT NULL DEFAULT 0,
    streak       INTEGER NOT NULL DEFAULT 0,
    last_correct BOOLEAN NOT NULL DEFAULT FALSE,
    last_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_at       TIMESTAMPTZ,
    PRIMARY KEY (user_id, lesson_id, question_id),
    CHECK (right_count >= 0),
    CHECK (wrong_count >= 0),
    CHECK (streak >= 0)
);

CREATE INDEX IF NOT EXISTS commulingo_question_progress_user_due_idx
    ON commulingo_question_progress(user_id, due_at);

COMMIT;
