-- 197: Family-first names in the prose itself, not only through given-first aliases.
--
-- Given-first alias rows link a mention such as 게저 예센스키 to the right card,
-- but the sentence still reads in the wrong order. Rewrite the remaining
-- given-first mentions of Hungarian and Japanese figures in Korean prose, with
-- the particle re-chosen for the new final syllable. Also 호즈미 → 호쓰미
-- (尾崎秀実, ほつみ: つ is 쓰) and Pfeiffer Zoltán as 파이페르 졸탄.

BEGIN;
UPDATE commulingo_history_events SET body_ko = replace(body_ko, '호즈미 오자키는', '오자키 호쓰미는') WHERE id = 'great-patriotic-war';
UPDATE commulingo_people SET bio_ko = replace(bio_ko, '호즈미 오자키는', '오자키 호쓰미는'),
    name_ko = '오자키 호쓰미', given_name_ko = '호쓰미',
    activities = replace(activities::text, '오자키 호즈미는', '오자키 호쓰미는')::jsonb
  WHERE id = 'hotsumi-ozaki';
UPDATE commulingo_curation_gaps SET label_ko = replace(label_ko, '호즈미', '호쓰미') WHERE label_ko LIKE '%호즈미%';
UPDATE commulingo_people SET bio_ko = replace(bio_ko, '마모루 시게미쓰는', '시게미쓰 마모루는') WHERE id = 'mamoru-shigemitsu';
UPDATE commulingo_people SET bio_ko = replace(bio_ko, '미치타로 고마쓰바라는', '고마쓰바라 미치타로는') WHERE id = 'michitaro-komatsubara';
UPDATE commulingo_people SET bio_ko = replace(bio_ko, '요시지로 우메즈는', '우메즈 요시지로는') WHERE id = 'yoshijiro-umezu';
UPDATE commulingo_terms SET body_ko = replace(body_ko, '나오타케 사토 주소 대사', '사토 나오타케 주소 대사') WHERE id = 'soviet-japanese-neutrality-pact';
UPDATE commulingo_terms SET body_ko = replace(body_ko, '게저 예센스키는', '예센스키 게저는') WHERE id = 'mefesz-union-of-hungarian-university-and-academy-students';
UPDATE commulingo_terms SET body_ko = replace(body_ko, '졸탄 파이퍼가', '파이페르 졸탄이') WHERE id = 'salami-tactics';
COMMIT;
