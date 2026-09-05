-- 161_commulingo_link_blocklist_generic_term_aliases_2.sql
-- Two more ordinary-word aliases caught on the German constitutions page
-- (2026-09-05): 거부권 (the Security Council veto entry) fires on any veto,
-- 무국적자 (the Baltic non-citizen entry) on any stateless person. The
-- specific aliases (안보리 거부권, 비시민) stay indexed.

BEGIN;

INSERT INTO commulingo_link_blocklist (kind, lang, phrase, note) VALUES
('term-alias', 'ko', '거부권', '안보리 거부권 항목의 일반형 — 모든 거부권에 걸린다'),
('term-alias', 'ko', '무국적자', '발트 비시민 항목의 일반형 — 모든 무국적자에 걸린다')
ON CONFLICT (kind, lang, phrase) DO NOTHING;

COMMIT;
