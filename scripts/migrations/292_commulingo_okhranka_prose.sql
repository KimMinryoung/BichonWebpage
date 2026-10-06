-- 292: the tsarist political police is 오흐란카 (охранка) in Korean prose, the
-- name contemporaries used (migration 291 renamed the term). 오흐라나 is a
-- Western shorthand kept only as an alias and explained in the okhrana body.
-- Both forms end in a vowel, so no particle changes. English prose keeps Okhrana;
-- evidence claims are left as recorded.

BEGIN;
UPDATE commulingo_terms SET body_ko = replace(body_ko, '오흐라나', '오흐란카'), updated_at = now()
    WHERE id <> 'okhrana' AND body_ko LIKE '%오흐라나%';
UPDATE commulingo_terms SET definition_ko = replace(definition_ko, '오흐라나', '오흐란카'), updated_at = now()
    WHERE id <> 'okhrana' AND definition_ko LIKE '%오흐라나%';
UPDATE commulingo_person_sections SET body_ko = replace(body_ko, '오흐라나', '오흐란카') WHERE body_ko LIKE '%오흐라나%';
UPDATE commulingo_people SET bio_ko = replace(bio_ko, '오흐라나', '오흐란카') WHERE bio_ko LIKE '%오흐라나%';
UPDATE commulingo_people SET moment_ko = replace(moment_ko, '오흐라나', '오흐란카') WHERE moment_ko LIKE '%오흐라나%';
UPDATE commulingo_people SET epithet_ko = replace(epithet_ko, '오흐라나', '오흐란카') WHERE epithet_ko LIKE '%오흐라나%';
UPDATE commulingo_person_career_entries SET role_ko = replace(role_ko, '오흐라나', '오흐란카') WHERE role_ko LIKE '%오흐라나%';
COMMIT;
