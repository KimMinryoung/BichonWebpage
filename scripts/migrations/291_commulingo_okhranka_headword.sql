-- 291: okhrana prose follows the Russian name 오흐란카 (охранка), the colloquial
-- name contemporaries used; 오흐라나 (Okhrana) is a Western shorthand of
-- Охранное отделение that English scholarship fixed, and the body now says so.
-- The headword is renamed through the editorial store (link reviews carried);
-- the English headword and body keep Okhrana.

BEGIN;
UPDATE commulingo_terms SET body_ko = replace(replace(body_ko,
    $q$이며, 러시아에서는 흔히 오흐란카(охранка)라는 속칭으로 불렸다. 영어권에서는 오흐라나(Okhrana)로 줄여 부르거나 '경비부'(Guard Department)로 옮긴다.$q$,
    $q$이며, 러시아에서는 흔히 오흐란카(охранка)라는 속칭으로 불렸다. 오흐라나(Okhrana)는 영어권 연구에서 굳어진 서구식 약칭이고, 영어로는 '경비부'(Guard Department)로도 옮긴다.$q$),
    $q$오흐라나는 $q$, $q$오흐란카는 $q$), updated_at = now() WHERE id = 'okhrana';
UPDATE commulingo_terms SET body_ko = replace(replace(body_ko, $q$이후 오흐라나의 기초$q$, $q$이후 오흐란카의 기초$q$),
    $q$이끌면서 오흐라나 요원$q$, $q$이끌면서 오흐란카 요원$q$), updated_at = now() WHERE id = 'okhrana';
COMMIT;
