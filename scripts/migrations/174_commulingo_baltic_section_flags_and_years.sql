-- Baltic wars of independence: flags on the section headings, and the year on
-- the first date of every section.
--
-- The headings take the `{code}` marker that event-countries.js turns into
-- flags (frame and treaties sections list all the countries they cover, the
-- national sections their own, the outsiders section Britain and Finland).
-- Four sections opened with a day-and-month date whose year was only
-- recoverable from the previous section; a reader arriving from the contents
-- list had no year. Latvia's first section also jumps back to December 1918
-- after opening in January 1919, so that date gets its year too.
--
-- Guarded by the body hashes after migration 173, so an intervening edit makes
-- this refuse rather than overwrite.

BEGIN;

DO $guard$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id = 'baltic-wars-of-independence'
                    AND md5(body_ko) = 'c8748d4b01cc6701251cb16746744889'
                    AND md5(body_en) = '94dc5ea74b814a9de21141769d8c35a0') THEN
    RAISE EXCEPTION 'Changed source: baltic-wars-of-independence body differs from the post-173 snapshot';
  END IF;
END
$guard$;

UPDATE commulingo_history_events SET
  body_ko = replace(replace(replace(replace(replace(
            replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(body_ko,
    E'## 1918년 11월: 세 정부, 하나의 공백', E'## 1918년 11월: 세 정부, 하나의 공백 {estonia latvia lithuania}'),
    E'## 에스토니아: 1919년 1월의 반격과 국가의 형성', E'## 에스토니아: 1919년 1월의 반격과 국가의 형성 {estonia}'),
    E'## 에스토니아: 유데니치의 북서군, 동맹인가 짐인가', E'## 에스토니아: 유데니치의 북서군, 동맹인가 짐인가 {estonia}'),
    E'## 에스토니아: 타르투 조약의 조건', E'## 에스토니아: 타르투 조약의 조건 {estonia}'),
    E'## 라트비아: 세 정부, 리예파야 쿠데타, 체시스 전투', E'## 라트비아: 세 정부, 리예파야 쿠데타, 체시스 전투 {latvia}'),
    E'## 라트비아: 베르몬트의 리가 공격과 리가 조약', E'## 라트비아: 베르몬트의 리가 공격과 리가 조약 {latvia}'),
    E'## 리투아니아: 리트벨의 실패', E'## 리투아니아: 리트벨의 실패 {lithuania}'),
    E'## 리투아니아: 빌뉴스 분쟁', E'## 리투아니아: 빌뉴스 분쟁 {lithuania}'),
    E'## 세 나라 밖에서: 영국 함대와 핀란드의 선택', E'## 세 나라 밖에서: 영국 함대와 핀란드의 선택 {uk finland}'),
    E'## 같은 해의 조약들: 무엇이 확정되고 무엇이 남았는가', E'## 같은 해의 조약들: 무엇이 확정되고 무엇이 남았는가 {estonia lithuania latvia finland}'),
    E'첫째, 영국 함대였다. 12월 12일 알렉산더-싱클레어', E'첫째, 영국 함대였다. 1918년 12월 12일 알렉산더-싱클레어'),
    E'표방했지만, 10월 8일 실제로 공격한 것은 리가였다', E'표방했지만, 1919년 10월 8일 실제로 공격한 것은 리가였다'),
    E'진행되었다. 12월 31일 독일군이 빌뉴스를 떠나자', E'진행되었다. 1918년 12월 31일 독일군이 빌뉴스를 떠나자'),
    E'빌뉴스는 다른 손에 넘어갔다. 4월 19일부터 21일까지', E'빌뉴스는 다른 손에 넘어갔다. 1919년 4월 19일부터 21일까지'),
    E'철사단이었다. 12월 29일 울마니스 정부는', E'철사단이었다. 1918년 12월 29일 울마니스 정부는'),
  body_en = replace(replace(replace(replace(replace(
            replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(body_en,
    E'## November 1918: three governments and one vacuum', E'## November 1918: three governments and one vacuum {estonia latvia lithuania}'),
    E'## Estonia: the counteroffensive of January 1919 and the making of a state', E'## Estonia: the counteroffensive of January 1919 and the making of a state {estonia}'),
    E'## Estonia: Yudenich''s North-Western Army, ally or burden?', E'## Estonia: Yudenich''s North-Western Army, ally or burden? {estonia}'),
    E'## Estonia: the terms of the Tartu treaty', E'## Estonia: the terms of the Tartu treaty {estonia}'),
    E'## Latvia: three governments, the Liepāja coup and Cēsis', E'## Latvia: three governments, the Liepāja coup and Cēsis {latvia}'),
    E'## Latvia: Bermondt''s attack on Riga and the treaty of Riga', E'## Latvia: Bermondt''s attack on Riga and the treaty of Riga {latvia}'),
    E'## Lithuania: the failure of Litbel', E'## Lithuania: the failure of Litbel {lithuania}'),
    E'## Lithuania: the Vilnius dispute', E'## Lithuania: the Vilnius dispute {lithuania}'),
    E'## Beyond the three: the British fleet and Finland''s choices', E'## Beyond the three: the British fleet and Finland''s choices {uk finland}'),
    E'## The treaties of one year: what was settled and what remained', E'## The treaties of one year: what was settled and what remained {estonia lithuania latvia finland}'),
    E'The first was the British navy. On 12 December Admiral', E'The first was the British navy. On 12 December 1918 Admiral'),
    E'but what it actually attacked on 8 October was Riga', E'but what it actually attacked on 8 October 1919 was Riga'),
    E'When German troops left Vilnius on 31 December a Polish', E'When German troops left Vilnius on 31 December 1918 a Polish'),
    E'Vilnius passed into other hands. From 19 to 21 April Polish', E'Vilnius passed into other hands. From 19 to 21 April 1919 Polish'),
    E'On 29 December the Ulmanis government', E'On 29 December 1918 the Ulmanis government'),
  updated_at = now()
WHERE id = 'baltic-wars-of-independence';

-- Every heading in both languages must now carry a marker.
DO $check$
DECLARE ko_marked int; en_marked int;
BEGIN
  SELECT (SELECT count(*) FROM regexp_matches(body_ko, E'^## .*\\{[a-z][a-z ]*\\}$', 'ng')),
         (SELECT count(*) FROM regexp_matches(body_en, E'^## .*\\{[a-z][a-z ]*\\}$', 'ng'))
    INTO ko_marked, en_marked
    FROM commulingo_history_events WHERE id = 'baltic-wars-of-independence';
  IF ko_marked <> 10 OR en_marked <> 10 THEN
    RAISE EXCEPTION 'Baltic section markers: expected 10/10, got %/%', ko_marked, en_marked;
  END IF;
END
$check$;

COMMIT;
