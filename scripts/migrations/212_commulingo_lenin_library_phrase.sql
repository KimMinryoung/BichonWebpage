-- 212: With 레닌 공공도서관 blocked (210), the next library mention 레닌 도서관
-- became the first Lenin link on the spetskhran page. Block that form too.

BEGIN;
INSERT INTO commulingo_link_blocklist (kind, lang, phrase, note)
    VALUES ('phrase', 'ko', '레닌 도서관', '도서관 이름 — 인물 레닌으로 오링크 방지 (210의 레닌 공공도서관과 짝)');
COMMIT;
