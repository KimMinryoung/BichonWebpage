-- 2026-10-07: link-fire audit after registering people-extra-20261007-e. Bare 페리 also hit
-- Perry Anderson, Pettis Perry, Ferrières and Périgny; bare 시몽 hit Simon-Pierre, Simão and
-- others; bare 베르니에/Bernier hit the traveller François Bernier (Asiatic mode of production)
-- and the place Verny. Michel Olivier and Wade Jacoby are other people. Full names, 베르니에
-- 신부 / abbé Bernier, 올리비에 내각 and 야코비 still link.
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('ko', '페리', 'Jules Ferry''s surname; also Perry Anderson, Pettis Perry, Ferrières, Périgny', 'alias'),
    ('ko', '시몽', 'Jules Simon''s surname; also Simon-Pierre, Simão and other given names', 'alias'),
    ('ko', '베르니에', 'abbé Bernier''s surname; also the traveller François Bernier and the place Verny', 'alias'),
    ('en', 'bernier', 'abbé Bernier''s surname; also the traveller François Bernier', 'alias'),
    ('ko', '미셸 올리비에', 'Michel Olivier (historian), not Émile Ollivier', 'phrase'),
    ('en', 'wade jacoby', 'Wade Jacoby (political scientist), not Johann Jacoby', 'phrase')
ON CONFLICT DO NOTHING;
COMMIT;
