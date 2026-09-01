-- 156: Hungarian display names follow the Hungarian order in Korean, and the
-- family-first rows that slipped past the name-order standard.
--
-- Korean orthography keeps Hungarian names family-first (카다르 야노시, 너지 임레,
-- 라코시 마차시), but `hungary` was missing from FAMILY_FIRST, so the public page,
-- which recomposes the display name from given/family parts, printed every
-- Hungarian given-first — including the four whose stored name_ko was already
-- right (쿤 벨러, 루카치 죄르지, 카다르 야노시, 너지 임레 rendered as 벨러 쿤 …).
-- The rule tables (frontend data/commulingo/native-script.js, leninbot
-- runtime_tools/commulingo_people.py) now carry hungary: {ko: ' ', en: null};
-- this migration brings the stored rows in line. English stays given-first
-- (János Kádár), the native line stays Hungarian order (Kádár János).
--
-- Also repaired, found by the new scripts/audit-person-name-order.js:
--   * four Hungarian transcriptions that broke 외래어 표기법 (Jeszenszky 절젠스키
--     → 예센스키, Pozsgay 포츠거이 → 포즈거이, Békés 벡시 → 베케시, Losonczy
--     로손치 → 로숀치) and Béla 베러 → 벨러 for Király;
--   * Orbán's Korean given part dropped the middle name (오르반 빅토르), as
--     Korean usage does; English keeps Viktor Mihály Orbán;
--   * Király's native line was in Western order;
--   * given-only rows: 히로히토 and 허가이 (Хегай is his surname; the row also
--     carried his whole Russian name as a "patronymic", which the page printed
--     as 허가이 알렉세이 이바노비치 헤가이) — the token moves to family, the
--     pseudo-patronymic goes, the aliases already hold 알렉세이 이바노비치 헤가이;
--   * Kim San's English parts (the whole name sat in family);
--   * six Japanese native names written with a space (近衞 文麿 → 近衞文麿).
--
-- Prose is left in whichever order it was written; the old given-first Korean
-- form is added as an alias so people-linkify keeps matching it.

BEGIN;

-- Transcription fixes in the parts (the full names are recomposed below).
UPDATE commulingo_people SET given_name_ko = '벨러', cyrillic = 'Király Béla', updated_at = NOW()
 WHERE id = 'bela-kiraly';
UPDATE commulingo_people SET family_name_ko = '예센스키', updated_at = NOW() WHERE id = 'geza-jeszenszky';
UPDATE commulingo_people SET family_name_ko = '포즈거이', updated_at = NOW() WHERE id = 'imre-pozsgay';
UPDATE commulingo_people SET family_name_ko = '베케시', updated_at = NOW() WHERE id = 'csaba-bekes';
UPDATE commulingo_people SET family_name_ko = '로숀치', updated_at = NOW() WHERE id = 'geza-losonczy';
UPDATE commulingo_people SET given_name_ko = '빅토르', updated_at = NOW() WHERE id = 'viktor-mihaly-orban';

-- The same spellings in prose, alias rows and curation-gap labels. The Korean
-- particles are unaffected: every replacement ends in the same syllable shape.
UPDATE commulingo_people
   SET bio_ko = replace(replace(replace(replace(bio_ko,
                '절젠스키', '예센스키'), '벡시', '베케시'), '로손치', '로숀치'), '베러 키라이', '벨러 키라이'),
       updated_at = NOW()
 WHERE bio_ko ~ '절젠스키|벡시|로손치|베러 키라이';
UPDATE commulingo_history_events
   SET body_ko = replace(replace(replace(body_ko, '벡시', '베케시'), '로손치', '로숀치'), '베러 키라이', '벨러 키라이'),
       updated_at = NOW()
 WHERE body_ko ~ '벡시|로손치|베러 키라이';
UPDATE commulingo_curation_gaps
   SET label_ko = replace(replace(replace(replace(replace(label_ko,
                  '절젠스키', '예센스키'), '포츠거이', '포즈거이'), '벡시', '베케시'), '로손치', '로숀치'), '베러 키라이', '벨러 키라이')
 WHERE label_ko ~ '절젠스키|포츠거이|벡시|로손치|베러 키라이';
UPDATE commulingo_person_aliases
   SET alias = replace(replace(alias, '포츠거이', '포즈거이'), '로손치', '로숀치')
 WHERE lang = 'ko' AND alias ~ '포츠거이|로손치';

-- Keep the old given-first Korean form reachable for prose that uses it.
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order)
SELECT p.id, 'ko', p.given_name_ko || ' ' || p.family_name_ko, 90
  FROM commulingo_people p
 WHERE p.citizenship_code = 'hungary'
   AND p.given_name_ko <> '' AND p.family_name_ko <> ''
   AND NOT EXISTS (
        SELECT 1 FROM commulingo_person_aliases a
         WHERE a.person_id = p.id AND a.lang = 'ko'
           AND a.alias = p.given_name_ko || ' ' || p.family_name_ko);

-- Recompose the Korean display name family-first for every Hungarian citizen.
UPDATE commulingo_people
   SET name_ko = family_name_ko || ' ' || given_name_ko, updated_at = NOW()
 WHERE citizenship_code = 'hungary'
   AND given_name_ko <> '' AND family_name_ko <> ''
   AND name_ko <> family_name_ko || ' ' || given_name_ko;

-- An alias identical to the new headword is noise (헤게뒤시 언드라시 was an
-- alias row while the headword was 언드라시 헤게뒤시).
DELETE FROM commulingo_person_aliases a
 USING commulingo_people p
 WHERE a.person_id = p.id AND p.citizenship_code = 'hungary'
   AND a.lang = 'ko' AND a.alias = p.name_ko;

-- Given-only rows: the lone token is the family part.
UPDATE commulingo_people
   SET family_name_ko = given_name_ko, given_name_ko = '',
       family_name_en = given_name_en, given_name_en = '', updated_at = NOW()
 WHERE id IN ('hirohito', 'ho-ka-i') AND family_name_ko = '' AND family_name_en = '';
DELETE FROM commulingo_person_patronymics WHERE person_id = 'ho-ka-i';

-- Kim San: the English parts were the whole name in family.
UPDATE commulingo_people SET given_name_en = 'San', family_name_en = 'Kim', updated_at = NOW()
 WHERE id = 'kim-san' AND family_name_en = 'Kim San';

-- Japanese native names are written solid.
UPDATE commulingo_people SET cyrillic = replace(cyrillic, ' ', ''), updated_at = NOW()
 WHERE id IN ('konoe-fumimaro', 'michitaro-komatsubara', 'sadao-araki',
              'yoshijiro-umezu', 'yosuke-matsuoka', 'tsuyoshi-hasegawa');

COMMIT;
