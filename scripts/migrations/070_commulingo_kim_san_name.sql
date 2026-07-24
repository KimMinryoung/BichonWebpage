-- Kim San (김산) is a fixed Korean revolutionary pen name. Store the public
-- display name in Korean order instead of composing it as Western given-family
-- order; retain the old English inversion only as a non-display link alias.
UPDATE commulingo_people
SET name_ko = '김산',
    name_en = 'Kim San',
    given_name_ko = '',
    given_name_en = '',
    family_name_ko = '김산',
    family_name_en = 'Kim San',
    cyrillic = '김산',
    updated_at = NOW()
WHERE id = 'kim-san';

INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order)
VALUES ('kim-san', 'en', 'San Kim', 10)
ON CONFLICT (person_id, lang, alias) DO UPDATE
SET sort_order = EXCLUDED.sort_order;
