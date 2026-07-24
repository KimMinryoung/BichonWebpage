-- Split person names into structured parts: given name, family name, and the
-- (already separate) patronymic. name_ko/name_en stay as the canonical derived
-- full name (given + family, patronymic NEVER embedded) so every reader keeps
-- working; the admin store now maintains all six columns together and rejects
-- names that embed the patronymic.
--
-- Also repairs the five records the 2026-07 audit found:
--   * alexei-rumyantsev, otto-shmidt — full name embedded the patronymic, so
--     display composition doubled it (오토 율리예비치 율리예비치 시미트).
--   * elizabeth-gurley-flynn (middle name Gurley), louis-auguste-blanqui
--     (middle name Auguste), alexander-serafimovich (patronymic used as pen
--     surname) — non-patronymics stored in the patronymics table.

ALTER TABLE commulingo_people
    ADD COLUMN IF NOT EXISTS given_name_ko TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS given_name_en TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS family_name_ko TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS family_name_en TEXT NOT NULL DEFAULT '';

-- Repair: strip the embedded patronymic from the two full names.
UPDATE commulingo_people
   SET name_ko = '알렉세이 루먄체프', name_en = 'Alexei Rumyantsev', updated_at = NOW()
 WHERE id = 'alexei-rumyantsev';
UPDATE commulingo_people
   SET name_ko = '오토 시미트', name_en = 'Otto Shmidt', updated_at = NOW()
 WHERE id = 'otto-shmidt';

-- Repair: these are middle names / a pen surname, not patronymics.
DELETE FROM commulingo_person_patronymics
 WHERE person_id IN ('elizabeth-gurley-flynn', 'louis-auguste-blanqui', 'alexander-serafimovich');

-- Backfill parts from the (now clean) full names: family = last token, given =
-- everything before it. Single-token names (East Asian fused names, mononyms
-- like 카모) go wholly to family_name so the derived full name is unchanged.
UPDATE commulingo_people SET
    given_name_ko  = CASE WHEN name_ko ~ '\s' THEN regexp_replace(name_ko, '\s+\S+$', '') ELSE '' END,
    family_name_ko = CASE WHEN name_ko ~ '\s' THEN regexp_replace(name_ko, '^.*\s', '') ELSE name_ko END,
    given_name_en  = CASE WHEN name_en ~ '\s' THEN regexp_replace(name_en, '\s+\S+$', '') ELSE '' END,
    family_name_en = CASE WHEN name_en ~ '\s' THEN regexp_replace(name_en, '^.*\s', '') ELSE name_en END;
