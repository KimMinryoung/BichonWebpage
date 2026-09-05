-- 160_commulingo_link_blocklist_generic_term_aliases.sql
-- Term aliases that are ordinary words or bare numbers, found firing on the
-- wrong page while auditing document links (2026-09-05): 오코 (the Oko
-- satellite) inside other words of the Riga treaty, 특별회의/오소 (the MGB
-- Special Conference) on any "special session", KT (key transparency) on
-- footnote ids, 107조/제107조 (the RSFSR speculation article) on article 107
-- of the 1936 and 1977 constitutions and the German Basic Law, 인민의 의지
-- (Narodnaya Volya) on the plain phrase. term-alias drops the alias from the
-- index; each entry keeps its headword and its specific aliases (오코
-- 조기경보위성, MGB 특별회의, RSFSR 형법 제107조, 인민의 의지당).

BEGIN;

INSERT INTO commulingo_link_blocklist (kind, lang, phrase, note) VALUES
('term-alias', 'ko', '오코', '오코 조기경보위성의 두 글자 별칭 — 다른 낱말 속에서 걸린다'),
('term-alias', 'ko', '특별회의', 'MGB 특별회의의 일반형 — 당대회·정부의 특별회의에 걸린다'),
('term-alias', 'ko', '오소', 'MGB 특별회의(ОСО)의 두 글자 별칭 — 다른 낱말 속에서 걸린다'),
('term-alias', 'ko', 'KT', '키 투명성의 약자 — 각주 표지·다른 약자에 걸린다'),
('term-alias', 'en', 'KT', 'Key Transparency abbreviation fires on footnote ids and other acronyms'),
('term-alias', 'ko', '107조', 'RSFSR 형법 107조의 맨 번호 — 헌법·기본법의 107조에 걸린다'),
('term-alias', 'ko', '제107조', 'RSFSR 형법 107조의 맨 번호 — 헌법·기본법의 107조에 걸린다'),
('term-alias', 'ko', '인민의 의지', '나로드나야 볼랴의 일반형 — 평범한 문구에 걸린다')
ON CONFLICT (kind, lang, phrase) DO NOTHING;

COMMIT;
