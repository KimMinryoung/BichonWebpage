-- Reading multi-country events by country.
--
-- 1. The people's democracies entry becomes the overview of a cluster: it moves
--    to 126 so its four national documents (169–172, at 127–130) follow it in
--    the reading order, and the Marshall Plan steps to 131. Its relations gain
--    the four neighbouring entries that already carry parts of the story.
-- 2. Its timeline entries carry country tags (event-countries.js): flags beside
--    the date, and a chip row that filters the list to one country.
-- 3. The Baltic wars of independence keep their prose but every section
--    heading now names the country it belongs to, and the two long national
--    sections (Latvia, Lithuania) split in two at the paragraph where the
--    second phase begins, so one country reads as one contiguous run:
--    frame → Estonia ×3 → Latvia ×2 → Lithuania ×2 → outsiders → treaties.
--    Its timeline gets the same country tags.
--
-- The Baltic edits are string replacements guarded by the body hashes of the
-- 2026-09-06 snapshot, so an intervening editorial change makes this refuse
-- rather than overwrite.

BEGIN;

UPDATE commulingo_history_events SET sort_order = 131 WHERE id = 'marshall-plan';
UPDATE commulingo_history_events
   SET sort_order = 126,
       relations = '{"related":["marshall-plan","berlin-blockade","tito-stalin-split","warsaw-pact"]}'::jsonb
 WHERE id = 'eastern-europe-peoples-democracies';

-- Country tags on the overview timeline, by index (see 168 for the entries).
UPDATE commulingo_history_events SET timeline = (
  SELECT jsonb_agg(
    CASE ord - 1
      WHEN 0 THEN item || '{"country":"poland"}'
      WHEN 1 THEN item || '{"country":"bulgaria"}'
      WHEN 2 THEN item || '{"country":["uk","soviet"]}'
      WHEN 3 THEN item || '{"country":["romania","soviet"]}'
      WHEN 4 THEN item || '{"country":"hungary"}'
      WHEN 5 THEN item || '{"country":"east-germany"}'
      WHEN 6 THEN item || '{"country":"poland"}'
      WHEN 7 THEN item || '{"country":["hungary","soviet"]}'
      WHEN 8 THEN item || '{"country":"bulgaria"}'
      WHEN 9 THEN item || '{"country":"romania"}'
      WHEN 10 THEN item || '{"country":"bulgaria"}'
      WHEN 11 THEN item || '{"country":"hungary"}'
      ELSE item
    END ORDER BY ord)
  FROM jsonb_array_elements(timeline) WITH ORDINALITY AS t(item, ord)
) WHERE id = 'eastern-europe-peoples-democracies' AND jsonb_array_length(timeline) = 12;

-- Baltic wars of independence: guard, headings, splits, tags.
DO $guard$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id = 'baltic-wars-of-independence'
                    AND md5(body_ko) = '1a773109c72abc9b3125bef8771b0ae2'
                    AND md5(body_en) = '3407d4d30c50c0b20746fc96f38c9a70'
                    AND jsonb_array_length(timeline) = 16) THEN
    RAISE EXCEPTION 'Changed source: baltic-wars-of-independence body or timeline differs from the 2026-09-06 snapshot';
  END IF;
END
$guard$;

UPDATE commulingo_history_events SET
  body_ko = replace(replace(replace(replace(replace(replace(replace(body_ko,
    E'## 유데니치와 에스토니아: 동맹인가 짐인가', E'## 에스토니아: 유데니치의 북서군, 동맹인가 짐인가'),
    E'## 타르투: 첫 조약의 조건', E'## 에스토니아: 타르투 조약의 조건'),
    E'## 라트비아: 세 정부와 두 번의 리가 전투', E'## 라트비아: 세 정부, 리예파야 쿠데타, 체시스 전투'),
    E'\n\n전쟁은 끝나지 않았다. 연합국이 골츠의 소환과', E'\n\n## 라트비아: 베르몬트의 리가 공격과 리가 조약\n\n전쟁은 끝나지 않았다. 연합국이 골츠의 소환과'),
    E'## 리투아니아: 리트벨의 실패와 빌뉴스 분쟁', E'## 리투아니아: 리트벨의 실패'),
    E'\n\n빌뉴스는 다른 손에 넘어갔다.', E'\n\n## 리투아니아: 빌뉴스 분쟁\n\n빌뉴스는 다른 손에 넘어갔다.'),
    E'## 영국 함대와 핀란드의 선택', E'## 세 나라 밖에서: 영국 함대와 핀란드의 선택'),
  body_en = replace(replace(replace(replace(replace(replace(replace(body_en,
    E'## Yudenich and Estonia: ally or burden?', E'## Estonia: Yudenich''s North-Western Army, ally or burden?'),
    E'## Tartu: the terms of the first treaty', E'## Estonia: the terms of the Tartu treaty'),
    E'## Latvia: three governments and two battles for Riga', E'## Latvia: three governments, the Liepāja coup and Cēsis'),
    E'\n\nThe war was not over. When the Allies demanded Goltz''s recall', E'\n\n## Latvia: Bermondt''s attack on Riga and the treaty of Riga\n\nThe war was not over. When the Allies demanded Goltz''s recall'),
    E'## Lithuania: the failure of Litbel and the Vilnius dispute', E'## Lithuania: the failure of Litbel'),
    E'\n\nVilnius passed into other hands.', E'\n\n## Lithuania: the Vilnius dispute\n\nVilnius passed into other hands.'),
    E'## The British fleet and Finland''s choices', E'## Beyond the three: the British fleet and Finland''s choices'),
  timeline = (
    SELECT jsonb_agg(
      CASE ord - 1
        WHEN 0 THEN item || '{"country":["estonia","latvia","lithuania"]}'
        WHEN 1 THEN item || '{"country":"estonia"}'
        WHEN 2 THEN item || '{"country":["estonia","uk"]}'
        WHEN 3 THEN item || '{"country":"estonia"}'
        WHEN 4 THEN item || '{"country":"latvia"}'
        WHEN 5 THEN item || '{"country":["latvia","estonia"]}'
        WHEN 6 THEN item || '{"country":"estonia"}'
        WHEN 7 THEN item || '{"country":"uk"}'
        WHEN 8 THEN item || '{"country":"estonia"}'
        WHEN 9 THEN item || '{"country":"latvia"}'
        WHEN 10 THEN item || '{"country":["latvia","poland"]}'
        WHEN 11 THEN item || '{"country":"estonia"}'
        WHEN 12 THEN item || '{"country":"lithuania"}'
        WHEN 13 THEN item || '{"country":"latvia"}'
        WHEN 14 THEN item || '{"country":["lithuania","poland"]}'
        WHEN 15 THEN item || '{"country":"finland"}'
        ELSE item
      END ORDER BY ord)
    FROM jsonb_array_elements(timeline) WITH ORDINALITY AS t(item, ord)
  ),
  updated_at = now()
WHERE id = 'baltic-wars-of-independence';

-- Every replacement must have landed: ten headings in each language.
DO $check$
DECLARE ko_count int; en_count int;
BEGIN
  SELECT (length(body_ko) - length(replace(body_ko, E'\n## ', ''))) / length(E'\n## ') + 1,
         (length(body_en) - length(replace(body_en, E'\n## ', ''))) / length(E'\n## ') + 1
    INTO ko_count, en_count
    FROM commulingo_history_events WHERE id = 'baltic-wars-of-independence';
  IF ko_count <> 10 OR en_count <> 10 THEN
    RAISE EXCEPTION 'Baltic headings: expected 10/10, got %/%', ko_count, en_count;
  END IF;
END
$check$;

COMMIT;
