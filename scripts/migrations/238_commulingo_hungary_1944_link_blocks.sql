-- 2026-10-02: link blocks for the new people of the hungary-1944-1945 event
-- (audit-family-name-collisions): 루츠 (Carl Lutz) fired inside 루츠크 (Lutsk,
-- the Brusilov offensive) and on Oswald Lutz in Guderian's card; Lakatos
-- (Géza Lakatos) on the poet István Lakatos in the Petőfi Circle entry.
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('ko', '루츠크', '우크라이나 도시(브루실로프 공세). 카를 루츠로 오링크 방지', 'phrase'),
    ('ko', '오스발트 루츠', '독일 기갑 장군. 카를 루츠로 오링크 방지', 'phrase'),
    ('en', 'Oswald Lutz', 'German panzer general; not Carl Lutz', 'phrase'),
    ('en', 'István Lakatos', 'Hungarian poet (Petőfi Circle); not Géza Lakatos', 'phrase')
ON CONFLICT DO NOTHING;
COMMIT;
