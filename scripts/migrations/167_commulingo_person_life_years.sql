-- Life dates are dates, not activity labels. Keep the repair and constraints
-- atomic, and retain the old values in the normal content revision history.
BEGIN;
SET LOCAL lock_timeout = '5s';
CREATE TEMP TABLE person_life_before ON COMMIT DROP AS
SELECT id, years_label, birth_year, death_year, fate_kind, fate_label_ko, fate_label_en
FROM commulingo_people;

-- Safronov gives his birth year in his own interview:
-- https://pchela.media/safronov/ ; https://nlobooks.ru/article/15303/
UPDATE commulingo_people SET years_label = '1987–' WHERE id = 'alexei-safronov';
-- Treml was incorrectly marked living and even had the wrong birth year.
-- https://www.walkersfuneralservice.com/obituaries/vladimir-treml
-- https://econ.duke.edu/news/memoriam-vladimir-g-treml
-- Neither source establishes a cause of death: do not invent "natural".
UPDATE commulingo_people SET years_label = '1929–2018', fate_kind = '',
    fate_label_ko = '사망', fate_label_en = 'Died' WHERE id = 'vladimir-treml';

UPDATE commulingo_people SET years_label = '?–?'
WHERE years_label = '생몰년 미상';
UPDATE commulingo_people SET years_label = '?–'
WHERE years_label ~* '^(현재|현대|생존|현존|present|current|living|alive|contemporary)$'
   OR years_label ~* '^(20세기|\?)[[:space:]]*[–-][[:space:]]*(현재|present|living|alive)$';
UPDATE commulingo_people
SET years_label = regexp_replace(years_label, '[[:space:]]*[–-][[:space:]]*(현재|present|current|living|alive)$', '–', 'i')
WHERE years_label ~* '[–-][[:space:]]*(현재|present|current|living|alive)$';
UPDATE commulingo_people SET years_label = regexp_replace(years_label, '^b\.[[:space:]]*([0-9]{3,4})$', '\1–', 'i')
WHERE years_label ~* '^b\.[[:space:]]*[0-9]{3,4}$';

UPDATE commulingo_people SET fate_kind = '', fate_label_ko = '', fate_label_en = ''
WHERE years_label ~ '^(c\.[[:space:]]*)?([0-9]{3,4}(/[0-9]{3,4})?\??|\?)[[:space:]]*[–-][[:space:]]*$';

-- Parse each endpoint independently. Unknown/approximate dates stay NULL;
-- a missing death date must not erase a known birth year.
WITH parsed AS (
    SELECT id,
        CASE WHEN btrim((regexp_split_to_array(years_label, '[–-]'))[1]) ~ '^[0-9]{3,4}$'
             THEN btrim((regexp_split_to_array(years_label, '[–-]'))[1])::integer END AS birth,
        CASE WHEN btrim((regexp_split_to_array(years_label, '[–-]'))[2]) ~ '^[0-9]{3,4}$'
             THEN btrim((regexp_split_to_array(years_label, '[–-]'))[2])::integer END AS death
    FROM commulingo_people
)
UPDATE commulingo_people p SET birth_year = v.birth, death_year = v.death
FROM parsed v WHERE p.id = v.id
AND (p.birth_year IS DISTINCT FROM v.birth OR p.death_year IS DISTINCT FROM v.death);

CREATE TEMP TABLE person_life_after ON COMMIT DROP AS
SELECT id, years_label, birth_year, death_year, fate_kind, fate_label_ko, fate_label_en
FROM commulingo_people;
INSERT INTO commulingo_people_revisions (entity_type, entity_id, revision_note, snapshot, changed_by)
SELECT 'person', a.id, 'Correct life dates and remove living-person fate metadata',
    jsonb_build_object('before', to_jsonb(b), 'after', to_jsonb(a)), 'migration-167-person-life-years'
FROM person_life_after a JOIN person_life_before b USING (id)
WHERE to_jsonb(a) IS DISTINCT FROM to_jsonb(b);
UPDATE commulingo_people p SET updated_at = NOW()
FROM person_life_after a JOIN person_life_before b USING (id)
WHERE p.id = a.id AND to_jsonb(a) IS DISTINCT FROM to_jsonb(b);

-- Match person-life-years.js. Checks apply to every writer, including SQL.
ALTER TABLE commulingo_people ADD CONSTRAINT commulingo_person_years_format CHECK (
    years_label = '' OR (years_label !~ '^[[:space:]]|[[:space:]]$'
    AND years_label ~ '^(c\.[[:space:]]*)?([0-9]{3,4}(/[0-9]{3,4})?\??|\?)[[:space:]]*[–-][[:space:]]*(([0-9]{3,4}(/[0-9]{3,4})?\??|\?)( 이후)?)?$')
);
ALTER TABLE commulingo_people ADD CONSTRAINT commulingo_person_living_fate_empty CHECK (
    years_label !~ '^(c\.[[:space:]]*)?([0-9]{3,4}(/[0-9]{3,4})?\??|\?)[[:space:]]*[–-][[:space:]]*$'
    OR (death_year IS NULL AND fate_kind = '' AND fate_label_ko = '' AND fate_label_en = '')
);
ALTER TABLE commulingo_people ADD CONSTRAINT commulingo_person_fate_not_status CHECK (
    (fate_label_ko || ' ' || fate_label_en) !~* '현재|현대|생존|현존|현역|활동[[:space:]]*중|\m(present|current|living|active|contemporary)\M'
    AND btrim(fate_label_en) !~* '^(still[[:space:]]+)?alive\M'
);
ALTER TABLE commulingo_people ADD CONSTRAINT commulingo_person_year_columns CHECK (
    birth_year IS NOT DISTINCT FROM CASE
        WHEN btrim((regexp_split_to_array(years_label, '[–-]'))[1]) ~ '^[0-9]{3,4}$'
        THEN btrim((regexp_split_to_array(years_label, '[–-]'))[1])::integer END
    AND death_year IS NOT DISTINCT FROM CASE
        WHEN btrim((regexp_split_to_array(years_label, '[–-]'))[2]) ~ '^[0-9]{3,4}$'
        THEN btrim((regexp_split_to_array(years_label, '[–-]'))[2])::integer END
);
COMMIT;
