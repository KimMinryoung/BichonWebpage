-- 「크론시타트 봉기」 용어를 같은 이름의 사건에 붙인다.
--
-- 표제어가 사건 제목과 글자까지 같은데도 짝이 지어지지 않아 따로 선 페이지였다.
-- same_subject 자동 판정은 이름이 같은 것만으로는 부족하고 그 사건에 이미 링크된
-- 항목만 후보로 삼기 때문이다(우연한 동명이 두 페이지를 합쳐 버리지 않도록 한
-- 장치다). 대숙청·레닌그라드 사건·반알코올 캠페인에는 그 링크가 있고 이 항목에만
-- 없었다. 링크를 넣으면 한 페이지의 두 탭이 되어 같은 내용이 두 번 서지 않는다.

INSERT INTO commulingo_term_events (term_id, event_id, sort_order)
VALUES ('kronstadt-rebellion-1921', 'kronstadt-1921', 0)
ON CONFLICT DO NOTHING;
